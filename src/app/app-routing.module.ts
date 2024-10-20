// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { HomeComponent } from './demo/ui-component/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./demo/ui-component/home/home.component').then((c) => c.HomeComponent)
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/user/user-dashboard/user-dashboard.component').then((c) => c.UserDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/users/user-table/user-table.component').then((c) => c.UserTableComponent)
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./demo/profile/profile/profile.component').then((c) => c.ProfileComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./demo/profile/change-password/change-password.component').then((c) => c.ChangePasswordComponent)
      },
      {
        path: 'friends/:userId',  // Define a route with a parameter
        loadComponent: () => import('./demo/users/user-tree/user-tree.component').then((c) => c.UserTreeComponent)
      },
      {
        path: 'user-profile/:userId',
        loadComponent: () => import('./demo/users/user-profile/user-profile.component').then((c) => c.UserProfileComponent)
      },
      {
        path: 'view-profile/:userId',
        loadComponent: () => import('./demo/users/view-profile/view-profile.component').then((c) => c.ViewProfileComponent)
      },
      {
        path: 'manage-account',
        loadComponent: () => import('./demo/account/account/account.component').then((c) => c.AccountComponent)
      },
      {
        path: 'bep',
        loadComponent: () => import('./demo/account/account/account.component').then((c) => c.AccountComponent)
      },
      {
        path: 'uses-bep',
        loadComponent: () => import('./demo/account/bep20-list/bep20-list.component').then((c) => c.Bep20ListComponent)
      },
      {
        path: 'withdrawals',
        loadComponent: () => import('./demo/withdraw/withdraws/withdraws.component').then((c) => c.WithdrawRequestComponent)
      },
      {
        path: 'withdrawal',
        loadComponent: () => import('./demo/withdraw/withdraw/withdraw.component').then((c) => c.WithdrawComponent)
      },
      {
        path: 'withdrawal-history',
        loadComponent: () => import('./demo/withdraw/withdraw-history/withdraw-history.component').then((c) => c.WithdrawHistoryComponent)
      },
      {
        path: 'fund',
        loadComponent: () => import('./demo/fund/add-fund/add-fund.component').then((c) => c.AddFundComponent)
      },
      {
        path: 'funds',
        loadComponent: () => import('./demo/fund/add-funds/add-funds.component').then((c) => c.AddFundsComponent)
      },
      {
        path: 'fund-history',
        loadComponent: () => import('./demo/fund/add-fund-history/add-fund-history.component').then((c) => c.AddFundHistoryComponent)
      },
      {
        path: 'payment-status/:userId',
        loadComponent: () => import('./demo/account/payment-status/payment-status.component').then((c) => c.PaymentStatusComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
