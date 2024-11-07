import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AIEarningService } from 'src/services/ai-earning.service';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { TransactionService } from 'src/services/transaction.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule,SharedModule, FormsModule, NgxPaginationModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss'
})
export class PaymentListComponent {
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
  editForm!: FormGroup;
  selectedPayment: any;
  totalAiIncome:any;
  totalDailyIncome:any;
  totalDailyLevelEarning:any;

  constructor(private paymentService: PaymentService, public cookies: CookieService,
    private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(): void {
    this.loading = true;
    this.paymentService.getAllReferUser().subscribe(
      (data: any) => {
        const adminHistory = data;
  
        // Calculate total depositWallet
        const totalDepositWallet = adminHistory.reduce((total: number, item: any) => {
          return total + parseFloat(item.depositWallet || 0);
        }, 0);
  
        // Calculate total AI income
        const totalAiIncome = adminHistory.reduce((total: number, item: any) => {
          return total + parseFloat(item.aiIncome || 0);
        }, 0);
  
        // Calculate total daily income
        const totalDailyIncome = adminHistory.reduce((total: number, item: any) => {
          return total + parseFloat(item.dailyIncome || 0);
        }, 0);
  
        // Calculate total daily level earning
        const totalDailyLevelEarning = adminHistory.reduce((total: number, item: any) => {
          return total + parseFloat(item.dailyLevelEarning || 0);
        }, 0);
  
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;
  
        // Store the totals for display
        this.totalDepositWallet = totalDepositWallet;
        this.totalAiIncome = totalAiIncome;
        this.totalDailyIncome = totalDailyIncome;
        this.totalDailyLevelEarning = totalDailyLevelEarning;
  
        this.loading = false;
        this.toastr.success('Data loaded successfully!');
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

  openEditForm(payment: any) {
    this.selectedPayment = payment;
    this.editForm.patchValue(payment); // Prefill form with selected transaction data
    // $('#editModal').modal('show'); // Open modal
  }

  onSubmitEdit() {
    if (this.editForm.valid) {
      const updatedData = this.editForm.value;
      // Update your data source here. (e.g., send updatedData to a service to save changes)
      
      // $('#editModal').modal('hide'); // Close modal after submission
    }
  }
}