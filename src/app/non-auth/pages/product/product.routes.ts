import { Routes } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { ProductEdit } from './product-edit/product-edit';

export const PRODUCT_ROUTES: Routes = [
    {
        path: '',
        component: ProductList
    },
    {
        path: 'add',
        component: ProductEdit
    },
    {
        path: 'edit/:id',
        component: ProductEdit
    }
];
