import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutStateService } from '../../../core/state/checkout-state.service';
import { CartStateService } from '../../../core/state/cart-state.service';
import { OrderApiService } from '../../../core/services/order-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { CheckoutRequest, CheckoutItemRequest } from '../../../core/models/order.model';
import { PaymentGatewayModalComponent, PaymentGatewayMethod } from '../payment-gateway-modal/payment-gateway-modal.component';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, RouterModule, PaymentGatewayModalComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Encabezado del Paso P-11 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div class="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">
          <span class="w-2 h-2 rounded-full bg-brand-primary"></span>
          Paso 2 de 3 · Confirmación de Split Order
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-brand-night tracking-tight font-display">
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
            <h3 class="text-xs font-bold text-brand-night uppercase tracking-wider flex items-center gap-1.5">
              <span>🏢</span> Datos Fiscales de Emisión
            </h3>
            <button
              type="button"
              (click)="prevStep.emit()"
              class="text-xs font-semibold text-brand-primary hover:underline"
            >
              Editar
            </button>
          </div>

          @if (checkoutState.billingData(); as b) {
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="font-bold text-brand-night text-sm">{{ b.razonSocial }}</div>
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
            <h3 class="text-xs font-bold text-brand-night uppercase tracking-wider flex items-center gap-1.5">
              <span>💳</span> Condición Comercial y Pago
            </h3>
            <button
              type="button"
              (click)="prevStep.emit()"
              class="text-xs font-semibold text-brand-primary hover:underline"
            >
              Cambiar
            </button>
          </div>

          @if (checkoutState.billingData(); as b) {
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="font-bold text-brand-night text-sm">
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
            <h3 class="text-base font-bold text-brand-night">
              Desglose de Subórdenes por Proveedor
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Esta compra se estructurará en {{ cartState.itemsByProvider().length }} subórdenes independientes con trazabilidad individual.
            </p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-brand-tint text-brand-primary border border-brand-tint self-start sm:self-auto">
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
                <span class="text-xs font-black text-brand-primary">
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
          <div class="flex justify-between text-base font-black text-brand-night pt-3 border-t border-slate-200">
            <span>Importe Total a Pagar:</span>
            <span class="text-brand-primary text-lg">S/ {{ cartState.total() | number:'1.2-2' }}</span>
          </div>
        </div>

      </div>

      <!-- Banner de error en checkout (ej. auto-compra o stock insuficiente) -->
      @if (checkoutError()) {
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800" role="alert">
          <div class="flex items-start gap-2.5">
            <svg class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-bold text-rose-900">No se pudo confirmar la orden</p>
              <p class="mt-0.5 text-rose-700">{{ checkoutError() }}</p>
            </div>
          </div>
          <a
            routerLink="/carrito"
            class="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold shrink-0 text-center transition-colors"
          >
            Revisar carrito
          </a>
        </div>
      }

      <!-- Acciones de Navegación del Paso 2 -->
      <div class="flex items-center justify-between pt-4">
        <button
          type="button"
          (click)="prevStep.emit()"
          [disabled]="isPlacingOrder()"
          class="px-6 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Volver a Datos Fiscales
        </button>

        <button
          type="button"
          (click)="confirmOrder()"
          [disabled]="isPlacingOrder()"
          class="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
        >
          @if (isPlacingOrder()) {
            <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Procesando Orden...</span>
          } @else {
            <span>Pagar y Confirmar Compra B2B</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          }
        </button>
      </div>

      @if (showGatewayModal() && checkoutState.billingData(); as billing) {
        <app-payment-gateway-modal
          [totalAmount]="cartState.total()"
          [suborderCount]="cartState.itemsByProvider().length"
          [ruc]="billing.ruc"
          [razonSocial]="billing.razonSocial"
          [initialMethod]="billing.metodoPagoSimulado"
          [isSubmitting]="isPlacingOrder()"
          [externalError]="checkoutError()"
          (closeModal)="showGatewayModal.set(false)"
          (paymentAuthorized)="executeCheckout($event)"
        />
      }

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

  public readonly showGatewayModal = signal<boolean>(false);
  public readonly isPlacingOrder = signal<boolean>(false);
  public readonly checkoutError = signal<string | null>(null);

  public confirmOrder(): void {
    const billing = this.checkoutState.billingData();
    const items = this.cartState.items();

    if (!billing || items.length === 0) {
      this.toastState.error('No fue posible registrar el pedido', 'No hay datos de facturación o el carrito está vacío.', 'checkout-empty');
      return;
    }

    this.checkoutError.set(null);
    this.showGatewayModal.set(true);
  }

  public executeCheckout(method: PaymentGatewayMethod): void {
    if (this.isPlacingOrder()) {
      return;
    }

    const billing = this.checkoutState.billingData();
    const items = this.cartState.items();

    if (!billing || items.length === 0) {
      this.toastState.error('No fue posible registrar el pedido', 'No hay datos de facturación o el carrito está vacío.', 'checkout-empty');
      return;
    }

    this.isPlacingOrder.set(true);
    this.checkoutError.set(null);

    const checkoutItems: CheckoutItemRequest[] = items.map(it => ({
      productoId: it.productoId,
      cantidad: it.cantidad
    }));

    const payload: CheckoutRequest = {
      rucFacturacion: billing.ruc,
      razonSocialFacturacion: billing.razonSocial,
      direccionFiscal: billing.direccionFiscal,
      metodoPagoSimulado: method,
      notasPedido: billing.notasPedido,
      items: checkoutItems
    };

    this.orderApi.checkout(payload).subscribe({
      next: (res) => {
        this.isPlacingOrder.set(false);
        this.showGatewayModal.set(false);
        this.checkoutState.setConfirmedOrder(res);
        this.cartState.clear();
        this.toastState.success('Pago autorizado y pedido registrado', `Orden ${res.codigoOrden} generada con éxito.`, 'checkout-success');
        this.orderConfirmed.emit();
      },
      error: (err) => {
        this.isPlacingOrder.set(false);
        const msg = err?.error?.mensaje || err?.error?.detail || err?.error?.message || 'No fue posible registrar el pedido. Verifica tu carrito o datos fiscales.';
        this.checkoutError.set(msg);
        this.toastState.error('No fue posible registrar el pedido', msg, 'checkout-error');
      }
    });
  }
}
