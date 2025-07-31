import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroceryItem } from '../models/grocery-item.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private apiUrl = `${environment.apiUrl}/grocery`;

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(`${this.apiUrl}/items`);
  }

  getItemById(id: number): Observable<GroceryItem> {
    return this.http.get<GroceryItem>(`${this.apiUrl}/items/${id}`);
  }

  getItemsByCategory(category: string): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(`${this.apiUrl}/items/category/${category}`);
  }

  searchItems(name: string): Observable<GroceryItem[]> {
    return this.http.get<GroceryItem[]>(`${this.apiUrl}/items/search?name=${name}`);
  }
}
