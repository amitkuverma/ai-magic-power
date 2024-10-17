import { Component } from '@angular/core';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-user-tree',
  standalone: true,
  imports: [],
  templateUrl: './user-tree.component.html',
  styleUrl: './user-tree.component.scss'
})
export class UserTreeComponent {
  userReferrals: any[] = [];
  loading: boolean = false;
  message: string = '';

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getUserReferrals(2);  // Call the method with a user ID
  }

  getUserReferrals(userId: any): void {
    this.loading = true;  // Start loading

    this.userService.getUserReferrals(userId).subscribe(
      (response) => {
        this.userReferrals = response.referrals; // Assuming referrals are returned as part of the response
        this.loading = false;  // Stop loading
        this.message = 'User referrals loaded successfully!';
      },
      (error) => {
        this.loading = false;  // Stop loading on error
        this.message = 'Failed to load user referrals. Please try again.';
        console.error('Error loading referrals:', error);
      }
    );
  }
}