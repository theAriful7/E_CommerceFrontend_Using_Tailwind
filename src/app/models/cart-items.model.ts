export interface CartItem {
  id?: number;
  cartId?: number;
  productId: number;
  productName?: string;
  productImage?: string; 
  pricePerItem?: number;
  quantity: number;
  totalPrice?: number;
}


