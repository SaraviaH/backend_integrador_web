import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartStateService } from '../../core/state/cart-state.service';
import { ToastStateService } from '../../core/state/toast-state.service';
import { CartGroupItemComponent } from './cart-group-item/cart-group-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CartGroupItemComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/catalog" class="hover:text-[#2456C6] transition-colors">Catálogo</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Carrito de Compras B2B</span>
      </nav>

      <!-- Encabezado de Pantalla P-09 -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1E50C0] text-xs font-semibold mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#1E50C0]"></span>
            Split Order Multi-Proveedor
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
            Bolsa de Pedidos Mayorista
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Revisa los componentes por proveedor, ajusta volúmenes y verifica la liquidación con desglose de IGV.
          </p>
        </div>

        @if (cartState.items().length > 0) {
          <div class="flex items-center gap-3">
            <button
              type="button"
              (click)="showClearConfirm.set(true)"
              class="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Vaciar carrito
            </button>
          </div>
        }
      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-09)                                             -->
      <!-- ========================================================================= -->

      <!-- 1. ESTADO VACÍO -->
      @if (cartState.items().length === 0) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6 max-w-lg mx-auto my-12 shadow-xs">
          <div class="w-20 h-20 mx-auto rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="space-y-1.5">
            <h2 class="text-lg font-bold text-[#142238]">Tu carrito mayorista está vacío</h2>
            <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              No tienes artículos seleccionados en tu orden de compra. Puedes explorar nuestro catálogo B2B de componentes y estaciones de trabajo.
            </p>
          </div>
          <div class="pt-2">
            <a
              routerLink="/catalog"
              class="px-6 py-3 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Explorar Catálogo de Hardware
            </a>
          </div>
        </div>
      }

      <!-- 2. ESTADO CON DATOS: GRUPOS MULTI-PROVEEDOR Y CAJA DE LIQUIDACIÓN -->
      @else {
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- COLUMNA IZQUIERDA: GRUPOS SPLIT ORDER POR PROVEEDOR (8 Columnas) -->
          <div class="lg:col-span-8 space-y-6">
            
            <!-- Banner Informativo Split Order B2B -->
            <div class="p-5 rounded-3xl bg-blue-50/70 border border-blue-200/70 text-blue-900 space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-[#1E50C0]">
                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Arquitectura Split Order B2B
              </div>
              <p class="text-xs text-blue-800/90 leading-relaxed">
                Tu orden agrupa productos de <strong>{{ cartState.itemsByProvider().length }} {{ cartState.itemsByProvider().length === 1 ? 'proveedor' : 'proveedores distintos' }}</strong>. 
                Al confirmar la compra, la plataforma dividirá automáticamente el pedido en subórdenes independientes para garantizar el despacho directo de cada almacén y la emisión individual de facturas electrónicas.
              </p>
            </div>

            <!-- Listado de Grupos de Proveedores -->
            <div class="space-y-6">
              @for (group of cartState.itemsByProvider(); track group.proveedorId) {
                <app-cart-group-item
                  [group]="group"
                  (updateQty)="onUpdateQty($event)"
                  (removeItem)="onRemoveItem($event)"
                />
              }
            </div>

            <!-- Botón para Seguir Comprando -->
            <div class="pt-4">
              <a
                routerLink="/catalog"
                class="inline-flex items-center gap-2 text-xs font-bold text-[#1E50C0] hover:text-[#1842A0] hover:underline transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continuar explorando más productos mayoristas
              </a>
            </div>

          </div>

          <!-- COLUMNA DERECHA: RESUMEN DE LIQUIDACIÓN Y PASO AL CHECKOUT (4 Columnas) -->
          <div class="lg:col-span-4 space-y-6 sticky top-24">
            
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
              
              <h2 class="text-sm font-black text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Resumen del Pedido</span>
                <span class="text-xs font-normal text-slate-400">
                  {{ cartState.totalItemsCount() }} {{ cartState.totalItemsCount() === 1 ? 'unidad' : 'unidades' }}
                </span>
              </h2>

              <!-- Subórdenes por Proveedor -->
              <div class="space-y-2.5">
                <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Desglose por Suborden:
                </span>
                @for (group of cartState.itemsByProvider(); track group.proveedorId) {
                  <div class="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                    <span class="text-slate-600 truncate max-w-44" [title]="group.proveedorRazonSocial">
                      {{ group.proveedorRazonSocial }}
                    </span>
                    <span class="font-semibold text-slate-800 shrink-0">
                      S/ {{ group.total | number:'1.2-2' }}
                    </span>
                  </div>
                }
              </div>

              <!-- Desglose Tributario Ley B2B (IGV 18%) -->
              <div class="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div class="flex justify-between text-slate-600">
                  <span>Base Imponible (Subtotal sin IGV):</span>
                  <span class="font-semibold text-slate-800">S/ {{ cartState.subtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>IGV (18% Ley Peruana):</span>
                  <span class="font-semibold text-slate-800">S/ {{ cartState.igv() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-base font-black text-[#142238] pt-3 border-t border-slate-100">
                  <span>Total Liquidación:</span>
                  <span class="text-[#1E50C0]">S/ {{ cartState.total() | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Garantía Tributaria -->
              <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div class="flex items-center gap-1.5 font-bold text-slate-700">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Factura Electrónica SUNAT
                </div>
                <p>Todos los precios incluyen emisión de factura electrónica por cada proveedor homologado.</p>
              </div>

              <!-- Botón CTA Checkout Wizard -->
              <div class="space-y-3 pt-2">
                <button
                  type="button"
                  (click)="proceedToCheckout()"
                  class="w-full py-3.5 px-6 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Continuar al Checkout (P-10)</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

            </div>

          </div>

        </div>

      }

      <!-- Modal de Confirmación de Vaciado -->
      @if (showClearConfirm()) {
        <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" (click)="showClearConfirm.set(false)"></div>
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md p-6 border border-slate-200 space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div class="text-center space-y-1">
                <h3 class="text-base font-bold text-[#142238]">¿Vaciar todo el carrito?</h3>
                <p class="text-xs text-slate-500">Se eliminarán todos los artículos mayoristas agrupados en tu pedido.</p>
              </div>
              <div class="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  (click)="showClearConfirm.set(false)"
                  class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  (click)="confirmClear()"
                  class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Sí, vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class CartComponent {
  public readonly cartState = inject(CartStateService);
  private readonly toastState = inject(ToastStateService);
  private readonly router = inject(Router);

  public readonly showClearConfirm = signal<boolean>(false);

  public onUpdateQty(event: { productoId: number; cantidad: number }): void {
    this.cartState.updateQuantity(event.productoId, event.cantidad);
  }

  public onRemoveItem(productoId: number): void {
    this.cartState.removeItem(productoId);
    this.toastState.info('Producto eliminado', 'El artículo fue retirado de tu pedido.');
  }

  public confirmClear(): void {
    this.cartState.clear();
    this.showClearConfirm.set(false);
    this.toastState.warning('Carrito vaciado', 'Todos los productos fueron retirados de la orden.');
  }

  public proceedToCheckout(): void {
    this.router.navigate(['/checkout/datos-facturacion']);
  }
}
