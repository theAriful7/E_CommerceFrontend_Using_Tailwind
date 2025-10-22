import { Address } from "./addess.model";

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  addresses: Address[];
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR'
}