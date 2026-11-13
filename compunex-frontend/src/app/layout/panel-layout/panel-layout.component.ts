import { Component, inject } from '@angular/core';
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
      <!-- Barra Lateral Privada -->
      <app-panel-sidebar></app-panel-sidebar>

      <!-- Zona de Contenido y Encabezado del Panel -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Encabezado Superior del Panel -->
        <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-brand-primary border border-blue-200">
              MODO OPERATIVO: PROVEEDOR B2B
            </span>
          </div>

          <div class="flex items-center gap-4">
            <span class="text-xs text-slate-500 font-medium">
              Empresa activa: <strong class="text-slate-800">{{ authState.currentUser()?.razonSocial || 'CompuNex Partner' }}</strong>
            </span>
            <div class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
              {{ authState.currentUser()?.nombreCompleto?.charAt(0) || 'U' }}
            </div>
          </div>
        </header>

        <!-- Área de Trabajo Principal del Panel -->
        <main class="flex-1 p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Notificaciones -->
      <app-toast-container></app-toast-container>
    </div>
  `
})
export class PanelLayoutComponent {
  public readonly authState = inject(AuthStateService);
}
