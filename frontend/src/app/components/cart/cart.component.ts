import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
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
    private authService: AuthService,
    public translationService: TranslationService
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

  getTranslatedProductName(item: any): string {
    // Try exact match first
    const nameKey = `products.${item.groceryItem.name.toLowerCase().replace(/\s+/g, '_')}`;
    let translation = this.translationService.translate(nameKey);
    
    if (translation !== nameKey) {
      return translation;
    }
    
    // Try partial matches for common words
    const commonTranslations: { [key: string]: string } = {
      'fresh': this.translationService.translate('common.fresh'),
      'organic': this.translationService.translate('common.organic'),
      'whole': this.translationService.translate('common.whole'),
      'greek': this.translationService.translate('common.greek'),
      'orange': this.translationService.translate('common.orange'),
      'roma': this.translationService.translate('common.roma'),
      'atlantic': this.translationService.translate('common.atlantic'),
      'bananas': this.translationService.translate('products.fresh_bananas'),
      'apples': this.translationService.translate('products.red_apples'),
      'milk': this.translationService.translate('products.whole_milk'),
      'eggs': this.translationService.translate('products.organic_eggs'),
      'bread': this.translationService.translate('products.whole_wheat_bread'),
      'chicken': this.translationService.translate('products.chicken_breast'),
      'spinach': this.translationService.translate('products.fresh_spinach'),
      'tomatoes': this.translationService.translate('products.roma_tomatoes'),
      'yogurt': this.translationService.translate('products.greek_yogurt'),
      'juice': this.translationService.translate('products.orange_juice'),
      'carrots': this.translationService.translate('products.fresh_carrots'),
      'salmon': this.translationService.translate('products.salmon_fillet'),
      'breast': this.translationService.translate('products.chicken_breast'),
      'fillet': this.translationService.translate('products.salmon_fillet')
    };
    
    // Try to match parts of the name
    const words = item.groceryItem.name.toLowerCase().split(' ');
    const translatedWords = words.map((word: string) => {
      return commonTranslations[word] || word;
    });
    
    return translatedWords.join(' ');
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
