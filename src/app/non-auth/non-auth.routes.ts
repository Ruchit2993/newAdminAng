import { Routes } from '@angular/router';

export const NON_AUTH_ROUTES: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    // },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.DashboardComponent)
    },
    {
        path: 'category',
        loadChildren: () => import('./pages/category/category.routes').then((m) => m.CATEGORY_ROUTES)
    },
    {
        path: 'product',
        loadChildren: () => import('./pages/product/product.routes').then((m) => m.PRODUCT_ROUTES)
    },
    {
        path: 'new-dashboard',
        loadComponent: () => import('../demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
    },
    {
        path: 'basic',
        loadChildren: () => import('../demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
    },
    {
        path: 'forms',
        loadComponent: () => import('../demo/pages/form-element/form-element').then((c) => c.FormElement)
    },
    {
        path: 'tables',
        loadComponent: () => import('../demo/pages/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
    },
    {
        path: 'apexchart',
        loadComponent: () => import('../demo/pages/core-chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent)
    },
    {
        path: 'sample-page',
        loadComponent: () => import('../demo/extra/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
    }
];
