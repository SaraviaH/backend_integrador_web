import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderSaleItem } from '../../../../../../core/models/provider.model';

@Component({
  selector: 'app-sales-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th class="py-3 px-4">Suborden B2B</th>
            <th class="py-3 px-4">Empresa Compradora</th>
            <th class="py-3 px-4">Fecha & Factura</th>
            <th class="py-3 px-4 text-center">Ítems</th>
            <th class="py-3 px-4 text-right">Total Liquidado</th>
            <th class="py-3 px-4 text-center">Estado Despacho</th>
            <th class="py-3 px-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs">
          @for (sale of sales; track sale.subordenId) {
            <tr class="hover:bg-slate-50/70 transition-colors">
              <!-- Código de Suborden -->
              <td class="py-3.5 px-4">
                <a
                  [routerLink]="['/panel/sales', sale.subordenId]"
                  class="font-mono font-bold text-brand-primary hover:underline"
                >
                  SUB-{{ sale.subordenId }}
                </a>
                <p class="text-[10px] text-slate-400 mt-0.5">Orden: {{ sale.codigoOrden }}</p>
              </td>

              <!-- Empresa Compradora -->
              <td class="py-3.5 px-4">
                <p class="font-bold text-slate-800 line-clamp-1">{{ sale.clienteRazonSocial }}</p>
                <p class="text-[10px] text-slate-500 font-mono mt-0.5">RUC: {{ sale.clienteRuc }}</p>
              </td>

              <!-- Fecha y Factura Simulada -->
              <td class="py-3.5 px-4 text-slate-600">
                <p>{{ sale.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</p>
                @if (sale.numeroFacturaSimulada) {
                  <span class="inline-block mt-0.5 font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {{ sale.numeroFacturaSimulada }}
                  </span>
                }
              </td>

              <!-- Ítems -->
              <td class="py-3.5 px-4 text-center">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {{ sale.items.length }} prod.
                </span>
              </td>

              <!-- Total Liquidado -->
              <td class="py-3.5 px-4 text-right">
                <p class="font-black text-slate-900 text-sm">
                  S/ {{ sale.total | number:'1.2-2' }}
                </p>
                <p class="text-[10px] text-slate-400">IGV: S/ {{ sale.igv | number:'1.2-2' }}</p>
              </td>

              <!-- Estado de Despacho -->
              <td class="py-3.5 px-4 text-center">
                @switch (sale.estado) {
                  @case ('PENDIENTE_DESPACHO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pendiente Despacho
                    </span>
                  }
                  @case ('EN_PREPARACION') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      En Preparación
                    </span>
                  }
                  @case ('DESPACHADO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Despachado
                    </span>
                  }
                  @case ('ENTREGADO') {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Entregado
                    </span>
                  }
                  @default {
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {{ sale.estado }}
                    </span>
                  }
                }
              </td>

              <!-- Acción -->
              <td class="py-3.5 px-4 text-right">
                <a
                  [routerLink]="['/panel/sales', sale.subordenId]"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all shadow-2xs"
                >
                  <span>Atender</span>
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
