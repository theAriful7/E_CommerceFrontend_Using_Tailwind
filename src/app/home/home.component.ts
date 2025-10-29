import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryResponse } from '../models/category.model';
import { FileData, Product } from '../models/product.model';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { CartStateServiceService } from '../services/cart-state-service.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: CategoryResponse[] = [];
  trendingProducts: Product[] = [];
  bestSellers: Product[] = [];
  featuredProducts: Product[] = [];
  loading = true;
  error = '';
  cartItemCount = 0;
  private cartSubscription!: Subscription;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private cartStateService: CartStateServiceService
  ) { }

  ngOnInit(): void {
    this.loadHomePageData();
    this.subscribeToCartUpdates();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  subscribeToCartUpdates(): void {
    this.cartSubscription = this.cartStateService.cart$.subscribe({
      next: (cart) => {
        this.cartItemCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;
        console.log('Cart item count updated:', this.cartItemCount);
      },
      error: (error) => {
        console.error('Error in cart subscription:', error);
        this.cartItemCount = 0;
      }
    });
  }

  loadHomePageData(): void {
    this.loading = true;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const approvedProducts = products.filter(product => product.status === 'ACTIVE');

        console.log('Total approved products:', approvedProducts.length);

        // Fixed slice indices
        this.trendingProducts = approvedProducts.slice(0, 8);
        this.bestSellers = approvedProducts.slice(8, 16);
        this.featuredProducts = approvedProducts.slice(16, 24);

        console.log('Trending products:', this.trendingProducts.length);
        console.log('Best sellers:', this.bestSellers.length);
        console.log('Featured products:', this.featuredProducts.length);

        this.loadCategories();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
        this.loadCategories();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 6);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  getCategoryIcon(index: number): string {
    const icons = [
      '📱', // Electronics
      '👕', // Fashion
      '🏠', // Home
      '🎮', // Entertainment
      '💄', // Beauty
      '⚽'  // Sports
    ];
    return icons[index] || '📦';
  }

  getCategoryColor(index: number): string {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-red-100 text-red-600',
      'bg-yellow-100 text-yellow-600',
      'bg-indigo-100 text-indigo-600'
    ];
    return colors[index] || 'bg-gray-100 text-gray-600';
  }

  calculateDiscountPrice(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount / 100);
  }

  getProductRating(product: Product): number {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
  }

  getProductImage(images?: any[]): string {
    const defaultImg =
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80';

    if (!images?.length) return defaultImg;

    const image = images.find(i => i.isPrimary) || images[0];
    return image?.filePath ? this.getFullImagePath(image.filePath) : defaultImg;
  }

  private getFullImagePath(path: string): string {
    if (path.startsWith('http')) return path;
    return `http://localhost:8080/${path.replace(/^\/?/, '')}`;
  }

  addToCart(product: Product): void {
    console.log('Add to cart:', product);
    this.cartStateService.addToCart(product).subscribe({
      next: () => {
        console.log('Product added to cart successfully');
        this.showAddToCartSuccess(product.name);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.showAddToCartError();
      }
    });
  }

  goToCart(): void {
    console.log('Cart button clicked - Current count:', this.cartItemCount);
    
    // Use both methods to be safe
    const serviceCount = this.cartStateService.getTotalItems();
    const componentCount = this.cartItemCount;
    const finalCount = Math.max(serviceCount, componentCount);
    
    console.log('Final cart count calculation:', { serviceCount, componentCount, finalCount });

    if (finalCount === 0) {
      console.log('Cart is empty, showing alert');
      this.showEmptyCartAlert();
    } else {
      console.log('Cart has items, navigating to cart page');
      this.router.navigate(['/cart']).then(success => {
        console.log('Navigation successful:', success);
      }).catch(error => {
        console.error('Navigation failed:', error);
      });
    }
  }

  addToWishlist(product: Product): void {
    console.log('Add to wishlist:', product);
    this.showWishlistSuccess(product.name);
  }

  viewAllProducts(type: string): void {
    console.log('View all:', type);
    this.router.navigate(['/products', type]);
  }

  // SweetAlert Methods
  private showAddToCartSuccess(productName: string): void {
    Swal.fire({
      title: '🎉 Added to Cart!',
      text: `${productName} has been added to your shopping cart`,
      icon: 'success',
      iconColor: '#10B981',
      confirmButtonColor: '#8B5CF6',
      confirmButtonText: 'View Cart',
      showCancelButton: true,
      cancelButtonText: 'Continue Shopping',
      timer: 3000,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/cart']);
      }
    });
  }

  private showAddToCartError(): void {
    Swal.fire({
      title: '❌ Oops!',
      text: 'Failed to add product to cart. Please try again.',
      icon: 'error',
      iconColor: '#EF4444',
      confirmButtonColor: '#8B5CF6',
      confirmButtonText: 'Try Again'
    });
  }

  private showWishlistSuccess(productName: string): void {
    Swal.fire({
      title: '❤️ Added to Wishlist!',
      text: `${productName} has been added to your wishlist`,
      icon: 'success',
      iconColor: '#F59E0B',
      confirmButtonColor: '#8B5CF6',
      confirmButtonText: 'Great!',
      showConfirmButton: true,
      timer: 2000,
      timerProgressBar: true
    });
  }

  private showEmptyCartAlert(): void {
    Swal.fire({
      title: '🛒 Your Cart is Empty',
      text: 'Explore our amazing products and add some items to your cart first!',
      icon: 'info',
      iconColor: '#8B5CF6',
      confirmButtonColor: '#8B5CF6',
      confirmButtonText: 'Browse Products',
      showCancelButton: true,
      cancelButtonText: 'Maybe Later'
    }).then((result) => {
      if (result.isConfirmed) {
        // Scroll to products section
        const productsSection = document.querySelector('section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  showShopNowAlert(): void {
  Swal.fire({
    title: '🛍️ Great Choice!',
    text: 'Let\'s explore our amazing collection of products!',
    icon: 'info',
    iconColor: '#8B5CF6',
    confirmButtonColor: '#8B5CF6',
    confirmButtonText: 'Let\'s Go!',
    showCancelButton: true,
    cancelButtonText: 'Not Now',
    background: '#f8fafc',
    customClass: {
      popup: 'rounded-2xl shadow-2xl'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Scroll to products section or navigate
      const productsSection = document.querySelector('section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
}

