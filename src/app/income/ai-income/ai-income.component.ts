

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { AIEarningService } from 'src/services/ai-earning.service';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';

@Component({
  selector: 'app-ai-income',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './ai-income.component.html',
  styleUrl: './ai-income.component.scss'
})
export class AiIncomeComponent {

  transInfo: any[] = [];
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';

  constructor(private aiEarningService: AIEarningService, public cookies: CookieService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    if (this.cookies.isAdmin()) {
      this.aiEarningService.getAllAiEarning().subscribe(
        (data: any) => {
          const today = new Date();
          const adminHistory = data.filter((item: any) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate.getDate() === today.getDate() &&
              createdAtDate.getMonth() === today.getMonth() &&
              createdAtDate.getFullYear() === today.getFullYear()
            );
          });
          this.transInfo = adminHistory;
          this.filteredTrans = adminHistory;
          this.totalItems = adminHistory.length;
          this.loading = false;
          this.toastr.success('Fund data loaded successfully!');
        },
        (error: any) => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.aiEarningService.getAiEarningByUserId(this.cookies.decodeToken().userId).subscribe(
        (data: any) => {
          const adminHistory = data;
          this.transInfo = adminHistory;
          this.filteredTrans = adminHistory;
          this.totalItems = adminHistory.length;
          this.loading = false;
          this.toastr.success('Fund data loaded successfully!');
        },
        (error: any) => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      );
    }

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