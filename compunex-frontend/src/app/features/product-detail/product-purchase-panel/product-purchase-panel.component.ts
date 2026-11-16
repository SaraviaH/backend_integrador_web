import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductDetail } from '../../../core/models/catalog.model';
import { BubbleButtonDirective } from '../../../shared/directives/bubble-button.directive';

@Component({
  selector: 'app-product-purchase-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BubbleButtonDirective],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch" data-testid="purchase-two-panels">
      <!-- PANEL 1: INFORMACIÓN Y CONFIGURACIÓN DEL PEDIDO -->
      <section
        class="xl:col-span-7 bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-sm"
        aria-labelledby="purchase-config-heading"
        data-testid="purchase-panel-config"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E1F2FA] dark:border-[#1D4960]">
            <h2
              id="purchase-config-heading"
              class="text-xs font-extrabold uppercase tracking-wider text-[#0F5E83] dark:text-[#98D5EE]"
            >
              1. Configuración del Pedido Mayorista
            </h2>
            @if (product.stockDisponible === 0) {
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Agotado
              </span>
            } @else if (product.stockDisponible != null) {
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ product.stockDisponible }} un. en stock
              </span>
            } @else {
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Stock Mayorista
              </span>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Tarjeta Precio por Unidad -->
            <div class="bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#0F5E83] dark:text-[#98D5EE] block">
                  Precio por Unidad
                </span>
                <div class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                  <span class="text-xl sm:text-2xl font-black text-[#04202E] dark:text-[#F2F9FC] font-mono leading-tight">
                    S/ {{ product.precioUnitario | number:'1.2-2' }}
                  </span>
                  <span class="text-xs font-medium text-[#527588] dark:text-[#B8DFEF]">
                    sin IGV
                  </span>
                </div>
              </div>
              <p class="text-[11px] text-[#527588] dark:text-[#98D5EE]/85 mt-2">
                Precio aplicado en carrito y checkout.
              </p>
            </div>

            <!-- Tarjeta Total de Caja o Condición Mayorista -->
            @if (product.precioTotalCaja) {
              <div class="bg-gradient-to-br from-[#0F5E83] to-[#1786B4] text-white rounded-xl p-4 border border-[#4FB3DA]/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-[#E1F2FA]">
                      Total de Caja
                    </span>
                    <span class="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full shrink-0">
                      Caja completa
                    </span>
                  </div>
                  <div class="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                    <span class="text-xl sm:text-2xl font-black text-white font-mono leading-tight">
                      S/ {{ product.precioTotalCaja | number:'1.2-2' }}
                    </span>
                    <span class="text-xs font-medium text-[#E1F2FA]/90">
                      sin IGV
                    </span>
                  </div>
                </div>
                <p class="text-[11px] text-[#E1F2FA]/90 mt-2">
                  {{ product.unidadesPorPaqueteTexto || 'Paquete completo' }}. Referencial.
                </p>
              </div>
            } @else {
              <div class="bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#0F5E83] dark:text-[#98D5EE] block">
                    Presentación Mayorista
                  </span>
                  <div class="mt-1.5 text-base font-extrabold text-[#04202E] dark:text-[#F2F9FC] leading-snug">
                    {{ product.pedidoMinimoTexto || 'Consultar con proveedor' }}
                  </div>
                </div>
                <p class="text-[11px] text-[#527588] dark:text-[#98D5EE]/85 mt-2">
                  Condición comercial informada por el proveedor.
                </p>
              </div>
            }
          </div>
        </div>

        <!-- Selector de Cantidad y Pedido Mínimo -->
        <div class="pt-4 border-t border-[#E1F2FA] dark:border-[#1D4960] flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <label for="qty-input" class="block text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">
              Cantidad a Pedir
            </label>
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
              Pedido mínimo:
              <strong class="font-bold text-[#1786B4] dark:text-[#4FB3DA]">
                {{ product.pedidoMinimoTexto || '1 unidad' }}
              </strong>
            </p>
          </div>

          <div class="inline-flex items-center bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl p-1 shadow-sm">
            <button
              type="button"
              (click)="emitQuantity(quantity - 1)"
              [disabled]="quantity <= 1 || product.stockDisponible === 0"
              class="w-10 h-10 rounded-lg bg-white dark:bg-[#0F3043] hover:bg-[#E1F2FA] dark:hover:bg-[#1D4960] text-[#04202E] dark:text-[#F2F9FC] border border-[#CFE4EE]/70 dark:border-[#1D4960] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <input
              id="qty-input"
              type="number"
              [ngModel]="quantity"
              (ngModelChange)="emitQuantity($event)"
              [min]="1"
              [max]="product.stockDisponible ?? null"
              [disabled]="product.stockDisponible === 0"
              aria-label="Cantidad a pedir"
              class="w-16 text-center text-base font-bold font-mono text-[#04202E] dark:text-[#F2F9FC] bg-transparent outline-none"
            />
            <button
              type="button"
              (click)="emitQuantity(quantity + 1)"
              [disabled]="product.stockDisponible === 0 || (product.stockDisponible != null && quantity >= product.stockDisponible)"
              class="w-10 h-10 rounded-lg bg-white dark:bg-[#0F3043] hover:bg-[#E1F2FA] dark:hover:bg-[#1D4960] text-[#04202E] dark:text-[#F2F9FC] border border-[#CFE4EE]/70 dark:border-[#1D4960] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
      </section>

      <!-- PANEL 2: RESUMEN ECONÓMICO Y ACCIONES -->
      <section
        class="xl:col-span-5 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-sm"
        aria-labelledby="purchase-summary-heading"
        data-testid="purchase-panel-summary"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-[#CFE4EE] dark:border-[#1D4960]">
            <h2
              id="purchase-summary-heading"
              class="text-xs font-extrabold uppercase tracking-wider text-[#0F5E83] dark:text-[#98D5EE]"
            >
              2. Resumen Económico
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E1F2FA] dark:bg-[#0F3043] text-[#0A3C55] dark:text-[#98D5EE] border border-[#98D5EE]/60 dark:border-[#1D4960]">
              {{ quantity }} {{ quantity === 1 ? 'unidad' : 'unidades' }}
            </span>
          </div>

          <div class="bg-white dark:bg-[#0F3043] rounded-xl p-4 border border-[#CFE4EE] dark:border-[#1D4960] space-y-2.5 text-xs">
            <div class="flex items-center justify-between gap-2 text-[#527588] dark:text-[#B8DFEF]">
              <span>Subtotal ({{ quantity }} {{ quantity === 1 ? 'un.' : 'un.' }} × S/ {{ unitPrice | number:'1.2-2' }})</span>
              <span class="font-mono font-semibold text-[#04202E] dark:text-[#F2F9FC] shrink-0">
                S/ {{ subtotal | number:'1.2-2' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 text-[#527588] dark:text-[#B8DFEF]">
              <span>IGV Ley (18%)</span>
              <span class="font-mono font-semibold text-[#04202E] dark:text-[#F2F9FC] shrink-0">
                S/ {{ igv | number:'1.2-2' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 pt-3 border-t border-[#E1F2FA] dark:border-[#1D4960]">
              <span class="text-xs sm:text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">
                Total Estimado <span class="font-normal text-[11px] text-[#527588] dark:text-[#B8DFEF]">(inc. IGV)</span>
              </span>
              <span class="text-lg sm:text-xl font-black font-mono text-[#1786B4] dark:text-[#4FB3DA] shrink-0" data-testid="summary-total">
                S/ {{ totalWithIgv | number:'1.2-2' }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <button
            type="button"
            (click)="addToCart.emit()"
            [disabled]="product.stockDisponible === 0 || isAdding"
            appBubbleButton
            data-testid="add-to-order-btn"
            class="w-full py-3.5 px-5 rounded-xl disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            [ngClass]="justAdded
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : (product.stockDisponible === 0
                ? 'bg-slate-400 dark:bg-[#1D4960] text-slate-100 dark:text-[#B8DFEF]'
                : 'bg-[#1786B4] hover:bg-[#0F5E83]')"
          >
            @if (isAdding) {
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>Agregando a la orden...</span>
            } @else if (justAdded) {
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>¡Agregado a la orden!</span>
            } @else {
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{{ product.stockDisponible === 0 ? 'Producto Agotado' : 'Agregar ' + quantity + ' un. a la Orden' }}</span>
            }
          </button>

          <a
            routerLink="/catalog"
            class="w-full py-2.5 px-4 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0F3043] hover:bg-[#E1F2FA]/60 dark:hover:bg-[#1D4960]/70 text-[#0A3C55] dark:text-[#E1F2FA] font-semibold text-xs sm:text-sm text-center transition-colors"
          >
            Seguir Comprando
          </a>
        </div>
      </section>
    </div>
  `
})
export class ProductPurchasePanelComponent {
  @Input({ required: true }) public product!: ProductDetail;
  @Input({ required: true }) public quantity = 1;
  @Input() public unitPrice = 0;
  @Input({ required: true }) public subtotal = 0;
  @Input({ required: true }) public igv = 0;
  @Input({ required: true }) public totalWithIgv = 0;
  @Input() public isAdding = false;
  @Input() public justAdded = false;

  @Output() public readonly quantityChange = new EventEmitter<number>();
  @Output() public readonly addToCart = new EventEmitter<void>();

  public emitQuantity(nextValue: number): void {
    const parsed = Math.max(1, Math.floor(Number(nextValue) || 1));
    const max = this.product?.stockDisponible;
    const clamped = max != null ? Math.min(parsed, Math.max(1, max)) : parsed;
    this.quantityChange.emit(clamped);
  }
}
