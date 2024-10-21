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
        url: '/plan',
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
  // {
  //   id: 'authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'login',
  //       title: 'Login',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/login',
  //       icon: 'login',
  //       target: true,
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'register',
  //       title: 'Register',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/register',
  //       icon: 'profile',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  // {
  //   id: 'utilities',
  //   title: 'UI Components',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/typography',
  //       icon: 'font-size'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/color',
  //       icon: 'bg-colors'
  //     },
  //     {
  //       id: 'tabler',
  //       title: 'Tabler',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://ant.design/components/icon',
  //       icon: 'ant-design',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },

  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'chrome'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/mantis-angular/',
  //       icon: 'question',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];
