import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { TransactionService } from 'src/services/transaction.service';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {
  bankTransferForm: FormGroup;
  userPaymentDetails: any;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  transInfo: any;
  filteredTrans: any;

  constructor(
    private trancService: TransactionService,
    private fb: FormBuilder,
    private cookiesService: CookieService,
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {
    // Initialize the form without max validator for transactionAmount
    this.bankTransferForm = this.fb.group({
      transactionAmount: ['', [Validators.required, Validators.min(5)]],
    });

    this.getUserPayment();
  }

  // Fetch the user payment details
  getUserPayment() {
    const userId = this.cookiesService.decodeToken().userId;
    this.paymentService.getUserReferrals(userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;

          // Update max validator for transactionAmount based on earnWallet
          this.bankTransferForm.get('transactionAmount')?.setValidators([
            Validators.required,
            Validators.min(5),
            Validators.max(this.userPaymentDetails.earnWallet)
          ]);
          this.bankTransferForm.get('transactionAmount')?.updateValueAndValidity();
        }
      },
      (error: any) => {
        console.error('Error fetching user payment details:', error);
        this.toastr.error('Unable to load payment details.');
      }
    );
  }

  onSubmitWithdrawal() {
    const transactionAmount = parseFloat(this.bankTransferForm.get('transactionAmount')?.value);
    const transactionId = this.bankTransferForm.get('transactionId')?.value;

    // Calculate the 5% fee and amount after fee with precision
    const feeAmount = parseFloat((transactionAmount * 0.05).toFixed(2));
    const amountAfterFee = parseFloat((transactionAmount - feeAmount).toFixed(2));
    console.log("Fee Amount:", feeAmount, "Amount After Fee:", amountAfterFee);

    // Ensure earnWallet is a number and sufficient funds are available
    const earnWallet = parseFloat(this.userPaymentDetails.earnWallet);

    // Check if the user has sufficient funds after fee deduction
    if (transactionAmount > earnWallet) {
      this.toastr.error('Insufficient funds in wallet for this transaction.');
      return;
    }

    // Update wallet balance after fee deduction
    this.userPaymentDetails.earnWallet = parseFloat((earnWallet - transactionAmount).toFixed(2));

    // Update the backend with new wallet balance
    this.paymentService.updatePaymentDetails(this.userPaymentDetails, this.userPaymentDetails.payId).subscribe(
      res => {
        const data = {
          paymentType: 'withdraw',
          transactionAmount: amountAfterFee,  // Use amount after fee for transaction
          transactionId: transactionId
        };

        // Send the transaction request
        this.trancService.createTransaction(data).subscribe(
          (res: any) => {
            this.bankTransferForm.reset();
            this.toastr.success('Withdrawal request sent successfully!');
          },
          (error: any) => {
            console.error('Error sending withdrawal request:', error);
            this.toastr.error('Unable to send withdrawal request!');
          }
        );
      },
      error => {
        console.error('Error updating wallet balance:', error);
        this.toastr.error('Failed to update wallet balance.');
      }
    );
  }
}
