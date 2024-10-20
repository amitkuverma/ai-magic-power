import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { TransactionService } from 'src/services/transaction.service';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent {
  bankTransferForm: FormGroup;
  userPaymentDetails: any;

  constructor(private trancService: TransactionService, private fb: FormBuilder,
    private cookiesService: CookieService, private paymentService: PaymentService) {
    this.bankTransferForm = this.fb.group({
      transactionAmount: ['', [Validators.required, Validators.min(5)]],
    }, { validators: this.validateTransactionAmount });
  }

  getUserPayment() {
    const userId = this.cookiesService.decodeToken().userId;
    this.paymentService.getUserReferrals(userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
        }
      },
      (error: any) => {
        console.error('Error fetching user payment details:', error);
      }
    );
  }

  validateTransactionAmount(control: AbstractControl) {
    const totalAmount = this.userPaymentDetails?.totalAmount;
    const transactionAmount = control.get('transactionAmount')?.value;

    return transactionAmount <= totalAmount ? null : { amountExceeds: true };
  }

  netAmmount(){
    const transactionAmount = this.bankTransferForm.get('transactionAmount')?.value;
    const x = (transactionAmount*5)/100
  }

  onSubmitWithdrawal() {
    const totalAmount =this.userPaymentDetails?.totalAmount;
    const transactionAmount = this.bankTransferForm.get('transactionAmount')?.value;

    if (transactionAmount > totalAmount) {
      // this.toastr.error('Transaction amount must not exceed total amount.', 'Error');
      return;
    }

    const data = {
      paymentType: 'withdraw',
      transactionAmount: transactionAmount
    };

    this.trancService.createTransaction(data).subscribe(
      (res: any) => {
        this.bankTransferForm.get('transactionAmount')?.setValue('');
        // this.message('Withdrawal request sent successfully!', 'Success');
      },
      (error: any) => {
        // this.message('Unable to send withdrawal request!', 'Error');
        // console.error('Error sending withdrawal request:', error);
      }
    );
  }
  fetchwalletaddress() {

  }
}
