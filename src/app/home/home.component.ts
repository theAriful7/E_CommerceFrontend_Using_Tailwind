import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from '../models/category.model';
import { FileData, Product } from '../models/product.model';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: CategoryResponse[] = [];
  trendingProducts: Product[] = [];
  bestSellers: Product[] = [];
  featuredProducts: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHomePageData();
  }

  loadHomePageData(): void {
    this.loading = true;

    // Use the working getAllProducts method
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const approvedProducts = products.filter(product => product.status === 'ACTIVE');

        console.log('Total approved products:', approvedProducts.length);

        // Distribute products across sections
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
    // In a real app, this would come from product reviews
    // For now, generate a random rating between 3.5 and 5
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
  }

  // getProductImage(images: FileData[]): string {
  //   if (!images || images.length === 0) {
  //     return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  //   }

  //   // Try to find primary image first
  //   const primaryImage = images.find(img => img.isPrimary);
  //   if (primaryImage) {
  //     return this.getFullImagePath(primaryImage.filePath);
  //   }

  //   // Otherwise get the first image sorted by order
  //   const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  //   return this.getFullImagePath(sortedImages[0].filePath);
  // }

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
    // Implement cart functionality here
  }

  addToWishlist(product: Product): void {
    console.log('Add to wishlist:', product);
    // Implement wishlist functionality here
  }

  viewAllProducts(type: string): void {
    console.log('View all:', type);
    // Navigate to product list page with the type as parameter
    this.router.navigate(['/products', type]);
  }
}

