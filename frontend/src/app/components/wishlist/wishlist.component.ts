import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroceryService } from '../../services/grocery.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { GroceryItem } from '../../models/grocery-item.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: GroceryItem[] = [];
  loading = true;
  quantities: { [key: number]: number } = {};

  constructor(
    private groceryService: GroceryService,
    private cartService: CartService,
    private notificationService: NotificationService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.loadWishlistItems();
  }

  loadWishlistItems() {
    this.loading = true;
    
    // Get wishlist IDs from localStorage
    const wishlistIds = this.getWishlistIds();
    
    if (wishlistIds.length === 0) {
      this.wishlistItems = [];
      this.loading = false;
      return;
    }

    // Load all products and filter by wishlist IDs
    this.groceryService.getAllItems().subscribe({
      next: (items) => {
        this.wishlistItems = items.filter(item => wishlistIds.includes(item.id));
        this.initializeQuantities();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist items:', error);
        this.loading = false;
        this.notificationService.error('Error', 'Failed to load wishlist items');
      }
    });
  }

  private getWishlistIds(): number[] {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  }

  private initializeQuantities() {
    this.wishlistItems.forEach(item => {
      this.quantities[item.id] = 1;
    });
  }

  getQuantity(itemId: number): number {
    return this.quantities[itemId] || 1;
  }

  increaseQuantity(itemId: number) {
    const item = this.wishlistItems.find(i => i.id === itemId);
    if (item && this.quantities[itemId] < item.availableQuantity) {
      this.quantities[itemId]++;
    }
  }

  decreaseQuantity(itemId: number) {
    if (this.quantities[itemId] > 1) {
      this.quantities[itemId]--;
    }
  }

  addToCart(item: GroceryItem) {
    const quantity = this.getQuantity(item.id);
    this.cartService.addToCart(item.id, quantity).subscribe({
      next: () => {
        this.quantities[item.id] = 1;
        this.notificationService.success(
          'Added to Cart',
          `${item.name} (${quantity}) has been added to your cart`
        );
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.notificationService.error(
          'Error',
          'Failed to add item to cart. Please try again.'
        );
      }
    });
  }

  removeFromWishlist(itemId: number) {
    const item = this.wishlistItems.find(i => i.id === itemId);
    const wishlistIds = this.getWishlistIds();
    const updatedIds = wishlistIds.filter(id => id !== itemId);
    
    localStorage.setItem('wishlist', JSON.stringify(updatedIds));
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
    
    this.notificationService.info(
      'Removed from Wishlist',
      `${item?.name || 'Item'} has been removed from your wishlist`
    );
  }

  clearWishlist() {
    localStorage.removeItem('wishlist');
    this.wishlistItems = [];
    this.notificationService.info(
      'Wishlist Cleared',
      'All items have been removed from your wishlist'
    );
  }

  getStockStatus(item: GroceryItem): { status: string; class: string } {
    if (item.availableQuantity === 0) {
      return { status: this.translationService.translateNested('products.stock_status', 'out_of_stock'), class: 'badge-danger' };
    } else if (item.availableQuantity <= 5) {
      return { status: this.translationService.translateNested('products.stock_status', 'low_stock'), class: 'badge-warning' };
    } else {
      return { status: this.translationService.translateNested('products.stock_status', 'in_stock'), class: 'badge-success' };
    }
  }

  getTranslatedProductName(item: GroceryItem): string {
    // Try exact match first
    const nameKey = `products.${item.name.toLowerCase().replace(/\s+/g, '_')}`;
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
    const words = item.name.toLowerCase().split(' ');
    const translatedWords = words.map((word: string) => {
      return commonTranslations[word] || word;
    });
    
    return translatedWords.join(' ');
  }

  getTranslatedProductDescription(item: GroceryItem): string {
    const descKey = `products.${item.name.toLowerCase().replace(/\s+/g, '_')}_desc`;
    const translation = this.translationService.translate(descKey);
    return translation !== descKey ? translation : item.description;
  }

  getTranslatedCategory(category: string): string {
    const categoryKey = `categories.${category.toLowerCase()}`;
    const translation = this.translationService.translate(categoryKey);
    return translation !== categoryKey ? translation : category;
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }
}
