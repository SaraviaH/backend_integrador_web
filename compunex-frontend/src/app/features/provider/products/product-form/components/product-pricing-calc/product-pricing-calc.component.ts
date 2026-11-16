import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../../../../shared/pipes/currency-symbol.pipe';

@Component({
  selector: 'app-product-pricing-calc',
  standalone: true,
  imports: [CommonModule, CurrencySymbolPipe],
  template: `
    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
      <div class="flex items-center justify-between text-xs font-bold text-slate-800">
        <span class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Simulación de Precio y Facturación B2B
        </span>
        <span class="text-[10px] uppercase font-semibold text-slate-400">+ IGV 18%</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">Base imponible unit.</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">
            {{ moneda | currencySymbol }} {{ baseUnitario | number:'1.2-2' }}
          </p>
        </div>

        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">IGV 18% por unidad</p>
          <p class="text-sm font-black text-slate-800 mt-0.5">
            {{ moneda | currencySymbol }} {{ igvUnitario | number:'1.2-2' }}
          </p>
        </div>

        <div class="p-3 bg-white rounded-xl border border-slate-200/60">
          <p class="text-[10px] text-slate-400 font-bold uppercase">Total unit. c/ IGV</p>
          <p class="text-sm font-black text-brand-primary mt-0.5">
            {{ moneda | currencySymbol }} {{ totalUnitarioConIgv | number:'1.2-2' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>Contenido: {{ unidadesPorPaquete }} {{ unidadesPorPaquete === 1 ? 'unidad' : 'unidades' }} por caja.</span>
        <span>Total de caja (sin IGV): <strong class="text-slate-700">{{ moneda | currencySymbol }} {{ totalCaja | number:'1.2-2' }}</strong></span>
      </div>

      <p class="text-[11px] text-slate-500">
        El carrito y el checkout toman el precio unitario base y suman el 18% de IGV al emitir el comprobante.
      </p>
    </div>
  `
})
export class ProductPricingCalcComponent {
  @Input() precioUnitario = 0;
  @Input() precioTotalCaja?: number;
  @Input() unidadesPorPaquete = 1;
  @Input() moneda = 'PEN';

  public get baseUnitario(): number {
    if (!this.precioUnitario || this.precioUnitario <= 0) return 0;
    return Math.round(Number(this.precioUnitario) * 100) / 100;
  }

  public get igvUnitario(): number {
    return Math.round(this.baseUnitario * 0.18 * 100) / 100;
  }

  public get totalUnitarioConIgv(): number {
    return Math.round((this.baseUnitario + this.igvUnitario) * 100) / 100;
  }

  public get totalCaja(): number {
    if (this.precioTotalCaja && this.precioTotalCaja > 0) return Number(this.precioTotalCaja);
    return Math.round(this.baseUnitario * Math.max(1, this.unidadesPorPaquete || 1) * 100) / 100;
  }
}
