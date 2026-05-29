export type Id = string;

export interface ProductListItemDto {
  id: Id;
  name: string;
  licenseType: string;
  userEmail: string;
  createdAt: string;
  comment?: string;
}

export interface CreateProductDto {
  name: string;
  licenseType: "Free" | "Academic" | "Commercial";
  userEmail: string;
  comment?: string;
}

export interface UpdateProductDto {
  name?: string;
  licenseType?: "Free" | "Academic" | "Commercial";
  userEmail?: string;
  comment?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
  errors?: Record<string, string[]>;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}