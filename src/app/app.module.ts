import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreComponent } from './core/core.component';
import { ComponentsComponent } from './components/components.component';
import { CustomerComponent } from './customer/customer.component';
import { VendorComponent } from './vendor/vendor.component';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { SharedComponent } from './shared/shared.component';
import { VendorDashboardComponent } from './vendor/vendor-dashboard/vendor-dashboard.component';
import { VendorProductListComponent } from './vendor/vendor-product-list/vendor-product-list.component';
import { VendorAddProductComponent } from './vendor/vendor-add-product/vendor-add-product.component';
import { VendorEditProductComponent } from './vendor/vendor-edit-product/vendor-edit-product.component';
import { VendorOrdersComponent } from './vendor/vendor-orders/vendor-orders.component';
import { VendorProfileComponent } from './vendor/vendor-profile/vendor-profile.component';
import { CustomerDashboardComponent } from './customer/customer-dashboard/customer-dashboard.component';
import { CustomerProfileComponent } from './customer/customer-profile/customer-profile.component';
import { CustomerOrdersComponent } from './customer/customer-orders/customer-orders.component';
import { CustomerOrderDetailsComponent } from './customer/customer-order-details/customer-order-details.component';
import { CustomerCartComponent } from './customer/customer-cart/customer-cart.component';
import { CustomerWishlistComponent } from './customer/customer-wishlist/customer-wishlist.component';
import { CustomerAddressComponent } from './customer/customer-address/customer-address.component';
import { CustomerReviewsComponent } from './customer/customer-reviews/customer-reviews.component';
import { CustomerHelpComponent } from './customer/customer-help/customer-help.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminVendorsComponent } from './admin/admin-vendors/admin-vendors.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminPaymentsComponent } from './admin/admin-payments/admin-payments.component';
import { AdminReviewsComponent } from './admin/admin-reviews/admin-reviews.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { SubCategoryListComponent } from './components/sub-category-list/sub-category-list.component';
import { SubCategoryFormComponent } from './components/sub-category-form/sub-category-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component'; 

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    ComponentsComponent,
    CustomerComponent,
    VendorComponent,
    AdminComponent,
    AuthComponent,
    SharedComponent,
    VendorDashboardComponent,
    VendorProductListComponent,
    VendorAddProductComponent,
    VendorEditProductComponent,
    VendorOrdersComponent,
    VendorProfileComponent,
    CustomerDashboardComponent,
    CustomerProfileComponent,
    CustomerOrdersComponent,
    CustomerOrderDetailsComponent,
    CustomerCartComponent,
    CustomerWishlistComponent,
    CustomerAddressComponent,
    CustomerReviewsComponent,
    CustomerHelpComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminVendorsComponent,
    AdminCategoriesComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminPaymentsComponent,
    AdminReviewsComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    CategoryListComponent,
    CategoryFormComponent,
    SubCategoryListComponent,
    SubCategoryFormComponent,
    ProductFormComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CustomerListComponent,
    VendorListComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
