import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderSaleItem } from '../../../../../../core/models/provider.model';
import { CurrencySymbolPipe } from '../../../../../../shared/pipes/currency-symbol.pipe';

@Component({
  selector: 'app-sales-table',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencySymbolPipe],
  template: `
    <div class="b2b-table-wrapper overflow-x-auto">
      <table class="b2b-table w-full min-w-[760px] text-left border-collapse">
        <thead>
          <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
            <th class="py-3.5 px-4">Suborden B2B</th>
            <th class="py-3.5 px-4">Empresa Compradora</th>
            <th class="py-3.5 px-4">Fecha & Comprobante</th>
            <th class="py-3.5 px-4 text-right">Total Liquidado</th>
            <th class="py-3.5 px-4 text-center">Estado Despacho</th>
            <th class="py-3.5 px-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960] text-xs">
          @for (sale of sales; track sale.subordenId) {
            <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
              <td class="py-3.5 px-4 whitespace-nowrap">
                <a
                  [routerLink]="['/panel/sales', sale.subordenId]"
                  class="font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:underline"
                >
                  SUB-{{ sale.subordenId }}
                </a>
                <p class="text-[10px] text-[#527588] dark:text-[#98D5EE] mt-0.5">Orden: {{ sale.codigoOrden }}</p>
              </td>

              <td class="py-3.5 px-4">
                <p class="font-bold text-[#04202E] dark:text-[#F2F9FC] line-clamp-1">{{ sale.clienteRazonSocial }}</p>
                <p class="text-[10px] text-[#527588] dark:text-[#B8DFEF] font-mono mt-0.5">RUC: {{ sale.clienteRuc }}</p>
              </td>

              <td class="py-3.5 px-4 text-[#527588] dark:text-[#B8DFEF] whitespace-nowrap">
                <p>{{ sale.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</p>
                @if (sale.numeroFacturaSimulada) {
                  <span class="inline-block mt-0.5 font-mono text-[10px] text-[#0F5E83] dark:text-[#98D5EE] bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE]/50 dark:border-[#1D4960] px-1.5 py-0.5 rounded">
                    {{ sale.numeroFacturaSimulada }}
                  </span>
                }
              </td>

              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <p class="font-black text-[#04202E] dark:text-[#F2F9FC] font-mono text-sm">
                  {{ sale.moneda | currencySymbol }} {{ sale.total | number:'1.2-2' }}
                </p>
                <p class="text-[10px] text-[#527588] dark:text-[#98D5EE]">IGV: {{ sale.moneda | currencySymbol }} {{ sale.igv | number:'1.2-2' }}</p>
              </td>

              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                @switch (sale.estado) {
                  @case ('PENDIENTE_DESPACHO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Pendiente Despacho
                    </span>
                  }
                  @case ('EN_PREPARACION') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E1F2FA] dark:bg-[#0A2535] text-[#0F5E83] dark:text-[#98D5EE] border border-[#98D5EE]/60 dark:border-[#1D4960]">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#1786B4] dark:bg-[#4FB3DA]"></span>
                      En Preparación
                    </span>
                  }
                  @case ('DESPACHADO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F9FC] dark:bg-[#0A2535] text-[#04202E] dark:text-[#E1F2FA] border border-[#CFE4EE] dark:border-[#1D4960]">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#04202E] dark:bg-[#4FB3DA]"></span>
                      Despachado
                    </span>
                  }
                  @case ('ENTREGADO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Entregado
                    </span>
                  }
                  @case ('CANCELADO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Cancelado
                    </span>
                  }
                  @default {
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F9FC] dark:bg-[#0A2535] text-[#527588] dark:text-[#B8DFEF] border border-[#CFE4EE] dark:border-[#1D4960]">
                      {{ sale.estado }}
                    </span>
                  }
                }
              </td>

              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <a
                  [routerLink]="['/panel/sales', sale.subordenId]"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE]/50 dark:border-[#1D4960] hover:bg-[#1786B4] dark:hover:bg-[#1786B4] hover:text-white dark:hover:text-white transition-all shadow-sm"
                >
                  <span>Atender</span>
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class SalesTableComponent {
  @Input() sales: ProviderSaleItem[] = [];
}
