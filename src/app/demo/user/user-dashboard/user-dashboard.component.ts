import { Component } from '@angular/core';
import { CookieService } from 'src/services/cookie.service';
import { PaymentService } from 'src/services/payment.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {
  userInfo: any;
  paymentInfo: any;
  totalDirect: any;
  activeDirect: any;
  totalTeam: any;
  activeTeam: any;

  constructor(private paymentService: PaymentService, private cookies: CookieService, private usersService: UsersService) {
    this.loadPayment();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(
      (res) => {
        this.userInfo = res.filter(item => item.userId === this.cookies.decodeToken().userId);
        this.totalDirect = res.filter(item => item.status === 'direct');
        this.activeDirect = res.filter(item => item.status === 'active_direct');
        this.totalTeam = res;
        this.activeTeam = res.filter(item => item.status === 'active');
      },

      (error: any) => {
        console.log(error)
      }
    )
  }

  loadPayment() {
    this.paymentService.getUserReferrals(this.cookies.decodeToken().userId).subscribe(
      (res) => {
        this.paymentInfo = res;
      },

      (error: any) => {
        console.log(error)
      }
    )
  }

}
