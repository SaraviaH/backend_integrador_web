import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuborderStatus } from '../../../../../../core/models/order.model';

@Component({
  selector: 'app-dispatch-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Estado de Despacho y Logística</h2>
          <p class="text-xs text-slate-500 mt-0.5">Controla las etapas de atención de esta suborden corporativa</p>
        </div>

        <!-- Botones de Transición Rápida -->
        <div class="flex items-center gap-2">
          @if (currentStatus === 'PENDIENTE_DESPACHO') {
            <button
              type="button"
              (click)="advanceStatus('EN_PREPARACION')"
              class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Iniciar Preparación
            </button>
          } @else if (currentStatus === 'EN_PREPARACION') {
            <button
              type="button"
              (click)="advanceStatus('DESPACHADO')"
              class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              Marcar como Despachado
            </button>
          } @else if (currentStatus === 'DESPACHADO') {
            <button
              type="button"
              (click)="advanceStatus('ENTREGADO')"
              class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Confirmar Entrega
            </button>
          } @else {
            <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              ✓ Proceso Completado
            </span>
          }
        </div>
      </div>

      <!-- Stepper Visual de 4 Fases -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        <!-- Fase 1: Recepción / Pendiente -->
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
              [class.text-white]="isStepCompleted(1)"
              [class.bg-amber-500]="isStepActive(1)"
              [class.text-white]="isStepActive(1)"
              [class.bg-slate-200]="isStepPending(1)"
              [class.text-slate-600]="isStepPending(1)"
            >1</span>
            <span class="text-xs font-bold text-slate-800">Orden Recibida</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-tight">Almacén notificado y stock reservado</p>
        </div>

        <!-- Fase 2: Preparación -->
        <div class="p-3.5 rounded-xl border transition-all"
          [class.bg-emerald-50]="isStepCompleted(2)"
          [class.border-emerald-200]="isStepCompleted(2)"
          [class.bg-indigo-50]="isStepActive(2)"
          [class.border-indigo-300]="isStepActive(2)"
          [class.bg-slate-50]="isStepPending(2)"
          [class.border-slate-200]="isStepPending(2)"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              [class.bg-emerald-600]="isStepCompleted(2)"
              [class.text-white]="isStepCompleted(2)"
              [class.bg-indigo-600]="isStepActive(2)"
              [class.text-white]="isStepActive(2)"
              [class.bg-slate-200]="isStepPending(2)"
              [class.text-slate-600]="isStepPending(2)"
            >2</span>
            <span class="text-xs font-bold text-slate-800">En Preparación</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-tight">Picking, packing y embalaje para transporte</p>
        </div>

        <!-- Fase 3: Despachado -->
        <div class="p-3.5 rounded-xl border transition-all"
          [class.bg-emerald-50]="isStepCompleted(3)"
          [class.border-emerald-200]="isStepCompleted(3)"
          [class.bg-blue-50]="isStepActive(3)"
          [class.border-blue-300]="isStepActive(3)"
          [class.bg-slate-50]="isStepPending(3)"
          [class.border-slate-200]="isStepPending(3)"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              [class.bg-emerald-600]="isStepCompleted(3)"
              [class.text-white]="isStepCompleted(3)"
              [class.bg-blue-600]="isStepActive(3)"
              [class.text-white]="isStepActive(3)"
              [class.bg-slate-200]="isStepPending(3)"
              [class.text-slate-600]="isStepPending(3)"
            >3</span>
            <span class="text-xs font-bold text-slate-800">En Tránsito</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-tight">En ruta hacia la sede de la empresa</p>
        </div>

        <!-- Fase 4: Entregado -->
        <div class="p-3.5 rounded-xl border transition-all"
          [class.bg-emerald-50]="isStepCompleted(4)"
          [class.border-emerald-200]="isStepCompleted(4)"
          [class.bg-emerald-50]="isStepActive(4)"
          [class.border-emerald-300]="isStepActive(4)"
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
          <p class="text-[11px] text-slate-500 leading-tight">Recepción confirmada con guía de remisión</p>
        </div>
      </div>
    </div>
  `
})
export class DispatchStepperComponent {
  @Input({ required: true }) currentStatus: SuborderStatus = 'PENDIENTE_DESPACHO';
  @Output() statusUpdate = new EventEmitter<SuborderStatus>();

  private getStepNumber(status: SuborderStatus): number {
    switch (status) {
      case 'PENDIENTE_DESPACHO': return 1;
      case 'EN_PREPARACION': return 2;
      case 'DESPACHADO': return 3;
      case 'ENTREGADO': return 4;
      default: return 1;
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
    this.statusUpdate.emit(nextStatus);
  }
}
