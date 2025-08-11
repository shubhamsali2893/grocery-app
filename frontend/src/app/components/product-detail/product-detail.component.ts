import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroceryItem } from '../../models/grocery-item.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  @Input() product: GroceryItem | null = null;
  @Input() isVisible = false;
  @Input() isInWishlist = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() addToCartEvent = new EventEmitter<{product: GroceryItem, quantity: number}>();
  @Output() toggleWishlistEvent = new EventEmitter<number>();
  
  quantity = 1;

  close() {
    this.closeModal.emit();
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.availableQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.addToCartEvent.emit({product: this.product, quantity: this.quantity});
      this.close();
    }
  }

  toggleWishlist() {
    if (this.product) {
      this.toggleWishlistEvent.emit(this.product.id);
    }
  }

  getStockStatus(): { status: string; class: string } {
    if (!this.product) return { status: '', class: '' };
    
    if (this.product.availableQuantity === 0) {
      return { status: 'Out of stock', class: 'badge-danger' };
    } else if (this.product.availableQuantity <= 5) {
      return { status: 'Low stock', class: 'badge-warning' };
    } else {
      return { status: 'In stock', class: 'badge-success' };
    }
  }
}
