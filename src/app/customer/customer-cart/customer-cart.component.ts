import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-items.model';
import { Cart } from 'src/app/models/cart.model';
import { CartStateServiceService } from 'src/app/services/cart-state-service.service';

@Component({
  selector: 'app-customer-cart',
  templateUrl: './customer-cart.component.html',
  styleUrls: ['./customer-cart.component.css']
})
export class CustomerCartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private cartStateService: CartStateServiceService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartStateService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        this.error = null;
        console.log('Cart updated in component:', cart);
      },
      error: (err) => {
        this.error = 'Failed to load cart. Please try again.';
        this.isLoading = false;
        console.error('Error loading cart:', err);
      }
    });
  }

  updateQuantity(item: CartItem, change: number): void {
    if (!item.id) {
      console.error('Item ID is missing');
      return;
    }

    const newQuantity = (item.quantity || 0) + change;
    
    if (newQuantity <= 0) {
      this.removeItem(item.id);
      return;
    }

    this.isLoading = true;
    this.cartStateService.updateQuantity(item.id, newQuantity).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to update quantity';
        this.isLoading = false;
        console.error('Error updating quantity:', err);
        // Reload cart to sync state
        this.loadCart();
      }
    });
  }

  removeItem(itemId: number): void {
    this.isLoading = true;
    this.cartStateService.removeItem(itemId).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to remove item';
        this.isLoading = false;
        console.error('Error removing item:', err);
        // Reload cart to sync state
        this.loadCart();
      }
    });
  }

  clearCart(): void {
    if (!this.cart?.id || !this.cart.items || this.cart.items.length === 0) {
      console.log('Cart is already empty');
      return;
    }

    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    this.isLoading = true;
    this.cartStateService.clearCart().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to clear cart';
        this.isLoading = false;
        console.error('Error clearing cart:', err);
        // Reload cart to sync state
        this.loadCart();
      }
    });
  }

  getItemTotal(item: CartItem): number {
    const price = item.pricePerItem || 0;
    const quantity = item.quantity || 0;
    return price * quantity;
  }

  proceedToCheckout(): void {
    if (!this.cart?.items || this.cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Implement your checkout logic here
    console.log('Proceeding to checkout with cart:', this.cart);
    alert('Proceeding to checkout!');
    // this.router.navigate(['/checkout']);
  }

  get cartItems(): CartItem[] {
    return this.cart?.items || [];
  }

  get totalPrice(): number {
    return this.cartStateService.getTotalPrice();
  }

  get totalItems(): number {
    return this.cartStateService.getTotalItems();
  }

  // Retry loading cart
  retryLoadCart(): void {
    this.error = null;
    this.loadCart();
  }
}
