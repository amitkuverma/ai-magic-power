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

export const NavigationItems: NavigationItem[] = [
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
