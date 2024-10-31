import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from 'src/services/users.service';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';

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
  loginUser:any;
  InvaliedUser:string;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private paymentService: PaymentService,
    public cookiesService: CookieService,
    private trancService: TransactionService
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
    if(this.selectedUser){
      this.InvaliedUser = this.selectedUser.name
    }else{
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

  activateUserIfTransferExceeds300(receiver: any) {
    this.userService.updateUserStatus(receiver.userId, 'active').subscribe(
      (res) => {
        // this.toastr.success(`${receiver.userName} is active.`, 'success');
      },
      (error: any) => {
        // this.toastr.error('Failed to update user status.', 'Error');
        console.error('Error fetching user payment details:', error);
      }
    );
  }




  validateTransactionAmount(control: AbstractControl) {
    const earnWallet = this.userPaymentDetails?.earnWallet || 0;
    const transactionAmount = control.get('transactionAmount')?.value;

    return transactionAmount <= earnWallet ? null : { amountExceeds: true };
  }

  transactionAmountExceeds(): boolean {
    const earnWallet = this.userPaymentDetails?.earnWallet || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value || 0;
    return transactionAmount > earnWallet;
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
    const earnWallet = this.userPaymentDetails?.earnWallet || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > earnWallet) {
      // this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const body = {
      userId: this.cookiesService.decodeToken().userId,
      userName: this.cookiesService.decodeToken().userName,
      receiverName: this.internalTransferForm.get('memberId')?.value,
      paymentType: 'internal',
      transactionAmount: transactionAmount
    };

    const selectedUserId = this.internalTransferForm.get('memberId')?.value;
    const senderUser = this.userPaymentInfo.find((user: any) => user.userId === this.cookiesService.decodeToken().userId);
    const receiverUser = this.userPaymentInfo.find((user: any) => user.userId === selectedUserId);
    
    this.trancService.createTransaction(body).subscribe(
      (transUpdate) => {
        senderUser.earnWallet -= transactionAmount;
        receiverUser.earnWallet += transactionAmount;
        
        this.updateUserStatus(senderUser, receiverUser);
        const userInfo = this.userDetails.find((item: any) => item.userId === receiverUser.userId);
        
        if (userInfo.status !== 'active' && receiverUser.earnWallet >= 5) {
          this.activateUserIfTransferExceeds300(receiverUser);
          this.userService.getUserById(this.selectedUser.userId).subscribe(
            (resUser: any) => {
              if (resUser.status === 'pending') {
                this.userService.updateUserStatus(this.selectedUser.userId, "active").subscribe(
                  resCre=>{
                      console.log(resCre);
                      
                  }
                )
              }
            }
          )
          this.closeModal();
        }
      },
      (error) => {
        // this.toastr.error('Failed to create internal transfer.', 'Error');
        console.error('Error creating internal transfer:', error);
      }
    );
  }

  updateUserStatus(senderUser: any, receiverUser: any) {
    this.paymentService.updateUserStatus(senderUser, senderUser.payId).subscribe(
      () => {
        this.paymentService.updateUserStatus(receiverUser, receiverUser.payId).subscribe(
          () => {
            this.internalTransferForm.get('transactionAmount')?.setValue('');
          },
          (error) => {
            // this.toastr.error('Failed to update receiver status.', 'Error');
            console.error('Error updating receiver status:', error);
          }
        );
      },
      (error) => {
        // this.toastr.error('Failed to update sender status.', 'Error');
        console.error('Error updating sender status:', error);
      }
    );
  }
}
