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
  private currentUserId = 1; // You should get this from auth service

  cart$ = this.cart.asObservable();

  constructor(
    private cartService: CartService, // Your existing service
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

  addToCart(product: any): Observable<CartItem> {
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      productImage: this.fileDataService.getProductImage(product.images),
      pricePerItem: product.discount ? 
        this.calculateDiscountPrice(product.price, product.discount) : product.price,
      quantity: 1,
      totalPrice: product.discount ? 
        this.calculateDiscountPrice(product.price, product.discount) : product.price
    };

    console.log('Adding to cart:', cartItem);

    return this.cartService.addCartItem(cartItem).pipe(
      tap((addedItem) => {
        console.log('Item added successfully:', addedItem);
        // Refresh cart after adding item
        this.loadUserCart();
        this.showAddToCartNotification(product.name);
      })
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.cartService.updateCartItemQuantity(itemId, quantity).pipe(
      tap(() => {
        console.log('Quantity updated');
        this.loadUserCart();
      })
    );
  }

  removeItem(itemId: number): Observable<void> {
    return this.cartService.removeCartItem(itemId).pipe(
      tap(() => {
        console.log('Item removed');
        this.loadUserCart();
      })
    );
  }

  clearCart(): Observable<void> {
    const currentCart = this.cart.value;
    if (!currentCart?.id) {
      console.error('No cart ID available');
      return new Observable();
    }
    
    return this.cartService.clearCart(currentCart.id).pipe(
      tap(() => {
        console.log('Cart cleared');
        this.loadUserCart();
      })
    );
  }

  getTotalItems(): number {
    const currentCart = this.cart.value;
    const total = currentCart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    console.log('Total items:', total);
    return total;
  }

  getTotalPrice(): number {
    const currentCart = this.cart.value;
    const total = currentCart?.items?.reduce((total, item) => total + (item.totalPrice || 0), 0) || 0;
    console.log('Total price:', total);
    return total;
  }

  private calculateDiscountPrice(price: number, discount: number): number {
    return price - (price * discount / 100);
  }

  private showAddToCartNotification(productName: string): void {
    // Simple browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Product Added', {
        body: `${productName} has been added to your cart`,
        icon: 'assets/logo.png'
      });
    } else {
      // Fallback to console or you can implement a toast service
      console.log(`${productName} added to cart!`);
    }
  }

  // Helper method to get current cart ID
  getCurrentCartId(): number | null {
    return this.cart.value?.id || null;
  }
}
