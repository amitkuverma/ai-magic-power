import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/services/payment.service';
import { AccountDetailsService } from 'src/services/account.service';

@Component({
  selector: 'app-withdraws',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './withdraws.component.html',
  styleUrls: ['./withdraws.component.scss'] // Corrected `styleUrls` typo
})
export class WithdrawRequestComponent implements OnInit {
  transInfo: any[] = [];
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';
  accountDetails: any;

  constructor(
    private transService: TransactionService,
    private cookies: CookieService,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private accountService: AccountDetailsService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchAccount(userId: any): void {
    this.accountService.getAccountByUserId(userId).subscribe(
      res => {
        this.accountDetails = res;
      },
      error => {
        this.toastr.error('Unable to load account details.', 'Error');
      }
    );
  }

  fetchUsers(): void {
    this.loading = true;
    this.transService.getAllTransaction().subscribe(
      (data: any) => {
        const isAdmin = this.cookies.isAdmin();
        const filteredData = data.filter(
          (item: any) =>
            item.paymentType === 'withdraw' &&
            item.status === 'pending' &&
            (isAdmin || item.userId === this.cookies.decodeToken().userId)
        );
        
        this.transInfo = filteredData;
        this.filteredTrans = filteredData;
        this.totalItems = filteredData.length;
        this.toastr.success('Withdrawals loaded successfully!');
      },
      error => {
        this.toastr.error('Failed to load withdrawals.', 'Error');
      },
      () => {
        this.loading = false;
      }
    );
  }

  filterUsers(): void {
    this.filteredTrans = this.transInfo.filter(
      (user) =>
        user.userId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalItems = this.filteredTrans.length;
  }

  viewUserDetails(user: any): void {
    this.selectedUser = user;
    this.fetchAccount(user.userId);
  }

  closeModal(): void {
    this.selectedUser = null;
  }

  updateStatus(status: any): void {
    if (!this.selectedUser) {
      this.toastr.error('No user selected.', 'Error');
      return;
    }

    this.selectedUser.status = status;
    this.transService.updateTransaction(this.selectedUser, this.selectedUser.transId).subscribe(
      () => {
        const action = status === 'approved' ? 'approved' : 'rejected';
        
        this.processUserBalance(status).then(
          (message) => {
            this.toastr.success(`Transaction ${action} successfully!`);
            this.fetchUsers();
            this.closeModal();
          },
          (error) => {
            this.toastr.error(error, 'Error');
            this.fetchUsers();
          }
        );
      },
      () => {
        this.toastr.error('Unable to update transaction status.', 'Error');
      }
    );
  }

  private processUserBalance(status: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.paymentService.getUserReferrals(this.selectedUser.userId).subscribe(
        (res: any) => {
          if (status === 'approved') {
            res.totalWithdraw = parseFloat(res.totalWithdraw) + parseFloat(this.selectedUser.transactionAmount);
          } else {
            res.earnWallet = parseFloat(res.earnWallet) + parseFloat(this.selectedUser.transactionAmount);
          }

          this.paymentService.updatePaymentDetails(res, res.payId).subscribe(
            () => resolve(`Balance ${status === 'approved' ? 'deducted' : 'returned'} successfully!`),
            () => reject('Failed to update user balance.')
          );
        },
        () => reject('Unable to retrieve user details.')
      );
    });
  }
}
