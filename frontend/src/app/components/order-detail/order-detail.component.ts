import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order, OrderStatus } from '../../models/order.model';
import { OrderProgressionService } from '../../services/order-progression.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  loading = true;
  orderId: number = 0;
  OrderStatus = OrderStatus; // Make OrderStatus available in template
  autoProgressionEnabled = false;
  progressionMessage = '';
  private refreshSubscription: Subscription | null = null;

  private statusOrder = [OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private orderProgressionService: OrderProgressionService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadOrder();
    });
    
    // Subscribe to refresh events to update the order when status changes
    this.refreshSubscription = this.orderService['refreshService'].refresh$.subscribe(source => {
      if (source === 'order-status-updated') {
        this.loadOrder();
      }
    });
  }
  
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadOrder() {
    this.loading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
      }
    });
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

  isStatusActive(status: OrderStatus): boolean {
    return this.order?.status === status;
  }

  isStatusCompleted(status: OrderStatus): boolean {
    if (!this.order) return false;
    if (this.order.status === OrderStatus.CANCELLED) return false;
    
    const currentIndex = this.statusOrder.indexOf(this.order.status);
    const statusIndex = this.statusOrder.indexOf(status);
    
    return currentIndex > statusIndex;
  }

  canCancelOrder(): boolean {
    if (!this.order) return false;
    return this.order.status !== OrderStatus.DELIVERED && this.order.status !== OrderStatus.CANCELLED;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  updateStatus(newStatus: string) {
    if (!this.order) return;
    
    this.orderService.updateOrderStatus(this.order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        
        // If the order is confirmed, start automatic progression
        if (updatedOrder.status === OrderStatus.CONFIRMED) {
          this.startAutomaticProgression(updatedOrder);
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status. Please try again.');
      }
    });
  }
  
  startAutomaticProgression(order: Order) {
    this.orderProgressionService.startOrderProgression(order);
    this.autoProgressionEnabled = true;
    this.progressionMessage = 'Automatic progression enabled. Order status will update every 3 minutes.';
    
    // Show the message for 5 seconds then fade it out
    setTimeout(() => {
      this.progressionMessage = '';
    }, 5000);
  }
}
