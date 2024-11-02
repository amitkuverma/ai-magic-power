export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationUserItems: NavigationItem[] = [
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
        id: 'crypto_address',
        title: 'Manage Crypto',
        type: 'item',
        classes: 'nav-item',
        url: '/my-crypto',
        icon: 'ant-design',
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
      },
      {
        id: 'ai_report',
        title: 'AI Plan Report',
        type: 'item',
        classes: 'nav-item',
        url: '/ai-trade',
        icon: 'wallet',
        breadcrumbs: false
      },
    ]
  },
  {
    id: 'team',
    title: 'Team',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'direct_team',
        title: 'Direct Team',
        type: 'item',
        classes: 'nav-item',
        url: '/direct-team',
        icon: 'ant-design',
        breadcrumbs: false
      },
      {
        id: 'leval_team',
        title: 'Leval Team',
        type: 'item',
        classes: 'nav-item',
        url: '/leval-team',
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
        id: 'transfer_deposit_history',
        title: 'Transfer to deposit wallte',
        type: 'item',
        classes: 'nav-item',
        url: '/transfer-deposit-wallte',
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
        id: 'ai_report',
        title: 'AI Earning',
        type: 'item',
        classes: 'nav-item',
        url: '/ai-trade',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'daily_report',
        title: 'Daily Earning',
        type: 'item',
        classes: 'nav-item',
        url: '/daily-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'one_time_report',
        title: 'One Time Earning',
        type: 'item',
        classes: 'nav-item',
        url: '/one-time-earning',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'leadership_report',
        title: 'Leaership Earning',
        type: 'item',
        classes: 'nav-item',
        url: '/leadership-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'royalty_report',
        title: 'Royalty Earning',
        type: 'item',
        classes: 'nav-item',
        url: '/royalty-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'star_report',
        title: 'Star Bonus',
        type: 'item',
        classes: 'nav-item',
        url: '/star-report',
        icon: 'ant-design',
        breadcrumbs: false
      },
      {
        id: 'super_report',
        title: 'Rewaeds',
        type: 'item',
        classes: 'nav-item',
        url: '/super-rewards',
        icon: 'ant-design',
        breadcrumbs: false
      },
    ]
  },
  {
    id: 'deposit_wallet',
    title: 'Deposit wallet',
    type: 'group',
    icon: 'icon-navigation',
    children: [
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
      {
        id: 'p2p_transfer',
        title: 'P2P Transfer',
        type: 'item',
        classes: 'nav-item',
        url: '/transfer',
        icon: 'ant-design',
        breadcrumbs: false
      },
      {
        id: 'p2p_transfer_history',
        title: 'P2P Report',
        type: 'item',
        classes: 'nav-item',
        url: '/p2p-report',
        icon: 'ant-design',
        breadcrumbs: false
      }
    ]
  }
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
];;
