import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from 'src/services/theme.service';
import { SharedModule } from '../../shared/shared.module';
import { CookieService } from 'src/services/cookie.service';
import { IconService } from '@ant-design/icons-angular';
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
  MoonOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @Input() styleSelectorToggle!: boolean;
  @Output() Customize = new EventEmitter();
  windowWidth!: number;
  screenFull: boolean = true;
  isSidebarVisible = false; // Property to track sidebar visibility
  isSidebarCollapsed = false;
  expandedMenu: string | null = null;
  activeDropdown: string | null = null; 
  menuItems:any;

  constructor(private iconService: IconService, public cookies: CookieService, public router: Router, private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Only run this in the browser
      this.windowWidth = window.innerWidth;
    }
    this.menuItems = this.cookies.isAdmin() === true ? this.getAdminMenu() : this.getUserMenu();
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
        MoonOutline,
        MenuFoldOutline,
        MenuUnfoldOutline,
      ]
    );
  }

  profile = [
    {
      icon: 'edit',
      title: 'Edit Profile'
    },
    {
      icon: 'user',
      title: 'View Profile'
    },
    {
      icon: 'profile',
      title: 'Social Profile'
    },
    {
      icon: 'wallet',
      title: 'Billing'
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support'
    },
    {
      icon: 'user',
      title: 'Account Settings'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'History'
    }
  ];

  getUserMenu() {
    return [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'default',
            title: 'Default',
            type: 'item',
            classes: 'nav-item',
            url: '/dashboard',
            icon: 'dashboard',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'profile',
        title: 'Profile',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'profile',
            title: 'My Profile',
            type: 'item',
            classes: 'nav-item',
            url: '/my-profile',
            icon: 'user',
            breadcrumbs: false
          },
          {
            id: 'change_password',
            title: 'Change Password',
            type: 'item',
            classes: 'nav-item',
            url: '/change-password',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'pdf',
        title: 'PDF',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'pdf_plan',
            title: 'Plan PDF',
            type: 'item',
            classes: 'nav-item',
            icon: 'ant-design',        
            url: '/plan-pdf',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'crypto',
        title: 'Crypto',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'crypto_address',
            title: 'Manage Crypto',
            type: 'item',
            classes: 'nav-item',
            url: '/my-crypto',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'ai_stake',
        title: 'AI Stake',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'ai_plan',
            title: 'AI Plan',
            type: 'item',
            classes: 'nav-item',
            url: '/packages',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'team',
        title: 'Team',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'my_team',
            title: 'My Team',
            type: 'item',
            classes: 'nav-item',
            url: '/team',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'withdrawal',
        title: 'Withdrawal',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'withdrawal',
            title: 'Withdrawal',
            type: 'item',
            classes: 'nav-item',
            url: '/withdrawal',
            icon: 'wallet',
            breadcrumbs: false
          },
          {
            id: 'withdrawal_history',
            title: 'Withdrawal History',
            type: 'item',
            classes: 'nav-item',
            url: '/withdrawal-history',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'income',
        title: 'Income',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'super_rewards',
            title: 'Super Rewards',
            type: 'item',
            classes: 'nav-item',
            url: '/super-rewards',
            icon: 'wallet',
            breadcrumbs: false
          },
          {
            id: 'royalty_report',
            title: 'Royalty Report',
            type: 'item',
            classes: 'nav-item',
            url: '/royalty-report',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'deposit_wallet',
        title: 'Deposit wallet',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          
          {
            id: 'ai_package',
            title: 'AI Packages',
            type: 'item',
            classes: 'nav-item',
            url: '/ai-packages',
            icon: 'ant-design',
            breadcrumbs: false
          },
          {
            id: 'add_fund',
            title: 'Add Fund',
            type: 'item',
            classes: 'nav-item',
            url: '/fund',
            icon: 'ant-design',
            breadcrumbs: false
          },
          {
            id: 'add_fund_history',
            title: 'Add Fund History',
            type: 'item',
            classes: 'nav-item',
            url: '/fund-history',
            icon: 'ant-design',
            breadcrumbs: false
          },
        ]
      },
      {
        id: 'p2p',
        title: 'P2P',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'p2p_transfer',
            title: 'P2P Transfer',
            type: 'item',
            classes: 'nav-item',
            url: '/transfer',
            icon: 'ant-design',
            breadcrumbs: false
          }
        ]
      },
      // { label: 'Dashboard', route: '/dashboard' },
      // {
      //   label: 'Profile',
      //   children: [
      //     { label: 'View Profile', route: '/profile/view' },
      //     { label: 'Edit Profile', route: '/profile/edit' }
      //   ]
      // },
      // { label: 'Settings', route: '/settings' },
      // { label: 'Logout', route: '/logout' }
    ];
  }

  getAdminMenu() {
    return [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'default',
            title: 'Default',
            type: 'item',
            classes: 'nav-item',
            url: '/dashboard',
            icon: 'dashboard',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'users',
        title: 'Users',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'userList',
            title: 'All Users',
            type: 'item',
            classes: 'nav-item',
            url: '/users',
            icon: 'user',
            breadcrumbs: false
          },
          {
            id: 'change_password',
            title: 'Change Password',
            type: 'item',
            classes: 'nav-item',
            url: '/change-password',
            icon: 'password',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'crypto',
        title: 'Crypto',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'crypto_address',
            title: 'Manage Crypto',
            type: 'item',
            classes: 'nav-item',
            url: '/my-crypto',
            icon: 'ant-design',
            breadcrumbs: false
          },      
          {
            id: 'cryptoList',
            title: 'Users Crypto',
            type: 'item',
            classes: 'nav-item',
            url: '/uses-crypto',
            icon: 'wallet',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'withdrawal',
        title: 'Withdrawal',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'withdrawal',
            title: 'Withdrawals',
            type: 'item',
            classes: 'nav-item',
            url: '/withdrawals',
            icon: 'ant-design',
            breadcrumbs: false
          },
          {
            id: 'withdrawal-history',
            title: 'Withdrawal History',
            type: 'item',
            classes: 'nav-item',
            url: '/withdrawal-history',
            icon: 'wallet',
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'deposit_wallet',
        title: 'Deposit wallet',
        type: 'group',
        icon: 'icon-navigation',
        children: [
          {
            id: 'ai_package',
            title: 'AI Package',
            type: 'item',
            classes: 'nav-item',
            url: '/ai-plans',
            icon: 'ant-design',
            breadcrumbs: false
          },
          {
            id: 'add_funds',
            title: 'Add Funds',
            type: 'item',
            classes: 'nav-item',
            url: '/funds',
            icon: 'ant-design',
            breadcrumbs: false
          },
          {
            id: 'add_funds_history',
            title: 'Add Funds History',
            type: 'item',
            classes: 'nav-item',
            url: '/fund-history',
            icon: 'ant-design',
            breadcrumbs: false
          },
        ]
      },
    ];
  }

  logout() {
    this.cookies.deleteCookie('token');
    this.router.navigate(['/home']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible; // Toggle sidebar visibility
  }

  toggleDropdown(label: string) {
    this.activeDropdown = this.activeDropdown === label ? null : label;
  }

  closeDropdownOnSelect() {
    this.activeDropdown = null; // Close the dropdown after item selection
    this.isSidebarVisible = false;
  }
}
