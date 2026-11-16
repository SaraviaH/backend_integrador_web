import { Component, Input, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCard } from '../../../core/models/catalog.model';
import { BubbleButtonDirective } from '../../directives/bubble-button.directive';
import { ActionTracker } from '../../../core/state/action-state.util';
import { CartStateService } from '../../../core/state/cart-state.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, BubbleButtonDirective],
  template: `
    <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 flex flex-col justify-between hover:border-[#1786B4] dark:hover:border-[#4FB3DA] hover:shadow-md motion-safe:transition-all motion-safe:duration-200 group h-full">

      <!-- Parte Superior: Imagen, Nombre, Proveedor -->
      <div>
        <!-- Imagen del Producto -->
        <a
          [routerLink]="['/catalog', product.id]"
          class="block aspect-[4/3] rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#E1F2FA] dark:border-[#1D4960] p-4 mb-4 overflow-hidden relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <img
            [src]="product.imagenPrincipalUrl"
            [alt]="product.nombre"
            class="w-full h-full object-contain motion-safe:group-hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
            loading="lazy"
            (error)="onImageError($event)"
          />
          @if (product.destacado) {
            <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-night text-white shadow-2xs">
              Destacado
            </span>
          }
        </a>

        <!-- Categoría & SKU -->
        <div class="flex items-center justify-between gap-2 mb-2 text-[11px] text-slate-400">
          <span class="truncate font-semibold text-slate-500">{{ product.categoriaNombre }}</span>
          <span class="font-mono text-[10px] shrink-0 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 border border-slate-200/70">
            {{ product.sku }}
          </span>
        </div>

        <!-- Nombre del Producto -->
        <a [routerLink]="['/catalog', product.id]" class="block focus-visible:outline-none focus-visible:underline">
          <h3 class="text-sm font-bold text-brand-night line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-brand-primary transition-colors" [title]="product.nombre">
            {{ product.nombre }}
          </h3>
        </a>

        <!-- Proveedor -->
        <div class="flex items-center gap-1.5 mt-2.5 text-slate-500 text-xs">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="truncate">{{ product.proveedorRazonSocial }}</span>
        </div>

        <!-- Precio y Disponibilidad -->
        <div class="mt-3.5 pt-3 border-t border-slate-100">
          <div class="flex items-baseline justify-between gap-2">
            <div class="text-lg font-extrabold text-brand-primary font-mono tracking-tight">
              S/ {{ product.precioUnitario | number:'1.2-2' }}
              <span class="text-[11px] font-sans font-medium text-slate-400">c/u</span>
            </div>

            @if (product.stockDisponible === 0) {
              <span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shrink-0">
                Agotado
              </span>
            } @else if (product.stockDisponible != null) {
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                Stock: {{ product.stockDisponible }}
              </span>
            } @else {
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                Disponible B2B
              </span>
            }
          </div>

          @if (product.pedidoMinimoTexto) {
            <div class="text-[11px] text-slate-500 mt-1.5">
              Pedido mínimo: <strong class="text-slate-700">{{ product.pedidoMinimoTexto }}</strong>
            </div>
          }
        </div>
      </div>

      <!-- Acciones: Botón Ver / Agregar -->
      <div class="mt-5 grid grid-cols-2 gap-2.5">
        <a
          [routerLink]="['/catalog', product.id]"
          class="py-2.5 px-3 rounded-xl border border-slate-200 text-brand-night hover:border-brand-primary hover:text-brand-primary hover:bg-brand-tint/60 font-semibold text-xs flex items-center justify-center transition-colors text-center"
        >
          Ver ficha
        </a>
        <button
          type="button"
          (click)="onAdd()"
          [disabled]="product.stockDisponible === 0 || action.isLoading('add')"
          appBubbleButton
          class="py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors disabled:cursor-not-allowed"
          [ngClass]="action.isSuccess('add')
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : (product.stockDisponible === 0
              ? 'bg-slate-200 dark:bg-brand-dark-border text-slate-400 dark:text-brand-ice/60'
              : 'bg-brand-primary hover:bg-brand-petrol text-white disabled:opacity-75')"
        >
          @if (action.isLoading('add')) {
            <svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span>Agregando...</span>
          } @else if (action.isSuccess('add')) {
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>Agregado</span>
          } @else {
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{{ product.stockDisponible === 0 ? 'Sin stock' : 'Agregar' }}</span>
          }
        </button>
      </div>

    </article>
  `
})
export class ProductCardComponent implements OnDestroy {
  private readonly cartState = inject(CartStateService);

  @Input({ required: true }) product!: ProductCard;
  @Output() addToCart = new EventEmitter<ProductCard>();

  public readonly action = new ActionTracker<'add'>();

  public ngOnDestroy(): void {
    this.action.clearAll();
  }

  public onAdd(): void {
    if (this.product.stockDisponible === 0 || this.action.isSuccess('add')) {
      return;
    }
    if (!this.action.start('add')) {
      return;
    }

    const currentItem = this.cartState.items().find(it => it.productoId === this.product.id);
    const willExceedStock =
      this.product.stockDisponible != null &&
      currentItem != null &&
      currentItem.cantidad >= this.product.stockDisponible;

    this.addToCart.emit(this.product);

    if (willExceedStock) {
      this.action.fail('add');
    } else {
      this.action.succeed('add', 900);
    }
  }

  public onImageError(event: Event): void {
    const img = event.target as HTMLImageElement | null;
    if (img && !img.src.endsWith('/images/compunex-hero.png')) {
      img.src = '/images/compunex-hero.png';
    }
  }
}
