import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { 
    path: 'products', 
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./components/order-list/order-list.component').then(m => m.OrderListComponent)
  },
  { 
    path: 'orders/:id', 
    loadComponent: () => import('./components/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  }
];
