import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountDetailsService } from 'src/services/account.service';
import { CookieService } from 'src/services/cookie.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  accountForm!: FormGroup;
  accountDetailsList: any[] = []; // List of all accounts
  accountDetails: any = null; // Selected account details for edit/view
  isEditing: boolean = false;
  isLoading: boolean = false;
  formType!: string;
  userId!: number;
  userName!: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountDetailsService,
    private cookies: CookieService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const decodedToken = this.cookies.decodeToken();
    this.userId = decodedToken?.userId;
    this.userName = decodedToken?.userName;

    // Initialize form controls with better validators
    this.accountForm = this.fb.group({
      bankName: [''],
      branchName: [''],
      accountHolderName: [''],
      accountNumber: ['', Validators.required],
      ifscCode: [''], // Adjust as per IFSC format Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]
      accountType: [''],
    });

    // Load account details (from API)
    this.loadAccountDetails();
  }

  loadAccountDetails() {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe(
      (data: any[]) => {
        // Use strict equality comparison
        this.accountDetailsList = data.filter(user => user.userId === this.userId);
        this.isLoading = false;
      },
      (error: any) => {
        this.toastr.error('Error fetching account details');
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      return;
    }

    this.isLoading = true;
    const accountData = this.accountForm.value;
    accountData.bankName = '';
    accountData.branchName = '';
    accountData.accountHolderName = '';
    accountData.ifscCode = '';
    accountData.accountType = '';

    if (this.isEditing && this.accountDetails) {
      // Update account
      this.accountService.updateAccount(accountData, this.accountDetails.accId).subscribe(
        () => {
          this.toastr.success('Account updated successfully');
          this.loadAccountDetails();
          this.resetForm();
        },
        (error) => {
          this.toastr.error('Error updating account');
          this.isLoading = false;
        }
      );
    } else {
      // Save new account
      this.accountService.saveAccount(accountData).subscribe(
        () => {
          this.toastr.success('Account added successfully');
          this.loadAccountDetails();
          this.resetForm();
        },
        (error) => {
          this.toastr.error('Error adding account');
          this.isLoading = false;
        }
      );
    }
  }

  deleteAccount(accId: number) {
    if (confirm('Are you sure you want to delete this account?')) {
      this.isLoading = true;
      this.accountService.deleteAccount(accId).subscribe(
        () => {
          this.toastr.success('Account deleted successfully');
          this.loadAccountDetails();
        },
        (error) => {
          this.toastr.error('Error deleting account');
          this.isLoading = false;
        }
      );
    }
  }

  editAccount(account: any) {
    this.formType = 'Edit';
    this.isEditing = true;
    this.accountDetails = account;
    this.accountForm.patchValue(account);
  }

  cancelEdit() {
    this.resetForm();
  }

  addNewAccount() {
    this.formType = 'Add';
    this.isEditing = true;
    this.accountDetails = null;
    this.accountForm.reset(); // Clear form for new account
  }

  // Helper function to reset form
  resetForm() {
    this.isEditing = false;
    this.isLoading = false;
    this.accountForm.reset(); // Clear the form
    this.accountDetails = null; // Reset selected account
  }

  filterAccountData(userId: number) {
    return this.accountDetailsList.filter(account => account.userId === userId);
  }
}
