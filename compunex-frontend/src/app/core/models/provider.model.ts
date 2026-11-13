import { SuborderStatus } from './order.model';

export interface ProviderMetrics {
  ventasMesActual: number;
  pedidosPendientes: number;
  productosPublicados: number;
  valorInventario: number;
}

export interface ProviderProductItem {
  id: number;
  sku: string;
  nombre: string;
  categoriaNombre: string;
  precioUnitario: number;
  stock: number;
  activo: boolean;
  ultimaActualizacion: string;
}

export interface ProviderProfile {
  id: number;
  razonSocial: string;
  ruc: string;
  nombreComercial?: string;
  descripcion?: string;
  telefono: string;
  direccion: string;
  ciudad?: string;
  urlLogo?: string;
  urlBanner?: string;
  anosMercado?: string;
}

export interface UpdateProviderProfileRequest {
  nombreComercial?: string;
  descripcion?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  urlLogo?: string;   // URL obtenida previamente desde /api/v1/media/upload (folder 'profiles')
  urlBanner?: string; // URL obtenida previamente desde /api/v1/media/upload (folder 'profiles')
}

