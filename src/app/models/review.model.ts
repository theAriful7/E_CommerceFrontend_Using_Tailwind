export interface Review {
  id?: number;
  userId?: number;         // For creating new review
  productId?: number;
  userName?: string;       // For displaying in list
  productName?: string;
  comment: string;
  rating: number;
  isActive?: boolean;
}