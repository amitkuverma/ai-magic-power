import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/services/users.service';
import { TransactionService } from 'src/services/transaction.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ai-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ai-packages.component.html',
  styleUrl: './ai-packages.component.scss'
})
export class AiPackagesComponent {
  daysToAdd: any;
  packages: any[] = [
    { id: 1, name: 'OPAL AI', stake: '12$ - 999$', commission: '0.3', days: 1000 },
    { id: 2, name: 'JASPER AI', stake: '1000$ - 9999$+', commission: '0.4', days: 750 }
  ];

  selectedPackage: any;
  successMessage!: string;
  walletAmount: any = 0;
  showModal = false;
  oneTimeEarning!: any;
  loginUserPayDetails: any;
  stakeError: string | null = null;
  modalRef?: NgbModalRef;

  constructor(private paymentService: PaymentService, private cookies: CookieService, private fb: FormBuilder, private toastr: ToastrService,
    private userService: UsersService, private transactionService: TransactionService, private modalService: NgbModal
  ) {
    this.fatchTransDetails();
  }

  fatchTransDetails() {
    this.paymentService.getUserReferrals(this.cookies.decodeToken().userId).subscribe(
      (res: any) => {
        this.loginUserPayDetails = res;
      },
      (error: any) => {

      }
    )
  }

  closeModal() {
    const modalElement = document.getElementById('packageModal');
    if (modalElement) {
      this.walletAmount = 0;
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement); // Get the modal instance
      if (modal) {
        modal.hide(); // Hide the modal using Bootstrap's method
      } else {
        // If the modal is not instantiated, hide it manually
        modalElement.classList.remove('show');
        modalElement.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        // Remove the backdrop if it exists
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
    }
  }



  validateStake() {
    // Check if walletAmount is greater than depositWallet
    if (this.walletAmount > this.loginUserPayDetails.depositWallet) {
      this.stakeError = "Entered amount exceeds available deposit wallet.";
    }
    // Additional conditions based on package
    else if (this.selectedPackage?.name === 'OPAL AI' && (this.walletAmount < 12 || this.walletAmount > 999)) {
      this.stakeError = "Stake must be between 12 and 999 for OPAL AI package.";
    } else if (this.selectedPackage?.name === 'JASPER AI' && (this.walletAmount < 1000 || this.walletAmount > 9999)) {
      this.stakeError = "Stake must be between 1000 and 9999 for JASPER AI package.";
    } else {
      this.stakeError = null; // Clear error if validation passes
    }
  }


  // Handle package selection
  selectPackage(pack: any): void {
    this.selectedPackage = pack;
  }

  activeUser() {
    try {
      const userId = this.cookies.decodeToken().userId;
      this.userService.getUserById(userId).subscribe(
        (resUser) => {
          console.log(resUser);

          if (resUser.status === 'pending') {
            resUser.activeDate = new Date();
            resUser.status = 'active';
            this.userService.updateUserProfile(resUser).subscribe(
              (res) => console.log('User activated:', resUser),
              (error) => console.error('Error updating user profile:', error)
            );
          }
        },
        (error) => console.error('Error fetching user:', error)
      );
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }

  submitPackage(): void {
    this.validateStake();

    if (this.stakeError) {
      return; // Prevent submission if there's a validation error
    }

    this.activeUser(); // Ensure user activation

    const currentDate = new Date();
    this.daysToAdd = this.selectedPackage === 'OPAL AI' ? 1000 : 750;
    const futureDate = new Date(currentDate.getTime() + this.daysToAdd * 24 * 60 * 60 * 1000);

    this.updateUserPayDetails(currentDate, futureDate);

    this.paymentService.updateUserStatus(this.loginUserPayDetails, this.loginUserPayDetails.payId).subscribe(
      () => {
        this.createTradeTransaction();
        this.toastr.success('Trading started successfully!', 'Success');
      },
      (error) => {
        this.toastr.error('Failed Trading.', 'Error');
        console.error('Error submitting package:', error);
      }
    );
  }

  updateUserPayDetails(currentDate: Date, futureDate: Date): void {
    this.loginUserPayDetails.plan = this.selectedPackage.name;
    this.loginUserPayDetails.commission = this.selectedPackage.commission;
    this.loginUserPayDetails.planStartDate = currentDate;
    this.loginUserPayDetails.planEndDate = futureDate;
    this.loginUserPayDetails.depositWallet = this.loginUserPayDetails.depositWallet - this.walletAmount;
    this.loginUserPayDetails.selfInvestment = this.loginUserPayDetails.selfInvestment + this.walletAmount;
  }

  createTradeTransaction() {
    const transactionData = {
      paymentType: 'trade',
      transactionId: this.walletAmount * this.selectedPackage.commission / 100,
      transactionAmount: this.walletAmount,
      status: 'completed',
    };

    this.transactionService.createTransaction(transactionData).subscribe(
      () => {
        this.userService.getParentReferralChain(this.cookies.decodeToken().userId).subscribe(
          (referralChain) => {
            const filteredReferrals = referralChain.filter(item => item.userId !== this.cookies.decodeToken().userId);
            this.handleReferralPercentage(filteredReferrals);
          },
          (error) => console.error('Error fetching referral chain:', error)
        );
      },
      (error) => console.error('Error creating transaction:', error)
    );
  }

  handleReferralPercentage(referrals: any[]) {
    referrals.forEach((referral, index) => {
      const level = index + 1;
      const percentage = this.getReferralPercentage(level);

      this.paymentService.getUserReferrals(referral.userId).subscribe(
        (resPay) => {
          const userFundRequestAmount = this.walletAmount || 0;
          const additionalAmount = userFundRequestAmount * percentage / 100;

          resPay.earnWallet = resPay.earnWallet + additionalAmount;
          resPay.dailyLevelEarning = resPay.dailyLevelEarning + additionalAmount;

          this.paymentService.updateUserStatus(resPay, resPay.payId).subscribe(
            () => {
              this.createReferralTransaction(referral, additionalAmount);
              console.log(`Updated earn for referral level ${level}: ${resPay.earnWallet}`);
            },
            (error) => console.error(`Failed to update referral for userId ${referral.userId}:`, error)
          );
        },
        (error) => console.error(`Error fetching user referrals for userId ${referral.userId}:`, error)
      );
    });
  }

  createReferralTransaction(referral: any, additionalAmount: any) {
    const transactionData = {
      userId: referral.userId,
      userName: referral.name,
      paymentType: 'oneTime',
      transactionAmount: additionalAmount,
      status: 'paid',
    };

    this.transactionService.createTransactionForOneTime(transactionData).subscribe(
      () => {
        this.closeModal(); // Close modal on success
        this.walletAmount = 0; // Reset wallet amount
        console.log("Transaction created for referral:", transactionData)
      },
      (error) => console.error('Error creating referral transaction:', error)
    );
  }

  getReferralPercentage(level: number): number {
    switch (level) {
      case 1: return 5;
      case 2: return 3;
      case 3: return 2;
      case 4: return 1;
      case 5: case 6: case 7: case 8: case 9: case 10: return 0.5;
      default: return 0;
    }
  }

}
