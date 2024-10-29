import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';
import { UploadService } from 'src/services/uploadfile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-fund',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './add-fund.component.html',
  styleUrls: ['./add-fund.component.scss']  // Fixed typo here
})
export class AddFundComponent {
  editProfileForm!: FormGroup;
  imagePreviewUrl: any;
  selectedImage: any;
  isImageUploaded: boolean = false;
  loading: boolean = false;
  transInfo: any[] = [];
  filteredTrans: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';
  searchQuery: string = '';
  selectedUser: any = null;
  transDetails: any;
  selectedUserInTransaction: any;
  fundInfo: any;
  fundAmount!: number;
  envImg:any;
  @ViewChild('userDetailsModal') userDetailsModal!: ElementRef;


  constructor(private uploadService: UploadService, private fb: FormBuilder,
    private cookiesService: CookieService, private transactionService: TransactionService) {
      this.envImg = environment.IMAGE_URL
  }
  ngOnInit(): void {
    this.fetchTransaction();
    this.getSelectedUser();
  }

  getSelectedUser() {
    this.transactionService.getUserTransactions(this.cookiesService.decodeToken().userId).subscribe(
      (res) => {
        this.selectedUserInTransaction = res;
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  fetchTransaction(): void {
    this.loading = true;
    this.transactionService.getAllTransaction().subscribe((data: any) => {

      const userHistory = data.filter((item:any) => item.userId === this.cookiesService.decodeToken().userId && item.paymentType === 'fund' && item.status === 'pending');
      this.transInfo = userHistory
      this.filteredTrans = userHistory;
      this.totalItems = userHistory.length;
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

  async createUserDetails(): Promise<any> {
    this.loading = true;
    const data = {
      paymentType: 'fund',
      transactionAmount: this.fundAmount
    };

    return this.transactionService.createTransaction(data).toPromise()
      .then(res => {
        if (res) {
          this.selectedUser = res;
          return res;
        }
      })
      .catch(error => {
        this.loading = false;
        console.log(error);
        return null;
      });
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

  // Handle the upload action
  async upload(): Promise<void> {
    const userData = await this.createUserDetails();
    console.log(userData);

    if (this.selectedImage && userData) {
      this.uploadService.uploadFile(this.selectedImage, userData.transId, 'transaction')
        .subscribe(
          response => {
            this.successMessage = 'File uploaded successfully';
            this.isImageUploaded = true; // Mark image as uploaded
            this.loading = false;
            this.closeModal();
          },
          error => {
            this.successMessage = 'Error uploading file';
            console.error('Error uploading file', error);
            this.loading = false;
          }
        );
    } else {
      this.successMessage = 'Error uploading file: No selected image or transaction data.';
      this.loading = false;
    }
  }



  updateStatus(status: any) {
    this.selectedUser.status = status;
    this.transactionService.updateTransaction(this.selectedUser, this.selectedUser.transId).subscribe(
      (res) => {
        this.successMessage = 'Status update successfully!';
        this.fetchTransaction();
      },
      (error: any) => {
        this.successMessage = 'Unable to update status';
      }
    )
  }
}
