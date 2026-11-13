import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProviderCartGroup, CartItem } from '../../../core/models/order.model';

@Component({
  selector: 'app-cart-group-item',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
      
      <!-- Encabezado del Grupo por Proveedor (Split Order) -->
      <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-[#1E50C0] font-bold text-sm flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Despacho Proveedor</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E50C0] border border-blue-100">
                Suborden Independiente
              </span>
            </div>
            <h3 class="text-sm font-bold text-[#142238]">{{ group.proveedorRazonSocial }}</h3>
          </div>
        </div>

        <div class="text-left sm:text-right">
          <span class="text-[11px] text-slate-400 block">Subtotal Proveedor (con IGV)</span>
          <span class="text-sm font-black text-[#1E50C0]">S/ {{ group.total | number:'1.2-2' }}</span>
        </div>
      </div>

      <!-- Lista de Ítems del Proveedor -->
      <div class="divide-y divide-slate-100">
        @for (item of group.items; track item.productoId) {
          <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            
            <!-- Foto y Nombre del Producto -->
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <a [routerLink]="['/catalog', item.productoId]" class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 shrink-0 overflow-hidden block">
                <img
                  [src]="item.imagenUrl"
                  [alt]="item.nombre"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </a>

              <div class="min-w-0 flex-1 space-y-1">
                <span class="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded inline-block">
                  SKU: {{ item.sku }}
                </span>
                <a [routerLink]="['/catalog', item.productoId]" class="block text-xs sm:text-sm font-bold text-[#142238] hover:text-[#2456C6] transition-colors truncate">
                  {{ item.nombre }}
                </a>
                <div class="text-[11px] text-slate-500">
                  Precio mayorista unitario: <strong class="text-slate-700">S/ {{ item.precioUnitario | number:'1.2-2' }}</strong>
                  <span class="text-slate-400 font-normal"> (sin IGV)</span>
                </div>
              </div>
            </div>

            <!-- Cantidad, Subtotal y Acción de Eliminar -->
            <div class="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              
              <!-- Control de Cantidad (+ / -) -->
              <div class="inline-flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-2xs">
                <button
                  type="button"
                  (click)="onDecrease(item)"
                  [disabled]="item.cantidad <= 1"
                  class="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                  title="Disminuir cantidad"
                >
                  −
                </button>
                <input
                  type="number"
                  [ngModel]="item.cantidad"
                  (ngModelChange)="onQuantityChange(item, $event)"
                  [min]="1"
                  [max]="item.stockDisponible"
                  class="w-12 text-center text-xs font-bold text-[#142238] bg-transparent outline-none"
                />
                <button
                  type="button"
                  (click)="onIncrease(item)"
                  [disabled]="item.cantidad >= item.stockDisponible"
                  class="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-sm shadow-xs transition-colors"
                  title="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <!-- Subtotal del Ítem -->
              <div class="text-right min-w-24">
                <span class="text-[10px] text-slate-400 block">Subtotal</span>
                <span class="text-sm font-black text-[#142238]">S/ {{ item.subtotal | number:'1.2-2' }}</span>
              </div>

              <!-- Botón Eliminar Ítem -->
              <button
                type="button"
                (click)="onRemove(item.productoId)"
                class="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center"
                title="Eliminar producto del pedido"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

            </div>

          </div>
        }
      </div>

    </div>
  `
})
export class CartGroupItemComponent {
  @Input({ required: true }) group!: ProviderCartGroup;
  @Output() updateQty = new EventEmitter<{ productoId: number; cantidad: number }>();
  @Output() removeItem = new EventEmitter<number>();

  public onIncrease(item: CartItem): void {
    if (item.cantidad < item.stockDisponible) {
      this.updateQty.emit({ productoId: item.productoId, cantidad: item.cantidad + 1 });
    }
  }

  public onDecrease(item: CartItem): void {
    if (item.cantidad > 1) {
      this.updateQty.emit({ productoId: item.productoId, cantidad: item.cantidad - 1 });
    }
  }

  public onQuantityChange(item: CartItem, val: number): void {
    const qty = Math.max(1, Math.min(val || 1, item.stockDisponible));
    this.updateQty.emit({ productoId: item.productoId, cantidad: qty });
  }

  public onRemove(productoId: number): void {
    this.removeItem.emit(productoId);
  }
}
