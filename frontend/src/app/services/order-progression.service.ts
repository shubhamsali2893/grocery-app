import { Injectable, OnDestroy } from '@angular/core';
import { OrderService } from './order.service';
import { Order, OrderStatus } from '../models/order.model';
import { interval, Subscription } from 'rxjs';
import { RefreshService } from './refresh.service';

@Injectable({
  providedIn: 'root'
})
export class OrderProgressionService implements OnDestroy {
  private progressionMap = new Map<number, Subscription>();
  private readonly PROGRESSION_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds
  private readonly statusOrder = [
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED
  ];

  constructor(
    private orderService: OrderService,
    private refreshService: RefreshService
  ) {}

  /**
   * Start automatic progression for an order after it's confirmed
   * @param order The order to start progression for
   */
  startOrderProgression(order: Order): void {
    // Don't start progression if the order is already in progress, delivered, or cancelled
    if (this.progressionMap.has(order.id) || 
        order.status === OrderStatus.DELIVERED || 
        order.status === OrderStatus.CANCELLED) {
      return;
    }

    // Only start progression if the order is confirmed
    if (order.status !== OrderStatus.CONFIRMED) {
      return;
    }

    console.log(`Starting automatic progression for order #${order.id}`);
    
    // Create a subscription that fires every 3 minutes
    const subscription = interval(this.PROGRESSION_INTERVAL).subscribe(() => {
      this.progressToNextStatus(order.id);
    });

    // Store the subscription for cleanup later
    this.progressionMap.set(order.id, subscription);
  }

  /**
   * Stop progression for a specific order
   * @param orderId The ID of the order to stop progression for
   */
  stopOrderProgression(orderId: number): void {
    const subscription = this.progressionMap.get(orderId);
    if (subscription) {
      subscription.unsubscribe();
      this.progressionMap.delete(orderId);
      console.log(`Stopped automatic progression for order #${orderId}`);
    }
  }

  /**
   * Progress an order to its next status
   * @param orderId The ID of the order to progress
   */
  private progressToNextStatus(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        const currentStatusIndex = this.statusOrder.indexOf(order.status as OrderStatus);
        
        // If the order is already delivered or cancelled, stop progression
        if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
          this.stopOrderProgression(orderId);
          return;
        }
        
        // If there's a next status, update to it
        if (currentStatusIndex >= 0 && currentStatusIndex < this.statusOrder.length - 1) {
          const nextStatus = this.statusOrder[currentStatusIndex + 1];
          console.log(`Automatically progressing order #${orderId} from ${order.status} to ${nextStatus}`);
          
          this.orderService.updateOrderStatus(orderId, nextStatus).subscribe({
            next: (updatedOrder) => {
              // If the order reached DELIVERED status, stop the progression
              if (updatedOrder.status === OrderStatus.DELIVERED) {
                this.stopOrderProgression(orderId);
              }
              
              // Notify components to refresh
              this.refreshService.triggerRefresh('order-status-updated');
            },
            error: (error) => {
              console.error(`Error updating order #${orderId} status:`, error);
            }
          });
        } else {
          // If there's no next status (e.g., already at DELIVERED), stop progression
          this.stopOrderProgression(orderId);
        }
      },
      error: (error) => {
        console.error(`Error fetching order #${orderId}:`, error);
      }
    });
  }

  /**
   * Clean up all subscriptions when the service is destroyed
   */
  ngOnDestroy(): void {
    this.progressionMap.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.progressionMap.clear();
  }
}
