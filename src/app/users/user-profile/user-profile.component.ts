import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService } from 'src/services/users.service';
import { CookieService } from 'src/services/cookie.service';
import { UploadService } from 'src/services/uploadfile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  editProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  user!: any; 
  imagePreviewUrl: any;
  selectedImage: any;
  imageUrl:any;
  isImageUploaded:boolean = false;
  loading: boolean = false;
  activeTab: string = 'profile';

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private cookies: CookieService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
    this.imageUrl = environment.IMAGE_URL;
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  // Initialize the forms
  initForms() {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      referralCode: ['']
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  // Load user profile from backend
  loadUserProfile() {
    this.loading = true;
    const userId = this.cookies.decodeToken().userId;
    this.userService.getUserById(userId).subscribe((user) => {
      this.user = user;
      this.editProfileForm.patchValue(user); 
      this.loading = false;
    });
  }

  onSubmitEditProfile() {
    if (this.editProfileForm.valid) {
      // Call API to update profile
    }
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

  upload(): void {
    if (this.selectedImage) {
      this.uploadService.uploadFile(this.selectedImage, this.cookies.decodeToken().userId, 'user')
        .subscribe(
          response => {
            console.log('File uploaded successfully', response);
            this.isImageUploaded = true;
          },
          error => {
            console.error('Error uploading file', error);
          }
        );
    }
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword === confirmPassword) {
        // Call API to change password
      } else {
        console.error('Passwords do not match');
      }
    }
  }

  printId() {
    const printContents = document.querySelector('.id-card')?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';
    window.print();
    document.body.innerHTML = originalContents; 
    window.location.reload();
  }
}