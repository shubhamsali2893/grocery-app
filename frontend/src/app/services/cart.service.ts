import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartItems();
  }



  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}`);
  }

  loadCartItems(): void {
    this.getCartItems().subscribe(items => {
      this.cartItemsSubject.next(items);
    });
  }

  addToCart(groceryItemId: number, quantity: number): Observable<CartItem> {
    const request = { groceryItemId, quantity };
    return this.http.post<CartItem>(`${this.apiUrl}/add`, request)
      .pipe(tap(() => this.loadCartItems()));
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/items/${cartItemId}`, { quantity })
      .pipe(tap(() => this.loadCartItems()));
  }

  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${cartItemId}`)
      .pipe(tap(() => this.loadCartItems()));
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`)
      .pipe(tap(() => this.loadCartItems()));
  }

  getCartTotal(): Observable<{total: number}> {
    return this.http.get<{total: number}>(`${this.apiUrl}/total`);
  }



  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }
}
