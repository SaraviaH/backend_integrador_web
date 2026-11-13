import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CatalogFilterParams,
  Category,
  CreateProductRequest,
  ProductCard,
  ProductDetail,
  UpdateProductRequest,
} from '../models/catalog.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categorias`);
  }

  public getProducts(filter: CatalogFilterParams = {}): Observable<PaginatedResponse<ProductCard>> {
    let params = new HttpParams();
    if (filter.busqueda) params = params.set('search', filter.busqueda);
    if (filter.categoriaId) params = params.set('categoryId', filter.categoriaId.toString());
    if (filter.precioMin != null) params = params.set('precioMin', filter.precioMin.toString());
    if (filter.precioMax != null) params = params.set('precioMax', filter.precioMax.toString());
    if (filter.proveedorId) params = params.set('proveedorId', filter.proveedorId.toString());
    if (filter.soloConStock != null) params = params.set('conStock', String(filter.soloConStock));
    if (filter.page != null) params = params.set('page', filter.page.toString());
    if (filter.size != null) params = params.set('size', filter.size.toString());
    if (filter.sort) params = params.set('sort', filter.sort);

    return this.http.get<PaginatedResponse<ProductCard>>(`${this.baseUrl}/products`, { params });
  }

  public getFeaturedProducts(): Observable<ProductCard[]> {
    return this.http.get<ProductCard[]>(`${this.baseUrl}/products/destacados`);
  }

  public getProductDetail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/products/${id}`).pipe(
      catchError(() => of(this.getFallbackDetail(id)))
    );
  }

  public getFallbackDetail(id: number): ProductDetail {
    const detailsMap: Record<number, Partial<ProductDetail>> = {
      101: {
        id: 101,
        nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD',
        sku: 'LAP-DELL-5520-01',
        categoriaNombre: 'Laptops & Workstations',
        precioUnitario: 2399.00,
        precioMayorista: 2199.00,
        cantidadMinimaMayorista: 3,
        stockDisponible: 25,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        proveedorRuc: '20601234567',
        proveedorCalificacion: 4.9,
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
        imagenesSecundarias: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'
        ],
        descripcion: 'Estación de trabajo portátil diseñada para productividad corporativa intensiva, multitarea empresarial, hojas de cálculo complejas y aplicaciones de ingeniería básica. Chasis reforzado con estándar de resistencia militar y batería de larga duración con carga rápida.',
        marca: 'Dell Latitude',
        modelo: '5520 Corporativa',
        garantiaMeses: 36,
        condicion: 'NUEVO',
        destacado: true,
        especificaciones: [
          { clave: 'Procesador', valor: 'Intel Core i5-1145G7 (4 núcleos, 8 hilos, hasta 4.40 GHz)' },
          { clave: 'Memoria RAM', valor: '16 GB DDR4 3200 MHz (Expandible a 64 GB)' },
          { clave: 'Almacenamiento', valor: '512 GB SSD M.2 NVMe PCIe 3.0' },
          { clave: 'Pantalla', valor: '15.6" FHD (1920 x 1080) Antirreflejo, 250 nits' },
          { clave: 'Conectividad', valor: 'Wi-Fi 6 AX201, Bluetooth 5.1, RJ-45 Gigabit' },
          { clave: 'Puertos', valor: '2x Thunderbolt 4 / USB-C, 2x USB 3.2 Gen 1, 1x HDMI 2.0, Lector MicroSD' },
          { clave: 'Sistema Operativo', valor: 'Windows 11 Pro 64-bit para Empresas' },
          { clave: 'Peso', valor: '1.59 kg' }
        ]
      },
      102: {
        id: 102,
        nombre: 'Tarjeta de video 8 GB GDDR6 Dual Fan',
        sku: 'GPU-RTX-3060-02',
        categoriaNombre: 'Componentes de Computadora',
        precioUnitario: 1199.00,
        precioMayorista: 1099.00,
        cantidadMinimaMayorista: 5,
        stockDisponible: 18,
        proveedorId: 2,
        proveedorRazonSocial: 'PC Global Perú',
        proveedorRuc: '20509876543',
        proveedorCalificacion: 4.8,
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
        imagenesSecundarias: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80'
        ],
        descripcion: 'Acelerador gráfico de alto rendimiento ideal para workstations de diseño 3D, edición de video 4K y renderizado CAD. Arquitectura NVIDIA Ampere con núcleos RT de 2da generación y núcleos Tensor de 3ra generación.',
        marca: 'GeForce RTX',
        modelo: '3060 Ventus 2X OC',
        garantiaMeses: 24,
        condicion: 'NUEVO',
        destacado: true,
        especificaciones: [
          { clave: 'Memoria VRAM', valor: '8 GB GDDR6 (128-bit)' },
          { clave: 'Frecuencia Boost', valor: '1807 MHz' },
          { clave: 'Núcleos CUDA', valor: '3584 Núcleos' },
          { clave: 'Interfaz', valor: 'PCI Express Gen 4.0 x16' },
          { clave: 'Salidas de Video', valor: '3x DisplayPort 1.4a, 1x HDMI 2.1 (Soporta 4K@120Hz)' },
          { clave: 'Consumo y PSU', valor: '170W (Fuente recomendada: 550W 80 Plus)' }
        ]
      }
    };

    const found = detailsMap[id];
    if (found) {
      return found as ProductDetail;
    }

    return {
      id,
      nombre: `Componente Mayorista Certificado #${id}`,
      sku: `SKU-B2B-${id}-GEN`,
      categoriaNombre: 'Hardware Mayorista',
      precioUnitario: 850.00,
      precioMayorista: 780.00,
      cantidadMinimaMayorista: 5,
      stockDisponible: 40,
      proveedorId: 1,
      proveedorRazonSocial: 'AndesTech Mayorista',
      proveedorRuc: '20601234567',
      proveedorCalificacion: 4.9,
      imagenPrincipalUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
      imagenesSecundarias: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
      ],
      descripcion: 'Hardware y componentes para infraestructura TI corporativa y ensamble de grado empresarial, respaldado por garantía de fábrica y soporte mayorista oficial.',
      marca: 'Enterprise Brand',
      modelo: `Pro Series-${id}`,
      garantiaMeses: 24,
      condicion: 'NUEVO',
      destacado: false,
      especificaciones: [
        { clave: 'Tipo de Producto', valor: 'Componente OEM B2B' },
        { clave: 'Garantía Oficial', valor: '24 meses con reemplazo directo' },
        { clave: 'Empaque', valor: 'Caja original sellada de fábrica' }
      ]
    };
  }

  /**
   * Crea un nuevo producto enviando la URL de imagen obtenida previamente desde /api/v1/media/upload
   */
  public createProduct(data: CreateProductRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.post<ApiResponse<ProductDetail>>(`${this.baseUrl}/products`, data);
  }

  /**
   * Actualiza un producto existente
   */
  public updateProduct(id: number, data: UpdateProductRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.put<ApiResponse<ProductDetail>>(`${this.baseUrl}/products/${id}`, data);
  }

  /**
   * Endpoints de Moderación Admin (ROLE_ADMIN)
   */
  public getAdminProducts(search: string = '', page: number = 0, size: number = 10): Observable<PaginatedResponse<ProductCard>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<ProductCard>>(`${this.baseUrl}/admin/products`, { params });
  }

  public updateProductStatus(id: number, status: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/admin/products/${id}/status`, { status });
  }
}


