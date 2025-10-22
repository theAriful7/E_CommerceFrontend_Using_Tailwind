export interface OrderItem {
  id?: number;        // Optional (database ID)
  productId: number;  // কোন product টি order হচ্ছে
  productName?: string; // Response এ product name আসতে পারে
  quantity: number;   // কতো quantity নেওয়া হয়েছে
  price: number;      // ঐ product এর price
  subtotal?: number;  // quantity * price (backend calc)
}