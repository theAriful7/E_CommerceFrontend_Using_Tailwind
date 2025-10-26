import { OrderItem } from "./order-items.model";

export interface Order {
  id?: number;
  orderNumber?: string;
  userId: number;
  customerName: string;
  totalAmount?: number;
  status?: string; // 'PENDING', 'CONFIRMED', 'CANCELLED'
  orderDate?: string;
  shippingAddress: string;
  items: OrderItem[];
}