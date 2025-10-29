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
  private cartItemsUrl = 'http://localhost:8080/api/cart_items';

  constructor(private http: HttpClient) {}

  // ✅ FIXED: Get cart by user ID
  getCartByUserId(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/user/${userId}`);
  }

  // ✅ FIXED: Create cart
  createCart(cart: { userId: number }): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, cart);
  }

  // ✅ FIXED: Add item to cart - CORRECT ENDPOINT
  // ✅ FIXED: Add item to cart - accepts simplified object
  addCartItem(cartItemData: { cartId?: number, productId: number, quantity: number }): Observable<CartItem> {
    // If cartId is not provided, get it from the current cart
    const cartId = cartItemData.cartId || this.getCurrentCartId();
    
    if (!cartId) {
      throw new Error('No cart ID available');
    }

    return this.http.post<CartItem>(this.cartItemsUrl, {
      cartId: cartId,
      productId: cartItemData.productId,
      quantity: cartItemData.quantity || 1
    });
  }

    private getCurrentCartId(): number | null {
    // You might want to get this from your CartStateService or localStorage
    // For now, return null and handle in the component
    return null;
  }

  // ✅ FIXED: Update quantity - CORRECT ENDPOINT
  updateCartItemQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.cartItemsUrl}/${itemId}/quantity?quantity=${quantity}`, {});
  }

  // ✅ FIXED: Remove item - CORRECT ENDPOINT
  removeCartItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartItemsUrl}/${itemId}`);
  }

  // ✅ FIXED: Clear cart - CORRECT ENDPOINT
  clearCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.cartItemsUrl}/cart/${cartId}/clear`);
  }

  // Other methods remain the same
  getAllCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}`);
  }

  getCartById(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${id}`);
  }

  deleteCart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
