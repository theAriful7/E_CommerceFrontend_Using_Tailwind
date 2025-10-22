import { Category } from "./category.model";

// ProductRequestDTO & ProductResponseDTO এর frontend model
export interface Product {
  id?: number;          // Optional, কারণ create করার সময় id থাকে না
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: Category;    // শুধু Request এ যাবে
  isActive : boolean;
}
