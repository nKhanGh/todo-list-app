export interface FieldErrorResponse {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  errors?: FieldErrorResponse[];
  timestamp: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}