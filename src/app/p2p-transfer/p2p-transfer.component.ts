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

  @ViewChild('shareDialog') shareDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private paymentService: PaymentService,
    public cookiesService: CookieService,
    private trancService: TransactionService
  ) {
    this.getAllUserPaymentDetails();
    this.internalTransferForm = this.fb.group({
      receiverName: ['', Validators.required],
      transactionAmount: ['', [Validators.required, Validators.min(1)]],
    });

    this.loadUsers();
    this.getUserPayment();
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
    const totalAmount = control.get('totalAmount')?.value;
    const transactionAmount = control.get('transactionAmount')?.value;

    return transactionAmount <= totalAmount ? null : { amountExceeds: true };
  }

  transactionAmountExceeds(): boolean {
    const totalAmount = this.userPaymentDetails?.totalAmount || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value || 0;
    return transactionAmount > totalAmount;
  }

  openShareDialog() {
    const selectedUserId = this.internalTransferForm.get('receiverName')?.value;
    this.selectedUser = this.userDetails.find((user: any) => user.userId === selectedUserId);
    // this.dialog.open(this.shareDialog);
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
    const totalAmount = this.userPaymentDetails?.totalAmount || 0;
    const transactionAmount = this.internalTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > totalAmount) {
      // this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const body = {
      userId: this.cookiesService.decodeToken().userId,
      userName: this.cookiesService.decodeToken().userName,
      receiverName: this.internalTransferForm.get('receiverName')?.value,
      paymentType: 'internal',
      transactionAmount: transactionAmount
    };

    const selectedUserId = this.internalTransferForm.get('receiverName')?.value;
    const senderUser = this.userPaymentInfo.find((user: any) => user.userId === this.cookiesService.decodeToken().userId);
    const receiverUser = this.userPaymentInfo.find((user: any) => user.userId === selectedUserId);

    body.receiverName = receiverUser.userName;
    this.trancService.createTransaction(body).subscribe(
      (transUpdate) => {
        senderUser.totalAmount -= transactionAmount;
        receiverUser.totalAmount += transactionAmount;
        
        this.updateUserStatus(senderUser, receiverUser);
        const userInfo = this.userDetails.find((item: any) => item.userId === receiverUser.userId);
        
        if (userInfo.status !== 'active' && receiverUser.totalAmount >= 300) {
          this.activateUserIfTransferExceeds300(receiverUser);
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
