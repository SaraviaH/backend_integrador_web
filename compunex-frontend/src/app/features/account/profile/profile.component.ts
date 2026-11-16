import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/state/auth-state.service';
import { UserProfile } from '../../../core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <span class="text-slate-500 font-medium">Mi Cuenta</span>
        <span>/</span>
        <span class="text-brand-night font-bold">Perfil Corporativo</span>
      </nav>

      <!-- Barra de Pestañas de la Cuenta -->
      <div class="flex items-center gap-5 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-bold">
        <a
          routerLink="/cuenta/perfil"
          class="pb-3 border-b-2 border-brand-primary text-brand-primary transition-colors shrink-0"
        >
          Perfil Corporativo
        </a>
        <a
          routerLink="/cuenta/seguridad"
          class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        >
          Seguridad y Contraseña
        </a>
        <a
          routerLink="/cuenta/mis-compras"
          class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        >
          Mis Compras
        </a>
        @if (!authState.isProveedor()) {
          <a
            routerLink="/cuenta/activar-proveedor"
            class="pb-3 border-b-2 border-transparent text-brand-primary hover:text-brand-petrol font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            Activar como Proveedor
          </a>
        } @else {
          <a
            routerLink="/panel"
            class="pb-3 border-b-2 border-transparent text-emerald-700 hover:text-emerald-800 font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            Mi Panel Proveedor
          </a>
        }
      </div>

      <!-- Encabezado -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-brand-tint text-brand-primary font-black text-xl flex items-center justify-center font-display shrink-0 uppercase">
            {{ getInitials() }}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span
                class="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                [class.bg-emerald-50]="user()?.rol === 'ROLE_PROVEEDOR'"
                [class.text-emerald-700]="user()?.rol === 'ROLE_PROVEEDOR'"
                [class.border-emerald-200]="user()?.rol === 'ROLE_PROVEEDOR'"
                [class.bg-brand-tint]="user()?.rol !== 'ROLE_PROVEEDOR'"
                [class.text-brand-primary]="user()?.rol !== 'ROLE_PROVEEDOR'"
                [class.border-brand-tint]="user()?.rol !== 'ROLE_PROVEEDOR'"
              >
                {{ user()?.rol === 'ROLE_PROVEEDOR' ? 'Proveedor Autorizado' : 'Cliente Corporativo B2B' }}
              </span>
              @if (user()?.ruc) {
                <span class="text-xs text-slate-400">
                  RUC: <strong class="text-slate-700 font-mono">{{ user()?.ruc }}</strong>
                </span>
              }
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-brand-night tracking-tight font-display">
              {{ user()?.razonSocial || user()?.nombreCompleto || user()?.nombre || 'Cuenta Corporativa' }}
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Información registrada en tu sesión corporativa actual.
            </p>
          </div>
        </div>

        @if (!authState.isProveedor()) {
          <div class="shrink-0">
            <a
              routerLink="/cuenta/activar-proveedor"
              class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Vender como Proveedor</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        }
      </div>

      <!-- 1. CARGA -->
      @if (isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 animate-pulse shadow-xs">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-14 bg-slate-200 rounded-2xl"></div>
            <div class="h-14 bg-slate-200 rounded-2xl"></div>
            <div class="h-14 bg-slate-200 rounded-2xl"></div>
            <div class="h-14 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      }

      <!-- 2. ERROR -->
      @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto">
          <h3 class="text-base font-bold text-rose-900">Error al cargar datos del perfil</h3>
          <p class="text-xs text-rose-700">Ocurrió un error al obtener tus datos corporativos desde el servidor.</p>
          <button
            type="button"
            (click)="loadProfile()"
            class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
          >
            Reintentar
          </button>
        </div>
      }

      <!-- 3. DATOS REALES (SOLO LECTURA) -->
      @else {
        @if (user(); as profile) {
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 class="text-sm font-bold text-brand-night uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Datos Corporativos de Sesión
            </h2>
            <span class="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
              Solo lectura
            </span>
          </div>

          <!-- Aviso honesto por ausencia de endpoint PUT/PATCH /auth/me -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-1">
            <p class="font-bold text-brand-night">Visualización directa de tu cuenta autenticada</p>
            <p>
              La edición directa de datos del comprador no está habilitada en el servidor actual. Puedes especificar o ajustar los datos fiscales al confirmar cada compra en el Checkout{{ authState.isProveedor() ? ' o gestionar tus datos comerciales desde tu Panel de Proveedor.' : '.' }}
            </p>
          </div>

          <dl class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">RUC de la Empresa</dt>
              <dd class="mt-1 font-mono font-bold text-sm text-brand-night">{{ profile.ruc || 'No registrado en sesión' }}</dd>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Razón Social</dt>
              <dd class="mt-1 font-bold text-sm text-brand-night">{{ profile.razonSocial || 'No disponible' }}</dd>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Representante / Contacto</dt>
              <dd class="mt-1 font-bold text-sm text-brand-night">{{ profile.nombreCompleto || profile.nombre || '—' }}</dd>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Correo Electrónico</dt>
              <dd class="mt-1 font-bold text-sm text-brand-night">{{ profile.correo }}</dd>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Teléfono de Contacto</dt>
              <dd class="mt-1 font-semibold text-sm text-brand-night">{{ profile.telefono || 'No registrado en sesión' }}</dd>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
              <dt class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Domicilio Fiscal</dt>
              <dd class="mt-1 font-semibold text-sm text-brand-night">{{ profile.direccion || 'No registrado en sesión' }}</dd>
            </div>
          </dl>

          <div class="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <a
              routerLink="/cuenta/seguridad"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-night hover:bg-slate-50 transition-colors"
            >
              Cambiar contraseña
            </a>
            @if (authState.isProveedor()) {
              <a
                routerLink="/panel/profile"
                class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors shadow-xs"
              >
                Ir a Perfil Comercial de Proveedor
              </a>
            }
          </div>

        </div>
        }
      }

    </div>
  `
})
export class ProfileComponent implements OnInit {
  private readonly authApi = inject(AuthApiService);
  public readonly authState = inject(AuthStateService);

  public readonly user = signal<UserProfile | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);

  ngOnInit(): void {
    this.loadProfile();
  }

  public getInitials(): string {
    const label = this.user()?.razonSocial || this.user()?.nombreCompleto || this.user()?.nombre || 'EM';
    return label.trim().substring(0, 2).toUpperCase();
  }

  public loadProfile(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const cached = this.authState.currentUser();
    if (cached) {
      this.user.set(cached);
      this.isLoading.set(false);
    }

    this.authApi.getProfile().subscribe({
      next: (profile) => {
        this.isLoading.set(false);
        this.user.set(profile);
        this.authState.updateProfile(profile);
      },
      error: () => {
        if (!cached) {
          this.isLoading.set(false);
          this.hasError.set(true);
        }
      }
    });
  }
}
