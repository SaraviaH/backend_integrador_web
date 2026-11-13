import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderProductItem } from '../../../../../../core/models/provider.model';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th class="py-3 px-4">Hardware / Ítem</th>
            <th class="py-3 px-4">Categoría</th>
            <th class="py-3 px-4 text-right">Precio Unitario</th>
            <th class="py-3 px-4 text-center">Stock B2B</th>
            <th class="py-3 px-4 text-center">Estado</th>
            <th class="py-3 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs">
          @for (prod of products; track prod.id) {
            <tr class="hover:bg-slate-50/70 transition-colors">
              <!-- Nombre y SKU -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    @if (prod.imagenUrl) {
                      <img [src]="prod.imagenUrl" [alt]="prod.nombre" class="w-full h-full object-contain" />
                    } @else {
                      <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    }
                  </div>
                  <div class="min-w-0">
                    <a [routerLink]="['/panel/products', prod.id]" class="font-bold text-slate-800 hover:text-brand-primary line-clamp-1 transition-colors">
                      {{ prod.nombre }}
                    </a>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        SKU: {{ prod.sku }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Categoría -->
              <td class="py-3.5 px-4 text-slate-600">
                <span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                  {{ prod.categoriaNombre }}
                </span>
              </td>

              <!-- Precios -->
              <td class="py-3.5 px-4 text-right">
                <p class="font-bold text-slate-900 text-sm">
                  S/ {{ prod.precioUnitario | number:'1.2-2' }}
                </p>
                @if (prod.precioMayorista) {
                  <p class="text-[10px] text-emerald-600 font-semibold">
                    Mayorista: S/ {{ prod.precioMayorista | number:'1.2-2' }} (≥ {{ prod.cantidadMinimaMayorista || 5 }})
                  </p>
                }
              </td>

              <!-- Stock B2B -->
              <td class="py-3.5 px-4 text-center">
                @if (prod.stock <= 0) {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Agotado
                  </span>
                } @else if (prod.stock <= 5) {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {{ prod.stock }} unid. (Bajo)
                  </span>
                } @else {
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {{ prod.stock }} unid.
                  </span>
                }
              </td>

              <!-- Estado -->
              <td class="py-3.5 px-4 text-center">
                @if (prod.activo) {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Activo
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Pausado
                  </span>
                }
              </td>

              <!-- Acciones -->
              <td class="py-3.5 px-4 text-right">
                <div class="inline-flex items-center gap-1">
                  <!-- Ver Detalle -->
                  <a
                    [routerLink]="['/panel/products', prod.id]"
                    title="Ver Detalle"
                    class="p-1.5 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
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
                    class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>

                  <!-- Pausar / Activar -->
                  <button
                    type="button"
                    (click)="onToggleStatus(prod)"
                    [title]="prod.activo ? 'Pausar publicación' : 'Activar publicación'"
                    class="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <!-- Eliminar -->
                  <button
                    type="button"
                    (click)="onDelete(prod)"
                    title="Retirar producto"
                    class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  @Output() toggleStatus = new EventEmitter<ProviderProductItem>();
  @Output() deleteProduct = new EventEmitter<ProviderProductItem>();

  public onToggleStatus(item: ProviderProductItem): void {
    this.toggleStatus.emit(item);
  }

  public onDelete(item: ProviderProductItem): void {
    this.deleteProduct.emit(item);
  }
}
