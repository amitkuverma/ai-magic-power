import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from 'src/services/users.service';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfer-to-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './transfer-to-deposit.component.html',
  styleUrl: './transfer-to-deposit.component.scss'
})
export class TransferToDepositComponent {
  transferAmount: number | null = null;
  transferMessage: string = '';
  transferError: string = '';
  transferInProgress: boolean = false;
  transferFeePercentage: number = 10; // 10% fee
  userPaymentDetails: any;

  constructor(private paymentService: PaymentService, public cookiesService: CookieService,
    private transactionService: TransactionService, private toaster: ToastrService
  ) {
    this.getUserPayment();
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

  validateTransferAmount() {
    // Reset messages
    this.transferMessage = '';
    this.transferError = '';

    // Check if the transfer amount is valid
    if (this.transferAmount && this.transferAmount > this.userPaymentDetails.earnWallet) {
      this.transferError = "Transfer amount exceeds available earnings.";
    } else if (this.transferAmount && this.transferAmount <= 0) {
      this.transferError = "Transfer amount must be greater than zero.";
    } else {
      this.transferError = '';
    }
  }
  onSubmitWithdrawal() {
    // Ensure transferAmount is a valid number within allowed limits
    if (!this.transferAmount || this.transferAmount <= 0 || this.transferAmount > this.userPaymentDetails.earnWallet) {
      this.transferError = "Invalid transfer amount.";
      console.warn("Invalid transfer amount:", this.transferAmount);
      return;
    }

    // Calculate the 10% fee and amount after fee with precision
    const feeAmount = this.transferAmount * 0.03;
    const amountAfterFee = this.transferAmount - feeAmount;
    console.log("Fee Amount:", feeAmount, "Amount After Fee:", amountAfterFee);

    // Convert wallets to numbers to ensure accurate arithmetic
    const earnWallet = this.userPaymentDetails.earnWallet;
    const depositWallet = this.userPaymentDetails.depositWallet;

    // Update wallet balances
    this.userPaymentDetails.earnWallet = earnWallet - this.transferAmount;
    this.userPaymentDetails.depositWallet = depositWallet + amountAfterFee;

    console.log("Updated Earn Wallet:", this.userPaymentDetails.earnWallet);
    console.log("Updated Deposit Wallet:", this.userPaymentDetails.depositWallet);

    // Prepare data for transaction
    const data = {
      paymentType: 'e2d',
      transactionAmount: this.transferAmount,
      status: 'completed'
    };

    // Mark transfer as in progress
    this.transferInProgress = true;

    // Create the transaction request
    this.transactionService.createTransaction(data).subscribe(
      (res: any) => {
        console.log("Transaction created successfully:", res);

        // Update user status with updated wallets
        this.paymentService.updateUserStatus(this.userPaymentDetails, this.userPaymentDetails.payId).subscribe(
          (res: any) => {
            console.log("User status updated successfully:", res);

            // Display success message
            this.toaster.success('Amount added to your deposit wallet successfully!', 'Success');
            this.transferMessage = `Earnings successfully transferred with a 10% fee. Amount credited: ${amountAfterFee.toFixed(2)}`;
            this.transferAmount = null;
            this.transferError = '';
            this.transferInProgress = false;
          },
          (error: any) => {
            this.transferError = 'Error updating user wallet status.';
            console.error("Error updating user status:", error);
            this.transferInProgress = false;
          }
        );
      },
      (error: any) => {
        this.transferError = 'Unable to send withdrawal request!';
        console.error("Error sending withdrawal request:", error);
        this.transferInProgress = false;
      }
    );
  }

}