import { FileData } from "./file-data.model";

export interface CartItem {
  id: number;
  cartId?: number;
  productId: number;
  productName?: string;
  productImage?: FileData[]; 
  pricePerItem?: number;
  quantity: number;
  totalPrice?: number;
}


