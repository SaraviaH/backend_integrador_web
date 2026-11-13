export type UserRole = 'ROLE_CLIENTE' | 'ROLE_PROVEEDOR' | 'ROLE_ADMIN' | 'COMPRADOR';

export function normalizeUserRole(rol?: string | null): UserRole {
  const upper = (rol || '').toUpperCase().trim();
  if (upper === 'PROVEEDOR' || upper === 'ROLE_PROVEEDOR') return 'ROLE_PROVEEDOR';
  if (upper === 'ADMIN' || upper === 'ROLE_ADMIN') return 'ROLE_ADMIN';
  return 'ROLE_CLIENTE';
}

export interface UserProfile {
  id?: number;
  usuarioId?: number;
  nombre: string;
  nombreCompleto?: string;
  correo: string;
  rol: UserRole;
  ruc?: string;
  razonSocial?: string;
  nombreComercial?: string;
  ciudad?: string;
  activo?: boolean;
  telefono?: string;
  direccion?: string;
  tienePerfilProveedor?: boolean;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  tipoToken: string;
  expiraEnSegundos: number;
}

export interface AuthResponse {
  token: string;
  tipoToken?: string;
  tipo?: string;
  usuario?: UserProfile;
  expiraEn?: number;
  expiraEnSegundos?: number;
}

export interface RegisterCompanyRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  ruc: string;
  razonSocial: string;
  telefono?: string;
  direccion?: string;
}

export interface RegisterCompanyResponse {
  usuarioId: number;
  correo: string;
  nombre: string;
  rol: string;
  tienePerfilProveedor: boolean;
  token?: string;
  tipoToken?: string;
  expiraEnSegundos?: number;
}

export interface ChangePasswordRequest {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface RequestProviderActivation {
  descripcionEmpresa: string;
  categoriaPrincipalId: number;
  documentoRucAdjuntoUrl?: string;
}

