import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TopProveedorMetric {
  proveedorId: number;
  razonSocial: string;
  ruc: string;
  ventasCount: number;
  montoTotal: number;
}

export interface SerieMensualMetric {
  periodo: string;
  etiqueta: string;
  gmv: number;
  igv: number;
  ordenesCount: number;
  ticketPromedio: number;
  horasDespachoPromedio: number;
}

export interface CategoriaMetric {
  categoria: string;
  unidadesVendidas: number;
  ordenesCount: number;
  montoTotal: number;
  porcentajeParticipacion: number;
}

export interface AdminDashboardMetrics {
  gmvTotal: number;
  igvTotalRecaudado: number;
  ticketPromedio: number;
  totalOrdenes: number;
  ordenesPagadas: number;
  ordenesProcesando: number;
  ordenesCanceladas: number;
  totalSubordenes: number;
  tasaEntregaPorcentaje: number;
  tiempoPromedioDespachoHoras: number;
  crecimientoMensualPorcentaje: number;
  comisionPlataformaEstimada: number;
  ingresosTotalesPlataforma: number;
  subordenesPorEstado: Record<string, number>;
  ordenesPorMetodoPago: Record<string, number>;
  topProveedores: TopProveedorMetric[];
  ventasMensuales: SerieMensualMetric[];
  ventasPorCategoria: CategoriaMetric[];
  totalUsuarios: number;
  totalClientes: number;
  totalProveedores: number;
  proveedoresVerificados: number;
  totalProductos: number;
  productosActivos: number;
  productosOcultosAdmin: number;
  productosDeshabilitados: number;
  mrrSuscripciones: number;
  suscripcionesActivas: number;
  proveedoresConFacturacion: number;
}

export interface AdminProviderItem {
  proveedorId: number;
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  ciudad: string;
  verificado: boolean;
  destacado: boolean;
  totalProductos: number;
  fechaCreacion: string;
}

export interface AdminUserItem {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
  fechaRegistro: string;
  ultimoAcceso: string | null;
}

export interface AdminOrderItem {
  ordenId: number;
  codigoOrden: string;
  compradorNombre: string;
  compradorRuc: string;
  metodoPago: string;
  codigoAutorizacionPago: string | null;
  estado: string;
  montoTotal: number;
  cantidadSubordenes: number;
  fechaCreacion: string;
}

export interface AdminSubscriptionItem {
  id: number;
  proveedorId: number;
  proveedorRazonSocial: string;
  proveedorRuc: string;
  plan: 'BASICO_CATALOGO' | 'PRO_FACTURACION' | 'ENTERPRISE_SUNAT';
  precioMensual: number;
  moneda: string;
  estado: 'ACTIVA' | 'PRUEBA' | 'VENCIDA' | 'CANCELADA';
  incluyeFacturacionSunat: boolean;
  incluyeGuiaRemision: boolean;
  fechaInicio: string;
  fechaVencimiento: string;
}

export interface AdminProductItem {
  id: number;
  titulo: string;
  categoriaNombre: string;
  modeloComercial: string;
  precioUnitarioRef: number;
  moneda: string;
  stockDisponible: number;
  estado: string;
  proveedorRazonSocial: string;
}

export interface AdminProductPage {
  contenido: AdminProductItem[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  public getDashboard(): Observable<AdminDashboardMetrics> {
    return this.http.get<AdminDashboardMetrics>(`${this.baseUrl}/dashboard`);
  }

  public getProviders(): Observable<AdminProviderItem[]> {
    return this.http.get<AdminProviderItem[]>(`${this.baseUrl}/providers`);
  }

  public verifyProvider(id: number, verificado: boolean, destacado: boolean): Observable<AdminProviderItem> {
    return this.http.patch<AdminProviderItem>(`${this.baseUrl}/providers/${id}/verify`, { verificado, destacado });
  }

  public getUsers(): Observable<AdminUserItem[]> {
    return this.http.get<AdminUserItem[]>(`${this.baseUrl}/users`);
  }

  public updateUserStatus(id: number, estado: string, motivo = ''): Observable<AdminUserItem> {
    return this.http.patch<AdminUserItem>(`${this.baseUrl}/users/${id}/status`, { estado, motivo });
  }

  public getOrders(): Observable<AdminOrderItem[]> {
    return this.http.get<AdminOrderItem[]>(`${this.baseUrl}/orders`);
  }

  public getSubscriptions(): Observable<AdminSubscriptionItem[]> {
    return this.http.get<AdminSubscriptionItem[]>(`${this.baseUrl}/subscriptions`);
  }

  public upsertSubscription(
    proveedorId: number,
    plan: AdminSubscriptionItem['plan'],
    estado: AdminSubscriptionItem['estado']
  ): Observable<AdminSubscriptionItem> {
    return this.http.post<AdminSubscriptionItem>(`${this.baseUrl}/subscriptions`, {
      proveedorId,
      plan,
      estado,
    });
  }

  public getProducts(search = '', page = 0, size = 12): Observable<AdminProductPage> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<AdminProductPage>(`${this.baseUrl}/products`, { params });
  }

  public updateProductStatus(id: number, nuevoEstado: string, motivo = ''): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/products/${id}/status`, { nuevoEstado, motivo });
  }

  public downloadReport(type: 'executive' | 'orders' | 'subscriptions'): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reports/${type}.csv`, { responseType: 'blob' });
  }
}
