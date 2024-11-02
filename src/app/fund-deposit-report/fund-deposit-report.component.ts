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
  selector: 'app-fund-deposit-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './fund-deposit-report.component.html',
  styleUrl: './fund-deposit-report.component.scss'
})
export class FundDepositReportComponent {
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
        const adminHistory = data.filter(item=>item.paymentType === 'fund-deposit');
  
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;
        this.loading = false;
        this.toastr.success('P2P Report loaded successfully!');
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