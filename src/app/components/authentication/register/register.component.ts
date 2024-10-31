// angular import
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';
import * as bootstrap from 'bootstrap';

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
  userInfo: any;
  @ViewChild('packageModal') packageModal!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.queryParamMap.subscribe((params) => {
      const referralCode = params.get('referralCode');
      if (referralCode) {
        this.signupForm.get('referralCode')?.setValue(referralCode);
        this.signupForm.get('referralCode')?.disable();
      }
    });
  }

  register() {
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true; // Start loading
    this.errorMessage = '';
    this.successMessage = '';
    this.signupForm.get('referralCode')?.enable();
    this.authService.register(this.signupForm.value).subscribe(
      (response) => {
        this.userInfo = response;
        const login = {
          userId: response.userId,
          password: this.signupForm.get('password').value
        }
        this.authService.login(login).subscribe(
          res => {
            this.cookiesSerrvice.setCookie('token', res.token, 1);
            const body = {
              userId: response.userId,
              userName: response.name,
              status: 'create'
            }
            this.paymentService.createPayment(body).subscribe(
              res => {
                this.loading = false; // Stop loading
                const modal = new bootstrap.Modal(this.packageModal.nativeElement);
                modal.show();
                this.toastr.success('Account created successfully!', 'Success');
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
