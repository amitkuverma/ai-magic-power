import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TransactionService } from 'src/services/transaction.service';
import { AccountDetailsService } from 'src/services/account.service';
import { UploadService } from 'src/services/uploadfile.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-fund',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-fund.component.html',
  styleUrls: ['./add-fund.component.scss']
})
export class AddFundComponent implements OnInit {
  editProfileForm!: FormGroup;
  selectedImage: any;
  loading: boolean = false;
  accountDetails: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private transactionService: TransactionService,
    private accountService: AccountDetailsService,
    private uploadService: UploadService,
    private clipboard: Clipboard,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchAdminAccount();
  }

  initializeForm(): void {
    this.editProfileForm = this.fb.group({
      fundAmount: [null, [Validators.required, Validators.min(1)]],
      transactionId: [null, Validators.required]
    });
  }

  fetchAdminAccount(): void {
    this.accountService.getAllAccounts().subscribe(
      res => {
        this.accountDetails = res.find(item => item.bankName === 'admin');
      },
      error => {
        console.error(error);
        this.toastr.error('Failed to load account details');
      }
    );
  }

  copyToClipboard(text: any): void {
    this.clipboard.copy(text);
    this.toastr.success('Copied to clipboard!');
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedImage = target.files[0];
    }
  }

  async upload(): Promise<void> {
    if (this.editProfileForm.invalid) {
      this.toastr.error('Please complete all required fields.');
      return;
    }

    this.loading = true;
    try {
      const transactionData = {
        paymentType: 'fund',
        transactionId: this.editProfileForm.get('transactionId')?.value,
        transactionAmount: this.editProfileForm.get('fundAmount')?.value
      };

      const userData = await this.transactionService.createTransaction(transactionData).toPromise();

      if (userData && this.selectedImage) {
        this.uploadService.uploadFile(this.selectedImage, userData.transId, 'transaction').subscribe(
          () => {
            this.loading = false;
            this.toastr.success('Fund request sent successfully!');
            this.router.navigate(['/fund-history']);
          },
          error => {
            console.error(error);
            this.toastr.error('Error uploading file');
            this.loading = false;
          }
        );
      } else {
        this.toastr.error('File or transaction data is missing');
      }
    } catch (error) {
      console.error(error);
      this.toastr.error('Error creating transaction');
      this.loading = false;
    }
  }
}
