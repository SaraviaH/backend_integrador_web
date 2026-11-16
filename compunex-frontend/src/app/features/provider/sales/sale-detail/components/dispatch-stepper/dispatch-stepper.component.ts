import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuborderStatus } from '../../../../../../core/models/order.model';

@Component({
  selector: 'app-dispatch-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Estado de Despacho y Logística</h2>
          <p class="text-xs text-slate-500 mt-0.5">Controla las etapas de atención de esta suborden corporativa</p>
        </div>

        <!-- Botones de Transición Rápida -->
        <div class="flex flex-wrap items-center gap-2">
          @if (currentStatus === 'PENDIENTE_DESPACHO') {
            <button
              type="button"
              [disabled]="isUpdating"
              (click)="advanceStatus('EN_PREPARACION')"
              class="px-3.5 py-2 bg-brand-primary hover:bg-brand-petrol disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {{ isUpdating ? 'Actualizando...' : 'Iniciar Preparación' }}
            </button>

            <button
              type="button"
              [disabled]="isUpdating"
              (click)="showCancelConfirm.set(true)"
              class="px-3.5 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar Suborden
            </button>
          } @else if (currentStatus === 'EN_PREPARACION') {
            <button
              type="button"
              [disabled]="isUpdating"
              (click)="advanceStatus('DESPACHADO')"
              class="px-3.5 py-2 bg-brand-primary hover:bg-brand-petrol disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              {{ isUpdating ? 'Actualizando...' : 'Marcar como Despachado' }}
            </button>

            <button
              type="button"
              [disabled]="isUpdating"
              (click)="showCancelConfirm.set(true)"
              class="px-3.5 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar Suborden
            </button>
          } @else if (currentStatus === 'DESPACHADO') {
            <button
              type="button"
              [disabled]="isUpdating"
              (click)="advanceStatus('ENTREGADO')"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isUpdating ? 'Actualizando...' : 'Confirmar Entrega' }}
            </button>
          } @else if (currentStatus === 'CANCELADO') {
            <span class="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              ✕ Suborden Cancelada
            </span>
          } @else {
            <span class="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              ✓ Proceso Completado
            </span>
          }
        </div>
      </div>

      <!-- Confirmación inline de cancelación -->
      @if (showCancelConfirm() && (currentStatus === 'PENDIENTE_DESPACHO' || currentStatus === 'EN_PREPARACION')) {
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p class="font-bold text-rose-900">¿Confirmar cancelación de esta suborden?</p>
            <p class="text-rose-700 mt-0.5">Esta acción marcará la suborden como CANCELADO y detendrá el flujo de despacho.</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              [disabled]="isUpdating"
              (click)="showCancelConfirm.set(false)"
              class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Mantener activa
            </button>
            <button
              type="button"
              [disabled]="isUpdating"
              (click)="confirmCancel()"
              class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold"
            >
              {{ isUpdating ? 'Cancelando...' : 'Sí, cancelar suborden' }}
            </button>
          </div>
        </div>
      }

      @if (currentStatus === 'CANCELADO') {
        <div class="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-800 flex items-center gap-3">
          <span class="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">✕</span>
          <p>
            Esta suborden fue marcada como <strong>CANCELADO</strong>. No admite nuevas transiciones logísticas.
          </p>
        </div>
      } @else {
        <!-- Stepper Visual de 4 Fases -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <!-- Fase 1 -->
          <div class="p-3.5 rounded-xl border transition-all"
            [class.bg-emerald-50]="isStepCompleted(1)"
            [class.border-emerald-200]="isStepCompleted(1)"
            [class.bg-amber-50]="isStepActive(1)"
            [class.border-amber-300]="isStepActive(1)"
            [class.bg-slate-50]="isStepPending(1)"
            [class.border-slate-200]="isStepPending(1)"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                [class.bg-emerald-600]="isStepCompleted(1)"
                [class.text-white]="isStepCompleted(1) || isStepActive(1)"
                [class.bg-amber-500]="isStepActive(1)"
                [class.bg-slate-200]="isStepPending(1)"
                [class.text-slate-600]="isStepPending(1)"
              >1</span>
              <span class="text-xs font-bold text-slate-800">Orden Recibida</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Almacén notificado y stock reservado</p>
          </div>

          <!-- Fase 2 -->
          <div class="p-3.5 rounded-xl border transition-all"
            [class.bg-emerald-50]="isStepCompleted(2)"
            [class.border-emerald-200]="isStepCompleted(2)"
            [class.bg-brand-tint]="isStepActive(2)"
            [class.border-brand-sky]="isStepActive(2)"
            [class.bg-slate-50]="isStepPending(2)"
            [class.border-slate-200]="isStepPending(2)"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                [class.bg-emerald-600]="isStepCompleted(2)"
                [class.text-white]="isStepCompleted(2) || isStepActive(2)"
                [class.bg-brand-primary]="isStepActive(2)"
                [class.bg-slate-200]="isStepPending(2)"
                [class.text-slate-600]="isStepPending(2)"
              >2</span>
              <span class="text-xs font-bold text-slate-800">En Preparación</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Picking, packing y embalaje para transporte</p>
          </div>

          <!-- Fase 3 -->
          <div class="p-3.5 rounded-xl border transition-all"
            [class.bg-emerald-50]="isStepCompleted(3)"
            [class.border-emerald-200]="isStepCompleted(3)"
            [class.bg-brand-tint]="isStepActive(3)"
            [class.border-brand-sky]="isStepActive(3)"
            [class.bg-slate-50]="isStepPending(3)"
            [class.border-slate-200]="isStepPending(3)"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                [class.bg-emerald-600]="isStepCompleted(3)"
                [class.text-white]="isStepCompleted(3) || isStepActive(3)"
                [class.bg-brand-primary]="isStepActive(3)"
                [class.bg-slate-200]="isStepPending(3)"
                [class.text-slate-600]="isStepPending(3)"
              >3</span>
              <span class="text-xs font-bold text-slate-800">En Tránsito</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">En ruta hacia la sede de la empresa</p>
          </div>

          <!-- Fase 4 -->
          <div class="p-3.5 rounded-xl border transition-all"
            [class.bg-emerald-50]="isStepCompleted(4) || isStepActive(4)"
            [class.border-emerald-300]="isStepActive(4)"
            [class.border-emerald-200]="isStepCompleted(4)"
            [class.bg-slate-50]="isStepPending(4)"
            [class.border-slate-200]="isStepPending(4)"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                [class.bg-emerald-600]="isStepCompleted(4) || isStepActive(4)"
                [class.text-white]="isStepCompleted(4) || isStepActive(4)"
                [class.bg-slate-200]="isStepPending(4)"
                [class.text-slate-600]="isStepPending(4)"
              >4</span>
              <span class="text-xs font-bold text-slate-800">Entregado</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-tight">Recepción confirmada en destino</p>
          </div>
        </div>
      }
    </div>
  `
})
export class DispatchStepperComponent {
  @Input({ required: true }) currentStatus: SuborderStatus = 'PENDIENTE_DESPACHO';
  @Input() isUpdating = false;
  @Output() statusUpdate = new EventEmitter<SuborderStatus>();

  public readonly showCancelConfirm = signal<boolean>(false);

  private getStepNumber(status: SuborderStatus): number {
    switch (status) {
      case 'PENDIENTE_DESPACHO': return 1;
      case 'EN_PREPARACION': return 2;
      case 'DESPACHADO': return 3;
      case 'ENTREGADO': return 4;
      default: return 0;
    }
  }

  public isStepCompleted(step: number): boolean {
    return this.getStepNumber(this.currentStatus) > step;
  }

  public isStepActive(step: number): boolean {
    return this.getStepNumber(this.currentStatus) === step;
  }

  public isStepPending(step: number): boolean {
    return this.getStepNumber(this.currentStatus) < step;
  }

  public advanceStatus(nextStatus: SuborderStatus): void {
    this.showCancelConfirm.set(false);
    this.statusUpdate.emit(nextStatus);
  }

  public confirmCancel(): void {
    this.showCancelConfirm.set(false);
    this.statusUpdate.emit('CANCELADO');
  }
}
