import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer/customer-dashboard/customer-dashboard.component';
import { CustomerHelpComponent } from './customer/customer-help/customer-help.component';
import { CustomerOrdersComponent } from './customer/customer-orders/customer-orders.component';
import { CustomerProfileComponent } from './customer/customer-profile/customer-profile.component';
import { CustomerReviewsComponent } from './customer/customer-reviews/customer-reviews.component';
import { CustomerWishlistComponent } from './customer/customer-wishlist/customer-wishlist.component';
import { CustomerAddressComponent } from './customer/customer-address/customer-address.component';
import { CustomerComponent } from './customer/customer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { SubCategoryFormComponent } from './components/sub-category-form/sub-category-form.component';
import { SubCategoryListComponent } from './components/sub-category-list/sub-category-list.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorDashboardComponent } from './vendor/vendor-dashboard/vendor-dashboard.component';
import { VendorProfileComponent } from './vendor/vendor-profile/vendor-profile.component';
import { VendorOrdersComponent } from './vendor/vendor-orders/vendor-orders.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CustomerCartComponent } from './customer/customer-cart/customer-cart.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent},
  { path: 'products/new', component: ProductFormComponent},
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'product-detail/:id', component: ProductDetailsComponent },
  { path: 'products/:type', component: ProductListComponent },

    // Products
{ path: 'cart', component: CustomerCartComponent},
  
  // Categories
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/edit/:id', component: CategoryFormComponent },
  
  // Sub-Categories
  { path: 'sub-categories', component: SubCategoryListComponent },
  { path: 'sub-categories/new', component: SubCategoryFormComponent },
  { path: 'sub-categories/edit/:id', component: SubCategoryFormComponent },
  // Storefront routes - No layout, just plain pages
  { path: '', component: HomeComponent }, // Main store page
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin-product', component: AdminProductsComponent },
  { path: 'cart', component: CustomerCartComponent },
  { path: 'vendor-dashboard', component: VendorComponent},
  
  
  // Customer dashboard routes - With customer layout
  { 
    path: 'customer', 
    component: CustomerComponent, // This has the navbar + router-outlet
    children: [
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'profile', component: CustomerProfileComponent },
      { path: 'orders', component: CustomerOrdersComponent },
      { path: 'wishlist', component: CustomerWishlistComponent },
      
      { path: 'addresses', component: CustomerAddressComponent },
      { path: 'help', component: CustomerHelpComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
    { 
    path: 'vendor', 
    component: VendorComponent, // This has the navbar + router-outlet
    children: [
      { path: 'dashboard', component: VendorDashboardComponent },
      { path: 'profile', component: VendorProfileComponent },
      { path: 'orders', component: VendorOrdersComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'product-list', component: ProductListComponent },
      // { path: 'vendor-addresses', component: CustomerAddressComponent },
      // { path: 'help', component: CustomerHelpComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Wildcard route - redirect to storefront
  { path: '**', redirectTo: '' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
