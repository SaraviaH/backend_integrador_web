import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckoutStateService } from '../../../core/state/checkout-state.service';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      
      @if (checkoutState.confirmedOrder(); as order) {
        <!-- Tarjeta de Éxito y Felicitaciones (P-12) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-6 shadow-xs">
          
          <div class="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Compra B2B Registrada con Éxito
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
              ¡Orden {{ order.codigoOrden }} Confirmada!
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Hemos emitido tus órdenes de compra a los almacenes de los proveedores y generado los comprobantes fiscales correspondientes.
            </p>
          </div>

          <!-- Metadatos de la Orden -->
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200/70 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-left">
            <div>
              <span class="text-slate-400 block text-[11px]">Código de Orden:</span>
              <strong class="text-[#142238] font-mono text-sm">{{ order.codigoOrden }}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Fecha de Emisión:</span>
              <strong class="text-slate-700">{{ order.fechaEmision | date:'dd/MM/yyyy HH:mm' }}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Importe Total (con IGV):</span>
              <strong class="text-[#1E50C0] text-sm">S/ {{ order.totalGeneral | number:'1.2-2' }}</strong>
            </div>
          </div>

          <!-- Subórdenes y Comprobantes Simulados Generados -->
          <div class="max-w-2xl mx-auto space-y-3 text-left">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Subórdenes y Facturas Electrónicas Generadas:
            </h3>

            <div class="space-y-3">
              @for (sub of order.subordenes; track sub.subordenId) {
                <div class="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                      <h4 class="text-xs sm:text-sm font-bold text-[#142238]">{{ sub.proveedorRazonSocial }}</h4>
                    </div>
                    <div class="text-[11px] text-slate-500 mt-1 space-x-2">
                      <span>RUC: {{ sub.proveedorRuc }}</span>
                      <span>•</span>
                      <span>Factura: <strong class="font-mono text-slate-700">{{ sub.numeroFacturaSimulada }}</strong></span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div class="text-right">
                      <span class="text-[10px] text-slate-400 block">Total Suborden</span>
                      <span class="text-xs font-bold text-[#1E50C0]">S/ {{ sub.total | number:'1.2-2' }}</span>
                    </div>
                    <a
                      [routerLink]="['/pedidos', order.ordenId, 'comprobante']"
                      class="px-3 py-1.5 rounded-xl border border-[#1E50C0] text-[#1E50C0] hover:bg-blue-50 text-xs font-bold transition-colors shrink-0"
                    >
                      Ver Factura
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Acciones Post-Compra -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-100">
            <a
              routerLink="/catalog"
              class="px-6 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Volver al Catálogo
            </a>

            <button
              type="button"
              (click)="printInvoice()"
              class="px-6 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir Resumen
            </button>

            <a
              routerLink="/cuenta/mis-compras"
              class="px-8 py-3 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors shadow-xs"
            >
              Ver en Mis Compras (P-14)
            </a>
          </div>

        </div>
      } @else {
        <!-- Estado Alternativo si no hay orden activa en memoria -->
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <h2 class="text-base font-bold text-[#142238]">No hay confirmación reciente</h2>
          <p class="text-xs text-slate-500">Puedes consultar tus compras previas o iniciar un nuevo pedido en el catálogo.</p>
          <div class="pt-2">
            <a routerLink="/catalog" class="px-6 py-2.5 rounded-full bg-[#1E50C0] text-white text-xs font-bold">
              Ir al Catálogo
            </a>
          </div>
        </div>
      }

    </div>
  `
})
export class ConfirmationStepComponent {
  public readonly checkoutState = inject(CheckoutStateService);

  public printInvoice(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
