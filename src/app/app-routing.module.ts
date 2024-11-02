// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/user-table/user-table.component').then((c) => c.UserTableComponent)
      },
      {
        path: 'direct-team',
        loadComponent: () => import('./teams/teams.component').then((c) => c.TeamsComponent)
      },
      {
        path: 'leval-team',
        loadComponent: () => import('./teams/teams.component').then((c) => c.TeamsComponent)
      },
      {
        path: 'my-profile',
        loadComponent: () => import('./profile/profile/profile.component').then((c) => c.ProfileComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./profile/change-password/change-password.component').then((c) => c.ChangePasswordComponent)
      },
      {
        path: 'friends/:userId',  // Define a route with a parameter
        loadComponent: () => import('./users/user-tree/user-tree.component').then((c) => c.UserTreeComponent)
      },
      {
        path: 'user-profile/:userId',
        loadComponent: () => import('./users/user-profile/user-profile.component').then((c) => c.UserProfileComponent)
      },
      {
        path: 'view-profile/:userId',
        loadComponent: () => import('./users/view-profile/view-profile.component').then((c) => c.ViewProfileComponent)
      },
      {
        path: 'my-crypto',
        loadComponent: () => import('./account/account/account.component').then((c) => c.AccountComponent)
      },
      {
        path: 'uses-crypto',
        loadComponent: () => import('./account/bep20-list/bep20-list.component').then((c) => c.Bep20ListComponent)
      },
      {
        path: 'withdrawals',
        loadComponent: () => import('./withdraw/withdraws/withdraws.component').then((c) => c.WithdrawRequestComponent)
      },
      {
        path: 'withdrawal',
        loadComponent: () => import('./withdraw/withdraw/withdraw.component').then((c) => c.WithdrawComponent)
      },
      {
        path: 'withdrawal-history',
        loadComponent: () => import('./withdraw/withdraw-history/withdraw-history.component').then((c) => c.WithdrawHistoryComponent)
      },
      {
        path: 'transfer',
        loadComponent: () => import('./p2p-transfer/p2p-transfer.component').then((c) => c.P2pTransferComponent)
      },
      {
        path: 'ai-packages-list',
        loadComponent: () => import('./fund/package-list/ai-package-list.component').then((c) => c.AiPackageListComponent)
      },
      {
        path: 'packages',
        loadComponent: () => import('./fund/ai-packages/ai-packages.component').then((c) => c.AiPackagesComponent)
      },
      {
        path: 'fund',
        loadComponent: () => import('./fund/add-fund/add-fund.component').then((c) => c.AddFundComponent)
      },
      {
        path: 'funds',
        loadComponent: () => import('./fund/add-funds/add-funds.component').then((c) => c.AddFundsComponent)
      },
      {
        path: 'fund-history',
        loadComponent: () => import('./fund/add-fund-history/add-fund-history.component').then((c) => c.AddFundHistoryComponent)
      },
      {
        path: 'ai-trade',
        loadComponent: () => import('./income/ai-income/ai-income.component').then((c) => c.AiIncomeComponent)
      },
      {
        path: 'daily-report',
        loadComponent: () => import('./income/daily-income/daily-income.component').then((c) => c.DailyIncomeComponent)
      },
      {
        path: 'leadership-report',
        loadComponent: () => import('./income/leadership-income/leadership-income.component').then((c) => c.LeadershipIncomeComponent)
      },
      {
        path: 'royalty-report',
        loadComponent: () => import('./income/royalty-report/royalty-report.component').then((c) => c.RoyaltyReportComponent)
      },
      {
        path: 'super-rewards',
        loadComponent: () => import('./income/super-rewards/super-rewards.component').then((c) => c.SuperRewardsComponent)
      },
      {
        path: 'star-report',
        loadComponent: () => import('./income/star-income/star-income.component').then((c) => c.StarIncomeComponent)
      },
      {
        path: 'plan-pdf',
        loadComponent: () => import('./pdf/pdf.component').then((c) => c.PdfComponent)
      },
      {
        path: 'today-joining',
        loadComponent: () => import('./today-joining/today-joining.component').then((c) => c.TodayJoiningComponent)
      },
      {
        path: 'earn-wallet',
        loadComponent: () => import('./earn-wallet-report/earn-wallet-report.component').then((c) => c.EarnWalletReportComponent)
      },
      {
        path: 'deposit-wallet',
        loadComponent: () => import('./deposit-wallet-report/deposit-wallet-report.component').then((c) => c.DepositWalletReportComponent)
      },
      {
        path: 'total-turnover',
        loadComponent: () => import('./total-turnover-report/total-turnover-report.component').then((c) => c.TotalTurnoverReportComponent)
      },
      {
        path: 'p2p-report',
        loadComponent: () => import('./p2p-report/p2p-report.component').then((c) => c.P2PReportComponent)
      },
      {
        path: 'fund-deposit',
        loadComponent: () => import('./fund-deposit-report/fund-deposit-report.component').then((c) => c.FundDepositReportComponent)
      },
      {
        path: 'one-time-earning',
        loadComponent: () => import('./one-time-earning/one-time-earning.component').then((c) => c.OneTimeEarningComponent)
      },
      {
        path: 'payment-status/:userId',
        loadComponent: () => import('./account/payment-status/payment-status.component').then((c) => c.PaymentStatusComponent)
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./components/authentication/register/register.component')
      }
    ]
  },
  { path:'**', redirectTo:'/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
