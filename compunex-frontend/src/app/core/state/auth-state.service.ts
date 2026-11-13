import { Injectable, signal, computed } from '@angular/core';
import { AuthResponse, UserProfile, UserRole } from '../models/auth.model';

const TOKEN_KEY = 'compunex_jwt_token';
const USER_KEY = 'compunex_user_profile';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly _token = signal<string | null>(this.getStoredToken());
  private readonly _currentUser = signal<UserProfile | null>(this.getStoredUser());

  // Señales Públicas Computadas
  public readonly token = this._token.asReadonly();
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._token());
  public readonly userRole = computed<UserRole | null>(() => this._currentUser()?.rol ?? null);

  public readonly isCliente = computed(() => this._currentUser()?.rol === 'ROLE_CLIENTE');
  public readonly isProveedor = computed(() => this._currentUser()?.rol === 'ROLE_PROVEEDOR');
  public readonly isAdmin = computed(() => this._currentUser()?.rol === 'ROLE_ADMIN');
  public readonly canAccessPanel = computed(() => this.isProveedor() || this.isAdmin());

  public setAuth(auth: AuthResponse): void {
    this._token.set(auth.token);
    this._currentUser.set(auth.usuario ?? null);

    try {
      localStorage.setItem(TOKEN_KEY, auth.token);
      if (auth.usuario) {
        localStorage.setItem(USER_KEY, JSON.stringify(auth.usuario));
      }
    } catch (e) {
      console.warn('No se pudo persistir la sesión en localStorage:', e);
    }
  }

  public updateProfile(usuario: UserProfile): void {
    this._currentUser.set(usuario);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    } catch (e) {
      console.warn('No se pudo actualizar perfil en localStorage:', e);
    }
  }

  public clearAuth(): void {
    this._token.set(null);
    this._currentUser.set(null);

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Error al limpiar localStorage:', e);
    }
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? (JSON.parse(data) as UserProfile) : null;
    } catch {
      return null;
    }
  }
}
