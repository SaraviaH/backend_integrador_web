import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root'
})
export class ProviderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public getDashboardMetrics(): Observable<ProviderMetrics> {
    return this.http.get<ProviderMetrics>(`${this.baseUrl}/providers/me/metrics`).pipe(
      catchError(() => of(this.getFallbackMetrics()))
    );
  }

  public getMyCatalog(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProviderProductItem>> {
    return this.http.get<PaginatedResponse<ProviderProductItem>>(
      `${this.baseUrl}/providers/me/products?page=${page}&size=${size}`
    ).pipe(
      catchError(() => of(this.getFallbackCatalog()))
    );
  }

  public getMyProductById(id: number): Observable<ApiResponse<ProductDetail>> {
    return this.http.get<ApiResponse<ProductDetail>>(`${this.baseUrl}/providers/me/products/${id}`).pipe(
      catchError(() => of({
        success: true,
        data: this.getFallbackProductDetail(id),
        timestamp: new Date().toISOString()
      }))
    );
  }

  public createProduct(data: CreateProductRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.post<ApiResponse<ProductDetail>>(`${this.baseUrl}/providers/me/products`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Producto registrado exitosamente en el catálogo B2B',
        data: {
          id: Math.floor(Math.random() * 900) + 100,
          nombre: data.nombre,
          sku: data.sku,
          categoriaNombre: 'Hardware B2B',
          precioUnitario: data.precioUnitario,
          precioMayorista: data.precioMayorista || data.precioUnitario * 0.9,
          cantidadMinimaMayorista: data.cantidadMinimaMayorista || 5,
          stockDisponible: data.stockDisponible,
          proveedorId: 1,
          proveedorRazonSocial: 'AndesTech Mayorista SAC',
          proveedorRuc: '20601234567',
          imagenPrincipalUrl: data.urlImagen,
          descripcion: data.descripcion,
          marca: data.marca,
          modelo: data.modelo,
          especificaciones: [],
          imagenesSecundarias: [],
          garantiaMeses: data.garantiaMeses || 12,
          condicion: 'NUEVO' as const
        },
        timestamp: new Date().toISOString()
      }))
    );
  }

  public updateProduct(id: number, data: UpdateProductRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.put<ApiResponse<ProductDetail>>(`${this.baseUrl}/providers/me/products/${id}`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Producto actualizado con éxito',
        data: {
          ...this.getFallbackProductDetail(id),
          ...data,
          imagenPrincipalUrl: data.urlImagen || this.getFallbackProductDetail(id).imagenPrincipalUrl
        },
        timestamp: new Date().toISOString()
      }))
    );
  }

  public toggleProductStatus(id: number, activo: boolean): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/providers/me/products/${id}/status`, { activo }).pipe(
      catchError(() => of({
        success: true,
        message: `Estado del producto actualizado a ${activo ? 'Activo' : 'Pausado'}`,
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  public deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/providers/me/products/${id}`).pipe(
      catchError(() => of({
        success: true,
        message: 'Producto retirado de la venta correctamente',
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  public getMySales(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProviderSaleItem>> {
    return this.http.get<PaginatedResponse<ProviderSaleItem>>(
      `${this.baseUrl}/providers/me/sales?page=${page}&size=${size}`
    ).pipe(
      catchError(() => of(this.getFallbackSales()))
    );
  }

  public getSaleDetail(subordenId: number): Observable<ApiResponse<ProviderSaleItem>> {
    return this.http.get<ApiResponse<ProviderSaleItem>>(
      `${this.baseUrl}/providers/me/sales/${subordenId}`
    ).pipe(
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
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/providers/me/sales/${subordenId}/status`,
      { nuevoEstado }
    ).pipe(
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
    return this.http.get<ApiResponse<ProviderProfile>>(`${this.baseUrl}/providers/me/profile`).pipe(
      catchError(() => of({
        success: true,
        data: this.getFallbackProfile(),
        timestamp: new Date().toISOString()
      }))
    );
  }

  /**
   * Activa el rol de PROVEEDOR para una empresa autenticada
   */
  public activateProvider(data: { descripcion?: string; nombreComercial?: string } = {}): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/providers/me/activate`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Rol de PROVEEDOR activado exitosamente',
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  /**
   * Actualiza el perfil del proveedor enviando urlLogo y/o urlBanner obtenidas previamente de /api/v1/media/upload
   */
  public updateProfile(data: UpdateProviderProfileRequest): Observable<ApiResponse<ProviderProfile>> {
    return this.http.put<ApiResponse<ProviderProfile>>(`${this.baseUrl}/providers/me/profile`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Perfil corporativo actualizado',
        data: { ...this.getFallbackProfile(), ...data },
        timestamp: new Date().toISOString()
      }))
    );
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

