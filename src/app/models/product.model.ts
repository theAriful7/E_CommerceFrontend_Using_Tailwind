import { FileData } from "./file-data.model";

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: FileData[]; 
  sku?: string;
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
  images: FileData[]; 
  categoryId: number;
  subCategoryId?: number;
  discount?: number;
  brand?: string;
  specifications: ProductSpecification[];
  // Images are handled separately via file upload, not in this DTO
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}




export { FileData };
// export interface FileData {
//   id: number;
//   fileName: string;
//   filePath: string;
//   fileType: string;
//   fileSize: number;
//   altText: string;
//   sortOrder: number;
//   isPrimary: boolean;
//   mimeType: string;
// }