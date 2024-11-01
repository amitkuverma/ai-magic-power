import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { TransactionService } from 'src/services/transaction.service';
import { UsersService } from 'src/services/users.service';

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
  envImg: any;
  addFundUserDetails: any;
  selectedImage!: File;
  imagePreviewUrl!: any;

  constructor(private transactionService: TransactionService, private cookies: CookieService, private paymentService: PaymentService,
    private userService: UsersService, private toastr:ToastrService
  ) {
    this.envImg = environment.IMAGE_URL
  }

  ngOnInit(): void {
    this.fetchTransactions();
  }


  fetchTransactions(): void {
    this.loading = true;
    this.transactionService.getAllTransaction().subscribe((data: any) => {
      if (this.cookies.isAdmin()) {
        const adminHistory = data.filter((item: any) => item.paymentType === 'fund' && item.status === 'pending')
        this.transInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;

      } else {
        const userHistory = data.filter((item: any) => item.userId === this.cookies.decodeToken().userId && item.paymentType === 'fund' && item.status === 'pending');
        this.transInfo = userHistory
        this.filteredTrans = userHistory;
        this.totalItems = userHistory.length;
      }
      this.loading = false;
      this.toastr.success('Fund history data loaded successfully!');
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
    this.selectedUser.status = status;
    this.transactionService.updateTransaction(this.selectedUser, this.selectedUser.transId).subscribe(
      (resTrans) => {
        if (status === 'approved') {
          this.paymentService.getUserReferrals(this.selectedUser.userId).subscribe(
            resPay => {
              resPay.depositWallet = (parseFloat(resPay.depositWallet) + parseFloat(this.selectedUser.transactionAmount)).toFixed(2);
              this.paymentService.updateUserStatus(resPay, resPay.payId).subscribe(
                res => {
                  this.userService.getUserById(this.selectedUser.userId).subscribe(
                    (resUser: any) => {
                      if (resUser.status === 'pending') {
                        resUser.activeDate = new Date();
                        this.userService.updateUserStatus(this.selectedUser.userId, "active").subscribe(
                          resCre=>{
                            this.userService.getParentReferralChain(this.selectedUser.userId).subscribe(resRefParent => {
                              switch (resRefParent.length) {
                                case 1:
                                  console.log("Case 1");
                                  this.handleReferralPercentage(resRefParent, 5);
                                  break;
                                case 2:
                                  console.log("Case 2");
                                  this.handleReferralPercentage(resRefParent, 3);
                                  break;
                                case 3:
                                  console.log("Case 3");
                                  this.handleReferralPercentage(resRefParent, 2);
                                  break;
                                case 4:
                                  console.log("Case 4");
                                  this.handleReferralPercentage(resRefParent, 1);
                                  break;
                                case (resRefParent.length >= 5 && resRefParent.length <= 10):
                                  console.log("Case 5-10");
                                  this.handleReferralPercentage(resRefParent, 0.5);
                                  break;
                                default:
                                  console.log("No match found");
                                  break;
                              }
                            });                           
                          }
                        )
                      }
                    }
                  )
                  this.closeModal();
                  this.toastr.success('Fund added successfully!');
                  this.fetchTransactions();
                },
                error => {
                  this.toastr.error('Unable to add fund!');
                  this.fetchTransactions();

                }
              )
            },
            error => {
              this.toastr.error('Unable to add fund!');
            }
          )

        } else {
          this.toastr.error('Fund rejected successfully!');
        }

      },
      (error: any) => {
        this.successMessage = 'Unable to update status';
      }
    )
  }

  handleReferralPercentage(referrals: any[], percentage: number) {
    referrals.forEach((referral, i) => {
      this.paymentService.getUserReferrals(referral.userId).subscribe(resPay => {
        const depositAmount = parseFloat(resPay.depositWallet) || 0;
        const additionalAmount = (depositAmount * (percentage / 100)).toFixed(2);
        resPay.depositWallet = (depositAmount + parseFloat(additionalAmount)).toFixed(2);
        
        console.log(`Updated deposit for referral ${i + 1}: ${resPay.depositWallet}`);
        
        // Now save the updated payment status
        this.paymentService.updateUserStatus(resPay, resPay.payId).subscribe(
          response => {
            console.log(`Payment status updated successfully for payId ${resPay.payId}`);
          },
          error => {
            console.error(`Failed to update payment status for payId ${resPay.payId}:`, error);
          }
        );
      });
    });
  }

  closeModal() {
    const modalElement = document.getElementById('packageModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement); // Get the modal instance
      if (modal) {
        modal.hide(); // Hide the modal using Bootstrap's method
      } else {
        // If the modal is not instantiated, hide it manually
        modalElement.classList.remove('show');
        modalElement.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        // Remove the backdrop if it exists
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
    }
  }
}