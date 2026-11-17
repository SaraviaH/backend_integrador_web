import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../../core/state/auth-state.service';

interface AdminNavItem {
  label: string;
  route: string;
  icon: 'dashboard' | 'subscriptions' | 'products' | 'providers' | 'users' | 'orders';
  exact: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Overlay móvil -->
    @if (isOpen) {
      <div
        (click)="closeDrawer.emit()"
        class="fixed inset-0 bg-[#04202E]/60 backdrop-blur-xs z-40 lg:hidden"
        aria-hidden="true"
      ></div>
    }

    <aside
      [class]="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-64 lg:shrink-0 h-full bg-gradient-to-b from-[#04202E] to-[#0A3C55] text-[#E1F2FA] flex flex-col border-r border-[#0F5E83]/40 shadow-xl lg:shadow-none transition-transform duration-200 ease-out"
      aria-label="Menú administrativo"
    >
      <!-- Marca -->
      <div class="h-16 px-5 flex items-center justify-between border-b border-[#1D4960]/70 shrink-0">
        <a routerLink="/admin/dashboard" (click)="closeDrawer.emit()" class="flex items-center gap-2.5 group">
          <img
            src="/images/compunex-icon.png"
            alt="COMPUNEX"
            class="h-8 w-8 rounded-lg bg-white/10 p-1 object-contain ring-1 ring-white/15 group-hover:scale-105 transition-transform"
          />
          <div class="leading-tight">
            <span class="block text-sm font-black tracking-tight text-white">COMPUNEX</span>
            <span class="block text-[10px] font-bold uppercase tracking-widest text-[#7CC5E6]">Consola Admin</span>
          </div>
        </a>

        <button
          type="button"
          (click)="closeDrawer.emit()"
          class="lg:hidden p-1.5 rounded-lg text-[#98D5EE] hover:bg-white/10 hover:text-white"
          aria-label="Cerrar menú lateral"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tarjeta de Administrador -->
      <div class="px-4 py-4 border-b border-[#1D4960]/60 shrink-0">
        <div class="rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#7CC5E6]">Administrador</span>
            <span class="px-1.5 py-0.5 rounded bg-[#1786B4]/30 border border-[#4FB3DA]/40 text-[9px] font-bold text-[#BCE6FA]">
              ROOT
            </span>
          </div>
          <p class="text-xs font-semibold text-white truncate">
            {{ authState.currentUser()?.nombreCompleto || 'Administrador COMPUNEX' }}
          </p>
          <p class="text-[11px] text-[#98D5EE]/85 truncate">
            {{ authState.currentUser()?.correo || 'admin@compunex.com' }}
          </p>
        </div>
      </div>

      <!-- Navegación -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#7CC5E6]/75">
          Control &amp; Operación
        </p>

        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            (click)="closeDrawer.emit()"
            routerLinkActive="!bg-[#1786B4]/35 !text-white !border-[#4FB3DA]/45 font-semibold shadow-sm"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#CDEAF7] hover:text-white hover:bg-white/10 border border-transparent transition-all"
          >
            @switch (item.icon) {
              @case ('dashboard') {
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
              @case ('subscriptions') {
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              }
              @case ('products') {
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              }
              @case ('providers') {
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              }
              @case ('users') {
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              }
              @case ('orders') {
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              }
            }
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Footer -->
      <div class="p-3 border-t border-[#1D4960]/60 space-y-1.5 shrink-0">
        <a
          routerLink="/catalogo"
          (click)="closeDrawer.emit()"
          class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#98D5EE] hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
          <span>Volver a Tienda B2B</span>
        </a>

        <button
          type="button"
          (click)="logout()"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-200 hover:text-white hover:bg-rose-500/20 transition-colors"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class AdminSidebarComponent {
  public readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  @Input() isOpen = false;
  @Output() closeDrawer = new EventEmitter<void>();

  public readonly navItems: AdminNavItem[] = [
    { label: 'Dashboard y KPIs', route: '/admin/dashboard', icon: 'dashboard', exact: true },
    { label: 'Suscripciones SaaS', route: '/admin/subscriptions', icon: 'subscriptions', exact: false },
    { label: 'Moderar Productos', route: '/admin/products', icon: 'products', exact: false },
    { label: 'Proveedores', route: '/admin/providers', icon: 'providers', exact: false },
    { label: 'Usuarios', route: '/admin/users', icon: 'users', exact: false },
    { label: 'Órdenes Globales', route: '/admin/orders', icon: 'orders', exact: false }
  ];

  public logout(): void {
    this.authState.clearAuth();
    this.closeDrawer.emit();
    this.router.navigate(['/auth/login']);
  }
}
