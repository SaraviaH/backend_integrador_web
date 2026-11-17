import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AdminSidebarComponent, ToastContainerComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen lg:h-screen lg:overflow-hidden flex bg-[#F4F9FC] dark:bg-[#061722] text-[#04202E] dark:text-[#F2F9FC]">
      <!-- Sidebar lateral Admin -->
      <app-admin-sidebar
        [isOpen]="mobileMenuOpen()"
        (closeDrawer)="mobileMenuOpen.set(false)"
      />

      <!-- Área Principal -->
      <div class="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden">
        <!-- Topbar Administrativo -->
        <header class="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0A2535]/95 backdrop-blur-md border-b border-[#CFE4EE] dark:border-[#1D4960] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <button
              type="button"
              (click)="mobileMenuOpen.set(true)"
              class="lg:hidden p-2 -ml-2 rounded-xl text-[#0A3C55] dark:text-[#B8DFEF] hover:bg-[#E1F2FA] dark:hover:bg-[#114662] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4]"
              aria-label="Abrir menú lateral administrativo"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div class="min-w-0">
              <p class="text-sm font-bold text-[#04202E] dark:text-white truncate">
                Administración de Plataforma
              </p>
              <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] hidden sm:block truncate">
                Indicadores de negocio, facturación SaaS y gobierno de catálogo B2B
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2.5 shrink-0">
            <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              En línea · Admin
            </span>

            <app-theme-toggle [compact]="true" />

            <a
              routerLink="/catalogo"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC] dark:bg-[#0F3043] hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] text-xs font-semibold text-[#0A3C55] dark:text-[#E1F2FA] transition-colors"
            >
              <span>Ir a Tienda</span>
            </a>
          </div>
        </header>

        <!-- Contenido de vistas -->
        <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div class="max-w-[1440px] mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>

    <app-toast-container></app-toast-container>
  `
})
export class AdminLayoutComponent {
  public readonly mobileMenuOpen = signal(false);
}
