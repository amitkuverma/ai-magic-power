import { Component } from '@angular/core';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
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
        this.userInfo = res.filter((item:any) => item.userId === this.cookies.decodeToken().userId);
        this.totalDirect = res.filter((item:any) => item.status === 'direct');
        this.activeDirect = res.filter((item:any) => item.status === 'active_direct');
        this.totalTeam = res;
        this.activeTeam = res.filter((item:any) => item.status === 'active');
      },

      (error: any) => {
        console.log(error)
      }
    )
  }

  loadPayment() {
    const userId = this.cookies.decodeToken()?.userId;
    if(userId){
      this.paymentService.getUserReferrals(userId).subscribe(
        (res) => {
          this.paymentInfo = res;
        },  
        (error: any) => {
          console.log(error)
        }
      )
    }
    
  }

}
