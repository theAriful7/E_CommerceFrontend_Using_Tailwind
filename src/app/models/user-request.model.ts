import { Address } from "./addess.model";
import { Role } from "./user.model";

export interface UserRequest {
  fullName: string;
  email: string;
  phone: string;
  password?: string; // create may need password; edit optional
  role: Role;
  addresses: Address[]; // backend expects AddressRequestDTO shape similar
}