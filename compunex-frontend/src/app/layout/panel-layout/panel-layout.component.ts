import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelSidebarComponent } from '../panel-sidebar/panel-sidebar.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { AuthStateService } from '../../core/state/auth-state.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelSidebarComponent, ToastContainerComponent, ThemeToggleComponent],
  template: `
    <div class="min-h-screen lg:h-screen lg:overflow-hidden flex bg-[#F4F9FC] dark:bg-[#061722] text-[#04202E] dark:text-[#F2F9FC] transition-colors duration-200">
      <app-panel-sidebar
        [mobileOpen]="sidebarOpen()"
        (closeRequested)="closeSidebar()"
      ></app-panel-sidebar>

      @if (sidebarOpen()) {
        <button
          type="button"
          class="fixed inset-0 z-40 bg-[#04202E]/60 backdrop-blur-sm lg:hidden"
          aria-label="Cerrar menú lateral"
          (click)="closeSidebar()"
        ></button>
      }

      <div class="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden">
        <header class="shrink-0 h-16 bg-white/95 dark:bg-[#0A2535]/95 backdrop-blur-md border-b border-[#CFE4EE] dark:border-[#1D4960] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          <div class="flex items-center gap-3 min-w-0">
            <button
              type="button"
              class="lg:hidden p-2 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0F3043] text-[#0A3C55] dark:text-[#E1F2FA] hover:bg-[#E1F2FA]/50 dark:hover:bg-[#1D4960]/60 transition-colors"
              aria-label="Abrir menú lateral"
              aria-controls="panel-sidebar"
              [attr.aria-expanded]="sidebarOpen()"
              (click)="toggleSidebar()"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide bg-[#E1F2FA] dark:bg-[#0F3043] text-[#0F5E83] dark:text-[#98D5EE] border border-[#98D5EE]/60 dark:border-[#1D4960] whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-[#1786B4] dark:bg-[#4FB3DA]" aria-hidden="true"></span>
              PROVEEDOR B2B
            </span>
          </div>

          <div class="flex items-center gap-3 sm:gap-4 min-w-0">
            <app-theme-toggle [compact]="true" />
            <span class="hidden md:block text-xs text-[#527588] dark:text-[#B8DFEF] font-medium truncate">
              Empresa activa: <strong class="text-[#04202E] dark:text-[#F2F9FC] font-semibold">{{ authState.currentUser()?.razonSocial || authState.currentUser()?.nombreComercial || authState.currentUser()?.nombre || 'Sesión activa' }}</strong>
            </span>
            <div class="w-9 h-9 rounded-full bg-[#E1F2FA] dark:bg-[#0F5E83] text-[#0A3C55] dark:text-white border border-[#98D5EE]/60 dark:border-[#4FB3DA]/40 font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-sm" aria-hidden="true">
              {{ (authState.currentUser()?.nombreCompleto || authState.currentUser()?.nombre || 'P').charAt(0) }}
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
          <div class="max-w-[1440px] mx-auto w-full pb-10">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `
})
export class PanelLayoutComponent {
  public readonly authState = inject(AuthStateService);
  public readonly sidebarOpen = signal(false);

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.closeSidebar();
  }

  public toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  public closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
