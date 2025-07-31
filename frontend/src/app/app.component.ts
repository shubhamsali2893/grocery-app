import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <a class="navbar-brand" routerLink="/products">
          <i class="fas fa-shopping-basket me-2"></i>
          Fresh Grocery Store
        </a>
        
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/products" routerLinkActive="active">
            <i class="fas fa-store me-1"></i>
            Products
          </a>
          <a class="nav-link position-relative" routerLink="/cart" routerLinkActive="active">
            <i class="fas fa-shopping-cart me-1"></i>
            Cart
            <span class="cart-badge" *ngIf="cartItemCount > 0">{{ cartItemCount }}</span>
          </a>
          <a class="nav-link" routerLink="/orders" routerLinkActive="active">
            <i class="fas fa-receipt me-1"></i>
            Orders
          </a>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .nav-link {
      margin: 0 10px;
      font-weight: 500;
    }
    
    .nav-link.active {
      color: #28a745 !important;
    }
  `]
})
export class AppComponent implements OnInit {
  cartItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }
}
