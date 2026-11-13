import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderSaleItem } from '../../../../../../core/models/provider.model';

@Component({
  selector: 'app-sale-client-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
      <h2 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
        <span>Datos del Comprador Corporativo</span>
        <span class="font-mono text-[10px] text-slate-400 font-normal">RUC SUNAT</span>
      </h2>

      <div class="space-y-3 text-xs">
        <div>
          <span class="text-slate-400 block text-[11px] font-semibold">Razón Social</span>
          <span class="font-bold text-slate-900 text-sm">{{ sale.clienteRazonSocial }}</span>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span class="text-slate-400 block text-[11px] font-semibold">Número de RUC</span>
            <span class="font-mono font-bold text-slate-800">{{ sale.clienteRuc }}</span>
          </div>

          <div>
            <span class="text-slate-400 block text-[11px] font-semibold">Factura SUNAT</span>
            <span class="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
              {{ sale.numeroFacturaSimulada || 'Pendiente' }}
            </span>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
          <div class="flex items-center justify-between text-slate-500">
            <span>Base Imponible (Sin IGV):</span>
            <span class="font-semibold text-slate-800">S/ {{ sale.subtotal | number:'1.2-2' }}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500">
            <span>IGV Liquidado (18%):</span>
            <span class="font-semibold text-slate-800">S/ {{ sale.igv | number:'1.2-2' }}</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-sm font-black text-slate-900">
            <span>Total Suborden:</span>
            <span class="text-brand-primary">S/ {{ sale.total | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SaleClientCardComponent {
  @Input({ required: true }) sale!: ProviderSaleItem;
}
