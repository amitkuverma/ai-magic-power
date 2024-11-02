import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'src/services/cookie.service';
import { DailyEarningService } from 'src/services/daily-earning.service';
import { TransactionService } from 'src/services/transaction.service';

@Component({
  selector: 'app-daily-income',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './daily-income.component.html',
  styleUrl: './daily-income.component.scss'
})
export class DailyIncomeComponent {

  transInfo: any[] = [];
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';

  constructor(private dailyEarningService: DailyEarningService, public cookies: CookieService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.dailyEarningService.getDailyEarningByUserId(this.cookies.decodeToken().userId).subscribe(
      (data: any) => {
        const adminHistory = data;
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;
        this.loading = false;
        this.toastr.success('Fund data loaded successfully!');
      },
      (error:any)=>{
        this.loading = false;
        this.toastr.error(error.error.message)
      }
    );
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
}