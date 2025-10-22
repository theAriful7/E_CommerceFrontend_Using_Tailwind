export interface CartItem {
  id?: number;
  cartId?: number;
  productId: number;
  productName?: string;
  pricePerItem?: number;
  quantity: number;
  totalPrice?: number;
}
