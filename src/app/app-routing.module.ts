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
        loadComponent: () => import('./dashboard/dashboard.component').then((c) => c.DashboardComponent)
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
        loadComponent: () => import('./teams/leval-team/leval-team.component').then((c) => c.LevalTeamComponent)
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
        loadComponent: () => import('./deposit/p2p-transfer/p2p-transfer.component').then((c) => c.P2pTransferComponent)
      },
      {
        path: 'ai-plan-report',
        loadComponent: () => import('./ai-stake/ai-plan-report/ai-plan-report.component').then((c) => c.AiPlanReportComponent)
      },
      {
        path: 'packages',
        loadComponent: () => import('./ai-stake/ai-packages/ai-packages.component').then((c) => c.AiPackagesComponent)
      },
      {
        path: 'fund',
        loadComponent: () => import('./deposit/add-fund/add-fund.component').then((c) => c.AddFundComponent)
      },
      {
        path: 'funds',
        loadComponent: () => import('./deposit/add-funds/add-funds.component').then((c) => c.AddFundsComponent)
      },
      {
        path: 'fund-history',
        loadComponent: () => import('./deposit-history/add-fund-history/add-fund-history.component').then((c) => c.AddFundHistoryComponent)
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
        loadComponent: () => import('./profile/today-joining/today-joining.component').then((c) => c.TodayJoiningComponent)
      },
      {
        path: 'earn-wallet',
        loadComponent: () => import('./profile/earn-wallet-report/earn-wallet-report.component').then((c) => c.EarnWalletReportComponent)
      },
      {
        path: 'deposit-wallet',
        loadComponent: () => import('./deposit-history/deposit-wallet-report/deposit-wallet-report.component').then((c) => c.DepositWalletReportComponent)
      },
      {
        path: 'transfer-deposit-wallet',
        loadComponent: () => import('./withdraw/transfer-to-deposit/transfer-to-deposit.component').then((c) => c.TransferToDepositComponent)
      },
      {
        path: 'transfer-deposit-wallet-report',
        loadComponent: () => import('./deposit-history/deposit-wallet-report/deposit-wallet-report.component').then((c) => c.DepositWalletReportComponent)
      },
      {
        path: 'total-turnover',
        loadComponent: () => import('./profile/total-turnover-report/total-turnover-report.component').then((c) => c.TotalTurnoverReportComponent)
      },
      {
        path: 'income-reports',
        loadComponent: () => import('./profile/payment-list/payment-list.component').then((c) => c.PaymentListComponent)
      },
      {
        path: 'update-payment/:userId',
        loadComponent: () => import('./profile/update-income-report/update-income-report.component').then((c) => c.UpdateIncomeReportComponent)
      },
      {
        path: 'p2p-report',
        loadComponent: () => import('./deposit-history/p2p-report/p2p-report.component').then((c) => c.P2PReportComponent)
      },
      {
        path: 'fund-deposit',
        loadComponent: () => import('./deposit-history/fund-deposit-report/fund-deposit-report.component').then((c) => c.FundDepositReportComponent)
      },
      {
        path: 'one-time-earning',
        loadComponent: () => import('./income/one-time-earning/one-time-earning.component').then((c) => c.OneTimeEarningComponent)
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
        loadComponent: () => import('./authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./authentication/register/register.component')
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
