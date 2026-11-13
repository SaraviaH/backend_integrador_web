import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterCompanyRequest,
  RegisterCompanyResponse,
  RequestProviderActivation,
  UserProfile,
  normalizeUserRole,
} from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { AuthStateService } from '../state/auth-state.service';

interface UsuarioSesionDTO {
  correo: string;
  nombre: string;
  rol: string;
  valido: boolean;
}

interface ProveedorPerfilBackendDTO {
  proveedorId: number;
  usuarioId: number;
  identificacionFiscal: string;
  razonSocial: string;
  nombreComercial?: string;
  telefonoContacto?: string;
  correoContacto?: string;
  direccion?: string;
  ciudad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      switchMap(auth => {
        if (!auth.token || auth.usuario) {
          return of(auth);
        }
        const headers = new HttpHeaders({ Authorization: `Bearer ${auth.token}` });
        return this.fetchSessionProfile(headers).pipe(
          map(usuario => ({ ...auth, usuario })),
          catchError(() => of(auth))
        );
      })
    );
  }

  public registerCompany(data: RegisterCompanyRequest): Observable<RegisterCompanyResponse> {
    const payload = {
      nombre: data.nombre,
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      direccionFiscal: data.direccion,
      telefono: data.telefono,
      correo: data.correo,
      contrasena: data.contrasena
    };
    return this.http.post<RegisterCompanyResponse>(`${this.baseUrl}/auth/register-company`, payload).pipe(
      tap(() => {
        this.authState.saveCompanyMeta(data.correo, {
          ruc: data.ruc,
          razonSocial: data.razonSocial,
          telefono: data.telefono,
          direccion: data.direccion
        });
      })
    );
  }

  public getProfile(): Observable<UserProfile> {
    const request$ = this.fetchSessionProfile();
    if (!environment.useMock) {
      return request$;
    }
    return request$.pipe(catchError(() => of(this.getFallbackProfile())));
  }

  public updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    const current = this.authState.currentUser();
    if (!current) {
      return of(this.getFallbackProfile());
    }
    const merged: UserProfile = {
      ...current,
      ...data,
      rol: normalizeUserRole(data.rol || current.rol)
    };
    this.authState.updateProfile(merged);
    return of(merged);
  }

  public changePassword(data: ChangePasswordRequest): Observable<ApiResponse<void>> {
    const request$ = this.http
      .patch<{ mensaje?: string; fechaActualizacion?: string }>(`${this.baseUrl}/auth/password`, data)
      .pipe(
        map(res => ({
          success: true,
          message: res?.mensaje || 'Contraseña actualizada con éxito',
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
        message: 'Contraseña actualizada con éxito',
        data: undefined as any,
        timestamp: new Date().toISOString()
      }))
    );
  }

  public requestProviderActivation(data: RequestProviderActivation): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/providers/me/activate`, data);
  }

  private fetchSessionProfile(headers?: HttpHeaders): Observable<UserProfile> {
    const options = headers ? { headers } : {};
    return this.http.get<UsuarioSesionDTO>(`${this.baseUrl}/auth/me`, options).pipe(
      switchMap(session => {
        const normalizedRole = normalizeUserRole(session.rol);
        const meta = this.authState.getCompanyMeta(session.correo);
        const baseProfile: UserProfile = {
          nombre: session.nombre,
          nombreCompleto: session.nombre,
          correo: session.correo,
          rol: normalizedRole,
          activo: session.valido,
          tienePerfilProveedor: normalizedRole === 'ROLE_PROVEEDOR',
          ...meta
        };

        if (normalizedRole !== 'ROLE_PROVEEDOR') {
          return of(baseProfile);
        }

        return this.http.get<ProveedorPerfilBackendDTO>(`${this.baseUrl}/providers/me/profile`, options).pipe(
          map(prov => ({
            ...baseProfile,
            usuarioId: prov.usuarioId,
            ruc: prov.identificacionFiscal,
            razonSocial: prov.razonSocial,
            nombreComercial: prov.nombreComercial,
            telefono: prov.telefonoContacto,
            direccion: prov.direccion,
            ciudad: prov.ciudad,
            tienePerfilProveedor: true
          })),
          catchError(() => of(baseProfile))
        );
      })
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

