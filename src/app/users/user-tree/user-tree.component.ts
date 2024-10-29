import { Component } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

interface UserNode {
  name: string;
  email: string;
  profilePic?: string;
  mobile?: string;
  referrals?: UserNode[];
  expanded?: boolean; // To track if the node is expanded
}
@Component({
  selector: 'app-user-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-tree.component.html',
  styleUrl: './user-tree.component.scss'
})
export class UserTreeComponent {
  dataSource: UserNode [] = [];
  selectedNode: UserNode | null = null;
  loading: boolean = false;
  successMessage!: string;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    public location: Location,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.fetchReferralData(userId);
    });
  }

  fetchReferralData(userId: any): void {
    this.loading = true; // Start loader
    this.usersService.getUserReferrals(userId).subscribe(
      (data: any) => {
        this.dataSource = this.formatReferralData(data);
        this.loading = false; // Stop loader
      },
      error => {
        this.loading = false; // Stop loader if error occurs
        setTimeout(() => (this.successMessage = 'Failed to load data'), 3000);
      }
    );
  }

  formatReferralData(data: any): UserNode[] {
    return [this.formatUserNode(data)];
  }

  formatUserNode(userObj: any): UserNode {
    return {
      name: userObj.user.name,
      email: userObj.user.email,
      profilePic: 'assets/profile.png',
      mobile: userObj.user.mobile,
      referrals: userObj.referrals.map((referral: any) => this.formatReferral(referral)),
      expanded: false // Initially collapsed
    };
  }

  formatReferral(referral: any): UserNode {
    return {
      name: referral.user.name,
      email: referral.user.email,
      profilePic: 'assets/profile.png',
      mobile: referral.user.mobile,
      referrals: referral.referrals.map((subReferral: any) => this.formatReferral(subReferral)),
      expanded: false
    };
  }

  toggleNode(node: UserNode): void {
    node.expanded = !node.expanded; // Toggle expansion
  }

  selectNode(node: UserNode): void {
    this.selectedNode = node;
    
    this.successMessage = `${node.name} selected`;
    setTimeout(() => (this.successMessage = ''), 3000);
  }
}