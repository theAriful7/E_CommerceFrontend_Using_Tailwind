import { CartItem } from "./cart-items.model";

export interface Cart {
  id?: number;
  userId?: number;
  userName?: string;
  totalItems?: number;
  totalPrice?: number;
  items?: CartItem[];
}