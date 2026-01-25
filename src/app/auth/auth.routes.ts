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
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
