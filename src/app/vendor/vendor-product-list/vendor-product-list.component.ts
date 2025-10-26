import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-vendor-product-list',
  templateUrl: './vendor-product-list.component.html',
  styleUrls: ['./vendor-product-list.component.css']
})
export class VendorProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';
  
  // Search and Filter Properties
  searchTerm = '';
  selectedStatus = 'ALL';
  selectedCategory = 'ALL';
  selectedStock = 'ALL';
  
  categories: string[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVendorProducts();
  }

  loadVendorProducts(): void {
    this.loading = true;
    // In a real application, you would get vendorId from authentication
    const vendorId = 1; // Replace with actual vendor ID from auth service
    
    this.productService.getProductsByVendor(vendorId).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = this.getUniqueCategories();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading products';
        this.loading = false;
        console.error('Error loading vendor products:', error);
      }
    });
  }

  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          // Filter search results to only show vendor's products
          const vendorProducts = products.filter(product => 
            this.products.some(p => p.id === product.id)
          );
          this.filteredProducts = vendorProducts;
        },
        error: (error) => {
          this.error = 'Error searching products';
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    let filtered = [...this.products];

    // Status filter
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(product => product.status === this.selectedStatus);
    }

    // Category filter
    if (this.selectedCategory !== 'ALL') {
      filtered = filtered.filter(product => 
        product.categoryName === this.selectedCategory
      );
    }

    // Stock filter
    if (this.selectedStock !== 'ALL') {
      switch (this.selectedStock) {
        case 'IN_STOCK':
          filtered = filtered.filter(product => product.stock > 10);
          break;
        case 'LOW_STOCK':
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
          break;
        case 'OUT_OF_STOCK':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    // Search term filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredProducts = filtered;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'ALL';
    this.selectedCategory = 'ALL';
    this.selectedStock = 'ALL';
    this.filteredProducts = this.products;
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      const vendorId = 1; // Replace with actual vendor ID from auth service
      
      this.productService.deleteProduct(productId, vendorId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
          this.filteredProducts = this.filteredProducts.filter(p => p.id !== productId);
          this.categories = this.getUniqueCategories();
        },
        error: (error) => {
          this.error = 'Error deleting product';
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStockClass(stock: number | undefined): string {
    if (!stock) return 'text-gray-500';
    
    if (stock === 0) {
      return 'text-red-600';
    } else if (stock <= 10) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  }

  // Helper method to get unique categories from products
  getUniqueCategories(): string[] {
    const categories = this.products
      .map(product => product.categoryName)
      .filter((category): category is string => !!category);
    
    return [...new Set(categories)];
  }
}