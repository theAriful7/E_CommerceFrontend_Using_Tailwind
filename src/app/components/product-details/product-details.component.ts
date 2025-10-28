import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileData } from 'src/app/models/file-data.model';
import { Product, ProductStatus } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
product: Product | null = null;
  loading = false;
  error = '';
  selectedImageIndex = 0;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(+productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading product';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  getPrimaryImage(images: FileData[]): string {
    if (!images || images.length === 0) {
      return '/assets/images/default-product.png';
    }
    
    const primaryImage = images.find(img => img.isPrimary);
    if (primaryImage) {
      return primaryImage.filePath;
    }
    
    return images[0].filePath;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    const cartItem = {
      productId: this.product.id!,
      productName: this.product.name,
      productImage: this.getPrimaryImage(this.product.images),
      pricePerItem: this.product.price,
      quantity: this.quantity,
      totalPrice: this.product.price * this.quantity
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        alert('Product added to cart successfully!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart');
      }
    });
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  getStatusBadgeClass(status: ProductStatus | undefined): string {
    switch (status) {
      case ProductStatus.APPROVED: return 'bg-green-100 text-green-800';
      case ProductStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case ProductStatus.REJECTED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: ProductStatus | undefined): string {
    switch (status) {
      case ProductStatus.APPROVED: return 'Available';
      case ProductStatus.PENDING: return 'Pending Approval';
      case ProductStatus.REJECTED: return 'Rejected';
      default: return 'Unknown';
    }
  }

  isProductAvailable(): boolean {
    return this.product?.status === ProductStatus.APPROVED && 
           (this.product?.stock || 0) > 0;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
