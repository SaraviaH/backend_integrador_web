import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProviderMetrics,
  ProviderProductItem,
  ProviderProfile,
  ProviderSaleItem,
  UpdateProviderProfileRequest,
} from '../models/provider.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';
import { SuborderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public getDashboardMetrics(): Observable<ProviderMetrics> {
    return this.http.get<ProviderMetrics>(`${this.baseUrl}/proveedor/metricas`);
  }

  public getMyCatalog(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProviderProductItem>> {
    return this.http.get<PaginatedResponse<ProviderProductItem>>(
      `${this.baseUrl}/proveedor/catalogo?page=${page}&size=${size}`
    );
  }

  public getMySales(page: number = 0, size: number = 10): Observable<PaginatedResponse<ProviderSaleItem>> {
    return this.http.get<PaginatedResponse<ProviderSaleItem>>(
      `${this.baseUrl}/proveedor/ventas?page=${page}&size=${size}`
    );
  }

  public updateSuborderStatus(suborderId: number, nuevoEstado: SuborderStatus): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}/proveedor/ventas/${suborderId}/estado`,
      { estado: nuevoEstado }
    );
  }

  /**
   * Obtiene el perfil corporativo del proveedor
   */
  public getProfile(): Observable<ApiResponse<ProviderProfile>> {
    return this.http.get<ApiResponse<ProviderProfile>>(`${this.baseUrl}/proveedor/perfil`);
  }

  /**
   * Actualiza el perfil del proveedor enviando urlLogo y/o urlBanner obtenidas previamente de /api/v1/media/upload
   */
  public updateProfile(data: UpdateProviderProfileRequest): Observable<ApiResponse<ProviderProfile>> {
    return this.http.put<ApiResponse<ProviderProfile>>(`${this.baseUrl}/proveedor/perfil`, data);
  }
}

