import { Component } from '@angular/core';
import { PaymentService } from 'src/services/payment.service';
import { CookieService } from 'src/services/cookie.service';
import { UsersService } from 'src/services/users.service';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PlusOutline, SendOutline, BankOutline, ShareAltOutline } from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
  users: any;
  filteredUsers: any;
  imageUrl: any;

  constructor(private paymentService: PaymentService, public cookies: CookieService, private usersService: UsersService,
    private clipboard: Clipboard, private toastr: ToastrService, private iconService: IconService
  ) {
    this.loadPayment();
    this.fetchUsers();
    this.imageUrl = environment.IMAGE_URL
    this.iconService.addIcon(
      ...[
        PlusOutline, SendOutline, BankOutline, ShareAltOutline
      ]
    );
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(
      (res) => {
        this.userInfo = res.filter((item: any) => item.userId === this.cookies.decodeToken().userId);
        this.totalDirect = res.filter((item: any) => item.status === 'direct');
        this.activeDirect = res.filter((item: any) => item.status === 'active_direct');
      },

      (error: any) => {
        console.log(error)
      }
    )
  }

  loadPayment() {
    const userId = this.cookies.decodeToken()?.userId;
    if (userId) {
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

  fetchUsers(): void {
    this.usersService.getUserReferrals(this.cookies.decodeToken().userId).subscribe((data: any) => {
      this.users = data.user;
      console.log(this.users)
      this.filteredUsers = data.referrals;
      this.totalTeam = data.referrals.length;
      this.activeTeam = data.referrals.filter((item: any) => item.status === 'active');
    });
  }
  copyToClipboard(text: any) {
    this.clipboard.copy(`${environment.UI_URL}register?referralCode=${text}`);
    this.toastr.success("Share URL Coppied successfully!")
  }
}
