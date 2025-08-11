import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroceryService } from '../../services/grocery.service';
import { CartService } from '../../services/cart.service';
import { RefreshService } from '../../services/refresh.service';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { GroceryItem } from '../../models/grocery-item.model';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductSkeletonComponent } from './product-skeleton.component';
import { Subscription, debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface FilterOptions {
  priceRange: { min: number; max: number };
  categories: string[];
  inStockOnly: boolean;
  sortBy: 'name' | 'price' | 'popularity' | 'newest';
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductDetailComponent, ProductSkeletonComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {
  items: GroceryItem[] = [];
  filteredItems: GroceryItem[] = [];
  categories: string[] = [];
  selectedCategory = 'all';
  searchTerm = '';
  loading = true;
  quantities: { [key: number]: number } = {};
  
  // Enhanced filtering and pagination
  filterOptions: FilterOptions = {
    priceRange: { min: 0, max: 1000 },
    categories: [],
    inStockOnly: false,
    sortBy: 'name',
    sortOrder: 'asc'
  };
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  
  // Advanced features
  showAdvancedFilters = false;
  wishlist: number[] = [];
  recentlyViewed: GroceryItem[] = [];
  searchSubject = new Subject<string>();
  
  // Product detail modal
  selectedProduct: GroceryItem | null = null;
  showProductModal = false;
  
  private refreshSubscription: Subscription;
  private searchSubscription: Subscription;

  constructor(
    private groceryService: GroceryService,
    private cartService: CartService,
    private refreshService: RefreshService,
    private notificationService: NotificationService,
    public translationService: TranslationService
  ) {
    this.refreshSubscription = new Subscription();
    this.searchSubscription = new Subscription();
  }

  ngOnInit() {
    this.loadProducts();
    this.setupSearchDebounce();
    this.loadWishlist();
    this.loadRecentlyViewed();
    
    this.refreshSubscription = this.refreshService.refresh$.subscribe(source => {
      if (source === 'order-placed') {
        console.log('Order placed, refreshing product list to update stock counts');
        this.loadProducts();
      }
    });
  }
  
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isNearBottom() && this.currentPage < this.totalPages) {
      this.loadMoreItems();
    }
  }

  private setupSearchDebounce() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.performSearch(term);
      });
  }

  performSearch(term: string) {
    if (term.trim()) {
      this.groceryService.searchItems(term).subscribe({
        next: (items) => {
          this.filteredItems = this.applyFilters(items);
          this.currentPage = 1;
          this.calculatePagination();
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.applyAllFilters();
    }
  }

  loadProducts() {
    this.loading = true;
    this.groceryService.getAllItems().subscribe({
      next: (items) => {
        this.items = items;
        this.filteredItems = items;
        this.categories = [...new Set(items.map(item => item.category))];
        this.initializeQuantities();
        this.calculatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  initializeQuantities() {
    this.items.forEach(item => {
      this.quantities[item.id] = 1;
    });
  }

  // Enhanced filtering methods
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyAllFilters();
  }

  onSearchInput(event: any) {
    this.searchSubject.next(event.target.value);
  }

  applyAllFilters() {
    let filtered = [...this.items];
    
    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }
    
    // Price range filter
    filtered = filtered.filter(item => 
      item.price >= this.filterOptions.priceRange.min && 
      item.price <= this.filterOptions.priceRange.max
    );
    
    // Stock filter
    if (this.filterOptions.inStockOnly) {
      filtered = filtered.filter(item => item.availableQuantity > 0);
    }
    
    // Multiple categories filter
    if (this.filterOptions.categories.length > 0) {
      filtered = filtered.filter(item => 
        this.filterOptions.categories.includes(item.category)
      );
    }
    
    // Sort items
    filtered = this.sortItems(filtered);
    
    this.filteredItems = filtered;
    this.currentPage = 1;
    this.calculatePagination();
  }

  private sortItems(items: GroceryItem[]): GroceryItem[] {
    return items.sort((a, b) => {
      let comparison = 0;
      
      switch (this.filterOptions.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'popularity':
          // Mock popularity based on available quantity (higher = more popular)
          comparison = b.availableQuantity - a.availableQuantity;
          break;
        case 'newest':
          // Mock newest based on ID (higher = newer)
          comparison = b.id - a.id;
          break;
      }
      
      return this.filterOptions.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  private applyFilters(items: GroceryItem[]): GroceryItem[] {
    return this.sortItems(items);
  }

  // Pagination methods
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
  }

  getPaginatedItems(): GroceryItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredItems.slice(startIndex, endIndex);
  }

  loadMoreItems() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  private isNearBottom(): boolean {
    const threshold = 100;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;
    return position > height - threshold;
  }

  // Wishlist functionality
  toggleWishlist(itemId: number) {
    const item = this.items.find(i => i.id === itemId);
    const index = this.wishlist.indexOf(itemId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.notificationService.info(
        'Removed from Wishlist',
        `${item?.name || 'Item'} has been removed from your wishlist`
      );
    } else {
      this.wishlist.push(itemId);
      this.notificationService.success(
        'Added to Wishlist',
        `${item?.name || 'Item'} has been added to your wishlist`
      );
    }
    this.saveWishlist();
  }

  isInWishlist(itemId: number): boolean {
    return this.wishlist.includes(itemId);
  }

  private loadWishlist() {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      this.wishlist = JSON.parse(saved);
    }
  }

  private saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  // Recently viewed functionality
  addToRecentlyViewed(item: GroceryItem) {
    const index = this.recentlyViewed.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.recentlyViewed.splice(index, 1);
    }
    this.recentlyViewed.unshift(item);
    this.recentlyViewed = this.recentlyViewed.slice(0, 5); // Keep only 5 items
    this.saveRecentlyViewed();
  }

  // Product detail modal methods
  openProductDetail(item: GroceryItem) {
    this.selectedProduct = item;
    this.showProductModal = true;
    this.addToRecentlyViewed(item);
  }

  closeProductDetail() {
    this.selectedProduct = null;
    this.showProductModal = false;
  }

  onAddToCartFromModal(event: {product: GroceryItem, quantity: number}) {
    this.cartService.addToCart(event.product.id, event.quantity).subscribe({
      next: () => {
        this.quantities[event.product.id] = 1;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  onToggleWishlistFromModal(itemId: number) {
    this.toggleWishlist(itemId);
  }

  private loadRecentlyViewed() {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      this.recentlyViewed = JSON.parse(saved);
    }
  }

  private saveRecentlyViewed() {
    localStorage.setItem('recentlyViewed', JSON.stringify(this.recentlyViewed));
  }

  // Enhanced quantity and cart methods
  getQuantity(itemId: number): number {
    return this.quantities[itemId] || 1;
  }

  increaseQuantity(itemId: number) {
    const item = this.items.find(i => i.id === itemId);
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
        this.addToRecentlyViewed(item);
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

  // Filter reset and utility methods
  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.filterOptions = {
      priceRange: { min: 0, max: 1000 },
      categories: [],
      inStockOnly: false,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.currentPage = 1;
    this.applyAllFilters();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onPriceRangeChange() {
    this.applyAllFilters();
  }

  onSortChange() {
    this.applyAllFilters();
  }

  onCategoryToggle(category: string) {
    const index = this.filterOptions.categories.indexOf(category);
    if (index > -1) {
      this.filterOptions.categories.splice(index, 1);
    } else {
      this.filterOptions.categories.push(category);
    }
    this.applyAllFilters();
  }

  // Utility methods for template
  getPriceRange(): { min: number; max: number } {
    if (this.items.length === 0) return { min: 0, max: 100 };
    const prices = this.items.map(item => item.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
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
}
