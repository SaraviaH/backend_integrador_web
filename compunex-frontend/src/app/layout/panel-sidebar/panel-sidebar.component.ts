import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthStateService } from '../../core/state/auth-state.service';

@Component({
  selector: 'app-panel-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-brand-secondary text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800">
      <!-- Encabezado de la barra lateral -->
      <div class="p-6 border-b border-slate-800 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            C
          </div>
          <div>
            <h1 class="text-base font-extrabold text-white tracking-tight leading-tight">COMPUNEX</h1>
            <p class="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              {{ authState.isAdmin() ? 'Portal Administrador' : 'Panel Proveedor' }}
            </p>
          </div>
        </a>
      </div>

      <!-- Perfil rápido de la empresa / proveedor -->
      <div class="p-4 mx-3 my-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
          {{ authState.currentUser()?.razonSocial?.charAt(0) || 'P' }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-white truncate leading-tight">
            {{ authState.currentUser()?.razonSocial || 'Distribuidora Tech' }}
          </p>
          <p class="text-[11px] text-slate-400 truncate">RUC: {{ authState.currentUser()?.ruc || '20601234567' }}</p>
        </div>
      </div>

      <!-- Navegación del Panel -->
      <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <a
          routerLink="/panel/dashboard"
          routerLinkActive="bg-brand-primary text-white font-semibold shadow-xs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard General
        </a>

        <a
          routerLink="/panel/products"
          routerLinkActive="bg-brand-primary text-white font-semibold shadow-xs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Mi Catálogo & Precios
        </a>

        <a
          routerLink="/panel/sales"
          routerLinkActive="bg-brand-primary text-white font-semibold shadow-xs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Ventas Recibidas & Despacho
        </a>

        <a
          routerLink="/panel/profile"
          routerLinkActive="bg-brand-primary text-white font-semibold shadow-xs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Perfil Corporativo
        </a>

        <div class="pt-4 mt-4 border-t border-slate-800/80">
          <p class="px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tienda Pública</p>
          <a
            routerLink="/"
            class="flex items-center gap-3 px-3.5 py-2.5 mt-1 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ir a Tienda B2B
          </a>
        </div>
      </nav>

      <!-- Pie del Sidebar con Salida -->
      <div class="p-4 border-t border-slate-800">
        <button
          type="button"
          (click)="logout()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-900/40 rounded-xl hover:bg-rose-900/50 hover:text-rose-200 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  `
})
export class PanelSidebarComponent {
  public readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  public logout(): void {
    this.authState.clearAuth();
    this.router.navigate(['/auth/login']);
  }
}
