import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/services/payment.service';
import { UsersService } from 'src/services/users.service';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-status.component.html',
  styleUrl: './payment-status.component.scss'
})
export class PaymentStatusComponent {
  paymentDetails: any;
  isLoading: boolean = false;
  userId: any;
  imageUrl: any;
  showDialog: boolean = false;
  message: string = '';

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location,
    private paymentService: PaymentService, private toastr: ToastrService) {
    this.imageUrl = environment.IMAGE_URL;
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.getPaymentData();
  }

  getPaymentData() {
    this.paymentService.getUserReferrals(this.userId).subscribe(
      (data: any) => {
        this.paymentDetails = data;
      },
      (error: any) => {
        this.toastr.error('Error loading payment details', 'Error');
      }
    );
  }

  updateStatus(userId: number, status: string): void {
    this.isLoading = true;
    this.usersService.updateUserStatus(userId, status).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toastr.success('Status updated successfully', 'Success');
        this.location.back();
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error('Error updating status', 'Error');
      }
    );
  }

  openShareDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  addPayment(): void {
    this.isLoading = true;
    this.paymentService.updateUserStatus(this.paymentDetails, this.paymentDetails.payId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.closeDialog();
        this.toastr.success('Payment updated successfully', 'Success');
        this.location.back();
      },
      (error: any) => {
        this.isLoading = false;
        this.toastr.error('Error updating payment', 'Error');
      }
    );
  }
}