import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from '../models/category.model';
import { Product } from '../models/product.model';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: CategoryResponse[] = [];
  trendingProducts: Product[] = [];
  bestSellers: Product[] = [];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTrendingProducts();
    this.loadBestSellers();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 6); // Take first 6 categories
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadTrendingProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Filter approved products and take first 4 as trending
        this.trendingProducts = products
          .filter(product => product.status === 'APPROVED')
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading trending products:', error);
      }
    });
  }

  loadBestSellers(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        // Filter approved products and take next 4 as best sellers
        // In a real app, you might want to sort by sales or ratings
        this.bestSellers = products
          .filter(product => product.status === 'APPROVED')
          .slice(4, 8);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading best sellers:', error);
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

  getProductRating(): number {
    // In a real app, this would come from the product data
    return 4.5;
  }
}
