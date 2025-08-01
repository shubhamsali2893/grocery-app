import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  loading = true;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadCartItems();
  }

  loadCartItems() {
    this.loading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity >= 1 && newQuantity <= item.groceryItem.availableQuantity) {
      this.cartService.updateCartItem(item.id, newQuantity).subscribe({
        next: () => {
          this.loadCartItems();
        },
        error: (error) => {
          console.error('Error updating cart item:', error);
        }
      });
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id).subscribe({
      next: () => {
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Error removing cart item:', error);
      }
    });
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCartItems();
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
    }
  }
}
