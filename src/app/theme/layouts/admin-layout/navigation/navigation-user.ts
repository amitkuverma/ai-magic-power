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
        url: '/teams',
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
        id: 'ai_report',
        title: 'AI Report',
        type: 'item',
        classes: 'nav-item',
        url: '/ai-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'daily_report',
        title: 'Daily Report',
        type: 'item',
        classes: 'nav-item',
        url: '/daily-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'leadership_report',
        title: 'Leaership Income Report',
        type: 'item',
        classes: 'nav-item',
        url: '/leadership-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'royalty_report',
        title: 'Royalty Report',
        type: 'item',
        classes: 'nav-item',
        url: '/royalty-report',
        icon: 'wallet',
        breadcrumbs: false
      },
      {
        id: 'super_report',
        title: 'Super Rewaeds',
        type: 'item',
        classes: 'nav-item',
        url: '/super-rewards',
        icon: 'ant-design',
        breadcrumbs: false
      },
      {
        id: 'star_report',
        title: 'Star Report',
        type: 'item',
        classes: 'nav-item',
        url: '/star-report',
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
];;
