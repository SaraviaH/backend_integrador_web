import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderSaleItem } from '../../../../core/models/provider.model';
import { SuborderStatus } from '../../../../core/models/order.model';
import { CurrencySymbolPipe } from '../../../../shared/pipes/currency-symbol.pipe';

@Component({
  selector: 'app-provider-recent-sales',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencySymbolPipe],
  template: `
    <section class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
      
      <div class="p-6 border-b border-[#E1F2FA] dark:border-[#1D4960] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-sm sm:text-base font-bold text-[#04202E] dark:text-[#F2F9FC]">Ventas y Pedidos Recientes</h3>
          <p class="text-xs text-[#527588] dark:text-[#B8DFEF] mt-0.5">Subórdenes asignadas a tu centro de distribución</p>
        </div>
        <a
          routerLink="/panel/sales"
          class="text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:underline"
        >
          Ver todas las ventas →
        </a>
      </div>

      @if (sales.length === 0) {
        <div class="p-8 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
          No hay ventas registradas recientemente.
        </div>
      } @else {
        <div class="b2b-table-wrapper overflow-x-auto">
          <table class="b2b-table w-full min-w-[680px] text-left text-xs">
            <thead class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] font-extrabold uppercase text-[11px] tracking-wider border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3]">
              <tr>
                <th class="py-3.5 px-6">Suborden</th>
                <th class="py-3.5 px-4">Cliente / Empresa</th>
                <th class="py-3.5 px-4">Fecha</th>
                <th class="py-3.5 px-4">Estado</th>
                <th class="py-3.5 px-6 text-right">Total Suborden</th>
                <th class="py-3.5 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
              @for (sale of sales; track sale.subordenId) {
                <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                  <td class="py-3.5 px-6 font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA] whitespace-nowrap">
                    {{ sale.codigoOrden }}
                  </td>
                  <td class="py-3.5 px-4 font-medium text-[#04202E] dark:text-[#F2F9FC]">
                    {{ sale.clienteRazonSocial }}
                  </td>
                  <td class="py-3.5 px-4 text-[#527588] dark:text-[#B8DFEF] whitespace-nowrap">
                    {{ sale.fechaCreacion | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      [ngClass]="getStatusClasses(sale.estado)"
                    >
                      {{ formatStatus(sale.estado) }}
                    </span>
                  </td>
                  <td class="py-3.5 px-6 text-right font-mono font-bold text-[#04202E] dark:text-[#F2F9FC] whitespace-nowrap">
                    {{ sale.moneda | currencySymbol }} {{ sale.total | number:'1.2-2' }}
                  </td>
                  <td class="py-3.5 px-6 text-right whitespace-nowrap">
                    <a
                      [routerLink]="['/panel/sales', sale.subordenId]"
                      class="px-3 py-1.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0A2535] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] text-[#0A3C55] dark:text-[#E1F2FA] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] font-semibold text-xs transition-colors inline-block"
                    >
                      Gestionar
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

    </section>
  `
})
export class ProviderRecentSalesComponent {
  @Input() sales: ProviderSaleItem[] = [];

  public formatStatus(status: SuborderStatus): string {
    return status.replace(/_/g, ' ');
  }

  public getStatusClasses(status: SuborderStatus): string {
    switch (status) {
      case 'ENTREGADO':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'DESPACHADO':
        return 'bg-[#E1F2FA] dark:bg-[#0A2535] text-[#0F5E83] dark:text-[#98D5EE] border-[#98D5EE]/60 dark:border-[#1D4960]';
      case 'EN_PREPARACION':
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      case 'PENDIENTE_DESPACHO':
        return 'bg-[#F4F9FC] dark:bg-[#0A2535] text-[#04202E] dark:text-[#E1F2FA] border-[#CFE4EE] dark:border-[#1D4960]';
      case 'CANCELADO':
        return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      default:
        return 'bg-[#F4F9FC] dark:bg-[#0A2535] text-[#527588] dark:text-[#B8DFEF] border-[#CFE4EE] dark:border-[#1D4960]';
    }
  }
}
