import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderSaleItem } from '../../../../core/models/provider.model';
import { SuborderStatus } from '../../../../core/models/order.model';

@Component({
  selector: 'app-provider-recent-sales',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
      
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-sm sm:text-base font-bold text-[#142238]">Ventas y Pedidos Recientes</h3>
          <p class="text-xs text-slate-500 mt-0.5">Subórdenes asignadas a tu centro de distribución</p>
        </div>
        <a
          routerLink="/panel/ventas"
          class="text-xs font-bold text-[#1E50C0] hover:underline"
        >
          Ver todas las ventas →
        </a>
      </div>

      @if (sales.length === 0) {
        <div class="p-8 text-center text-xs text-slate-400">
          No hay ventas registradas recientemente.
        </div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th class="py-3 px-6">Suborden</th>
                <th class="py-3 px-4">Cliente / Empresa</th>
                <th class="py-3 px-4">Fecha</th>
                <th class="py-3 px-4">Estado</th>
                <th class="py-3 px-6 text-right">Total Suborden</th>
                <th class="py-3 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (sale of sales; track sale.subordenId) {
                <tr class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3.5 px-6 font-mono font-bold text-[#1E50C0]">
                    {{ sale.codigoOrden }}
                  </td>
                  <td class="py-3.5 px-4 font-medium text-slate-800">
                    {{ sale.clienteRazonSocial }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-500">
                    {{ sale.fechaCreacion | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span
                      class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      [ngClass]="getStatusClasses(sale.estado)"
                    >
                      {{ sale.estado }}
                    </span>
                  </td>
                  <td class="py-3.5 px-6 text-right font-mono font-bold text-[#142238]">
                    S/ {{ sale.total | number:'1.2-2' }}
                  </td>
                  <td class="py-3.5 px-6 text-right">
                    <a
                      [routerLink]="['/panel/ventas', sale.subordenId]"
                      class="px-3 py-1 rounded-xl border border-slate-200 hover:border-[#1E50C0] text-slate-700 hover:text-[#1E50C0] font-semibold text-xs transition-colors inline-block"
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

    </div>
  `
})
export class ProviderRecentSalesComponent {
  @Input() sales: ProviderSaleItem[] = [];

  public getStatusClasses(status: SuborderStatus): string {
    switch (status) {
      case 'ENTREGADO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DESPACHADO':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'EN_PREPARACION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PENDIENTE_DESPACHO':
        return 'bg-blue-50 text-[#1E50C0] border-blue-200';
      case 'ANULADO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }
}
