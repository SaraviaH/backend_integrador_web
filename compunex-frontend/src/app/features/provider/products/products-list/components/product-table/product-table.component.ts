import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderProductItem } from '../../../../../../core/models/provider.model';
import { CurrencySymbolPipe } from '../../../../../../shared/pipes/currency-symbol.pipe';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencySymbolPipe],
  template: `
    <div class="b2b-table-wrapper overflow-x-auto">
      <table class="b2b-table w-full min-w-[780px] text-left border-collapse">
        <thead>
          <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
            <th class="py-3.5 px-4">Hardware / Ítem</th>
            <th class="py-3.5 px-4">Categoría</th>
            <th class="py-3.5 px-4 text-right">Precio Unitario</th>
            <th class="py-3.5 px-4 text-center">Stock B2B</th>
            <th class="py-3.5 px-4 text-center">Estado</th>
            <th class="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960] text-xs">
          @for (prod of products; track prod.id) {
            <tr
              class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors"
              [class.is-selected]="isBusy(prod.id)"
              [attr.aria-selected]="isBusy(prod.id) ? 'true' : null"
            >
              <!-- Nombre y SKU -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shrink-0 flex items-center justify-center p-1">
                    @if (prod.imagenUrl) {
                      <img [src]="prod.imagenUrl" [alt]="prod.nombre" class="w-full h-full object-contain" />
                    } @else {
                      <svg class="w-5 h-5 text-[#527588] dark:text-[#98D5EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    }
                  </div>
                  <div class="min-w-0">
                    <a [routerLink]="['/panel/products', prod.id]" class="font-bold text-[#04202E] dark:text-[#F2F9FC] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] line-clamp-1 transition-colors">
                      {{ prod.nombre }}
                    </a>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-mono text-[10px] text-[#0A3C55] dark:text-[#B8DFEF] bg-[#E1F2FA]/70 dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] px-1.5 py-0.5 rounded">
                        SKU: {{ prod.sku }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Categoría -->
              <td class="py-3.5 px-4 text-[#527588] dark:text-[#B8DFEF]">
                <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E1F2FA]/80 dark:bg-[#0A2535] text-[#0F5E83] dark:text-[#98D5EE] border border-[#98D5EE]/50 dark:border-[#1D4960] whitespace-nowrap">
                  {{ prod.categoriaNombre }}
                </span>
              </td>

              <!-- Precios -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <p class="font-bold text-[#04202E] dark:text-[#F2F9FC] font-mono text-sm">
                  {{ prod.moneda | currencySymbol }} {{ prod.precioUnitario | number:'1.2-2' }}
                </p>
                @if (prod.precioTotalCaja) {
                  <p class="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">
                    Caja: {{ prod.moneda | currencySymbol }} {{ prod.precioTotalCaja | number:'1.2-2' }}
                  </p>
                  <p class="text-[10px] text-[#527588] dark:text-[#98D5EE]/85">
                    {{ prod.unidadesPorPaqueteTexto || '1 unidad' }} por paquete
                  </p>
                }
              </td>

              <!-- Stock Referencial B2B -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                @if (prod.stock == null) {
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4F9FC] dark:bg-[#0A2535] text-[#527588] dark:text-[#B8DFEF] border border-[#CFE4EE] dark:border-[#1D4960]">
                    No especificado
                  </span>
                } @else if (prod.stock <= 0) {
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                    Agotado
                  </span>
                } @else if (prod.stock <= 5) {
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    {{ prod.stock }} unid. (Bajo)
                  </span>
                } @else {
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    {{ prod.stock }} unid.
                  </span>
                }
              </td>

              <!-- Estado -->
              <td class="py-3.5 px-4 text-center whitespace-nowrap">
                @if (prod.activo) {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Activo
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F4F9FC] dark:bg-[#0A2535] text-[#527588] dark:text-[#B8DFEF] border border-[#CFE4EE] dark:border-[#1D4960]">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Pausado
                  </span>
                }
              </td>

              <!-- Acciones -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1">
                  <!-- Ver Detalle -->
                  <a
                    [routerLink]="['/panel/products', prod.id]"
                    title="Ver Detalle"
                    aria-label="Ver detalle del producto"
                    class="p-1.5 text-[#527588] dark:text-[#B8DFEF] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] hover:bg-[#E1F2FA]/70 dark:hover:bg-[#1786B4]/20 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>

                  <!-- Editar -->
                  <a
                    [routerLink]="['/panel/products', prod.id, 'edit']"
                    title="Editar Producto"
                    aria-label="Editar producto"
                    class="p-1.5 text-[#527588] dark:text-[#B8DFEF] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] hover:bg-[#E1F2FA]/70 dark:hover:bg-[#1786B4]/20 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>

                  <!-- Pausar / Activar -->
                  <button
                    type="button"
                    (click)="onToggleStatus(prod)"
                    [disabled]="isBusy(prod.id)"
                    [title]="isBusy(prod.id) ? 'Actualizando estado...' : (prod.activo ? 'Pausar publicación' : 'Activar publicación')"
                    class="p-1.5 text-[#527588] dark:text-[#B8DFEF] hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 disabled:opacity-45 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                  >
                    @if (isBusy(prod.id)) {
                      <svg class="animate-spin w-4 h-4 text-[#1786B4] dark:text-[#4FB3DA]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    } @else {
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  </button>

                  <!-- Eliminar -->
                  <button
                    type="button"
                    (click)="onDelete(prod)"
                    [disabled]="isBusy(prod.id)"
                    title="Retirar producto"
                    class="p-1.5 text-[#527588] dark:text-[#B8DFEF] hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-45 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ProductTableComponent {
  @Input() products: ProviderProductItem[] = [];
  @Input() busyProductIds: ReadonlySet<number> = new Set<number>();
  @Output() toggleStatus = new EventEmitter<ProviderProductItem>();
  @Output() deleteProduct = new EventEmitter<ProviderProductItem>();

  public isBusy(id: number): boolean {
    return this.busyProductIds.has(id);
  }

  public onToggleStatus(item: ProviderProductItem): void {
    if (this.isBusy(item.id)) return;
    this.toggleStatus.emit(item);
  }

  public onDelete(item: ProviderProductItem): void {
    if (this.isBusy(item.id)) return;
    this.deleteProduct.emit(item);
  }
}
