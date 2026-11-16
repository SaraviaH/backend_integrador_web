import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthStateService } from '../../core/state/auth-state.service';

@Component({
  selector: 'app-panel-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      id="panel-sidebar"
      class="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-gradient-to-b from-[#04202E] to-[#0A3C55] text-[#E1F2FA] flex flex-col shrink-0 h-screen border-r border-[#0F5E83]/40 shadow-xl lg:shadow-none transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-auto lg:w-64 lg:shrink-0 lg:translate-x-0"
      [class.-translate-x-full]="!mobileOpen"
      aria-label="Navegación del panel"
    >
      <div class="h-16 px-5 border-b border-[#0F5E83]/40 flex items-center justify-between gap-3 shrink-0">
        <a routerLink="/" class="flex items-center gap-2.5 min-w-0" (click)="closeRequested.emit()">
          <img
            src="/images/compunex-icon.png"
            alt="COMPUNEX B2B"
            class="w-9 h-9 rounded-xl object-contain bg-[#04202E]/80 p-0.5 border border-[#4FB3DA]/25 shadow-md shrink-0"
          />
          <div class="min-w-0">
            <h2 class="text-base font-extrabold text-white tracking-tight leading-tight truncate">COMPUNEX</h2>
            <p class="text-[10px] text-[#4FB3DA] font-semibold uppercase tracking-wider truncate">
              Panel Proveedor
            </p>
          </div>
        </a>

        <button
          type="button"
          class="lg:hidden p-2 rounded-lg text-[#98D5EE] hover:text-white hover:bg-[#0F5E83]/50 transition-colors"
          aria-label="Cerrar menú lateral"
          (click)="closeRequested.emit()"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-3.5 mx-3 mt-4 mb-2 rounded-xl bg-[#04202E]/65 border border-[#0F5E83]/50 flex items-center gap-3 shrink-0">
        <div class="w-10 h-10 rounded-lg bg-[#1786B4]/25 border border-[#4FB3DA]/30 text-[#4FB3DA] flex items-center justify-center font-bold text-sm shrink-0" aria-hidden="true">
          {{ (authState.currentUser()?.razonSocial || authState.currentUser()?.nombre || 'P').charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-white truncate leading-tight">
            {{ authState.currentUser()?.razonSocial || authState.currentUser()?.nombreComercial || authState.currentUser()?.nombre || 'Cuenta Proveedor' }}
          </p>
          <p class="text-[11px] text-[#98D5EE]/85 truncate mt-0.5">
            RUC: {{ authState.currentUser()?.ruc || 'No registrado en sesión' }}
          </p>
        </div>
      </div>

      <nav class="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        <a
          routerLink="/panel/dashboard"
          routerLinkActive="!bg-[#1786B4]/35 !text-white !border-[#4FB3DA]/45 font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#E1F2FA]/85 border border-transparent hover:bg-[#0F5E83]/45 hover:text-white transition-all duration-150"
          (click)="closeRequested.emit()"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard General
        </a>

        <a
          routerLink="/panel/products"
          routerLinkActive="!bg-[#1786B4]/35 !text-white !border-[#4FB3DA]/45 font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#E1F2FA]/85 border border-transparent hover:bg-[#0F5E83]/45 hover:text-white transition-all duration-150"
          (click)="closeRequested.emit()"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Mi Catálogo & Precios
        </a>

        <a
          routerLink="/panel/sales"
          routerLinkActive="!bg-[#1786B4]/35 !text-white !border-[#4FB3DA]/45 font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#E1F2FA]/85 border border-transparent hover:bg-[#0F5E83]/45 hover:text-white transition-all duration-150"
          (click)="closeRequested.emit()"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Ventas Recibidas & Despacho
        </a>

        <a
          routerLink="/panel/profile"
          routerLinkActive="!bg-[#1786B4]/35 !text-white !border-[#4FB3DA]/45 font-semibold shadow-sm"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#E1F2FA]/85 border border-transparent hover:bg-[#0F5E83]/45 hover:text-white transition-all duration-150"
          (click)="closeRequested.emit()"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Perfil Corporativo
        </a>

        <div class="pt-4 mt-4 border-t border-[#0F5E83]/40">
          <p class="px-3.5 text-[10px] uppercase font-bold text-[#98D5EE]/70 tracking-wider">Tienda Pública</p>
          <a
            routerLink="/"
            class="flex items-center gap-3 px-3.5 py-2.5 mt-1.5 rounded-xl text-xs font-medium text-[#E1F2FA]/85 border border-transparent hover:bg-[#0F5E83]/45 hover:text-white transition-all duration-150"
            (click)="closeRequested.emit()"
          >
            <svg class="w-4 h-4 shrink-0 text-[#4FB3DA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ir a Tienda B2B
          </a>
        </div>
      </nav>

      <div class="p-4 border-t border-[#0F5E83]/40 shrink-0">
        <button
          type="button"
          (click)="logout()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-rose-300 bg-rose-950/35 border border-rose-500/30 rounded-xl hover:bg-rose-900/50 hover:text-rose-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

  @Input() public mobileOpen = false;
  @Output() public readonly closeRequested = new EventEmitter<void>();

  public logout(): void {
    this.closeRequested.emit();
    this.authState.clearAuth();
    this.router.navigate(['/auth/login']);
  }
}
