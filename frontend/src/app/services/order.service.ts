import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Order, CustomerDetails } from '../models/order.model';
import { environment } from '../../environments/environment';
import { RefreshService } from './refresh.service';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient, 
    private refreshService: RefreshService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  getAllOrders(): Observable<Order[]> {
    // If user is admin, return all orders
    // If user is logged in but not admin, return only their orders
    // If user is not logged in, return empty array (handled by auth guard)
    if (this.authService.isAdmin()) {
      return this.http.get<Order[]>(this.apiUrl);
    } else if (this.authService.isLoggedIn()) {
      const user = this.authService.getUser();
      return this.getOrdersByCustomer(user.username);
    }
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByCustomer(customerName: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/customer/${customerName}`);
  }

  placeOrder(customerDetails: CustomerDetails): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/place`, customerDetails)
      .pipe(
        tap(() => {
          // Notify components to refresh their data when an order is placed
          this.refreshService.triggerRefresh('order-placed');
          
          // Force reload of cart items to reset the cart count
          this.cartService.loadCartItems();
        })
      );
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }
}
