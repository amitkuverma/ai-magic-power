// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';

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
    private router: Router,
    private toastr: ToastrService,
    private paymentService: PaymentService,
    private cookiesSerrvice: CookieService
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
        const login = {
          email: this.signupForm.get('email').value,
          password: this.signupForm.get('password').value
        }
        this.authService.login(login).subscribe(
          res=>{
            this.cookiesSerrvice.setCookie('token', res.token, 1);
            const body = {
              userId: response.userId,
              userName: response.name,
              status: 'create'
            }
            this.paymentService.createPayment(body).subscribe(
              res=>{
                this.loading = false; // Stop loading
                this.toastr.success('Account created successfully!','Success');
                this.cookiesSerrvice.deleteCookie('token');
                this.router.navigate(['/login']);                  
              }
            )
          }
        )

      
       
      },
      (error) => {
        this.loading = false; // Stop loading
        this.toastr.error('Registration failed. Please try again.', 'Error');
      }
    );
  }
}
