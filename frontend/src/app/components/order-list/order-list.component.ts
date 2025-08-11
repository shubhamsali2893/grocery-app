import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { OrderProgressionService } from '../../services/order-progression.service';
import { Order, OrderStatus } from '../../models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = true;
  searchCustomer = '';
  isAdmin = false;
  private refreshSubscription: Subscription | null = null;

  constructor(
    private orderService: OrderService,
    public authService: AuthService,
    public translationService: TranslationService,
    private orderProgressionService: OrderProgressionService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadOrders();
    
    // Subscribe to refresh events to update the orders list when statuses change
    this.refreshSubscription = this.orderService['refreshService'].refresh$.subscribe(source => {
      if (source === 'order-status-updated') {
        this.loadOrders();
      }
    });
  }
  
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        
        // If admin, check for confirmed orders and start automatic progression
        if (this.isAdmin) {
          this.startProgressionForConfirmedOrders(orders);
        }
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }
  
  startProgressionForConfirmedOrders(orders: Order[]) {
    // Find all confirmed orders and start automatic progression for them
    const confirmedOrders = orders.filter(order => order.status === OrderStatus.CONFIRMED);
    
    if (confirmedOrders.length > 0) {
      console.log(`Starting automatic progression for ${confirmedOrders.length} confirmed orders`);
      confirmedOrders.forEach(order => {
        this.orderProgressionService.startOrderProgression(order);
      });
    }
  }

  searchOrders() {
    if (this.searchCustomer.trim()) {
      this.loading = true;
      this.orderService.getOrdersByCustomer(this.searchCustomer).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching orders:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadOrders();
    }
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PLACED': return 'Placed';
      case 'CONFIRMED': return 'Confirmed';
      case 'PREPARING': return 'Preparing';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }
}
