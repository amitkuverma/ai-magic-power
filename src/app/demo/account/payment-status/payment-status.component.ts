import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/services/payment.service';
import { UsersService } from 'src/services/users.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private usersService: UsersService, private route: ActivatedRoute, public location: Location, private paymentService: PaymentService) {
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
        this.showMessage('Error loading payment details');
      }
    );
  }

  updateStatus(userId: number, status: string): void {
    this.isLoading = true;
    this.usersService.updateUserStatus(userId, status).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.showMessage('Status updated successfully');
        this.location.back();
      },
      (error: any) => {
        this.isLoading = false;
        this.showMessage('Error updating status');
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
        this.showMessage('Payment updated successfully');
        this.location.back();
      },
      (error: any) => {
        this.isLoading = false;
        this.showMessage('Error updating payment');
      }
    );
  }

  showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => this.message = '', 3000); // Message disappears after 3 seconds
  }
}