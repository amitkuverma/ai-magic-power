import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/services/users.service';
import { TransactionService } from 'src/services/transaction.service';

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
  walletAmount: any;
  aiStakeForm!: FormGroup;
  showModal = false;
  oneTimeEarning!: any;
  loginUserPayDetails: any;

  constructor(private paymentService: PaymentService, private cookies: CookieService, private fb: FormBuilder, private toastr: ToastrService,
    private userService: UsersService, private transactionService: TransactionService
  ) {
    this.aiStakeForm = this.fb.group({
      aiStake: ['', [Validators.required, this.aiStakeValidator]]
    });
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

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    const modalElement = document.getElementById('packageModal');
    if (modalElement) {
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



  // Custom validator for AI Stake
  aiStakeValidator(control: AbstractControl): ValidationErrors | null {
    const stakeValue = control.value;

    if (stakeValue === null || stakeValue === '') {
      return null; // Skip validation if empty, handled by 'required'
    }

    // Check range based on selected package
    if (this.selectedPackage?.name === 'OPAL AI' && (stakeValue < 12 || stakeValue > 999)) {
      return { invalidStake: true };
    }

    if (this.selectedPackage?.name === 'JASPER AI' && (stakeValue < 1000 || stakeValue > 9999)) {
      return { invalidStake: true };
    }

    return null; // Valid stake
  }


  // Getter for easy access to form fields
  get f() {
    return this.aiStakeForm.controls;
  }

  // Handle package selection
  selectPackage(pack: any): void {
    this.selectedPackage = pack;
    this.openModal();
  }

  oneTimeEarnings(): any {
    this.oneTimeEarning = (this.walletAmount * 5) % 100;
    return this.oneTimeEarning;
  }

  submitPackage(): void {
    const currentDate = new Date(); // Get the current date
    if (this.selectedPackage === 'OPAL AI') {
      this.daysToAdd = 1000;
    }
    else {
      this.daysToAdd = 750;
    }
    const futureDate = new Date(currentDate.getTime() + this.daysToAdd * 24 * 60 * 60 * 1000);
    this.loginUserPayDetails.plan = this.selectedPackage.name,
      this.loginUserPayDetails.commission = this.selectedPackage.commission,
      this.loginUserPayDetails.planStartDate = currentDate,
      this.loginUserPayDetails.planEndDate = futureDate,
      this.loginUserPayDetails.depositWallet = (parseFloat(this.loginUserPayDetails.depositWallet) - parseFloat(this.walletAmount)).toFixed(2);
    this.loginUserPayDetails.selfInvestment = (parseFloat(this.loginUserPayDetails.selfInvestment) + parseFloat(this.walletAmount)).toFixed(2);

    this.paymentService.updateUserStatus(this.loginUserPayDetails, this.loginUserPayDetails.payId).subscribe(
      res => {
        const body = {
          paymentType: 'trade',
          transactionAmount: this.walletAmount,
          status: 'completed'
        }
        this.transactionService.createTransaction(body).subscribe(
          (createTrade) => {
            this.userService.getParentReferralChain(this.cookies.decodeToken().userId).subscribe(resRefParent => {
              resRefParent = resRefParent.filter(item => item.userId !== this.cookies.decodeToken().userId);
              this.handleReferralPercentage(resRefParent.reverse());
            });
          }
        )
        this.toastr.success('Trading started successfully!', 'Success');
        this.closeModal(); // Close modal on success
        this.aiStakeForm.get('aiStake')?.reset(); // Reset the input
        this.aiStakeForm.get('aiStake')?.updateValueAndValidity(); // Update validation
      },
      (error: any) => {
        this.toastr.error('Failed Trading.', 'Error');
      }
    );
  }

  handleReferralPercentage(referrals: any[]) {
    referrals.forEach((referral, i) => {
      const level = i + 1;  // Determine the level (1-based index)
      const percentage = this.getReferralPercentage(level);  // Get percentage based on level

      console.log(referral);

      this.paymentService.getUserReferrals(referral.userId).subscribe(resPay => {
        const userFundRequestAmount = parseFloat(this.walletAmount) || 0;
        const additionalAmount = (userFundRequestAmount * (percentage / 100)).toFixed(2);
        resPay.earnWallet = (parseFloat(resPay.earnWallet) + parseFloat(additionalAmount)).toFixed(2);

        console.log(`Updated earn for referral level ${level}: ${resPay.earnWallet}`);

        // Save the updated payment status
        this.paymentService.updateUserStatus(resPay, resPay.payId).subscribe(
          response => {
            console.log(`Payment status updated successfully for payId ${resPay.payId}`);
            const body = {
              userId: referral.userId,
              userName: referral.name,
              paymentType: 'oneTime',
              transactionAmount: additionalAmount,
              status: 'paid'
            };
            this.transactionService.createTransactionForOneTime(body).subscribe(
              transCreated => {
                console.log("Transaction created:", transCreated);
              },
              transError => {
                console.error("Failed to create transaction:", transError);
              }
            );
          },
          error => {
            console.error(`Failed to update payment status for payId ${resPay.payId}:`, error);
          }
        );
      });
    });
  }

  // Function to determine percentage based on referral level
  getReferralPercentage(level: number): number {
    switch (level) {
      case 1:
        return 5;
      case 2:
        return 3;
      case 3:
        return 2;
      case 4:
        return 1;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return 0.5;
      default:
        return 0;
    }
  }
}
