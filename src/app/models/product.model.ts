export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls: string[];
  discount?: number;
  brand?: string;
  categoryName?: string;
  subCategoryName?: string;
  status?: ProductStatus;
  vendorId?: number;
  vendorName?: string;
  createdAt?: string;
  updatedAt?: string;
  specifications: ProductSpecification[];
}

export interface ProductSpecification {
  key: string;
  value: string;
  displayOrder?: number;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrls: string[];
  categoryId: number;
  subCategoryId?: number;
  discount?: number;
  brand?: string;
  specifications: ProductSpecification[];
}

export enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}