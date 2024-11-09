import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from 'src/services/users.service';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-p2p-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './p2p-transfer.component.html',
  styleUrl: './p2p-transfer.component.scss'
})
export class P2pTransferComponent {
  internalTransferForm: FormGroup;
  userDetails: any = [];
  userPaymentDetails: any;
  selectedUser: any;
  paymentInfo: any;
  payResult: any;
  transResult: any;
  userPaymentInfo: any;
  loginUser: any;
  InvaliedUser: string;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private paymentService: PaymentService,
    public cookiesService: CookieService,
    private trancService: TransactionService,
    private toastr: ToastrService
  ) {
    this.getAllUserPaymentDetails();
    this.internalTransferForm = this.fb.group({
      memberId: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(5)]],
    });

    this.loadUsers();
    this.getUserPayment();
    // this.internalTransferForm.get('memberId')?.valueChanges.subscribe(value => {
    //   this.getUserData(value);
    // });
  }

  onMemberIdBlur(): void {
    const formattedId = this.internalTransferForm.get('memberId')?.value;
    if (formattedId) {
      this.getUserData(formattedId);
    }
  }

  getUserData(formattedId: string): void {
    console.log(this.userDetails);

    this.selectedUser = this.userDetails.find((user: any) => user.userId === formattedId);
    if (this.selectedUser) {
      this.InvaliedUser = this.selectedUser.name
    } else {
      this.InvaliedUser = "Mamber Id not found."
    }
    console.log(this.selectedUser);

  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.userDetails = res.filter((item: any) => item.status !== 'admin' && item.userId !== this.cookiesService.decodeToken().userId);
      },
      (error: any) => {
        // this.toastr.error('Failed to load user details.', 'Error');
        console.error('Error fetching users:', error);
      }
    );
  }

  getUserPayment() {
    const userId = this.cookiesService.decodeToken().userId;
    this.paymentService.getUserReferrals(userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
          console.log(res)
        }
      },
      (error: any) => {
        console.error('Error fetching user payment details:', error);
      }
    );
  }

  // activateUserIfTransferExceeds300(receiver: any) {
  //   this.userService.updateUserStatus(receiver.userId, 'active').subscribe(
  //     (res) => {
  //       // this.toastr.success(`${receiver.userName} is active.`, 'success');
  //     },
  //     (error: any) => {
  //       // this.toastr.error('Failed to update user status.', 'Error');
  //       console.error('Error fetching user payment details:', error);
  //     }
  //   );
  // }




  validateTransactionAmount(control: AbstractControl) {
    const depositWallet = this.userPaymentDetails?.depositWallet || 0;
    const transactionAmount = control.get('transactionAmount')?.value;

    return transactionAmount <= depositWallet ? null : { amountExceeds: true };
  }

  transactionAmountExceeds(): boolean {
    const depositWallet = this.userPaymentDetails?.depositWallet || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value || 0;
    return transactionAmount > depositWallet;
  }

  openShareDialog() {
    const selectedUserId = this.internalTransferForm.get('memberId')?.value;
    this.selectedUser = this.userDetails.find((user: any) => user.userId === selectedUserId);
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

  formatId(id: number): string {
    return 'AI' + id.toString().padStart(4, '0');
  }

  getAllUserPaymentDetails() {
    this.paymentService.getAllReferUser().subscribe(
      (res) => {
        this.userPaymentInfo = res;
        this.loginUser = this.userPaymentInfo.find((user: any) => user.userId === this.cookiesService.decodeToken().userId)
      },
      (error: any) => {
        // this.toastr.error('Failed to load all user payment details.', 'Error');
        console.error('Error fetching all user payment details:', error);
      }
    );
  }

  onInternalSubmit() {
    const depositWallet = this.userPaymentDetails?.depositWallet || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > depositWallet) {
       this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const body = {
      userId: this.cookiesService.decodeToken().userId,
      userName: this.cookiesService.decodeToken().userName,
      receiverName: this.internalTransferForm.get('memberId')?.value,
      paymentType: 'p2p',
      transactionAmount: transactionAmount,
      status: 'Completed'
    };

    const selectedUserId = this.internalTransferForm.get('memberId')?.value;
    const senderUser = this.userPaymentInfo.find((user: any) => user.userId === this.cookiesService.decodeToken().userId);
    const receiverUser = this.userPaymentInfo.find((user: any) => user.userId === selectedUserId);

    this.trancService.createTransaction(body).subscribe(
      (transUpdate) => {
        senderUser.depositWallet -= transactionAmount;
        receiverUser.depositWallet += transactionAmount;

        this.updateUserStatus(senderUser, receiverUser);
      },
      (error) => {
        this.toastr.error('Failed to create internal transfer.', 'Error');
        console.error('Error creating internal transfer:', error);
        setTimeout(() => {
          this.closeModal();
        })
      }
    );
  }

  updateUserStatus(senderUser: any, receiverUser: any) {
    this.paymentService.updatePaymentDetails(senderUser, senderUser.payId).subscribe(
      () => {
        this.paymentService.updatePaymentDetails(receiverUser, receiverUser.payId).subscribe(
          () => {
            this.internalTransferForm.get('transactionAmount')?.setValue('');
            this.getUserPayment();
            
            this.toastr.error('Amount transfer successfully!', 'Error');
            setTimeout(() => {
              this.closeModal();
            })
          },
          (error) => {
            this.toastr.error('Failed to update receiver status.', 'Error');
            console.error('Error updating receiver status:', error);
          }
        );
      },
      (error) => {
        this.toastr.error('Failed to update sender status.', 'Error');
        console.error('Error updating sender status:', error);
      }
    );
  }
}
