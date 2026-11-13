// Respuesta estándar de la API B2B
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content?: T[];
  contenido?: T[];
  totalElements?: number;
  totalElementos?: number;
  totalPages?: number;
  totalPaginas?: number;
  page?: number;
  pagina?: number;
  size?: number;
  tamano?: number;
  last?: boolean;
  esUltima?: boolean;
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
