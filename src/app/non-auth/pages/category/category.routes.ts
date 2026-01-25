import { Routes } from '@angular/router';

export const CATEGORY_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./category-list/category-list').then((c) => c.CategoryList)
    },
    {
        path: 'add',
        loadComponent: () => import('./category-edit/category-edit').then((c) => c.CategoryEdit)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./category-edit/category-edit').then((c) => c.CategoryEdit)
    }
];
