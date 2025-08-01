import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <header>
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <a class="navbar-brand" routerLink="/products">
            <i class="fas fa-leaf me-2 text-grocery-green"></i>
            <span class="text-grocery-green">Fresh Grocery Market</span>
          </a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav ms-auto">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">
                <i class="fas fa-store me-2"></i>
                Shop
              </a>
              <a class="nav-link position-relative" routerLink="/cart" routerLinkActive="active">
                <i class="fas fa-shopping-cart me-2"></i>
                Cart
                <span class="cart-badge" *ngIf="cartItemCount > 0">{{ cartItemCount }}</span>
              </a>
              <a class="nav-link" routerLink="/orders" routerLinkActive="active">
                <i class="fas fa-receipt me-2"></i>
                Orders
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      <div class="promo-banner" *ngIf="showBanner">
        <div class="container d-flex justify-content-between align-items-center">
          <div>
            <i class="fas fa-truck-fast me-2"></i> Free delivery on orders over $50
          </div>
          <button class="btn-close btn-close-white" (click)="closeBanner()"></button>
        </div>
      </div>
    </header>

    <main class="container py-5">
      <router-outlet></router-outlet>
    </main>
    
    <footer class="footer mt-5 py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <h5><i class="fas fa-leaf me-2 text-grocery-green"></i><span class="text-grocery-green">Fresh Grocery Market</span></h5>
            <p class="text-muted">Providing fresh, quality groceries to your doorstep since 2023.</p>
            <div class="mt-3 d-flex align-items-center">
              <span class="badge bg-success-light text-success me-2">Organic</span>
              <span class="badge bg-primary-light text-primary me-2">Fresh</span>
              <span class="badge bg-secondary-light text-secondary">Quality</span>
            </div>
          </div>
          <div class="col-md-2 mb-4 mb-md-0">
            <h6>Shop</h6>
            <ul class="list-unstyled">
              <li><a routerLink="/products">All Products</a></li>
              <li><a routerLink="/products">Fruits</a></li>
              <li><a routerLink="/products">Vegetables</a></li>
              <li><a routerLink="/products">Dairy</a></li>
            </ul>
          </div>
          <div class="col-md-2 mb-4 mb-md-0">
            <h6>Account</h6>
            <ul class="list-unstyled">
              <li><a routerLink="/cart">My Cart</a></li>
              <li><a routerLink="/orders">My Orders</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6>Newsletter</h6>
            <p class="text-muted small">Subscribe for fresh deals and promotions</p>
            <div class="input-group">
              <input type="email" class="form-control" placeholder="Your email">
              <button class="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        <hr class="mt-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap">
          <p class="mb-0 text-muted small">© 2025 Fresh Grocery Market. All rights reserved.</p>
          <div class="social-links">
            <a href="#" class="me-3"><i class="fab fa-facebook social-icon"></i></a>
            <a href="#" class="me-3"><i class="fab fa-instagram social-icon"></i></a>
            <a href="#" class="me-3"><i class="fab fa-twitter social-icon"></i></a>
            <a href="#"><i class="fab fa-pinterest social-icon"></i></a>
          </div>
        </div>
        <div class="text-center mt-4">
          <p class="small text-muted mb-0">We care about your health and the planet 🌱</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .nav-link {
      margin: 0 10px;
      font-weight: 500;
      position: relative;
      padding: 8px 0;
    }
    
    .active {
      color: #2E7D32 !important;
    }
    
    .active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background-color: var(--primary);
      border-radius: 3px;
    }
    
    .promo-banner {
      background-color: var(--secondary);
      color: white;
      padding: 8px 0;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(13, 71, 161, 0.15);
    }
    
    .footer {
      background-color: #f8f9fa;
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .footer h5, .footer h6 {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .footer a {
      color: #6c757d;
      text-decoration: none;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    .footer a:hover {
      color: var(--primary);
    }
    
    .social-links a {
      color: var(--gray-600);
      font-size: 1.2rem;
      transition: all 0.2s;
    }
    
    .social-links a:hover {
      color: var(--primary);
    }
  `]
})
export class AppComponent implements OnInit {
  cartItemCount = 0;
  showBanner = true;

  constructor(private cartService: CartService) {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  ngOnInit() {
    // Initial load of cart items
    this.cartService.loadCartItems();
    this.loadBannerState();
  }

  // updateCartCount method removed as we're now using the cartItems$ observable directly
  
  closeBanner() {
    this.showBanner = false;
    localStorage.setItem('hideBanner', 'true');
  }
  
  loadBannerState() {
    const hideBanner = localStorage.getItem('hideBanner');
    this.showBanner = hideBanner !== 'true';
  }
}
