import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/registration/registration').then(m => m.Registration)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('../non-auth/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
