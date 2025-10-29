import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CartItem } from '../models/cart-items.model';
import { Cart } from '../models/cart.model';
import { CartService } from './cart.service';
import { FileDataService } from './file-data.service';

@Injectable({
  providedIn: 'root'
})
export class CartStateServiceService {
 private cart = new BehaviorSubject<Cart | null>(null);
  private currentUserId = 1;

  cart$ = this.cart.asObservable();

  constructor(
    private cartService: CartService,
    private fileDataService: FileDataService
  ) {
    this.loadUserCart();
  }

  private loadUserCart(): void {
    this.cartService.getCartByUserId(this.currentUserId).subscribe({
      next: (cart) => {
        console.log('Cart loaded:', cart);
        this.cart.next(cart);
      },
      error: (err) => {
        console.log('No cart found, creating new one...', err);
        this.createNewCart();
      }
    });
  }

  private createNewCart(): void {
    this.cartService.createCart({ userId: this.currentUserId }).subscribe({
      next: (cart) => {
        console.log('New cart created:', cart);
        this.cart.next(cart);
      },
      error: (err) => console.error('Failed to create cart:', err)
    });
  }

  // ✅ FIXED: Add to cart with proper data structure
  addToCart(product: any): Observable<CartItem> {
    const currentCartId = this.getCurrentCartId();

    if (!currentCartId) {
      console.error('❌ No cart found for user. Cannot add item.');
      return new Observable();
    }

    // ✅ CORRECT: Send only required fields to backend
    const cartItem: any = {
      cartId: currentCartId,
      productId: product.id,
      quantity: 1
    };

    console.log('🛒 Sending to backend:', cartItem);

    return this.cartService.addCartItem(cartItem).pipe(
      tap((addedItem) => {
        console.log('✅ Item added successfully:', addedItem);
        this.loadUserCart();
        this.showAddToCartNotification(product.name);
      })
    );
  }

  // ✅ FIXED: Update quantity
  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    console.log(`🔄 Updating item ${itemId} to quantity ${quantity}`);
    return this.cartService.updateCartItemQuantity(itemId, quantity).pipe(
      tap((updatedItem) => {
        console.log('✅ Quantity updated successfully:', updatedItem);
        this.loadUserCart();
      })
    );
  }

  // ✅ FIXED: Remove item
  removeItem(itemId: number): Observable<void> {
    console.log(`🗑️ Removing item ${itemId}`);
    return this.cartService.removeCartItem(itemId).pipe(
      tap(() => {
        console.log('✅ Item removed successfully');
        this.loadUserCart();
      })
    );
  }

  // ✅ FIXED: Clear cart
  clearCart(): Observable<void> {
    const currentCart = this.cart.value;
    if (!currentCart?.id) {
      console.error('No cart ID available');
      return new Observable();
    }
    
    console.log(`🧹 Clearing cart ${currentCart.id}`);
    return this.cartService.clearCart(currentCart.id).pipe(
      tap(() => {
        console.log('✅ Cart cleared successfully');
        this.loadUserCart();
      })
    );
  }

  getTotalItems(): number {
    const currentCart = this.cart.value;
    const total = currentCart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    return total;
  }

  getTotalPrice(): number {
    const currentCart = this.cart.value;
    const total = currentCart?.items?.reduce((total, item) => total + (item.totalPrice || 0), 0) || 0;
    return total;
  }

  private calculateDiscountPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }

  private showAddToCartNotification(productName: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Product Added', {
        body: `${productName} has been added to your cart`,
        icon: 'assets/logo.png'
      });
    } else {
      console.log(`${productName} added to cart!`);
    }
  }

  getCurrentCartId(): number | null {
    return this.cart.value?.id || null;
  }
}
