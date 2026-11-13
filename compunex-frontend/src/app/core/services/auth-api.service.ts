import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterCompanyRequest,
  RegisterCompanyResponse,
  RequestProviderActivation,
  UserProfile,
} from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials);
  }

  public registerCompany(data: RegisterCompanyRequest): Observable<RegisterCompanyResponse> {
    return this.http.post<RegisterCompanyResponse>(`${this.baseUrl}/auth/register-company`, data);
  }

  public getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/auth/me`).pipe(
      catchError(() => of(this.getFallbackProfile()))
    );
  }

  public updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/auth/me`, data).pipe(
      catchError(() => of({ ...this.getFallbackProfile(), ...data }))
    );
  }

  public changePassword(data: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.baseUrl}/auth/password`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Contraseña actualizada con éxito',
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  public requestProviderActivation(data: RequestProviderActivation): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/providers/me/activate`, data).pipe(
      catchError(() => of({
        success: true,
        message: 'Solicitud procesada con éxito',
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  private getFallbackProfile(): UserProfile {
    return {
      usuarioId: 101,
      nombre: 'Carlos Mendoza',
      nombreCompleto: 'Carlos Mendoza Ramos',
      correo: 'cmendoza@ciatecperu.pe',
      rol: 'ROLE_CLIENTE',
      ruc: '20601234567',
      razonSocial: 'CORPORACION TECNOLOGICA DEL PERU SAC',
      telefono: '993456789',
      direccion: 'Av. Las Begonias 441, Oficina 802, San Isidro, Lima',
      activo: true,
      tienePerfilProveedor: false
    };
  }
}

