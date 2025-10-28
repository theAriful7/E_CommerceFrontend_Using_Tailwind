import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-items.model';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/carts';

  constructor(private http: HttpClient) {}

  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}`);
  }

  getCartById(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${id}`);
  }

  createCart(cart: { userId: number }): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}`, cart);
  }

  deleteCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Cart Items
  addCartItem(cartItem: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.baseUrl}/items`, cartItem);
  }

  removeCartItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${itemId}`);
  }

  // Add this missing method that's being called in ProductDetailsComponent
  addToCart(cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/items`, cartItem);
  }

  // Optional: Additional useful methods you might need
  getCartByUserId(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/user/${userId}`);
  }

  updateCartItemQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/items/${itemId}`, { quantity });
  }

  clearCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${cartId}/items`);
  }
}
