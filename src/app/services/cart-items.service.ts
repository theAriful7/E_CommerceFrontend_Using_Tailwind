import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-items.model';

@Injectable({
  providedIn: 'root'
})
export class CartItemsService {

    private baseUrl = 'http://localhost:8080/api/cart-items';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.baseUrl);
  }

  getById(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.baseUrl}/${id}`);
  }

  create(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(this.baseUrl, item);
  }

  update(id: number, item: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
