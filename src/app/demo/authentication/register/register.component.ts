// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  // public method
  SignUpOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
  signupForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // Mobile number validation
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      referralCode: [''] // Optional
    });
  }

  register() {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true; // Start loading
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.signupForm.value).subscribe(
      (response) => {
        this.loading = false; // Stop loading
        this.successMessage = 'Account created successfully!';
        console.log('Registration successful:', response);
        setTimeout(() => {
          this.router.navigate(['/login']); // Navigate after success
        }, 2000);
      },
      (error) => {
        this.loading = false; // Stop loading
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration failed:', error);
      }
    );
  }
}
