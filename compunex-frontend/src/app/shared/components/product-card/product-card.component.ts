import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../../core/models/catalog.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all group h-full">
      
      <!-- Parte Superior: Imagen, Nombre, Proveedor -->
      <div>
        <!-- Imagen del Producto -->
        <a [routerLink]="['/catalog', product.id]" class="block aspect-square rounded-xl bg-slate-50/60 p-4 mb-4 overflow-hidden relative">
          <img
            [src]="product.imagenPrincipalUrl"
            [alt]="product.nombre"
            class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          @if (product.destacado) {
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#1E50C0] text-white shadow-2xs">
              Destacado
            </span>
          }
        </a>

        <!-- Categoría & SKU -->
        <div class="flex items-center justify-between gap-2 mb-1.5 text-[11px] text-slate-400">
          <span class="truncate font-medium text-slate-500">{{ product.categoriaNombre }}</span>
          <span class="font-mono text-[10px] shrink-0 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
            SKU: {{ product.sku }}
          </span>
        </div>

        <!-- Nombre del Producto -->
        <a [routerLink]="['/catalog', product.id]" class="block">
          <h3 class="text-xs sm:text-sm font-bold text-[#142238] line-clamp-2 leading-snug group-hover:text-[#2456C6] transition-colors" [title]="product.nombre">
            {{ product.nombre }}
          </h3>
        </a>

        <!-- Proveedor -->
        <div class="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="truncate">{{ product.proveedorRazonSocial }}</span>
        </div>

        <!-- Precio y Pedido Mínimo -->
        <div class="mt-3 pt-3 border-t border-slate-100">
          <div class="flex items-baseline justify-between">
            <div class="text-base font-extrabold text-[#1E50C0]">
              S/ {{ product.precioUnitario | number:'1.2-2' }} <span class="text-[11px] font-normal text-slate-400">c/u</span>
            </div>
            @if (product.stockDisponible > 0) {
              <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Stock: {{ product.stockDisponible }}
              </span>
            } @else {
              <span class="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Agotado
              </span>
            }
          </div>

          @if (product.cantidadMinimaMayorista) {
            <div class="text-[11px] text-slate-500 mt-1">
              Pedido mínimo: <strong class="text-slate-700">{{ product.cantidadMinimaMayorista }} unidades</strong>
            </div>
          }
        </div>
      </div>

      <!-- Acciones: Botón Ver / Agregar -->
      <div class="mt-5 grid grid-cols-2 gap-2">
        <a
          [routerLink]="['/catalog', product.id]"
          class="py-2.5 px-3 rounded-full border border-[#1E50C0] text-[#1E50C0] hover:bg-blue-50/60 font-semibold text-xs flex items-center justify-center transition-colors text-center"
        >
          Ver producto
        </a>
        <button
          type="button"
          (click)="onAdd()"
          class="py-2.5 px-3 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Pedir
        </button>
      </div>

    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCard;
  @Output() addToCart = new EventEmitter<ProductCard>();

  public onAdd(): void {
    this.addToCart.emit(this.product);
  }
}
