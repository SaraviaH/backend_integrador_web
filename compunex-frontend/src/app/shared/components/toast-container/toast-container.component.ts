import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastStateService, ToastMessage } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-[400px] z-[60] flex flex-col gap-2.5 pointer-events-none"
      aria-label="Notificaciones"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast-card pointer-events-auto p-4 rounded-2xl shadow-dropdown border flex items-start gap-3 transition-all duration-200 animate-slide-in"
          [ngClass]="getContainerClasses(toast)"
          [attr.role]="toast.tipo === 'error' ? 'alert' : 'status'"
          [attr.aria-live]="toast.tipo === 'error' ? 'assertive' : 'polite'"
          aria-atomic="true"
        >
          <div class="shrink-0 mt-0.5" [ngClass]="getIconClasses(toast.tipo)">
            @switch (toast.tipo) {
              @case ('success') {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('error') {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('warning') {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              @case ('loading') {
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3.5"></circle>
                  <path class="opacity-85" fill="currentColor" d="M4 12a8 8 0 018-8v3.5a4.5 4.5 0 00-4.5 4.5H4z"></path>
                </svg>
              }
              @default {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            }
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold leading-snug" [ngClass]="getTitleClasses(toast.tipo)">
              {{ toast.titulo }}
            </h4>
            <p class="text-xs mt-0.5 leading-relaxed" [ngClass]="getMessageClasses(toast.tipo)">
              {{ toast.mensaje }}
            </p>
          </div>

          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 rounded-lg p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4] dark:focus-visible:ring-[#4FB3DA]"
            [ngClass]="getCloseClasses(toast.tipo)"
            aria-label="Cerrar notificación"
            title="Cerrar"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  public readonly toastService = inject(ToastStateService);

  public getContainerClasses(toast: ToastMessage): string {
    const exit = toast.closing ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100';
    switch (toast.tipo) {
      case 'success':
        return `${exit} bg-[#ECFDF5] border-[#6EE7B7] dark:bg-[#062E24] dark:border-[#10B981]/60`;
      case 'error':
        return `${exit} bg-[#FEF2F2] border-[#FCA5A5] dark:bg-[#310D16] dark:border-[#F43F5E]/60`;
      case 'warning':
        return `${exit} bg-[#FFFBEB] border-[#FCD34D] dark:bg-[#2E1F07] dark:border-[#F59E0B]/60`;
      case 'loading':
        return `${exit} bg-[#F0F8FC] border-[#98D5EE] dark:bg-[#0F3043] dark:border-[#4FB3DA]/65`;
      default:
        return `${exit} bg-[#E1F2FA] border-[#4FB3DA] dark:bg-[#0A2535] dark:border-[#4FB3DA]/65`;
    }
  }

  public getIconClasses(tipo: ToastMessage['tipo']): string {
    switch (tipo) {
      case 'success':
        return 'text-[#059669] dark:text-[#34D399]';
      case 'error':
        return 'text-[#DC2626] dark:text-[#FB7185]';
      case 'warning':
        return 'text-[#D97706] dark:text-[#FBBF24]';
      default:
        return 'text-[#1786B4] dark:text-[#4FB3DA]';
    }
  }

  public getTitleClasses(tipo: ToastMessage['tipo']): string {
    switch (tipo) {
      case 'success':
        return 'text-[#064E3B] dark:text-[#ECFDF5]';
      case 'error':
        return 'text-[#7F1D1D] dark:text-[#FFF1F2]';
      case 'warning':
        return 'text-[#78350F] dark:text-[#FFFBEB]';
      default:
        return 'text-[#04202E] dark:text-[#E1F2FA]';
    }
  }

  public getMessageClasses(tipo: ToastMessage['tipo']): string {
    switch (tipo) {
      case 'success':
        return 'text-[#065F46] dark:text-[#A7F3D0]';
      case 'error':
        return 'text-[#991B1B] dark:text-[#FECDD3]';
      case 'warning':
        return 'text-[#92400E] dark:text-[#FDE68A]';
      case 'loading':
        return 'text-[#0F5E83] dark:text-[#98D5EE]';
      default:
        return 'text-[#0A3C55] dark:text-[#98D5EE]';
    }
  }

  public getCloseClasses(tipo: ToastMessage['tipo']): string {
    switch (tipo) {
      case 'success':
        return 'text-[#065F46]/75 hover:text-[#064E3B] hover:bg-[#D1FAE5] dark:text-[#A7F3D0]/80 dark:hover:text-[#ECFDF5] dark:hover:bg-[#10B981]/20';
      case 'error':
        return 'text-[#991B1B]/75 hover:text-[#7F1D1D] hover:bg-[#FEE2E2] dark:text-[#FECDD3]/80 dark:hover:text-[#FFF1F2] dark:hover:bg-[#F43F5E]/20';
      case 'warning':
        return 'text-[#92400E]/75 hover:text-[#78350F] hover:bg-[#FEF3C7] dark:text-[#FDE68A]/80 dark:hover:text-[#FFFBEB] dark:hover:bg-[#F59E0B]/20';
      default:
        return 'text-[#0A3C55]/75 hover:text-[#04202E] hover:bg-[#98D5EE]/35 dark:text-[#98D5EE]/80 dark:hover:text-[#E1F2FA] dark:hover:bg-[#1D4960]';
    }
  }
}
