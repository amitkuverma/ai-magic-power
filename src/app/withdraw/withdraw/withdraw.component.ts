import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
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
  errorValue: boolean = false;
  amountExceeds: boolean = false;

  constructor(
    private trancService: TransactionService,
    private fb: FormBuilder,
    private cookiesService: CookieService,
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {
    // Initialize the form with base validators
    this.bankTransferForm = this.fb.group({
      transactionAmount: ['', [Validators.required, Validators.min(this.minWithdrawalValue), this.multipleOfFiveValidator]],
    });
  }

  ngOnInit() {
    this.getUserPayment();
    this.fetchTransaction();

    // Listen to real-time changes and validate fields accordingly
    this.bankTransferForm.get('transactionAmount')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.updateErrorFlags();
      });
  }

  // Fetch user transactions for withdrawal info
  fetchTransaction() {
    this.trancService.getAllTransaction().subscribe((res) => {
      this.transInfo = res.filter(
        (item) =>
          item.userId === this.cookiesService.decodeToken().userId &&
          item.paymentType === 'withdraw'
      );
    });
  }

  // Fetch and set user payment details and update the max validator dynamically
  getUserPayment() {
    const userId = this.cookiesService.decodeToken().userId;
    this.paymentService.getUserReferrals(userId).subscribe(
      (res: any) => {
        if (res) {
          this.userPaymentDetails = res;
          const maxWithdrawable = this.userPaymentDetails.earnWallet * 0.9; // 10% fee deducted

          // Set the dynamic max validator based on the user's available balance
          this.bankTransferForm
            .get('transactionAmount')
            ?.setValidators([
              Validators.required,
              Validators.min(this.minWithdrawalValue),
              Validators.max(maxWithdrawable),
              this.multipleOfFiveValidator
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

  // Custom validator to check if the transaction amount is a multiple of 5
  multipleOfFiveValidator(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);
    return !isNaN(value) && value % 5 === 0 ? null : { notMultipleOfFive: true };
  }

  // Update error flags based on current validator errors
  updateErrorFlags() {
    const transactionAmountControl = this.bankTransferForm.get('transactionAmount');
    this.errorValue = !!transactionAmountControl?.hasError('notMultipleOfFive');
    this.amountExceeds = !!transactionAmountControl?.hasError('max');
  }

  // Submit withdrawal request after validation
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
              transactionAmount: this.bankTransferForm.get('transactionAmount')?.value,
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
