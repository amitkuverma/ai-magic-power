import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/services/users.service';
import { CookieService } from 'src/services/cookie.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-leval-team',
  standalone: true,
  imports:  [CommonModule, FormsModule, NgxPaginationModule, SharedModule, RouterModule],
  templateUrl: './leval-team.component.html',
  styleUrl: './leval-team.component.scss'
})
export class LevalTeamComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchQuery: string = '';
  selectedUser: any = null;
  loading: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  successMessage: string = '';
  isMenuOpen: { [key: number]: boolean } = {};

  constructor(private usersService: UsersService, private router: Router,
    private toastr: ToastrService, private cookies: CookieService
  ) {
  }
  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.usersService.getUserReferrals(this.cookies.decodeToken().userId).subscribe((data: any) => {
      this.users = data.referrals;
      this.filteredUsers = data.referrals;
      this.totalItems = data.referrals.length;
      this.loading = false;
      this.toastr.success('Users loaded successfully!', 'Success');
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalItems = this.filteredUsers.length;
  }

  viewUserDetails(user: any): void {
    this.selectedUser = user;
  }

  closeModal(): void {
    this.selectedUser = null;
  }
  toggleMenu(userId: number) {
    this.isMenuOpen[userId] = !this.isMenuOpen[userId];
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(userId).subscribe(
        (response: any) => {
          this.successMessage = 'User deleted successfully!';
          this.filteredUsers = this.filteredUsers.filter(user => user.userId !== userId);
        },
        (error: any) => {
          console.error('Error deleting user', error);
          this.successMessage = 'Failed to delete user!';
        }
      );
    }
  }

  goToUserNetwork(userId: number): void {
    this.router.navigate(['/friends-network', userId]);
  }

  goToUserDetails(userId: number): void {
    this.router.navigate(['/user-details', userId]);
  }

  goToPaymentDetails(userId: number): void {
    this.router.navigate(['/payment-status', userId]);
  }

}
