import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CookieService } from 'src/services/cookie.service';
import { UploadService } from 'src/services/uploadfile.service';
import { UsersService } from 'src/services/users.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  editProfileForm!: FormGroup;
  changePasswordForm!: FormGroup;
  user!: any; // User information
  imagePreviewUrl: any;
  selectedImage: any;
  imageUrl: any;
  isImageUploaded: boolean = false;


  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private cookies: CookieService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
    this.imageUrl = environment.IMAGE_URL
  }

  // Initialize the forms
  initForms() {
    // Edit profile form
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      password: [''],
      referralCode: [''],
      status: ['active', Validators.required]
    });
  }

  // Load user profile from backend
  loadUserProfile() {
    const userId = this.cookies.decodeToken().userId;
    this.userService.getUserById(userId).subscribe((user) => {
      this.user = user;
      this.editProfileForm.patchValue(user); // Populate form with user data
    });
  }

  // Submit profile changes
  onSubmitEditProfile() {
    if (this.editProfileForm.valid) {
      this.userService.updateUserProfile(this.editProfileForm.value).subscribe(
        (res) => { 
          this.loadUserProfile();
          console.log('Profile updated successfully!') 
        },
        (error) => console.log('Error updating profile.')
      );
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

      // Update form control for image
      this.editProfileForm.patchValue({ image: this.selectedImage });
      this.editProfileForm.get('image')?.updateValueAndValidity();
    }
  }

  // Handle the upload action
  upload(): void {
    if (this.selectedImage) {
      this.uploadService.uploadFile(this.selectedImage, this.cookies.decodeToken().userId, 'user')
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
}