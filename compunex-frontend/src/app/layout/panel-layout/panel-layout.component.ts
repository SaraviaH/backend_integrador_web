import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelSidebarComponent } from '../panel-sidebar/panel-sidebar.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { AuthStateService } from '../../core/state/auth-state.service';

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelSidebarComponent, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex bg-brand-bg text-slate-800">
      <app-panel-sidebar
        [mobileOpen]="sidebarOpen()"
        (closeRequested)="closeSidebar()"
      ></app-panel-sidebar>

      @if (sidebarOpen()) {
        <button
          type="button"
          class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          aria-label="Cerrar menú lateral"
          (click)="closeSidebar()"
        ></button>
      }

      <div class="flex-1 flex flex-col min-w-0">
        <header class="min-h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div class="flex items-center gap-3 min-w-0">
            <button
              type="button"
              class="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              aria-label="Abrir menú lateral"
              aria-controls="panel-sidebar"
              [attr.aria-expanded]="sidebarOpen()"
              (click)="toggleSidebar()"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-blue-50 text-brand-primary border border-blue-200 whitespace-nowrap">
              {{ authState.isAdmin() ? 'ADMINISTRADOR' : 'PROVEEDOR B2B' }}
            </span>
          </div>

          <div class="flex items-center gap-3 sm:gap-4 min-w-0">
            <span class="hidden md:block text-xs text-slate-500 font-medium truncate">
              Empresa activa: <strong class="text-slate-800">{{ authState.currentUser()?.razonSocial || 'CompuNex Partner' }}</strong>
            </span>
            <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0" aria-hidden="true">
              {{ authState.currentUser()?.nombreCompleto?.charAt(0) || 'U' }}
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
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
