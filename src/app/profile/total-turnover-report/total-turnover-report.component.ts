import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { AIEarningService } from 'src/services/ai-earning.service';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { TransactionService } from 'src/services/transaction.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-total-turnover-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './total-turnover-report.component.html',
  styleUrl: './total-turnover-report.component.scss'
})
export class TotalTurnoverReportComponent {
  transInfo: any[] = [];
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';
  totalDepositWallet: string = '';

  constructor(private transactionServices: TransactionService, public cookies: CookieService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.transactionServices.getAllTransaction().subscribe(
      (data: any) => {
        const adminHistory = data.filter(item=>item.paymentType === 'fund');
  
        // Calculate total depositWallet
        const totalDepositWallet = adminHistory.reduce((total: number, item: any) => {
          return total + parseFloat(item.transactionAmount);
        }, 0);
  
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;
        this.totalDepositWallet = totalDepositWallet; // Store the total for display
        this.loading = false;
        this.toastr.success('Total Turnover data loaded successfully!');
      },
      (error: any) => {
        this.loading = false;
        this.toastr.error(error.error.message);
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