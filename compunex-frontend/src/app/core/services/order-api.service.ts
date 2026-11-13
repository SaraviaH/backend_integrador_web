import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CheckoutRequest,
  CheckoutResponse,
  OrderDetail,
  OrderStatus,
  OrderSummary,
  SuborderInvoice,
  SuborderStatus,
} from '../models/order.model';
import { PaginatedResponse } from '../models/api-response.model';

interface BackendCheckoutResponseDTO {
  ordenId: number;
  codigoOrden: string;
  fechaEmision: string;
  moneda?: string;
  totalGeneral: number;
  esSimulado?: boolean;
  facturasEmitidas?: BackendSubordenResumenDTO[];
}

interface BackendSubordenResumenDTO {
  subordenId: number;
  numeroComprobante: string;
  tipoComprobante?: string;
  emisor?: { proveedorId: number; ruc: string; razonSocial: string };
  receptor?: { ruc: string; razonSocial: string; direccionFiscal: string };
  subtotal: number;
  igv: number;
  total: number;
  estado: string;
  items?: { productoId: number; titulo: string; cantidad: number; precioUnitario: number; subtotalLinea: number }[];
}

interface BackendOrdenResumenDTO {
  ordenId: number;
  codigoOrden: string;
  fechaEmision: string;
  cantidadProveedores: number;
  totalGeneral: number;
  moneda?: string;
  esSimulado?: boolean;
}

interface BackendOrdenPaginadaDTO {
  contenido: BackendOrdenResumenDTO[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  esUltima?: boolean;
}

function mapBackendCheckoutToFrontend(res: BackendCheckoutResponseDTO): CheckoutResponse {
  const facturas = res.facturasEmitidas || [];
  const subordenes: SuborderInvoice[] = facturas.map(f => ({
    subordenId: f.subordenId,
    proveedorId: f.emisor?.proveedorId || 0,
    proveedorRazonSocial: f.emisor?.razonSocial || 'Proveedor B2B',
    proveedorRuc: f.emisor?.ruc || '—',
    numeroFacturaSimulada: f.numeroComprobante,
    estado: (f.estado === 'CANCELADO' ? 'ANULADO' : f.estado) as SuborderStatus,
    subtotal: Number(f.subtotal),
    igv: Number(f.igv),
    total: Number(f.total),
    items: (f.items || []).map(it => ({
      productoId: it.productoId,
      nombre: it.titulo,
      cantidad: it.cantidad,
      precioUnitario: Number(it.precioUnitario),
      subtotal: Number(it.subtotalLinea)
    }))
  }));

  const subtotalGeneral = Math.round(subordenes.reduce((acc, s) => acc + s.subtotal, 0) * 100) / 100;
  const igvGeneral = Math.round(subordenes.reduce((acc, s) => acc + s.igv, 0) * 100) / 100;

  return {
    ordenId: res.ordenId,
    codigoOrden: res.codigoOrden,
    fechaEmision: res.fechaEmision,
    totalGeneral: Number(res.totalGeneral),
    subtotalGeneral,
    igvGeneral,
    subordenes
  };
}

function deriveOrderStatus(subordenes: SuborderInvoice[]): OrderStatus {
  if (!subordenes || subordenes.length === 0) return 'CONFIRMADA';
  if (subordenes.every(s => s.estado === 'ENTREGADO')) return 'ENTREGADA';
  if (subordenes.some(s => s.estado === 'DESPACHADO')) return 'DESPACHADA';
  if (subordenes.some(s => s.estado === 'EN_PREPARACION')) return 'EN_PREPARACION';
  if (subordenes.every(s => s.estado === 'ANULADO')) return 'CANCELADA';
  return 'CONFIRMADA';
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public checkout(orderData: CheckoutRequest): Observable<CheckoutResponse> {
    const metodoPagoMap: Record<string, string> = {
      TRANSFERENCIA_BANCARIA: 'TRANSFERENCIA_B2B',
      LINEA_CREDITO_B2B: 'LINEA_CREDITO_B2B',
      TARJETA_EMPRESARIAL: 'TARJETA_CORPORATIVA'
    };

    const payload = {
      datosFacturacion: {
        tipoComprobante: 'FACTURA',
        rucReceptor: orderData.rucFacturacion,
        razonSocialReceptor: orderData.razonSocialFacturacion,
        direccionFiscal: orderData.direccionFiscal,
        metodoPagoSimulado: metodoPagoMap[orderData.metodoPagoSimulado] || 'TRANSFERENCIA_B2B'
      },
      items: orderData.items
    };

    const request$ = this.http
      .post<BackendCheckoutResponseDTO>(`${this.baseUrl}/orders/checkout`, payload)
      .pipe(map(mapBackendCheckoutToFrontend));

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(catchError(() => of(this.simulateCheckoutResponse(orderData))));
  }

  private simulateCheckoutResponse(orderData: CheckoutRequest): CheckoutResponse {
    const ordenId = Math.floor(10000 + Math.random() * 90000);
    const subtotal = 4250.00;
    const igv = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + igv) * 100) / 100;

