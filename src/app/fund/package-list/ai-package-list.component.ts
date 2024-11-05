import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from 'src/environments/environment';
import { TransactionService } from 'src/services/transaction.service';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';

@Component({
  selector: 'app-ai-package-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './ai-package-list.component.html',
  styleUrl: './ai-package-list.component.scss'
})



export class AiPackageListComponent {
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

  constructor(private transactionService: TransactionService, private cookies: CookieService, private paymentService: PaymentService) {
    this.envImg = environment.IMAGE_URL
  }

  ngOnInit(): void {
    this.fetchTransactions();
    this.fetchPaymentDetails();
  }

  fetchPaymentDetails() {
    this.paymentService.getAllReferUser().subscribe(
      res => {
        console.log(this.cookies.decodeToken().userId)
        this.loginUserPaymetDetails = res.filter((item:any) => item.userId === this.cookies.decodeToken().userId);
        console.log(this.loginUserPaymetDetails)
      },
      error => {

      }
    )
  }

  fetchTransactions(): void {
    this.loading = true;
    this.paymentService.getAllReferUser().subscribe((data: any) => {
      if (this.cookies.isAdmin()) {
        const adminHistory = data.filter((item:any) => item.status === 'new')
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;

      } else {
        const userHistory = data.filter((item:any) => item.userId === this.cookies.decodeToken().userId && item.paymentType === 'fund' && item.status === 'pending');
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

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedImage = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  updateStatus(status: any) {
    
    const currentDate = Date.now();

    // Calculate 1000 days in milliseconds (1000 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const daysToAdd = this.selectedUser.plan === ''? 1000 * 24 * 60 * 60 * 1000 : 750 * 24 * 60 * 60 * 1000;

    // Create a new date by adding 1000 days
    const newDate = new Date(currentDate + daysToAdd);

    this.selectedUser.planStartDate = currentDate;
    this.selectedUser.planEndDate = newDate;
    this.selectedUser.status = status;

    this.paymentService.updateUserStatus(this.selectedUser, this.selectedUser.transId).subscribe(
      (res:any) => {
        if (status === 'active') {
          this.loginUserPaymetDetails.earnWallet += this.addedAmount;
          this.paymentService.updateUserStatus(this.loginUserPaymetDetails, this.loginUserPaymetDetails.payId).subscribe(
            (res:any) => {
              this.successMessage = 'Fund added successfully!';
              this.fetchTransactions();

            },
            (error:any) => {
              this.successMessage = 'Unable to add fund!';
              this.fetchTransactions();

            }
          )
        }
        this.successMessage = 'Fund rejected successfully!';

      },
      (error: any) => {
        this.successMessage = 'Unable to update status';
      }
    )
  }
}