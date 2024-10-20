import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CookieService } from 'src/services/cookie.service';
import { TransactionService } from 'src/services/transaction.service';
import { UploadService } from 'src/services/uploadfile.service';

@Component({
  selector: 'app-add-fund',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './add-fund.component.html',
  styleUrl: './add-fund.component.scss'
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
  userInfo: any; 
  fundInfo: any; 



  constructor(private uploadService: UploadService, private fb: FormBuilder,
    private cookiesService: CookieService, private transactionService: TransactionService) {
  }
  ngOnInit(): void {
    this.fetchUsers();
    this.getSelectedUser();
  }

  getSelectedUser(){
    this.transactionService.getUserTransactions(this.cookiesService.decodeToken().userId).subscribe(
      (res)=>{
        this.userInfo = res;
      },
      (error:any)=>{

      }
    )
  }

  fetchUsers(): void {
    this.loading = true;
    this.transactionService.getAllTransaction().subscribe((data: any) => {
      if (this.cookiesService.isAdmin()) {
        this.transDetails = data;
        const adminHistory = data.filter(item => item.paymentType === 'fund' && item.status === 'pending')
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;

      } else {
        const userHistory = data.filter(item => item.userId === this.cookiesService.decodeToken().userId && item.paymentType === 'fund' && item.status === 'pending');
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

  viewUserDetails(): void {
    const data = {
      paymentType: 'fund',
      transactionAmount: 0
    };
    this.transactionService.createTransaction(data).subscribe(
      (res)=>{
        this.fundInfo = res;
      },
      (error)=>{
        console.log(error)
      }
    )
    this.selectedUser = this.transDetails.filter(item => item.userId === this.selectedUser.userId);
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

      // Update form control for image
      this.editProfileForm.patchValue({ image: this.selectedImage });
      this.editProfileForm.get('image')?.updateValueAndValidity();
    }
  }

  // Handle the upload action
  upload(): void {
    if (this.selectedImage) {
      this.uploadService.uploadFile(this.selectedImage, this.cookiesService.decodeToken().userId, 'transaction')
        .subscribe(
          response => {
            console.log('File uploaded successfully', response);
            this.isImageUploaded = true; // Mark image as uploaded
          },
          error => {
            console.error('Error uploading file', error);
          }
        );
    }
  }

  updateStatus(status: any) {
    this.selectedUser.
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
