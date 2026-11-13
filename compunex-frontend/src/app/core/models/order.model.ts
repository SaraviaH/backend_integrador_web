export type OrderStatus = 'PENDIENTE' | 'CONFIRMADA' | 'EN_PREPARACION' | 'DESPACHADA' | 'ENTREGADA' | 'CANCELADA';
export type SuborderStatus = 'PENDIENTE_DESPACHO' | 'EN_PREPARACION' | 'DESPACHADO' | 'ENTREGADO' | 'ANULADO';

export interface CartItem {
  productoId: number;
  nombre: string;
  sku: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  proveedorId: number;
  proveedorRazonSocial: string;
  imagenUrl: string;
  stockDisponible: number;
}

export interface ProviderCartGroup {
  proveedorId: number;
  proveedorRazonSocial: string;
  items: CartItem[];
  subtotal: number;
  igv: number;
  total: number;
}

export interface CheckoutItemRequest {
  productoId: number;
  cantidad: number;
}

export interface CheckoutRequest {
  rucFacturacion: string;
  razonSocialFacturacion: string;
  direccionFiscal: string;
  metodoPagoSimulado: 'TRANSFERENCIA_BANCARIA' | 'LINEA_CREDITO_B2B' | 'TARJETA_EMPRESARIAL';
  notasPedido?: string;
  items: CheckoutItemRequest[];
}

export interface SuborderInvoice {
  subordenId: number;
  proveedorId: number;
  proveedorRazonSocial: string;
  proveedorRuc: string;
  numeroFacturaSimulada: string; // ej. F001-00000123
  estado: SuborderStatus;
  subtotal: number;
  igv: number;
  total: number;
  items: {
    productoId: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

export interface CheckoutResponse {
  ordenId: number;
  codigoOrden: string; // ej. ORD-2026-0001
  fechaEmision: string;
  totalGeneral: number;
  subtotalGeneral: number;
  igvGeneral: number;
  subordenes: SuborderInvoice[];
}

export interface OrderSummary {
  id: number;
  codigoOrden: string;
  fechaCreacion: string;
  totalGeneral: number;
  estadoGeneral: OrderStatus;
  cantidadSubordenes: number;
}
