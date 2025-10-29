import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItem } from 'src/app/models/cart-items.model';
import { Cart } from 'src/app/models/cart.model';
import { CartStateServiceService } from 'src/app/services/cart-state-service.service';
import { FileDataService } from 'src/app/services/file-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-cart',
  templateUrl: './customer-cart.component.html',
  styleUrls: ['./customer-cart.component.css']
})
export class CustomerCartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = false;
  error: string | null = null;
  viewMode: 'list' | 'grid' = 'list';
  shippingCost: number = 50;
  taxAmount: number = 0;

  constructor(
    private cartStateService: CartStateServiceService,
    private fileDataService: FileDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.calculateTax();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartStateService.cart$.subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
        this.error = null;
        this.calculateTax();
        console.log('Cart loaded successfully:', cart);
        
        // ✅ ADDED: Debug cart items to check for IDs
        this.debugCartItems();
      },
      error: (err) => {
        this.error = 'Failed to load cart. Please try again.';
        this.isLoading = false;
        console.error('Error loading cart:', err);
        this.showErrorToast('Failed to load cart');
      }
    });
  }

  // ✅ ADDED: Debug method to check cart items
  debugCartItems(): void {
    console.log('🛒 === CART ITEMS DEBUG === 🛒');
    
    if (!this.cart) {
      console.log('❌ No cart found');
      return;
    }

    console.log('📦 Cart ID:', this.cart.id);
    console.log('👤 User ID:', this.cart.userId);
    console.log('💰 Total Price:', this.cart.totalPrice);
    console.log('📊 Total Items:', this.cart.totalItems);

    if (!this.cart.items || this.cart.items.length === 0) {
      console.log('🛑 Cart is empty - no items found');
      return;
    }

    console.log(`🎯 Found ${this.cart.items.length} items in cart:`);
    
    this.cart.items.forEach((item, index) => {
      console.log(`\n📋 Item ${index + 1}:`);
      console.log('   ID:', item.id);
      console.log('   Product ID:', item.productId);
      console.log('   Product Name:', item.productName);
      console.log('   Quantity:', item.quantity);
      console.log('   Price per item:', item.pricePerItem);
      console.log('   Total Price:', item.totalPrice);
      console.log('   Cart ID:', item.cartId);
      console.log('   Has ID?', !!item.id ? '✅ YES' : '❌ NO');
      console.log('   Full item object:', item);
    });

    // Count items with and without IDs
    const itemsWithIds = this.cart.items.filter(item => item.id != null).length;
    const itemsWithoutIds = this.cart.items.filter(item => item.id == null).length;
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Items with IDs: ${itemsWithIds}`);
    console.log(`   Items without IDs: ${itemsWithoutIds}`);
    console.log(`   Total items: ${this.cart.items.length}`);
    
    if (itemsWithoutIds > 0) {
      console.log('🚨 PROBLEM: Some items are missing IDs!');
      console.log('💡 This could be because:');
      console.log('   1. Backend is not returning item IDs');
      console.log('   2. CartItem DTO is missing ID field');
      console.log('   3. Database issue with cart_items table');
    } else {
      console.log('✅ SUCCESS: All items have IDs!');
    }
    
    console.log('🛒 === END DEBUG === 🛒\n');
  }

  // ✅ FIXED: Update quantity with debug info
  updateQuantity(item: CartItem, change: number): void {
    // Check if item has an ID
    if (!item.id) {
      console.error('❌ Cannot update quantity: Item ID is missing', item);
      this.showErrorToast('Cannot update item quantity - missing ID');
      
      // Debug the specific item
      console.log('🔍 Problem item details:', {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        fullItem: item
      });
      return;
    }

    const currentQuantity = item.quantity || 0;
    const newQuantity = currentQuantity + change;

    // Prevent going below 1
    if (newQuantity < 1) {
      this.showWarningToast('Quantity cannot be less than 1');
      return;
    }

    console.log(`🔄 Updating item ${item.id} from ${currentQuantity} to ${newQuantity}`);

    this.cartStateService.updateQuantity(item.id, newQuantity).subscribe({
      next: (updatedItem) => {
        console.log('✅ Quantity updated successfully:', updatedItem);
        this.showSuccessToast(`Quantity updated to ${newQuantity}`);
      },
      error: (err) => {
        console.error('❌ Error updating quantity:', err);
        this.showErrorToast('Failed to update quantity. Please try again.');
      }
    });
  }

  // ✅ FIXED: Remove item with debug info
  removeItem(item: CartItem): void {
    // Check if item has an ID
    if (!item.id) {
      console.error('❌ Cannot remove item: Item ID is missing', item);
      this.showErrorToast('Cannot remove this item - missing ID');
      
      // Debug the specific item
      console.log('🔍 Problem item details:', {
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        fullItem: item
      });
      return;
    }

    Swal.fire({
      title: 'Remove Item?',
      text: `Are you sure you want to remove "${item.productName}" from your cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`🗑️ Removing item ${item.id}: ${item.productName}`);
        
        this.cartStateService.removeItem(item.id).subscribe({
          next: () => {
            console.log('✅ Item removed successfully');
            this.showSuccessToast('Item removed from cart');
          },
          error: (err) => {
            console.error('❌ Error removing item:', err);
            this.showErrorToast('Failed to remove item. Please try again.');
          }
        });
      }
    });
  }

  // ✅ FIXED: Clear cart method
  clearCart(): void {
    if (!this.cart?.items || this.cart.items.length === 0) {
      this.showInfoToast('Your cart is already empty');
      return;
    }

    Swal.fire({
      title: 'Clear Entire Cart?',
      text: 'This will remove all items from your shopping cart.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear all!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartStateService.clearCart().subscribe({
          next: () => {
            console.log('✅ Cart cleared successfully');
            this.showSuccessToast('Cart cleared successfully');
          },
          error: (err) => {
            console.error('❌ Error clearing cart:', err);
            this.showErrorToast('Failed to clear cart. Please try again.');
          }
        });
      }
    });
  }

  // Image handling
  getProductImage(item: CartItem): string {
    const defaultImg = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80';
    
    try {
      // If productImage is a string
      if (item.productImage && typeof item.productImage === 'string') {
        return this.getFullImagePath(item.productImage);
      }
      
      // If productImage is FileData array
      if (item.productImage && Array.isArray(item.productImage) && item.productImage.length > 0) {
        return this.fileDataService.getProductImage(item.productImage);
      }
      
      return defaultImg;
    } catch (error) {
      return defaultImg;
    }
  }

  private getFullImagePath(path: string): string {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80';
    if (path.startsWith('http')) return path;
    if (path.startsWith('assets/') || path.startsWith('/assets/')) {
      return path;
    }
    return `http://localhost:8080/${path.replace(/^\/?/, '')}`;
  }

  handleImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80';
  }

  // Utility methods
  getItemTotal(item: CartItem): number {
    const price = item.pricePerItem || 0;
    const quantity = item.quantity || 0;
    return price * quantity;
  }

  calculateTax(): void {
    const subtotal = this.totalPrice;
    this.taxAmount = Math.round(subtotal * 0.05);
  }

  proceedToCheckout(): void {
    if (!this.cart?.items || this.cart.items.length === 0) {
      this.showWarningToast('Your cart is empty! Add some items first.');
      return;
    }
    
    this.showSuccessToast('Proceeding to checkout...');
    // this.router.navigate(['/checkout']);
  }

  // Toast notifications
  private showSuccessToast(message: string): void {
    Swal.fire({
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  }

  private showErrorToast(message: string): void {
    Swal.fire({
      text: message,
      icon: 'error',
      timer: 3000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  }

  private showWarningToast(message: string): void {
    Swal.fire({
      text: message,
      icon: 'warning',
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  }

  private showInfoToast(message: string): void {
    Swal.fire({
      text: message,
      icon: 'info',
      timer: 2000,
      showConfirmButton: false,
      position: 'top-end',
      toast: true
    });
  }

  // Getters - filter out items without IDs
  get cartItems(): CartItem[] {
    const items = this.cart?.items || [];
    const itemsWithIds = items.filter(item => item.id != null);
    
    if (itemsWithIds.length !== items.length) {
      console.warn(`⚠️ Filtered out ${items.length - itemsWithIds.length} items without IDs`);
    }
    
    return itemsWithIds;
  }

  get totalPrice(): number {
    return this.cartStateService.getTotalPrice();
  }

  get totalItems(): number {
    return this.cartStateService.getTotalItems();
  }

  retryLoadCart(): void {
    this.error = null;
    this.loadCart();
  }

  setViewMode(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
  }

  // ✅ ADDED: Manual debug button (optional - you can add a button in HTML to trigger this)
  forceDebug(): void {
    console.log('🔧 Manual debug triggered');
    this.debugCartItems();
  }
}