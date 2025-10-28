import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from 'src/app/models/category.model';
import { FileData, Product, ProductStatus } from 'src/app/models/product.model';
import { SubCategoryResponse } from 'src/app/models/sub-category.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: CategoryResponse[] = [];
  subCategories: SubCategoryResponse[] = [];
  
  // Search and Filter Properties
  searchTerm: string = '';
  selectedCategoryId: number = 0;
  selectedSubCategoryId: number = 0;
  selectedStatus: string = 'ALL';
  minPrice: number = 0;
  maxPrice: number = 10000;
  selectedBrand: string = '';
  
  // UI State
  loading: boolean = false;
  error: string = '';
  showFilters: boolean = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading products';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onCategoryChange(): void {
    if (this.selectedCategoryId) {
      this.subCategoryService.getSubCategoriesByCategory(this.selectedCategoryId).subscribe({
        next: (subCategories) => {
          this.subCategories = subCategories;
          this.selectedSubCategoryId = 0; // Reset sub-category
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error loading sub-categories:', error);
        }
      });
    } else {
      this.subCategories = [];
      this.selectedSubCategoryId = 0;
      this.applyFilters();
    }
  }

  searchProducts(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.filteredProducts = products;
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

    // Category filter
    if (this.selectedCategoryId) {
      filtered = filtered.filter(product => 
        product.categoryName && 
        this.categories.some(cat => cat.id === this.selectedCategoryId && cat.name === product.categoryName)
      );
    }

    // Sub-category filter
    if (this.selectedSubCategoryId) {
      filtered = filtered.filter(product => 
        product.subCategoryName && 
        this.subCategories.some(sc => sc.id === this.selectedSubCategoryId && sc.name === product.subCategoryName)
      );
    }

    // Status filter
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(product => product.status === this.selectedStatus);
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= this.minPrice && product.price <= this.maxPrice
    );

    // Brand filter
    if (this.selectedBrand) {
      filtered = filtered.filter(product => 
        product.brand?.toLowerCase().includes(this.selectedBrand.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.applyFilters();
    } else {
      this.productService.getProductsByStatus(status as ProductStatus).subscribe({
        next: (products) => {
          this.filteredProducts = products;
        },
        error: (error) => {
          this.error = 'Error filtering products';
          console.error('Error filtering products:', error);
        }
      });
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = 0;
    this.selectedSubCategoryId = 0;
    this.selectedStatus = 'ALL';
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.selectedBrand = '';
    this.subCategories = [];
    this.filteredProducts = this.products;
  }

  deleteProduct(productId: number, vendorId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId, vendorId).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
          this.filteredProducts = this.filteredProducts.filter(p => p.id !== productId);
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
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  // ✅ UPDATED: Image helper method with proper path handling
  getProductImage(images?: FileData[]): string {
    const defaultImg = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80';

    if (!images || images.length === 0) return defaultImg;

    // Get primary image first, then first image by sort order
    const primaryImage = images.find(img => img.isPrimary);
    if (primaryImage) {
      return this.getFullImagePath(primaryImage.filePath);
    }

    // Get image with lowest sort order
    const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
    return this.getFullImagePath(sortedImages[0].filePath);
  }

  // ✅ ADDED: Method to convert relative paths to full URLs
  private getFullImagePath(path: string): string {
    if (path.startsWith('http')) return path;
    return `http://localhost:8080/${path.replace(/^\/?/, '')}`;
  }
}