import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ProviderMetrics,
  ProviderProductItem,
  ProviderProfile,
  ProviderSaleItem,
  UpdateProviderProfileRequest,
} from '../models/provider.model';
import { CreateProductRequest, ProductDetail, UpdateProductRequest } from '../models/catalog.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';
import { SuborderStatus } from '../models/order.model';
import { resolveMediaUrl } from './media-api.service';

interface BackendProductoResumenDTO {
  id: number;
  uuid?: string;
  titulo: string;
  descripcion: string;
  categoriaId?: string;
  categoriaNombre?: string;
  modeloComercial?: string;
  tipoFormato?: string;
  unidadesPorPaquete?: string;
  pedidoMinimo?: string;
  precioUnitarioRef: number;
  precioTotalRef?: number;
  moneda?: string;
  terminosComerciales?: string;
  estado: string;
  urlImagenPrincipal?: string;
  imagenes?: { urlImagen: string; orden?: number }[];
  especificaciones?: { clave: string; valor: string }[];
  fechaPublicacion?: string;
  fechaActualizacion?: string;
}

interface BackendProductoPaginadoDTO {
  contenido: BackendProductoResumenDTO[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
}

interface BackendProductoDetalleProvDTO {
  id: number;
  uuid?: string;
  proveedorId: number;
  proveedorRazonSocial?: string;
  categoriaId?: string;
  titulo: string;
  descripcion: string;
  modeloComercial?: string;
  tipoFormato?: string;
  unidadesPorPaquete?: string;
  pedidoMinimo?: string;
  precioUnitarioRef: number;
  precioTotalRef?: number;
  moneda?: string;
  terminosComerciales?: string;
  estado?: string;
  imagenes?: { urlImagen: string; orden?: number }[];
  especificaciones?: { clave: string; valor: string }[];
  fechaPublicacion?: string;
  fechaActualizacion?: string;
}

interface BackendVentaResumenDTO {
  subordenId: number;
  ordenId: number;
  codigoOrden: string;
  numeroComprobante: string;
  fechaEmision: string;
  razonSocialComprador: string;
  rucComprador: string;
  total: number;
  moneda?: string;
  estado: string;
}

interface BackendVentaPaginadaDTO {
  contenido: BackendVentaResumenDTO[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
}

interface BackendSubordenDetalleProvDTO {
  subordenId: number;
  ordenId: number;
  codigoOrden: string;
  numeroComprobante: string;
  tipoComprobante?: string;
  fechaEmision: string;
  receptor?: { ruc: string; razonSocial: string; direccionFiscal?: string };
  subtotal: number;
  igv: number;
  total: number;
  moneda?: string;
  estado: string;
  items?: { productoId: number; titulo: string; cantidad: number; precioUnitario: number; subtotalLinea: number }[];
}

interface BackendProveedorPerfilDTO {
  proveedorId: number;
  usuarioId: number;
  identificacionFiscal: string;
  razonSocial: string;
  nombreComercial?: string;
  telefonoContacto: string;
  correoContacto?: string;
  direccion: string;
  ciudad?: string;
  anosMercado?: string;
  descripcion?: string;
  politicaComercial?: string;
}

export interface ActivateProviderBackendRequest {
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  telefonoContacto: string;
  direccion: string;
  ciudad: string;
  anosMercado?: string;
  descripcion?: string;
  politicaComercial?: string;
}

export interface ActivateProviderBackendResponse {
  proveedorId: number;
  rol: string;
  token: string;
  tipoToken: string;
  expiraEnSegundos: number;
  mensaje: string;
}

function findSpecValue(specs: { clave: string; valor: string }[] | undefined, key: string): string | undefined {
  return specs?.find(s => s.clave.trim().toLowerCase() === key.toLowerCase())?.valor;
}

function parseLeadingInt(val?: string, fallback: number = 1): number {
  if (!val) return fallback;
  const m = val.match(/\d+/);
  return m ? Math.max(0, Number(m[0])) : fallback;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public getDashboardMetrics(): Observable<ProviderMetrics> {
    if (!environment.useMock) {
      return forkJoin({
        products: this.getMyCatalog(0, 100),
        sales: this.getMySales(0, 100)
      }).pipe(
        map(({ products, sales }) => {
          const prodList = products.content || [];
          const salesList = sales.content || [];
          const activeProds = prodList.filter(p => p.activo);
          const ventasMesActual = Math.round(
            salesList
              .filter(s => s.estado !== 'ANULADO')
              .reduce((acc, s) => acc + s.total, 0) * 100
          ) / 100;
          const pedidosPendientes = salesList.filter(
            s => s.estado === 'PENDIENTE_DESPACHO' || s.estado === 'EN_PREPARACION'
          ).length;
          const valorInventario = Math.round(
            activeProds.reduce((acc, p) => acc + p.precioUnitario * p.stock, 0) * 100
          ) / 100;

          return {
            ventasMesActual,
            pedidosPendientes,
            productosPublicados: prodList.length,
            valorInventario
          };
        })
      );
    }

    return this.http.get<ProviderMetrics>(`${this.baseUrl}/providers/me/metrics`).pipe(
      catchError(() => of(this.getFallbackMetrics()))
    );
  }

  public getMyCatalog(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProviderProductItem>> {
    const request$ = this.http
      .get<BackendProductoPaginadoDTO>(`${this.baseUrl}/providers/me/products?page=${page}&size=${size}`)
      .pipe(
        map(res => ({
          content: (res.contenido || []).map(p => ({
            id: p.id,
            sku: findSpecValue(p.especificaciones, 'SKU') || `CMP-${String(p.id).padStart(4, '0')}`,
            nombre: p.titulo,
            categoriaNombre: p.categoriaNombre || p.categoriaId || 'Hardware B2B',
            precioUnitario: Number(p.precioUnitarioRef),
            precioMayorista: p.precioTotalRef != null && Number(p.precioTotalRef) < Number(p.precioUnitarioRef)
              ? Number(p.precioTotalRef)
              : undefined,
            cantidadMinimaMayorista: parseLeadingInt(p.pedidoMinimo, 1),
            stock: parseLeadingInt(findSpecValue(p.especificaciones, 'Stock Referencial'), 100),
            activo: p.estado === 'ACTIVO',
            ultimaActualizacion: p.fechaActualizacion || p.fechaPublicacion || new Date().toISOString(),
            imagenUrl: resolveMediaUrl(p.urlImagenPrincipal || p.imagenes?.[0]?.urlImagen)
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

    return request$.pipe(catchError(() => of(this.getFallbackCatalog())));
  }

  public getMyProductById(id: number): Observable<ApiResponse<ProductDetail>> {
    const request$ = this.http
      .get<BackendProductoDetalleProvDTO>(`${this.baseUrl}/providers/me/products/${id}`)
      .pipe(
        map(d => {
          const specs = (d.especificaciones || []).map(e => ({ clave: e.clave, valor: e.valor }));
          const imgs = (d.imagenes || []).map(i => resolveMediaUrl(i.urlImagen));
          const unitPrice = Number(d.precioUnitarioRef);
          const totalRef = d.precioTotalRef != null ? Number(d.precioTotalRef) : undefined;

          const detail: ProductDetail = {
            id: d.id,
            categoriaId: d.categoriaId,
            nombre: d.titulo,
            sku: findSpecValue(specs, 'SKU') || `CMP-${String(d.id).padStart(4, '0')}`,
            categoriaNombre: d.categoriaId || 'Hardware B2B',
            precioUnitario: unitPrice,
            precioMayorista: totalRef && totalRef < unitPrice ? totalRef : undefined,
            cantidadMinimaMayorista: parseLeadingInt(d.pedidoMinimo, 1),
            stockDisponible: parseLeadingInt(findSpecValue(specs, 'Stock Referencial'), 100),
            proveedorId: d.proveedorId,
            proveedorRazonSocial: d.proveedorRazonSocial || 'Mi Empresa B2B',
            proveedorRuc: '—',
            imagenPrincipalUrl: imgs[0] || resolveMediaUrl(null),
            imagenesSecundarias: imgs.slice(1),
            descripcion: d.descripcion,
            marca: findSpecValue(specs, 'Marca') || d.modeloComercial || 'Enterprise',
            modelo: findSpecValue(specs, 'Modelo') || d.tipoFormato || 'B2B',
            especificaciones: specs,
            garantiaMeses: parseLeadingInt(findSpecValue(specs, 'Garantía') || d.terminosComerciales, 12),
            condicion: 'NUEVO'
          };

          return {
            success: true,
            data: detail,
            timestamp: new Date().toISOString()
          };
        })
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        data: this.getFallbackProductDetail(id),
        timestamp: new Date().toISOString()
      }))
    );
  }

  public createProduct(data: CreateProductRequest): Observable<ApiResponse<ProductDetail>> {
    const payload = this.buildBackendProductPayload(data);
    const request$ = this.http
      .post<{ id: number; titulo: string; categoriaId: string; precioUnitarioRef: number; precioTotalRef: number }>(
        `${this.baseUrl}/providers/me/products`,
        payload
      )
      .pipe(
        map(res => ({
          success: true,
          message: 'Producto registrado exitosamente en el catálogo B2B',
          data: {
            id: res.id,
            categoriaId: res.categoriaId,
            nombre: res.titulo,
            sku: data.sku,
            categoriaNombre: res.categoriaId || 'Hardware B2B',
            precioUnitario: Number(res.precioUnitarioRef),
            precioMayorista: Number(res.precioTotalRef),
            cantidadMinimaMayorista: data.cantidadMinimaMayorista || 1,
            stockDisponible: data.stockDisponible,
            proveedorId: 0,
            proveedorRazonSocial: '',
            proveedorRuc: '',
            imagenPrincipalUrl: resolveMediaUrl(data.urlImagen),
            imagenesSecundarias: [],
            descripcion: data.descripcion,
            marca: data.marca,
            modelo: data.modelo,
            especificaciones: payload.especificaciones,
            garantiaMeses: data.garantiaMeses || 12,
            condicion: 'NUEVO' as const
          },
          timestamp: new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        message: 'Producto registrado exitosamente en el catálogo B2B',
        data: {
          ...this.getFallbackProductDetail(Math.floor(Math.random() * 900) + 100),
          nombre: data.nombre,
          sku: data.sku,
          precioUnitario: data.precioUnitario,
          imagenPrincipalUrl: data.urlImagen
        },
        timestamp: new Date().toISOString()
      }))
    );
  }

  public updateProduct(id: number, data: UpdateProductRequest): Observable<ApiResponse<ProductDetail>> {
    const payload = this.buildBackendProductPayload(data as CreateProductRequest);
    const request$ = this.http
      .put<{ id: number; titulo: string; precioUnitarioRef: number; precioTotalRef: number }>(
        `${this.baseUrl}/providers/me/products/${id}`,
        payload
      )
      .pipe(
        map(res => ({
          success: true,
          message: 'Producto actualizado con éxito',
          data: {
            ...this.getFallbackProductDetail(id),
            id: res.id,
            nombre: res.titulo,
            precioUnitario: Number(res.precioUnitarioRef),
            imagenPrincipalUrl: resolveMediaUrl(data.urlImagen)
          },
          timestamp: new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        message: 'Producto actualizado con éxito',
        data: {
          ...this.getFallbackProductDetail(id),
          ...data,
          categoriaId: String(data.categoriaId || this.getFallbackProductDetail(id).categoriaId || 'ram'),
          imagenPrincipalUrl: data.urlImagen || this.getFallbackProductDetail(id).imagenPrincipalUrl
        },
        timestamp: new Date().toISOString()
      }))
    );
  }

  public toggleProductStatus(id: number, activo: boolean): Observable<ApiResponse<void>> {
    const estado = activo ? 'ACTIVO' : 'DESHABILITADO_POR_PROVEEDOR';
    const request$ = this.http
      .patch<{ mensaje?: string; fechaActualizacion?: string }>(
        `${this.baseUrl}/providers/me/products/${id}/status`,
        { estado }
      )
      .pipe(
        map(res => ({
          success: true,
          message: res?.mensaje || `Estado del producto actualizado a ${activo ? 'Activo' : 'Pausado'}`,
          data: undefined as void,
          timestamp: res?.fechaActualizacion || new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        message: `Estado del producto actualizado a ${activo ? 'Activo' : 'Pausado'}`,
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  public deleteProduct(id: number): Observable<ApiResponse<void>> {
    const request$ = this.http.delete<void>(`${this.baseUrl}/providers/me/products/${id}`).pipe(
      map(() => ({
        success: true,
        message: 'Producto retirado de la venta correctamente',
        data: undefined as void,
        timestamp: new Date().toISOString()
      }))
    );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        message: 'Producto retirado de la venta correctamente',
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  public getMySales(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProviderSaleItem>> {
    const request$ = this.http
      .get<BackendVentaPaginadaDTO>(`${this.baseUrl}/providers/me/sales?page=${page}&size=${size}`)
      .pipe(
        map(res => ({
          content: (res.contenido || []).map(v => {
            const total = Number(v.total);
            const subtotal = Math.round((total / 1.18) * 100) / 100;
            const igv = Math.round((total - subtotal) * 100) / 100;
            return {
              subordenId: v.subordenId,
              ordenId: v.ordenId,
              codigoOrden: v.codigoOrden,
              clienteRazonSocial: v.razonSocialComprador,
              clienteRuc: v.rucComprador,
              fechaCreacion: v.fechaEmision,
              estado: (v.estado === 'CANCELADO' ? 'ANULADO' : v.estado) as SuborderStatus,
              subtotal,
              igv,
              total,
              numeroFacturaSimulada: v.numeroComprobante,
              items: []
            };
          }),
          page: res.pagina ?? 0,
          size: res.tamano ?? size,
          totalElements: res.totalElementos ?? 0,
          totalPages: Math.max(res.totalPaginas ?? 1, 1)
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(catchError(() => of(this.getFallbackSales())));
  }

  public getSaleDetail(subordenId: number): Observable<ApiResponse<ProviderSaleItem>> {
    const request$ = this.http
      .get<BackendSubordenDetalleProvDTO>(`${this.baseUrl}/providers/me/sales/${subordenId}`)
      .pipe(
        map(d => ({
          success: true,
          data: {
            subordenId: d.subordenId,
            ordenId: d.ordenId,
            codigoOrden: d.codigoOrden,
            clienteRazonSocial: d.receptor?.razonSocial || 'Cliente B2B',
            clienteRuc: d.receptor?.ruc || '—',
            fechaCreacion: d.fechaEmision,
            estado: (d.estado === 'CANCELADO' ? 'ANULADO' : d.estado) as SuborderStatus,
            subtotal: Number(d.subtotal),
            igv: Number(d.igv),
            total: Number(d.total),
            numeroFacturaSimulada: d.numeroComprobante,
            items: (d.items || []).map(i => ({
              productoId: i.productoId,
              nombre: i.titulo,
              sku: `CMP-${String(i.productoId).padStart(4, '0')}`,
              cantidad: i.cantidad,
              precioUnitario: Number(i.precioUnitario),
              subtotal: Number(i.subtotalLinea)
            }))
          },
          timestamp: new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => {
        const salesList = this.getFallbackSales().content || [];
        const found = salesList.find(s => s.subordenId === subordenId) || salesList[0];
        return of({
          success: true,
          data: { ...found, subordenId },
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  public updateSuborderStatus(subordenId: number, nuevoEstado: SuborderStatus): Observable<ApiResponse<void>> {
    const backendEstado = nuevoEstado === 'ANULADO' ? 'CANCELADO' : nuevoEstado;
    const request$ = this.http
      .patch<BackendSubordenDetalleProvDTO>(
        `${this.baseUrl}/providers/me/sales/${subordenId}/status`,
        { nuevoEstado: backendEstado }
      )
      .pipe(
        map(() => ({
          success: true,
          message: `Estado de la suborden #${subordenId} actualizado a ${nuevoEstado}`,
          data: undefined as void,
          timestamp: new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        message: `Estado de la suborden #${subordenId} actualizado a ${nuevoEstado}`,
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  /**
   * Obtiene el perfil corporativo del proveedor (requiere ROLE_PROVEEDOR)
   */
  public getProfile(): Observable<ApiResponse<ProviderProfile>> {
    const request$ = this.http
      .get<BackendProveedorPerfilDTO>(`${this.baseUrl}/providers/me/profile`)
      .pipe(
        map(d => ({
          success: true,
          data: {
            id: d.proveedorId,
            razonSocial: d.razonSocial,
            ruc: d.identificacionFiscal,
            nombreComercial: d.nombreComercial,
            descripcion: d.descripcion,
            telefono: d.telefonoContacto,
            direccion: d.direccion,
            ciudad: d.ciudad,
            anosMercado: d.anosMercado
          },
          timestamp: new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        data: this.getFallbackProfile(),
        timestamp: new Date().toISOString()
      }))
    );
  }

  /**
   * Activa el rol de PROVEEDOR para una empresa autenticada y retorna nuevo JWT
   */
  public activateProvider(data: ActivateProviderBackendRequest): Observable<ApiResponse<ActivateProviderBackendResponse>> {
    const request$ = this.http
      .post<ActivateProviderBackendResponse>(`${this.baseUrl}/providers/me/activate`, data)
      .pipe(
        map(res => ({
          success: true,
          message: res.mensaje,
          data: res,
          timestamp: new Date().toISOString()
        }))
      );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
      catchError(() => of({
        success: true,
        message: 'Rol de PROVEEDOR activado exitosamente',
        data: {
          proveedorId: 1,
          rol: 'PROVEEDOR',
          token: '',
          tipoToken: 'Bearer',
          expiraEnSegundos: 86400,
          mensaje: 'Rol activado (mock)'
        },
        timestamp: new Date().toISOString()
      }))
    );
  }

  /**
   * Actualiza los datos comerciales del perfil del proveedor
   */
  public updateProfile(data: UpdateProviderProfileRequest & { anosMercado?: string }): Observable<ApiResponse<ProviderProfile>> {
    if (!environment.useMock) {
      return this.getProfile().pipe(
        switchMap(current =>
          this.activateProvider({
            ruc: current.data.ruc,
            razonSocial: current.data.razonSocial,
            nombreComercial: data.nombreComercial || current.data.nombreComercial,
            telefonoContacto: data.telefono || current.data.telefono,
            direccion: data.direccion || current.data.direccion,
            ciudad: data.ciudad || current.data.ciudad || 'Lima',
            anosMercado: data.anosMercado || current.data.anosMercado,
            descripcion: data.descripcion || current.data.descripcion
          }).pipe(
            switchMap(() => this.getProfile()),
            map(refreshed => ({
              ...refreshed,
              data: {
                ...refreshed.data,
                urlLogo: data.urlLogo ?? refreshed.data.urlLogo,
                urlBanner: data.urlBanner ?? refreshed.data.urlBanner
              }
            }))
          )
        )
      );
    }

    return this.http.put<ApiResponse<ProviderProfile>>(`${this.baseUrl}/providers/me/profile`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Perfil corporativo actualizado',
        data: { ...this.getFallbackProfile(), ...data },
        timestamp: new Date().toISOString()
      }))
    );
  }

  private buildBackendProductPayload(data: CreateProductRequest) {
    const qtyMin = data.cantidadMinimaMayorista || 1;
    const specs: { clave: string; valor: string }[] = [
      { clave: 'SKU', valor: data.sku || 'CMP-B2B' },
      { clave: 'Marca', valor: data.marca || 'Enterprise' },
      { clave: 'Modelo', valor: data.modelo || 'Corporativo' },
      { clave: 'Stock Referencial', valor: String(data.stockDisponible ?? 100) },
      { clave: 'Garantía', valor: `${data.garantiaMeses || 12} meses` }
    ];

    return {
      categoriaId: String(data.categoriaId),
      titulo: data.nombre,
      descripcion: data.descripcion,
      modeloComercial: 'DISTRIBUIDOR_OFICIAL',
      tipoFormato: data.modelo || 'Unidad / Caja Master',
      unidadesPorPaquete: `${qtyMin} ${qtyMin === 1 ? 'unidad' : 'unidades'}`,
      pedidoMinimo: `${qtyMin} ${qtyMin === 1 ? 'unidad' : 'unidades'}`,
      precioUnitarioRef: data.precioUnitario,
      precioTotalRef: data.precioMayorista && data.precioMayorista > 0 ? data.precioMayorista : data.precioUnitario,
      moneda: 'PEN',
      terminosComerciales: `Garantía oficial de ${data.garantiaMeses || 12} meses. Emisión de factura electrónica B2B.`,
      especificaciones: specs,
      imagenes: [
        {
          urlImagen: data.urlImagen,
          orden: 1
        }
      ]
    };
  }

  private getFallbackMetrics(): ProviderMetrics {
    return {
      ventasMesActual: 48920.50,
      pedidosPendientes: 6,
      productosPublicados: 18,
      valorInventario: 142800.00
    };
  }

  private getFallbackProfile(): ProviderProfile {
    return {
      id: 1,
      razonSocial: 'AndesTech Mayorista SAC',
      ruc: '20601234567',
      nombreComercial: 'AndesTech Perú',
      descripcion: 'Distribuidor autorizado mayorista de equipamiento corporativo, workstations Dell y Lenovo, servidores Xeon y componentes de alto rendimiento para centros de datos.',
      telefono: '01 680-9900',
      direccion: 'Av. República de Panamá 3500, Almacén 4, San Isidro',
      ciudad: 'Lima',
      urlLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      urlBanner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
      anosMercado: '12 años'
    };
  }

  private getFallbackSales(): PaginatedResponse<ProviderSaleItem> {
    const content: ProviderSaleItem[] = [
      {
        subordenId: 100011,
        ordenId: 10001,
        codigoOrden: 'ORD-2026-10001',
        clienteRazonSocial: 'CORPORACION TECNOLOGICA DEL PERU SAC',
        clienteRuc: '20601234567',
        fechaCreacion: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        estado: 'PENDIENTE_DESPACHO',
        subtotal: 2399.00,
        igv: 431.82,
        total: 2830.82,
        numeroFacturaSimulada: 'F001-00004921',
        items: [
          {
            productoId: 101,
            nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM (Dell 5520)',
            sku: 'LAP-DELL-5520-01',
            cantidad: 1,
            precioUnitario: 2399.00,
            subtotal: 2399.00
          }
        ]
      },
      {
        subordenId: 100002,
        ordenId: 10000,
        codigoOrden: 'ORD-2026-10000',
        clienteRazonSocial: 'INVERSIONES DIGITALES DEL NORTE EIRL',
        clienteRuc: '20509876543',
        fechaCreacion: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        estado: 'EN_PREPARACION',
        subtotal: 7197.00,
        igv: 1295.46,
        total: 8492.46,
        numeroFacturaSimulada: 'F001-00004920',
        items: [
          {
            productoId: 101,
            nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM (Dell 5520)',
            sku: 'LAP-DELL-5520-01',
            cantidad: 3,
            precioUnitario: 2399.00,
            subtotal: 7197.00
          }
        ]
      },
      {
        subordenId: 99891,
        ordenId: 9989,
        codigoOrden: 'ORD-2026-09989',
        clienteRazonSocial: 'SISTEMAS & REDES PERU SAC',
        clienteRuc: '20401122334',
        fechaCreacion: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        estado: 'DESPACHADO',
        subtotal: 4798.00,
        igv: 863.64,
        total: 5661.64,
        numeroFacturaSimulada: 'F001-00004919',
        items: [
          {
            productoId: 101,
            nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM (Dell 5520)',
            sku: 'LAP-DELL-5520-01',
            cantidad: 2,
            precioUnitario: 2399.00,
            subtotal: 4798.00
          }
        ]
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

  private getFallbackCatalog(): PaginatedResponse<ProviderProductItem> {
    const content: ProviderProductItem[] = [
      {
        id: 101,
        sku: 'LAP-DELL-5520-01',
        nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD',
        categoriaNombre: 'Laptops & Workstations',
        precioUnitario: 2399.00,
        stock: 25,
        activo: true,
        ultimaActualizacion: new Date().toISOString()
      },
      {
        id: 104,
        sku: 'MON-LG-27MP-04',
        nombre: 'Monitor 27" IPS Full HD (1920 x 1080) 75Hz VESA',
        categoriaNombre: 'Monitores & Pantallas',
        precioUnitario: 699.00,
        stock: 34,
        activo: true,
        ultimaActualizacion: new Date().toISOString()
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

  private getFallbackProductDetail(id: number): ProductDetail {
    return {
      id,
      nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD (Dell Latitude 5520)',
      sku: 'LAP-DELL-5520-01',
      categoriaNombre: 'Laptops & Workstations',
      precioUnitario: 2399.00,
      precioMayorista: 2199.00,
      cantidadMinimaMayorista: 5,
      stockDisponible: 25,
      proveedorId: 1,
      proveedorRazonSocial: 'AndesTech Mayorista SAC',
      proveedorRuc: '20601234567',
      proveedorCalificacion: 4.8,
      imagenPrincipalUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      descripcion: 'Equipo corporativo de alta durabilidad pensado para flujos de trabajo profesionales e ingeniería comercial.',
      marca: 'Dell',
      modelo: 'Latitude 5520',
      especificaciones: [
        { clave: 'Procesador', valor: 'Intel Core i5-1135G7 (4 núcleos / 8 hilos)' },
        { clave: 'Memoria RAM', valor: '16 GB DDR4 3200MHz (expandible a 64GB)' },
        { clave: 'Almacenamiento', valor: '512 GB SSD NVMe M.2 PCIe Gen 3' },
        { clave: 'Pantalla', valor: '15.6" FHD (1920x1080) Antirreflejo 250 nits' },
        { clave: 'Garantía B2B', valor: '36 meses ProSupport con reemplazo al siguiente día laborable' }
      ],
      imagenesSecundarias: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
      ],
      garantiaMeses: 36,
      condicion: 'NUEVO'
    };
  }
}

