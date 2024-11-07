import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';

@Component({
  selector: 'app-update-income-report',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './update-income-report.component.html',
  styleUrls: ['./update-income-report.component.scss']
})
export class UpdateIncomeReportComponent {
  payInfo: any;
  filteredTrans: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  updating: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';
  totalDepositWallet: string = '';
  editForm!: FormGroup;
  selectedPayment: any;
  userId: string | null = null;

  constructor(
    private paymentService: PaymentService,
    public cookies: CookieService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.editForm = this.fb.group({
      userId: [''],
      userName: [''],
      earnWallet: [''],
      depositWallet: [''],
      referralEarning: [''],
      selfInvestment: [''],
      levelEarning: [''],
      aiEarning: [''],
      royalty: [''],
      totalWithdraw: [''],
      dailyLevelEarning: [''],
      leadershipEarning: [''],
      oneTimeEarning: [''],
      starEarning: [''],
      totalAmount: [''],
      plan: [''],
      commission: [''],
      planStartDate: [''],
      planEndDate: ['']
    });
  }

  fetchUsers(): void {
    this.loading = true;
    this.paymentService.getUserReferrals(this.userId).subscribe(
      (data: any) => {
        const adminHistory = data;
        this.payInfo = adminHistory;
        this.filteredTrans = adminHistory;
        this.totalItems = adminHistory.length;
        this.loading = false;

        // Populate the form with the fetched payInfo
        this.editForm.patchValue({
          userId: this.payInfo.userId,
          userName: this.payInfo.userName,
          earnWallet: this.payInfo.earnWallet,
          depositWallet: this.payInfo.depositWallet,
          referralEarning: this.payInfo.referralEarning,
          selfInvestment: this.payInfo.selfInvestment,
          levelEarning: this.payInfo.levelEarning,
          aiEarning: this.payInfo.aiEarning,
          royalty: this.payInfo.royalty,
          totalWithdraw: this.payInfo.totalWithdraw,
          dailyLevelEarning: this.payInfo.dailyLevelEarning,
          leadershipEarning: this.payInfo.leadershipEarning,
          oneTimeEarning: this.payInfo.oneTimeEarning,
          starEarning: this.payInfo.starEarning,
          totalAmount: this.payInfo.totalAmount,
          plan: this.payInfo.plan,
          commission: this.payInfo.commission,
          planStartDate: this.payInfo.planStartDate,
          planEndDate: this.payInfo.planEndDate
        });

        this.toastr.success('Total Turnover data loaded successfully!');
      },
      (error: any) => {
        this.loading = false;
        this.toastr.error(error.error.message);
      }
    );
  }

  onSubmitEdit() {
    if (this.editForm.valid) {
      this.updating = true; // Set updating to true when the update starts
      const updatedData = this.editForm.value;
      
      this.paymentService.updateUserStatus(updatedData, this.payInfo.payId).subscribe(
        res => {
          this.updating = false; // Reset updating flag
          this.toastr.success('Data updated successfully!');
          // Optionally reload data or update local data source here
        },
        error => {
          this.updating = false; // Reset updating flag
          this.toastr.error('Failed to update data. Please try again.');
        }
      );
    }
  }
}
