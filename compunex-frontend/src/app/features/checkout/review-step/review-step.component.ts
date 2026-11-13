import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutStateService } from '../../../core/state/checkout-state.service';
import { CartStateService } from '../../../core/state/cart-state.service';
import { OrderApiService } from '../../../core/services/order-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { CheckoutRequest, CheckoutItemRequest } from '../../../core/models/order.model';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      
      <!-- Encabezado del Paso P-11 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div class="flex items-center gap-2 text-xs font-bold text-[#1E50C0] uppercase tracking-wider mb-1">
          <span class="w-2 h-2 rounded-full bg-[#1E50C0]"></span>
          Paso 2 de 3 · Confirmación de Split Order
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-[#142238] tracking-tight font-display">
          Revisión Final de tu Orden de Compra
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Verifica los datos fiscales, la división por proveedores y los montos tributarios antes de emitir la compra.
        </p>
      </div>

      <!-- Cuadrícula de Resumen: Datos de Facturación + Método de Pago -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Tarjeta 1: Datos de Facturación -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="text-xs font-bold text-[#142238] uppercase tracking-wider flex items-center gap-1.5">
              <span>🏢</span> Datos Fiscales de Emisión
            </h3>
            <button
              type="button"
              (click)="prevStep.emit()"
              class="text-xs font-semibold text-[#1E50C0] hover:underline"
            >
              Editar
            </button>
          </div>

          @if (checkoutState.billingData(); as b) {
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="font-bold text-[#142238] text-sm">{{ b.razonSocial }}</div>
              <div>RUC: <strong class="text-slate-800">{{ b.ruc }}</strong></div>
              <div>Dirección: {{ b.direccionFiscal }} ({{ b.departamento }})</div>
              <div class="pt-1 text-[11px] text-slate-400">
                Contacto: {{ b.contactoNombre }} · {{ b.contactoTelefono }}
              </div>
              <div class="text-[11px] text-slate-400">
                Envío de Comprobantes: {{ b.contactoCorreo }}
              </div>
            </div>
          }
        </div>

        <!-- Tarjeta 2: Método de Pago y Logística -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="text-xs font-bold text-[#142238] uppercase tracking-wider flex items-center gap-1.5">
              <span>💳</span> Condición Comercial y Pago
            </h3>
            <button
              type="button"
              (click)="prevStep.emit()"
              class="text-xs font-semibold text-[#1E50C0] hover:underline"
            >
              Cambiar
            </button>
          </div>

          @if (checkoutState.billingData(); as b) {
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="font-bold text-[#142238] text-sm">
                @switch (b.metodoPagoSimulado) {
                  @case ('TRANSFERENCIA_BANCARIA') { Transferencia Bancaria Directa B2B }
                  @case ('LINEA_CREDITO_B2B') { Línea de Crédito Mayorista a 30 días }
                  @case ('TARJETA_EMPRESARIAL') { Tarjeta de Débito/Crédito Corporativa }
                }
              </div>
              <div class="text-[11px] text-slate-500">
                Modalidad: Emisión de facturas electrónicas con pago al contado o crédito según acuerdo comercial.
              </div>
              @if (b.notasPedido) {
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mt-2">
                  <span class="font-bold text-slate-700">Notas:</span> {{ b.notasPedido }}
                </div>
              }
            </div>
          }
        </div>

      </div>

      <!-- Desglose Exhaustivo de Split Order por Proveedor -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-[#142238]">
              Desglose de Subórdenes por Proveedor
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Esta compra se estructurará en {{ cartState.itemsByProvider().length }} subórdenes independientes con trazabilidad individual.
            </p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1E50C0] border border-blue-100 self-start sm:self-auto">
            {{ cartState.totalItemsCount() }} unidades en total
          </span>
        </div>

        <div class="space-y-6">
          @for (group of cartState.itemsByProvider(); track group.proveedorId) {
            <div class="rounded-2xl border border-slate-200/80 overflow-hidden">
              <div class="bg-slate-50 px-5 py-3 border-b border-slate-200/60 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-bold text-slate-800">{{ group.proveedorRazonSocial }}</span>
                </div>
                <span class="text-xs font-black text-[#1E50C0]">
                  S/ {{ group.total | number:'1.2-2' }} (inc. IGV)
                </span>
              </div>

              <div class="divide-y divide-slate-100 p-2 sm:p-4">
                @for (item of group.items; track item.productoId) {
                  <div class="py-2.5 px-3 flex items-center justify-between text-xs gap-4">
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 shrink-0">
                        {{ item.sku }}
                      </span>
                      <span class="font-medium text-slate-700 truncate">{{ item.nombre }}</span>
                      <span class="text-slate-400 shrink-0 font-semibold">× {{ item.cantidad }}</span>
                    </div>
                    <span class="font-bold text-slate-800 shrink-0">
                      S/ {{ item.subtotal | number:'1.2-2' }}
                    </span>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Totalización Final de la Orden -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 space-y-3">
          <div class="flex justify-between text-xs text-slate-600">
            <span>Base Imponible Consolidada:</span>
            <span class="font-bold text-slate-800">S/ {{ cartState.subtotal() | number:'1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-xs text-slate-600">
            <span>IGV Total (18% Ley SUNAT):</span>
            <span class="font-bold text-slate-800">S/ {{ cartState.igv() | number:'1.2-2' }}</span>
          </div>
          <div class="flex justify-between text-base font-black text-[#142238] pt-3 border-t border-slate-200">
            <span>Importe Total a Pagar:</span>
            <span class="text-[#1E50C0] text-lg">S/ {{ cartState.total() | number:'1.2-2' }}</span>
          </div>
        </div>

      </div>

      <!-- Acciones de Navegación del Paso 2 -->
      <div class="flex items-center justify-between pt-4">
        <button
          type="button"
          (click)="prevStep.emit()"
          class="px-6 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          ← Volver a Datos Fiscales
        </button>

        <button
          type="button"
          (click)="confirmOrder()"
          [disabled]="isPlacingOrder()"
          class="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
        >
          @if (isPlacingOrder()) {
            <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Generando Órdenes ACID...</span>
          } @else {
            <span>Confirmar Compra y Generar Órdenes B2B (P-12)</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          }
        </button>
      </div>

    </div>
  `
})
export class ReviewStepComponent {
  public readonly checkoutState = inject(CheckoutStateService);
  public readonly cartState = inject(CartStateService);
  private readonly orderApi = inject(OrderApiService);
  private readonly toastState = inject(ToastStateService);

  @Output() prevStep = new EventEmitter<void>();
  @Output() orderConfirmed = new EventEmitter<void>();

  public readonly isPlacingOrder = signal<boolean>(false);

  public confirmOrder(): void {
    const billing = this.checkoutState.billingData();
    const items = this.cartState.items();

    if (!billing || items.length === 0) {
      this.toastState.error('Error en la Orden', 'No hay datos de facturación o el carrito está vacío.');
      return;
    }

    this.isPlacingOrder.set(true);

    const checkoutItems: CheckoutItemRequest[] = items.map(it => ({
      productoId: it.productoId,
      cantidad: it.cantidad
    }));

    const payload: CheckoutRequest = {
      rucFacturacion: billing.ruc,
      razonSocialFacturacion: billing.razonSocial,
      direccionFiscal: billing.direccionFiscal,
      metodoPagoSimulado: billing.metodoPagoSimulado,
      notasPedido: billing.notasPedido,
      items: checkoutItems
    };

    this.orderApi.checkout(payload).subscribe({
      next: (res) => {
        this.isPlacingOrder.set(false);
        this.checkoutState.setConfirmedOrder(res);
        // Limpiar el carrito una vez emitida exitosamente la compra
        this.cartState.clear();
        this.toastState.success('¡Compra Confirmada!', `Orden ${res.codigoOrden} generada con éxito.`);
        this.orderConfirmed.emit();
      },
      error: (err) => {
        this.isPlacingOrder.set(false);
        const msg = err?.error?.mensaje || 'Ocurrió un error al procesar la compra. Intenta nuevamente.';
        this.toastState.error('Error al procesar la compra', msg);
      }
    });
  }
}
