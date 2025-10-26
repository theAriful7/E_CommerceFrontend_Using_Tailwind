import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

interface DashboardStats {
  totalProducts: number;
  productsThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  revenueGrowth: number;
  averageRating: number;
  totalReviews: number;
}
@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  dashboardStats: DashboardStats = {
    totalProducts: 0,
    productsThisMonth: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    averageRating: 0,
    totalReviews: 0
  };

  recentOrders: any[] = [];
  vendorProducts: Product[] = [];
  allOrders: Order[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadVendorProducts();
  }

  loadVendorProducts(): void {
    this.loading = true;
    const vendorId = 1; // Replace with actual vendor ID from auth service
    
    this.productService.getProductsByVendor(vendorId).subscribe({
      next: (products) => {
        this.vendorProducts = products;
        this.calculateProductStats(products);
        this.loadAllOrders();
      },
      error: (error) => {
        this.error = 'Error loading products';
        this.loading = false;
        console.error('Error loading vendor products:', error);
      }
    });
  }

  loadAllOrders(): void {
    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.calculateDashboardStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.calculateDashboardStats();
        this.loading = false;
      }
    });
  }

  private calculateDashboardStats(): void {
    // Calculate product stats
    this.dashboardStats.totalProducts = this.vendorProducts.length;
    this.dashboardStats.productsThisMonth = this.calculateProductsThisMonth(this.vendorProducts);
    
    // Calculate order stats
    const vendorOrders = this.getVendorOrders();
    this.dashboardStats.totalOrders = vendorOrders.length;
    this.dashboardStats.pendingOrders = vendorOrders.filter(order => 
      order.status === 'PENDING'
    ).length;
    this.dashboardStats.totalRevenue = this.calculateTotalRevenue(vendorOrders);
    
    // Set recent orders
    this.recentOrders = this.getRecentOrders(vendorOrders);
  }

  private getVendorOrders(): Order[] {
    // Since Order model doesn't have vendorId, we return all orders for now
    // In real scenario, you'd need a backend endpoint for vendor orders
    return this.allOrders;
  }

  private calculateProductsThisMonth(products: Product[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return products.filter(product => {
      if (!product.createdAt) return false;
      const productDate = new Date(product.createdAt);
      return productDate.getMonth() === currentMonth && productDate.getFullYear() === currentYear;
    }).length;
  }

  private calculateTotalRevenue(orders: Order[]): number {
    return orders.reduce((total, order) => {
      return total + (order.totalAmount || 0);
    }, 0);
  }

  private getRecentOrders(orders: Order[]): any[] {
    return orders
      .sort((a, b) => new Date(b.orderDate || '').getTime() - new Date(a.orderDate || '').getTime())
      .slice(0, 4)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `Customer ${order.userId}`,
        amount: order.totalAmount || 0,
        status: order.status,
        date: this.formatDate(order.orderDate)
      }));
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getOrderStatusClass(status: string | undefined): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  private calculateProductStats(products: Product[]): void {
  // Calculate product stats
  this.dashboardStats.totalProducts = products.length;
  this.dashboardStats.productsThisMonth = this.calculateProductsThisMonth(products);
  
  // Calculate order stats
  const vendorOrders = this.getVendorOrders();
  this.dashboardStats.totalOrders = vendorOrders.length;
  this.dashboardStats.pendingOrders = vendorOrders.filter(order => 
    order.status === 'PENDING'
  ).length;
  this.dashboardStats.totalRevenue = this.calculateTotalRevenue(vendorOrders);
  
  // Set recent orders
  this.recentOrders = this.getRecentOrders(vendorOrders);
  
  // For demo purposes - you can remove these if you don't have rating data
  this.dashboardStats.averageRating = 4.5;
  this.dashboardStats.totalReviews = 89;
  this.dashboardStats.revenueGrowth = 12;
}
}