import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroceryService } from '../../services/grocery.service';
import { CartService } from '../../services/cart.service';
import { RefreshService } from '../../services/refresh.service';
import { GroceryItem } from '../../models/grocery-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  private refreshSubscription: Subscription;

  constructor(
    private groceryService: GroceryService,
    private cartService: CartService,
    private refreshService: RefreshService
  ) {
    // Initialize the subscription
    this.refreshSubscription = new Subscription();
  }

  ngOnInit() {
    this.loadProducts();
    
    // Subscribe to refresh events
    this.refreshSubscription = this.refreshService.refresh$.subscribe(source => {
      if (source === 'order-placed') {
        console.log('Order placed, refreshing product list to update stock counts');
        this.loadProducts();
      }
    });
  }
  
  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
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

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter(item => item.category === category);
    }
  }

  searchProducts() {
    if (this.searchTerm.trim()) {
      this.groceryService.searchItems(this.searchTerm).subscribe({
        next: (items) => {
          this.filteredItems = items;
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.filterByCategory(this.selectedCategory);
    }
  }

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
        // Reset quantity to 1 after adding to cart
        this.quantities[item.id] = 1;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.filteredItems = this.items;
  }
}
