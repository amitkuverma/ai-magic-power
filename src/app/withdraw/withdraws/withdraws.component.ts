import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  styleUrl: './withdraws.component.scss'
})
export class WithdrawRequestComponent {
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

  constructor(private transService: TransactionService, private cookies: CookieService, private toastr:ToastrService,
    private paymentService: PaymentService, private accountService: AccountDetailsService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchAccount(userId:any){
    this.accountService.getAccountById(userId).subscribe(
      res=>{
        console.log(res);
        
        this.accountDetails = res;
      },
      error=>{

      }
    )
  }

  fetchUsers(): void {
    this.loading = true;
    this.transService.getAllTransaction().subscribe((data: any) => {
      if(this.cookies.isAdmin()){
        const adminHistory = data.filter((item:any) => item.paymentType === 'withdraw' && item.status === 'pending' )
        this.transInfo = adminHistory;        
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;
        
      }else{
        const userHistory = data.filter((item:any) => item.userId === this.cookies.decodeToken().userId && item.paymentType === 'withdraw' && item.status === 'pending');
        this.transInfo = userHistory
        this.filteredTrans = userHistory;
        this.totalItems = userHistory.length;
      }
      this.loading = false;
      this.toastr.success('Hello world!', 'Toastr fun!');
      this.successMessage = 'Withdraw loaded successfully!';
      setTimeout(() => (this.successMessage = ''), 3000); // Clear success message after 3 seconds
    });
  }

  filterUsers() {
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

  
  updateStatus(status: any) {
    this.selectedUser.status = status;
    this.transService.updateTransaction(this.selectedUser, this.selectedUser.transId).subscribe(
      (res) => {
        if (status === 'approved') {
          this.paymentService.getUserReferrals(this.selectedUser.userId).subscribe(
            res => {              
              res.totalWithdraw = res.totalWithdraw + this.selectedUser.transactionAmount;
              console.log(res)
              this.paymentService.updatePaymentDetails(res, res.payId).subscribe(
                res => {
                  this.successMessage = 'Fund added successfully!';
                  // this.fetchTransactions();
                },
                error => {
                  this.successMessage = 'Unable to add fund!';
                  // this.fetchTransactions();

                }
              )
            },
            error => {
              this.successMessage = 'Unable to withdraw amount!';
            }
          )
        } else {
          this.paymentService.getUserReferrals(this.selectedUser.userId).subscribe(
            res => {              
              res.earnWallet = res.earnWallet + this.selectedUser.transactionAmount + this.selectedUser.transactionAmount * 0.1;
              this.paymentService.updatePaymentDetails(res, res.payId).subscribe(
                res => {
                  this.successMessage = 'Fund rejected successfully!';
                },
                error => {
                  this.successMessage = 'Unable to add fund!';
                }
              )
            },
            error => {
              this.successMessage = 'Unable to withdraw amount!';
            }
          )
        }

      },
      (error: any) => {
        this.successMessage = 'Unable to update status';
      }
    )
  }
}