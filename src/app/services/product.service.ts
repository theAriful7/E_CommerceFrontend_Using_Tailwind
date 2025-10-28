import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileData, Product, ProductRequest, ProductStatus } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private baseUrl = 'http://localhost:8080/api/products';

  //  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  // Create Product
  createProduct(product: ProductRequest, vendorId: number): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/vendor/${vendorId}`, product);
  }

  // Get All Products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // Get Product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Get Products by Vendor
  getProductsByVendor(vendorId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/vendor/${vendorId}`);
  }

  // Get Products by Category
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${categoryId}`);
  }

  // Get Products by Status
  getProductsByStatus(status: ProductStatus): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/status/${status}`);
  }

  // Get Products by SubCategory
  getProductsBySubCategory(subCategoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/sub-category/${subCategoryId}`);
  }

  // Update Product
  updateProduct(id: number, product: ProductRequest, vendorId: number): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}/vendor/${vendorId}`, product);
  }

  // Delete Product
  deleteProduct(id: number, vendorId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/vendor/${vendorId}`);
  }

  // Change Product Status (Admin)
  changeProductStatus(id: number, status: ProductStatus): Observable<Product> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Product>(`${this.baseUrl}/${id}/status`, {}, { params });
  }

  // Search Products
  searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Product[]>(`${this.baseUrl}/search`, { params });
  }

  // Filter Products
  filterProducts(filters: {
    categoryId?: number;
    subCategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  }): Observable<Product[]> {
    let params = new HttpParams();
    
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters.subCategoryId) params = params.set('subCategoryId', filters.subCategoryId.toString());
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.brand) params = params.set('brand', filters.brand);

    return this.http.get<Product[]>(`${this.baseUrl}/filter`, { params });
  }

// In ProductService - FIX THESE URLS:
uploadProductImages(productId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/${productId}/images`, formData, { // ✅ REMOVE /products
    reportProgress: true,
    observe: 'events'
  });
}

getProductImages(productId: number): Observable<FileData[]> {
  return this.http.get<FileData[]>(`${this.baseUrl}/${productId}/images`); // ✅ REMOVE /products
}

deleteProductImage(productId: number, imageId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${productId}/images/${imageId}`); // ✅ REMOVE /products
}

setPrimaryImage(productId: number, imageId: number): Observable<FileData> {
  return this.http.patch<FileData>(
    `${this.baseUrl}/${productId}/images/${imageId}/primary`, // ✅ REMOVE /products
    {}
  );
}
  // Optional: Single API call that creates product with images
  // createProductWithImages(formData: FormData): Observable<Product> {
  //   return this.http.post<Product>(`${this.baseUrl}/products/with-images`, formData);
  // }

   // NEW METHODS FOR HOME PAGE
  getTrendingProducts(limit: number = 8): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.baseUrl}/home/trending`, { params });
  }

  getBestSellers(limit: number = 8): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.baseUrl}/home/bestsellers`, { params });
  }

  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Product[]>(`${this.baseUrl}/home/featured`, { params });
  }

  getAllHomePageProducts(limits: { trending: number, bestsellers: number, featured: number }): Observable<{
    trending: Product[];
    bestsellers: Product[];
    featured: Product[];
  }> {
    const params = new HttpParams()
      .set('trendingLimit', limits.trending.toString())
      .set('bestsellersLimit', limits.bestsellers.toString())
      .set('featuredLimit', limits.featured.toString());
    
    return this.http.get<{
      trending: Product[];
      bestsellers: Product[];
      featured: Product[];
    }>(`${this.baseUrl}/home/all`, { params });
  }

}
