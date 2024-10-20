import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';

@Component({
  selector: 'app-add-funds',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './add-funds.component.html',
  styleUrl: './add-funds.component.scss'
})
export class AddFundsComponent {
  transInfo: any[] = [];
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';

  constructor(private transactionService: TransactionService, private cookies: CookieService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.transactionService.getAllTransaction().subscribe((data: any) => {
      if (this.cookies.isAdmin()) {
        const adminHistory = data.filter(item => item.paymentType === 'fund' && item.status === 'pending')
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;

      } else {
        const userHistory = data.filter(item => item.userId === this.cookies.decodeToken().userId && item.paymentType === 'fund' && item.status === 'pending');
        this.transInfo = userHistory
        this.filteredTrans = userHistory;
        this.totalItems = userHistory.length;
      }
      this.loading = false;
      this.successMessage = 'Fund history data loaded successfully!';
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
  }

  closeModal(): void {
    this.selectedUser = null;
  }

  updateStatus(status: any) {
    this.selectedUser.status = status;
    this.transactionService.updateTransaction(this.selectedUser, this.selectedUser.transId).subscribe(
      (res)=>{
        this.successMessage = 'Status update successfully!';
        this.fetchUsers();
      },
      (error:any)=>{
        this.successMessage = 'Unable to update status';
      }
    )
  }
}