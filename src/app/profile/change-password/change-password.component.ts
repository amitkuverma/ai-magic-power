import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm!:FormGroup;

  constructor(private fb:FormBuilder, private userService: UsersService, private toastr: ToastrService) { 
    this.initForms();
  }

  initForms() {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.changePasswordForm.value;
      if (newPassword === confirmPassword) {
        this.userService.changePassword({ newPassword }).subscribe(
          () => this.toastr.success('Password changed successfully!'),
          (error) => this.toastr.error('Error changing password.')
        );
      } else {
        this.toastr.warning('Passwords do not match.');
      }
    }
  }
}
