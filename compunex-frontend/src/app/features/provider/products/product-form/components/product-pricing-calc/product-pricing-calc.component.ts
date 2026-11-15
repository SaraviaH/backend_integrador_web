import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-pricing-calc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      <div class="flex items-center justify-between text-xs font-bold text-slate-800">
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Precio unitario y caja
        </span>
        <span class="text-[10px] uppercase font-semibold text-slate-400">IGV 18%</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">Precio unitario</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">
            S/ {{ precioUnitario | number:'1.2-2' }}
          </p>
        </div>

        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">IGV por unidad</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">
            S/ {{ igvUnitario | number:'1.2-2' }}
          </p>
        </div>

        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">Total de caja</p>
          <p class="text-sm font-black text-brand-primary mt-0.5">
            S/ {{ totalCaja | number:'1.2-2' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>Contenido: {{ unidadesPorPaquete }} {{ unidadesPorPaquete === 1 ? 'unidad' : 'unidades' }} por caja.</span>
        <span>Base imponible unitaria: S/ {{ subtotalUnitario | number:'1.2-2' }}</span>
      </div>

      <p class="text-[11px] text-slate-500">
        El carrito y el checkout aplican el precio unitario. El total de caja es informativo para compras por paquete completo.
      </p>
    </div>
  `
})
export class ProductPricingCalcComponent {
  @Input() precioUnitario = 0;
  @Input() precioTotalCaja?: number;
  @Input() unidadesPorPaquete = 1;

  public get subtotalUnitario(): number {
    if (!this.precioUnitario || this.precioUnitario <= 0) return 0;
    return this.precioUnitario / 1.18;
  }

  public get igvUnitario(): number {
    return this.precioUnitario - this.subtotalUnitario;
  }

  public get totalCaja(): number {
    if (this.precioTotalCaja && this.precioTotalCaja > 0) return this.precioTotalCaja;
    return Math.round(this.precioUnitario * Math.max(1, this.unidadesPorPaquete || 1) * 100) / 100;
  }
}
