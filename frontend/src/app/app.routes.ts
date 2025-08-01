import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/orders', pathMatch: 'full' },
  { 
    path: 'products', 
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [() => userGuard()]
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [() => userGuard()]
  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [() => userGuard()]
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./components/order-list/order-list.component').then(m => m.OrderListComponent),
    canActivate: [() => authGuard()]
  },
  { 
    path: 'orders/:id', 
    loadComponent: () => import('./components/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  }
];
