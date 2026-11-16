import { Injectable, signal, computed } from '@angular/core';
import { AuthResponse, UserProfile, UserRole, normalizeUserRole } from '../models/auth.model';

const TOKEN_KEY = 'compunex_jwt_token';
const USER_KEY = 'compunex_user_profile';
const COMPANY_META_PREFIX = 'compunex_company_meta_';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly _token = signal<string | null>(this.getStoredToken());
  private readonly _currentUser = signal<UserProfile | null>(this.getStoredUser());
  private rememberSession = this.detectRememberSession();

  public readonly token = this._token.asReadonly();
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());
  public readonly userRole = computed<UserRole | null>(() => {
    const rol = this._currentUser()?.rol ?? this.decodeJwtClaims(this._token())?.rol;
    return rol ? normalizeUserRole(rol) : null;
  });

  public readonly isCliente = computed(() => this.userRole() === 'ROLE_CLIENTE');
  public readonly isProveedor = computed(() => this.userRole() === 'ROLE_PROVEEDOR');
  public readonly isAdmin = computed(() => this.userRole() === 'ROLE_ADMIN');
  public readonly canAccessPanel = computed(() => this.isProveedor());

  public setAuth(auth: AuthResponse, remember: boolean = true): void {
    this.rememberSession = remember;
    this._token.set(auth.token);

    let usuario = auth.usuario ?? null;
    if (!usuario && auth.token) {
      const claims = this.decodeJwtClaims(auth.token);
      if (claims) {
        const meta = claims.correo ? this.getCompanyMeta(claims.correo) : {};
        usuario = {
          nombre: claims.correo || 'Empresa B2B',
          nombreCompleto: claims.correo || 'Empresa B2B',
          correo: claims.correo || '',
          rol: normalizeUserRole(claims.rol),
          tienePerfilProveedor: claims.tienePerfilProveedor ?? normalizeUserRole(claims.rol) === 'ROLE_PROVEEDOR',
          activo: true,
          ...meta
        };
      }
    } else if (usuario) {
      usuario = {
        ...usuario,
        rol: normalizeUserRole(usuario.rol),
        tienePerfilProveedor: usuario.tienePerfilProveedor ?? normalizeUserRole(usuario.rol) === 'ROLE_PROVEEDOR'
      };
      if (usuario.correo && (usuario.ruc || usuario.razonSocial)) {
        this.saveCompanyMeta(usuario.correo, {
          ruc: usuario.ruc,
          razonSocial: usuario.razonSocial,
          nombreComercial: usuario.nombreComercial,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          ciudad: usuario.ciudad
        });
      }
    }

    this._currentUser.set(usuario);
    this.persistSessionData(auth.token, usuario, remember);
  }

  public saveCompanyMeta(correo: string, meta: Partial<UserProfile>): void {
    try {
      const existing = this.getCompanyMeta(correo);
      localStorage.setItem(`${COMPANY_META_PREFIX}${correo.toLowerCase()}`, JSON.stringify({ ...existing, ...meta }));
    } catch {
      // Ignorar fallos de almacenamiento local
    }
  }

  public getCompanyMeta(correo: string): Partial<UserProfile> {
    try {
      const raw = localStorage.getItem(`${COMPANY_META_PREFIX}${correo.toLowerCase()}`);
      return raw ? (JSON.parse(raw) as Partial<UserProfile>) : {};
    } catch {
      return {};
    }
  }

  public updateProfile(usuario: UserProfile): void {
    const normalized: UserProfile = {
      ...usuario,
      rol: normalizeUserRole(usuario.rol),
      tienePerfilProveedor: usuario.tienePerfilProveedor ?? normalizeUserRole(usuario.rol) === 'ROLE_PROVEEDOR'
    };
    this._currentUser.set(normalized);
    if (normalized.correo && (normalized.ruc || normalized.razonSocial)) {
      this.saveCompanyMeta(normalized.correo, {
        ruc: normalized.ruc,
        razonSocial: normalized.razonSocial,
        nombreComercial: normalized.nombreComercial,
        telefono: normalized.telefono,
        direccion: normalized.direccion,
        ciudad: normalized.ciudad
      });
    }
    try {
      this.getActiveStorage().setItem(USER_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.warn('No se pudo actualizar perfil en almacenamiento:', e);
    }
  }

  public setProviderRole(newToken?: string): void {
    const current = this._currentUser();
    if (newToken) {
      this._token.set(newToken);
      try {
        this.getActiveStorage().setItem(TOKEN_KEY, newToken);
      } catch {
        // Ignorar
      }
    }
    if (current) {
      this.updateProfile({
        ...current,
        rol: 'ROLE_PROVEEDOR',
        tienePerfilProveedor: true
      });
    }
  }

  public clearAuth(): void {
    this._token.set(null);
    this._currentUser.set(null);

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Error al limpiar sesión:', e);
    }
  }

  private persistSessionData(token: string, usuario: UserProfile | null, remember: boolean): void {
    try {
      const target = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;
      other.removeItem(TOKEN_KEY);
      other.removeItem(USER_KEY);
      target.setItem(TOKEN_KEY, token);
      if (usuario) {
        target.setItem(USER_KEY, JSON.stringify(usuario));
      }
    } catch (e) {
      console.warn('No se pudo persistir la sesión:', e);
    }
  }

  private getActiveStorage(): Storage {
    try {
      if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
      if (localStorage.getItem(TOKEN_KEY)) return localStorage;
    } catch {
      // Ignorar
    }
    return this.rememberSession ? localStorage : sessionStorage;
  }

  private detectRememberSession(): boolean {
    try {
      if (sessionStorage.getItem(TOKEN_KEY)) return false;
    } catch {
      // Ignorar
    }
    return true;
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (data) {
        const parsed = JSON.parse(data) as UserProfile;
        return { ...parsed, rol: normalizeUserRole(parsed.rol) };
      }
      const claims = this.decodeJwtClaims(this.getStoredToken());
      if (claims) {
        return {
          nombre: claims.correo || 'Empresa B2B',
          nombreCompleto: claims.correo || 'Empresa B2B',
          correo: claims.correo || '',
          rol: normalizeUserRole(claims.rol),
          tienePerfilProveedor: claims.tienePerfilProveedor
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  private decodeJwtClaims(token: string | null): { correo?: string; rol?: string; tienePerfilProveedor?: boolean } | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const payload = JSON.parse(atob(padded));
      const rawRole = payload.rol || (Array.isArray(payload.roles) ? payload.roles[0] : undefined);
      return {
        correo: payload.sub,
        rol: rawRole,
        tienePerfilProveedor: typeof payload.tienePerfilProveedor === 'boolean' ? payload.tienePerfilProveedor : undefined
      };
    } catch {
      return null;
    }
  }
}
