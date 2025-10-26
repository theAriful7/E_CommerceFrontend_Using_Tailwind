export interface SubCategory {
  id?: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategoryRequest {
  name: string;
  description?: string;
  categoryId: number;
}

export interface SubCategoryResponse {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}