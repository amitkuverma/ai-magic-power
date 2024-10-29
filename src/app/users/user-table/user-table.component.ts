import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterModule } from '@angular/router';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
  HolderOutline,
  MoreOutline,
  DeleteOutline,
  UserDeleteOutline
} from '@ant-design/icons-angular/icons';
import { IconService } from '@ant-design/icons-angular';
import { SharedModule } from '../../../shared/shared.module';
import { UsersService } from 'src/services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxPaginationModule, SharedModule, RouterModule], // Import necessary modules directly
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
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

  constructor(private usersService: UsersService, private iconService: IconService, private router: Router, private toastr: ToastrService) {
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        UserOutline,
        SettingOutline,
        GiftOutline,
        MoreOutline,
        MessageOutline,
        DeleteOutline,
        UserDeleteOutline,
      ]
    );
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe((data: any) => {
      this.users = data;
      this.filteredUsers = data;
      this.totalItems = data.length;
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