    const subordenes: SuborderInvoice[] = [
      {
        subordenId: ordenId + 1,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        proveedorRuc: '20601234567',
        numeroFacturaSimulada: `F001-000${Math.floor(1000 + Math.random() * 9000)}`,
        estado: 'PENDIENTE_DESPACHO',
        subtotal: 2399.00,
        igv: 431.82,
        total: 2830.82,
        items: [
          {
            productoId: 101,
            nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM',
            cantidad: 1,
            precioUnitario: 2399.00,
            subtotal: 2399.00
          }
        ]
      },
      {
        subordenId: ordenId + 2,
        proveedorId: 2,
        proveedorRazonSocial: 'PC Global Perú',
        proveedorRuc: '20509876543',
        numeroFacturaSimulada: `F002-000${Math.floor(1000 + Math.random() * 9000)}`,
        estado: 'PENDIENTE_DESPACHO',
        subtotal: 1851.00,
        igv: 333.18,
        total: 2184.18,
        items: [
          {
            productoId: 102,
            nombre: 'Tarjeta de video 8 GB GDDR6 Dual Fan',
            cantidad: 1,
            precioUnitario: 1199.00,
            subtotal: 1199.00
          }
        ]
      }
    ];

    return {
      ordenId,
      codigoOrden: `ORD-2026-${ordenId}`,
      fechaEmision: new Date().toISOString(),
      totalGeneral: total,
      subtotalGeneral: subtotal,
      igvGeneral: igv,
      subordenes
    };
  }

  public getMyOrders(page: number = 0, size: number = 10): Observable<PaginatedResponse<OrderSummary>> {
    const request$ = this.http
      .get<BackendOrdenPaginadaDTO>(`${this.baseUrl}/orders/me?page=${page}&size=${size}`)
      .pipe(
        map(res => ({
          content: (res.contenido || []).map(o => ({
            id: o.ordenId,
            codigoOrden: o.codigoOrden,
            fechaCreacion: o.fechaEmision,
            totalGeneral: Number(o.totalGeneral),
            estadoGeneral: 'CONFIRMADA' as OrderStatus,
            cantidadSubordenes: o.cantidadProveedores ?? 1
          })),
          page: res.pagina ?? 0,
          size: res.tamano ?? size,
          totalElements: res.totalElementos ?? 0,
          totalPages: Math.max(res.totalPaginas ?? 1, 1)
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(catchError(() => of(this.simulateMyOrders())));
  }

  private simulateMyOrders(): PaginatedResponse<OrderSummary> {
    const content: OrderSummary[] = [
      {
        id: 10001,
        codigoOrden: 'ORD-2026-10001',
        fechaCreacion: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        totalGeneral: 5015.00,
        estadoGeneral: 'CONFIRMADA',
        cantidadSubordenes: 2
      },
      {
        id: 9840,
        codigoOrden: 'ORD-2026-09840',
        fechaCreacion: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        totalGeneral: 3890.00,
        estadoGeneral: 'EN_PREPARACION',
        cantidadSubordenes: 1
      },
      {
        id: 9512,
        codigoOrden: 'ORD-2026-09512',
        fechaCreacion: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        totalGeneral: 8450.00,
        estadoGeneral: 'DESPACHADA',
        cantidadSubordenes: 3
      },
      {
        id: 8990,
        codigoOrden: 'ORD-2026-08990',
        fechaCreacion: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        totalGeneral: 12300.00,
        estadoGeneral: 'ENTREGADA',
        cantidadSubordenes: 2
      }
    ];

    return {
      content,
      totalElements: content.length,
      totalPages: 1,
      size: 10,
      page: 0
    };
  }

  public getOrderDetail(ordenId: number): Observable<OrderDetail> {
    const request$ = this.http
      .get<BackendCheckoutResponseDTO>(`${this.baseUrl}/orders/me/${ordenId}`)
      .pipe(
        map(res => {
          const base = mapBackendCheckoutToFrontend(res);
          const receptor = res.facturasEmitidas?.[0]?.receptor;
          return {
            ...base,
            rucFacturacion: receptor?.ruc || '—',
            razonSocialFacturacion: receptor?.razonSocial || 'Cliente Corporativo B2B',
            direccionFiscal: receptor?.direccionFiscal || 'Dirección fiscal registrada',
            metodoPago: 'Transferencia Bancaria B2B',
            estado: deriveOrderStatus(base.subordenes)
          };
        })
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(catchError(() => of(this.simulateOrderDetail(ordenId))));
  }

  private simulateOrderDetail(ordenId: number): OrderDetail {
    const subtotal = 4250.00;
    const igv = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + igv) * 100) / 100;

    return {
      ordenId,
      codigoOrden: `ORD-2026-${ordenId}`,
      fechaEmision: new Date().toISOString(),
      rucFacturacion: '20601234567',
      razonSocialFacturacion: 'CORPORACION TECNOLOGICA DEL PERU SAC',
      direccionFiscal: 'Av. Las Begonias 441, Oficina 802, San Isidro, Lima',
      metodoPago: 'Transferencia Bancaria Directa B2B',
      estado: 'CONFIRMADA',
      subtotalGeneral: subtotal,
      igvGeneral: igv,
      totalGeneral: total,
      subordenes: [
        {
          subordenId: ordenId * 10 + 1,
          proveedorId: 1,
          proveedorRazonSocial: 'AndesTech Mayorista SAC',
          proveedorRuc: '20601234567',
          numeroFacturaSimulada: `F001-0000${Math.floor(1000 + Math.random() * 9000)}`,
          estado: 'PENDIENTE_DESPACHO',
          subtotal: 2399.00,
          igv: 431.82,
          total: 2830.82,
          items: [
            {
              productoId: 101,
              nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD (Dell Latitude 5520)',
              cantidad: 1,
              precioUnitario: 2399.00,
              subtotal: 2399.00
            }
          ]
        },
        {
          subordenId: ordenId * 10 + 2,
          proveedorId: 2,
          proveedorRazonSocial: 'PC Global Perú EIRL',
          proveedorRuc: '20509876543',
          numeroFacturaSimulada: `F002-0000${Math.floor(1000 + Math.random() * 9000)}`,
          estado: 'PENDIENTE_DESPACHO',
          subtotal: 1851.00,
          igv: 333.18,
          total: 2184.18,
          items: [
            {
              productoId: 102,
              nombre: 'Tarjeta de video 8 GB GDDR6 Dual Fan (RTX 3060 Ventus OC)',
              cantidad: 1,
              precioUnitario: 1199.00,
              subtotal: 1199.00
            },
            {
              productoId: 103,
              nombre: 'Unidad SSD NVMe 1 TB PCIe Gen4 x4 M.2 2280',
              cantidad: 2,
              precioUnitario: 326.00,
              subtotal: 652.00
            }
          ]
        }
      ]
    };
  }
}
