export type UserRole = 'ROLE_CLIENTE' | 'ROLE_PROVEEDOR' | 'ROLE_ADMIN';

export interface UserProfile {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: UserRole;
  ruc?: string;
  razonSocial?: string;
  activo: boolean;
  telefono?: string;
  direccion?: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  tipo: string; // 'Bearer'
  usuario: UserProfile;
  expiraEn: number;
}

export interface RegisterCompanyRequest {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  ruc: string;
  razonSocial: string;
  direccionFiscal: string;
  telefono: string;
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
