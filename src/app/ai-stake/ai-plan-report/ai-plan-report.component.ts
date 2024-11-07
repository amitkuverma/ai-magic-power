import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environments/environment';
import { TransactionService } from 'src/services/transaction.service';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ai-plan-report',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './ai-plan-report.component.html',
  styleUrl: './ai-plan-report.component.scss'
})



export class AiPlanReportComponent {
  transInfo: any[] = [];
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  addedAmount: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';
  envImg: any;
  loginUserPaymetDetails: any;
  selectedImage!: File;
  imagePreviewUrl!: any;

  constructor(private transactionService: TransactionService, private cookies: CookieService, private toastr: ToastrService) {
    this.envImg = environment.IMAGE_URL
  }

  ngOnInit(): void {
    this.fetchTransactions();
  }


  fetchTransactions(): void {
    this.loading = true;
    this.transactionService.getAllTransaction().subscribe((data: any) => {
      if (this.cookies.isAdmin()) {
        const adminHistory = data.filter((item:any) => item.paymentType === 'trade')
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;

      } else {
        const userHistory = data.filter((item:any) => item.userId === this.cookies.decodeToken().userId && item.paymentType === 'trade' );
        this.transInfo = userHistory
        this.filteredTrans = userHistory;
        this.totalItems = userHistory.length;
      }
      this.loading = false;
      this.toastr.success('AI Plan history loaded successfully!');
      setTimeout(() => (this.successMessage = ''), 3000); // Clear success message after 3 seconds
    },
    error=>{
      this.toastr.error('No data found!!');
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

}