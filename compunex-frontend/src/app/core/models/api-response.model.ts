// Respuesta estándar de la API B2B
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  last: boolean;
}

export interface ApiErrorResponse {
  type?: string;
  title?: string;
  status: number;
  detail: string;
  instance?: string;
  errorCode?: string;
  errors?: Record<string, string>;
  timestamp: string;
}
