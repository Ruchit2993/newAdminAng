import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./non-auth/non-auth.routes').then(m => m.NON_AUTH_ROUTES)
      }
    ]


    // path: '',
    // component: AdminComponent,
    // children: [
    //   {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    //   },
    //   {
    //     path: 'dashboard',
    //     loadComponent: () => import('./non-auth/pages/dashboard/dashboard').then((c) => c.DashboardComponent)
    //   },
    //   {
    //     path: 'category',
    //     loadChildren: () => import('./non-auth/pages/category/category.routes').then((m) => m.CATEGORY_ROUTES)
    //   },
    //   {
    //     path: 'product',
    //     loadChildren: () => import('./non-auth/pages/product/product.routes').then((m) => m.PRODUCT_ROUTES)
    //   },
    //   {
    //     path: 'new-dashboard',
    //     loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
    //   },
    //   {
    //     path: 'basic',
    //     loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
    //   },
    //   {
    //     path: 'forms',
    //     loadComponent: () => import('./demo/pages/form-element/form-element').then((c) => c.FormElement)
    //   },
    //   {
    //     path: 'tables',
    //     loadComponent: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
    //   },
    //   {
    //     path: 'apexchart',
    //     loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent)
    //   },
    //   {
    //     path: 'sample-page',
    //     loadComponent: () => import('./demo/extra/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
    //   }
    // ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
      },
      // {
      //   path: 'auth/login',
      //   loadComponent: () => import('./auth/pages/login/login').then((c) => c.Login)
      // },
      // {
      //   path: 'auth/register',
      //   loadComponent: () => import('./auth/pages/registration/registration').then((c) => c.Registration)
      // },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
