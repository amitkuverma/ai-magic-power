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
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/users/user-table/user-table.component').then((c) => c.UserTableComponent)
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
        path: 'withdrawal-requests',
        loadComponent: () => import('./demo/account/withdraw-request/withdraw-request.component').then((c) => c.WithdrawRequestComponent)
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
