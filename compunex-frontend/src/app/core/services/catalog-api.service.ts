import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    if (filter.busqueda) params = params.set('q', filter.busqueda);
    if (filter.categoriaId) params = params.set('categoriaId', filter.categoriaId.toString());
    if (filter.precioMin != null) params = params.set('precioMin', filter.precioMin.toString());
    if (filter.precioMax != null) params = params.set('precioMax', filter.precioMax.toString());
    if (filter.proveedorId) params = params.set('proveedorId', filter.proveedorId.toString());
    if (filter.soloConStock != null) params = params.set('conStock', String(filter.soloConStock));
    if (filter.page != null) params = params.set('page', filter.page.toString());
    if (filter.size != null) params = params.set('size', filter.size.toString());
    if (filter.sort) params = params.set('sort', filter.sort);

    return this.http.get<PaginatedResponse<ProductCard>>(`${this.baseUrl}/productos`, { params });
  }

  public getFeaturedProducts(): Observable<ProductCard[]> {
    return this.http.get<ProductCard[]>(`${this.baseUrl}/productos/destacados`);
  }

  public getProductDetail(id: number): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/productos/${id}`);
  }

  /**
   * Crea un nuevo producto enviando la URL de imagen obtenida previamente desde /api/v1/media/upload
   */
  public createProduct(data: CreateProductRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.post<ApiResponse<ProductDetail>>(`${this.baseUrl}/productos`, data);
  }

  /**
   * Actualiza un producto existente
   */
  public updateProduct(id: number, data: UpdateProductRequest): Observable<ApiResponse<ProductDetail>> {
    return this.http.put<ApiResponse<ProductDetail>>(`${this.baseUrl}/productos/${id}`, data);
  }
}

