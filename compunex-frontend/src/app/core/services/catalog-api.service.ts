import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
import { resolveMediaUrl } from './media-api.service';

interface BackendProductItemDTO {
  id: number;
  uuid?: string;
  titulo: string;
  categoriaId?: string;
  categoriaNombre?: string;
  pedidoMinimo?: string;
  precioUnitarioRef: number;
  moneda?: string;
  stockDisponible?: number;
  urlImagenPrincipal?: string;
  proveedorId: number;
  proveedorNombreComercial?: string;
}

interface BackendProductPageDTO {
  contenido: BackendProductItemDTO[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
  esUltima?: boolean;
}

interface BackendProductDetailDTO {
  id: number;
  uuid?: string;
  categoriaId?: string;
  categoriaNombre?: string;
  titulo: string;
  descripcion: string;
  modeloComercial?: string;
  tipoFormato?: string;
  unidadesPorPaquete?: string;
  pedidoMinimo?: string;
  precioUnitarioRef: number;
  precioTotalRef?: number;
  moneda?: string;
  stockDisponible?: number;
  terminosComerciales?: string;
  estado?: string;
  especificaciones?: { id?: number; clave: string; valor: string }[];
  imagenes?: { id?: number; urlImagen: string; orden?: number }[];
  proveedor?: {
    id: number;
    razonSocial?: string;
    nombreComercial?: string;
    identificacionFiscal?: string;
    ciudad?: string;
    telefonoContacto?: string;
    correoContacto?: string;
  };
}

function parseLeadingPositiveInt(value?: string, fallback: number = 1): number {
  if (!value) return fallback;
  const match = value.match(/\d+/);
  return match ? Math.max(1, Number(match[0])) : fallback;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  public getProducts(filter: CatalogFilterParams = {}): Observable<PaginatedResponse<ProductCard>> {
    let params = new HttpParams();
    if (filter.busqueda) params = params.set('search', filter.busqueda);
    if (filter.categoriaId !== undefined && filter.categoriaId !== null && filter.categoriaId !== '') {
      params = params.set('categoryId', String(filter.categoriaId));
    }
    if (filter.page != null) params = params.set('page', filter.page.toString());
    if (filter.size != null) params = params.set('size', filter.size.toString());

    return this.http.get<BackendProductPageDTO>(`${this.baseUrl}/products`, { params }).pipe(
      map(res => {
        const rawList = res.contenido || [];
        let content: ProductCard[] = rawList.map(item => ({
          id: item.id,
          nombre: item.titulo,
          sku: `CMP-${String(item.id).padStart(4, '0')}`,
          categoriaNombre: item.categoriaNombre || 'Hardware B2B',
          precioUnitario: Number(item.precioUnitarioRef),
          cantidadMinimaMayorista: parseLeadingPositiveInt(item.pedidoMinimo, 1),
          stockDisponible: item.stockDisponible ?? 100,
          proveedorId: item.proveedorId,
          proveedorRazonSocial: item.proveedorNombreComercial || 'Proveedor COMPUNEX',
          imagenPrincipalUrl: resolveMediaUrl(item.urlImagenPrincipal),
          destacado: false
        }));

        if (filter.precioMin != null) {
          content = content.filter(p => p.precioUnitario >= filter.precioMin!);
        }
        if (filter.precioMax != null) {
          content = content.filter(p => p.precioUnitario <= filter.precioMax!);
        }
        if (filter.soloConStock) {
          content = content.filter(p => p.stockDisponible > 0);
        }
        if (filter.sort === 'precio_asc') {
          content = [...content].sort((a, b) => a.precioUnitario - b.precioUnitario);
        } else if (filter.sort === 'precio_desc') {
          content = [...content].sort((a, b) => b.precioUnitario - a.precioUnitario);
        } else if (filter.sort === 'nombre_asc') {
          content = [...content].sort((a, b) => a.nombre.localeCompare(b.nombre));
        }

        return {
          content,
          page: res.pagina ?? 0,
          size: res.tamano ?? 12,
          totalElements: res.totalElementos ?? content.length,
          totalPages: Math.max(res.totalPaginas ?? 1, 1)
        };
      })
    );
  }

  public getFeaturedProducts(): Observable<ProductCard[]> {
    return this.getProducts({ page: 0, size: 8 }).pipe(map(res => res.content || []));
  }

  public getProductDetail(id: number): Observable<ProductDetail> {
    const request$ = this.http.get<BackendProductDetailDTO>(`${this.baseUrl}/products/${id}`).pipe(
      map(d => {
        const specs = (d.especificaciones || []).map(e => ({ clave: e.clave, valor: e.valor }));
        const findSpec = (key: string) =>
          specs.find(s => s.clave.trim().toLowerCase() === key.toLowerCase())?.valor;

        const imgs = (d.imagenes || []).map(i => resolveMediaUrl(i.urlImagen));
        const unitPrice = Number(d.precioUnitarioRef);
        const totalRef = d.precioTotalRef != null ? Number(d.precioTotalRef) : undefined;
        const warrantyDigits = parseLeadingPositiveInt(findSpec('Garantía') || d.terminosComerciales, 12);

        return {
          id: d.id,
          categoriaId: d.categoriaId,
          nombre: d.titulo,
          sku: findSpec('SKU') || `CMP-${String(d.id).padStart(4, '0')}`,
          categoriaNombre: d.categoriaNombre || d.categoriaId || 'Hardware B2B',
          precioUnitario: unitPrice,
          precioMayorista: totalRef && totalRef < unitPrice ? totalRef : undefined,
          cantidadMinimaMayorista: parseLeadingPositiveInt(d.pedidoMinimo, 1),
          stockDisponible: d.stockDisponible ?? 100,
          proveedorId: d.proveedor?.id || 0,
          proveedorRazonSocial: d.proveedor?.nombreComercial || d.proveedor?.razonSocial || 'Proveedor B2B',
          proveedorRuc: d.proveedor?.identificacionFiscal || '—',
          imagenPrincipalUrl: imgs[0] || resolveMediaUrl(null),
          imagenesSecundarias: imgs.slice(1),
          descripcion: d.descripcion,
          marca: findSpec('Marca') || d.modeloComercial || 'Enterprise',
          modelo: findSpec('Modelo') || d.tipoFormato || 'B2B',
          especificaciones: specs,
          garantiaMeses: warrantyDigits,
          condicion: 'NUEVO' as const
        };
      })
    );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(catchError(() => of(this.getFallbackDetail(id))));
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


