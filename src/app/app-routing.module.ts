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

const routes: Routes = [
  // Storefront routes - No layout, just plain pages
  { path: '', component: HomeComponent }, // Main store page
  { path: 'home', component: HomeComponent },
  
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

  // Wildcard route - redirect to storefront
  { path: '**', redirectTo: '' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
