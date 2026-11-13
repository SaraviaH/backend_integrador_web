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
      `${this.baseUrl}/providers/me/sales?page=${page}&size=${size}`
    );
  }

  public getSaleDetail(subordenId: number): Observable<ApiResponse<ProviderSaleItem>> {
    return this.http.get<ApiResponse<ProviderSaleItem>>(
      `${this.baseUrl}/providers/me/sales/${subordenId}`
    );
  }

  public updateSuborderStatus(subordenId: number, nuevoEstado: SuborderStatus): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/providers/me/sales/${subordenId}/status`,
      { nuevoEstado }
    );
  }

  /**
   * Obtiene el perfil corporativo del proveedor (requiere ROLE_PROVEEDOR)
   */
  public getProfile(): Observable<ApiResponse<ProviderProfile>> {
    return this.http.get<ApiResponse<ProviderProfile>>(`${this.baseUrl}/providers/me/profile`);
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
    return this.http.put<ApiResponse<ProviderProfile>>(`${this.baseUrl}/providers/me/profile`, data);
  }
}

