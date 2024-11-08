import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
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
export class WithdrawComponent implements OnInit {
  bankTransferForm: FormGroup;
  userPaymentDetails: any;
  transInfo: any;
  minWithdrawalValue: number = 5;

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
  }

  ngOnInit() {
    this.getUserPayment();
    this.fetchTransaction();
  }

  fetchTransaction() {
    this.trancService.getAllTransaction().subscribe((res) => {
      this.transInfo = res.filter(
        (item) =>
          item.userId === this.cookiesService.decodeToken().userId &&
          item.paymentType === 'withdraw'
      );
      this.updateMinValue(this.transInfo.length);  // Update the minimum value after fetching transactions
    });
  }
  
  updateMinValue(length: number) {
    const transactionAmountControl = this.bankTransferForm.get('transactionAmount');
    // Calculate the new minimum value by multiplying the withdrawal count by 5
    this.minWithdrawalValue = 5 * Math.pow(5, length - 1);  // Minimum value increases by a factor of 5 after each withdrawal
    transactionAmountControl.setValidators([
      Validators.required,
      Validators.min(this.minWithdrawalValue),  // Set the new dynamic min value
      this.balanceValidator.bind(this),
    ]);
    transactionAmountControl.updateValueAndValidity();
  }
  


  // Fetch the user payment details and update max validator
  getUserPayment() {
    const userId = this.cookiesService.decodeToken().userId;
    this.paymentService.getUserReferrals(userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;

          // Set max validator based on user's available balance
          const maxWithdrawable = this.userPaymentDetails.earnWallet * 0.9; // 10% fee deducted
          this.bankTransferForm
            .get('transactionAmount')
            ?.setValidators([
              Validators.required,
              Validators.min(5),
              Validators.max(maxWithdrawable),
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

  // Custom validator to ensure withdrawal amount does not exceed balance
  balanceValidator(control: AbstractControl): ValidationErrors | null {
    const maxWithdrawable = this.userPaymentDetails.earnWallet * 0.9;
    return control.value && control.value > maxWithdrawable
      ? { amountExceeds: true }
      : null;
  }

  onSubmitWithdrawal() {
    if (this.bankTransferForm.invalid) {
      this.bankTransferForm.markAllAsTouched();
      return;
    }

    const transactionAmount = this.bankTransferForm.get('transactionAmount')?.value;
    const amountAfterFee = transactionAmount * 0.9; // Adjust for 10% fee

    // Check if sufficient funds are available
    if (transactionAmount > this.userPaymentDetails.earnWallet * 0.9) {
      this.toastr.error('Insufficient funds in wallet for this transaction.');
      return;
    }

    this.paymentService
      .updatePaymentDetails(
        { ...this.userPaymentDetails, earnWallet: this.userPaymentDetails.earnWallet - transactionAmount },
        this.userPaymentDetails.payId
      )
      .subscribe(
        (res) => {
          this.trancService
            .createTransaction({
              paymentType: 'withdraw',
              transactionAmount: amountAfterFee,
              transactionId: this.bankTransferForm.get('transactionId')?.value,
            })
            .subscribe(
              () => {
                this.bankTransferForm.reset();
                this.getUserPayment();
                this.fetchTransaction();
                this.toastr.success('Withdrawal request sent successfully!');
              },
              (error) => {
                console.error('Error sending withdrawal request:', error);
                this.toastr.error('Unable to send withdrawal request!');
              }
            );
        },
        (error) => {
          console.error('Error updating wallet balance:', error);
          this.toastr.error('Failed to update wallet balance.');
        }
      );
  }
}
