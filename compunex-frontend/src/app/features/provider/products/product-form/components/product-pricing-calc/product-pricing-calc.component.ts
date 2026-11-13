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
          Simulador Fiscal SUNAT & Escala B2B
        </span>
        <span class="text-[10px] uppercase font-semibold text-slate-400">Tasa IGV: 18%</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">Subtotal (Base Imponible)</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">
            S/ {{ subtotalSinIgv | number:'1.2-2' }}
          </p>
        </div>

        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">IGV 18% (SUNAT)</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">
            S/ {{ igvMonto | number:'1.2-2' }}
          </p>
        </div>

        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">Descuento por Volumen</p>
          <p class="text-sm font-black text-emerald-600 mt-0.5">
            @if (descuentoPorcentaje > 0) {
              -{{ descuentoPorcentaje | number:'1.1-1' }}%
            } @else {
              0%
            }
          </p>
        </div>
      </div>

      @if (descuentoPorcentaje > 0 && precioMayorista && cantidadMinima) {
        <p class="text-[11px] text-emerald-700 font-medium">
          ✓ Los compradores mayoristas obtendrán un precio preferencial de S/ {{ precioMayorista | number:'1.2-2' }} llevando un mínimo de {{ cantidadMinima }} unidades.
        </p>
      }
    </div>
  `
})
export class ProductPricingCalcComponent {
  @Input() precioUnitario = 0;
  @Input() precioMayorista?: number;
  @Input() cantidadMinima?: number;

  public get subtotalSinIgv(): number {
    if (!this.precioUnitario || this.precioUnitario <= 0) return 0;
    return this.precioUnitario / 1.18;
  }

  public get igvMonto(): number {
    return this.precioUnitario - this.subtotalSinIgv;
  }

  public get descuentoPorcentaje(): number {
    if (!this.precioUnitario || !this.precioMayorista || this.precioUnitario <= 0) return 0;
    if (this.precioMayorista >= this.precioUnitario) return 0;
    return ((this.precioUnitario - this.precioMayorista) / this.precioUnitario) * 100;
  }
}
