import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastStateService, ToastMessage } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 transform transition-all duration-300 animate-slide-in"
          [ngClass]="getContainerClasses(toast.tipo)"
        >
          <div class="shrink-0 mt-0.5">
            @switch (toast.tipo) {
              @case ('success') {
                <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('error') {
                <svg class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              @case ('warning') {
                <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              @default {
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            }
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-slate-900 leading-tight">{{ toast.titulo }}</h4>
            <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">{{ toast.mensaje }}</p>
          </div>
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  public readonly toastService = inject(ToastStateService);

  getContainerClasses(tipo: ToastMessage['tipo']): string {
    switch (tipo) {
      case 'success':
        return 'bg-emerald-50/95 border-emerald-200 text-emerald-900';
      case 'error':
        return 'bg-rose-50/95 border-rose-200 text-rose-900';
      case 'warning':
        return 'bg-amber-50/95 border-amber-200 text-amber-900';
      default:
        return 'bg-blue-50/95 border-blue-200 text-blue-900';
    }
  }
}
