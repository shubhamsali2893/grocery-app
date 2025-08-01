import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart-item.model';
import { CustomerDetails } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  customerDetails: CustomerDetails = {
    customerName: '',
    customerAddress: '',
    customerPhone: ''
  };
  placing = false;
  orderPlaced = false;
  placedOrder: any = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
        if (items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
      }
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      return;
    }

    this.placing = true;
    
    this.orderService.placeOrder(this.customerDetails).subscribe({
      next: (order) => {
        this.placedOrder = order;
        this.orderPlaced = true;
        this.placing = false;
        
        // Force reload cart items to ensure cart count is reset
        this.cartService.loadCartItems();
        
        // Clear local cart items array
        this.cartItems = [];
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.placing = false;
        alert('Failed to place order. Please try again.');
      }
    });
  }

  getFormattedDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  viewOrder() {
    if (this.placedOrder) {
      this.router.navigate(['/orders', this.placedOrder.id]);
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}
