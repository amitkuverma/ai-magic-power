import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm!:FormGroup;

  constructor(private fb:FormBuilder) { 
    this.initForms();
  }

  initForms() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword === confirmPassword) {
        // this.userService.changePassword({ oldPassword, newPassword }).subscribe(
        //   () => this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 }),
        //   (error) => this.snackBar.open('Error changing password.', 'Close', { duration: 3000 })
        // );
      } else {
        // this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      }
    }
  }
}
