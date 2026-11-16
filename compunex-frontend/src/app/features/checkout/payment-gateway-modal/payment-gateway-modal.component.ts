import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutRequest } from '../../../core/models/order.model';

export type PaymentGatewayMethod = CheckoutRequest['metodoPagoSimulado'];

@Component({
  selector: 'app-payment-gateway-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pg-title"
    >
      <div class="w-full max-w-2xl bg-white dark:bg-[#0F3043] rounded-3xl border border-[#CFE4EE] dark:border-[#1D4960] shadow-2xl overflow-hidden">

        <!-- Cabecera de Pasarela -->
        <div class="px-6 py-5 bg-gradient-to-r from-[#04202E] to-[#1786B4] text-white flex items-center justify-between gap-4">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-sky-200">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Pasarela Segura COMPUNEX Pay B2B (Simulada)
            </div>
            <h2 id="pg-title" class="text-lg sm:text-xl font-black tracking-tight font-display">
              Autorización de Pago Directo
            </h2>
          </div>

          <div class="text-right shrink-0">
            <span class="block text-[10px] uppercase tracking-wider text-sky-200">Importe Total (Inc. IGV)</span>
            <span class="text-xl sm:text-2xl font-black font-mono">S/ {{ totalAmount | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="p-6 space-y-5 max-h-[82vh] overflow-y-auto">

          <!-- Resumen Receptor -->
          <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] text-xs">
            <div>
              <span class="text-[#527588] dark:text-[#9FCBE0]">Empresa pagadora: </span>
              <strong class="text-[#04202E] dark:text-[#F2F9FC]">{{ razonSocial }}</strong>
              <span class="text-[#527588] dark:text-[#9FCBE0] font-mono ml-1.5">(RUC {{ ruc }})</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-[#1786B4] dark:text-[#4FB3DA] font-bold text-[11px]">
              {{ suborderCount }} suborden(es) Split Order
            </span>
          </div>

          <!-- Selector de Medio de Pago -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            @for (opt of methodOptions; track opt.id) {
              <button
                type="button"
                (click)="selectMethod(opt.id)"
                [disabled]="isProcessing() || isSubmitting"
                class="p-3 rounded-2xl border text-left transition-all flex flex-col gap-1"
                [ngClass]="selectedMethod() === opt.id
                  ? 'border-[#1786B4] bg-sky-50/80 dark:bg-sky-900/35 dark:border-[#4FB3DA] ring-2 ring-[#1786B4]/20'
                  : 'border-[#CFE4EE] dark:border-[#1D4960] hover:border-[#1786B4]/60 bg-white dark:bg-[#0A2535]'"
              >
                <span class="text-base leading-none">{{ opt.icon }}</span>
                <span class="text-xs font-bold text-[#04202E] dark:text-[#F2F9FC] leading-tight">{{ opt.label }}</span>
                <span class="text-[10px] text-[#527588] dark:text-[#9FCBE0]">{{ opt.hint }}</span>
              </button>
            }
          </div>

          <!-- Formulario Dinámico según Medio Elegido -->
          <form [formGroup]="form" (ngSubmit)="submitPayment()" class="space-y-4">

            @if (selectedMethod() === 'TARJETA_EMPRESARIAL') {
              <div class="p-4 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] bg-slate-50/70 dark:bg-[#0A2535]/70 space-y-4">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-bold text-[#04202E] dark:text-[#F2F9FC]">Datos de Tarjeta Corporativa (Visa / Mastercard)</span>
                  <button
                    type="button"
                    (click)="fillDemoCard()"
                    class="text-[11px] font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:underline"
                  >
                    Autocompletar tarjeta de prueba
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div class="sm:col-span-12">
                    <label class="block text-[11px] font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-1">Número de Tarjeta *</label>
                    <input
                      type="text"
                      formControlName="cardNumber"
                      maxlength="19"
                      placeholder="4532 8900 1234 5678"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs sm:text-sm font-mono text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4]"
                    />
                  </div>
                  <div class="sm:col-span-6">
                    <label class="block text-[11px] font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-1">Titular / Empresa *</label>
                    <input
                      type="text"
                      formControlName="cardHolder"
                      placeholder="COMERCIAL TECH MYPE SAC"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4]"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="block text-[11px] font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-1">Vencimiento *</label>
                    <input
                      type="text"
                      formControlName="cardExpiry"
                      maxlength="5"
                      placeholder="12/28"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-mono text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4]"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="block text-[11px] font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-1">CVV *</label>
                    <input
                      type="password"
                      formControlName="cardCvv"
                      maxlength="4"
                      placeholder="842"
                      class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-mono text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4]"
                    />
                  </div>
                </div>
              </div>
            }

            @if (selectedMethod() === 'TRANSFERENCIA_BANCARIA') {
              <div class="p-4 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] bg-slate-50/70 dark:bg-[#0A2535]/70 space-y-3 text-xs">
                <div class="font-bold text-[#04202E] dark:text-[#F2F9FC]">Cuenta Recaudadora COMPUNEX B2B (Custodia Split Order)</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] font-mono text-[11px]">
                  <div><span class="text-[#527588] block font-sans">Banco / Moneda:</span>BCP Empresas · Soles (PEN)</div>
                  <div><span class="text-[#527588] block font-sans">CCI Interbancario:</span>002-191-0048592014-88</div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-1">N.º de Operación / Voucher *</label>
                  <input
                    type="text"
                    formControlName="operationCode"
                    placeholder="OP-2026-884920"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-mono text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4]"
                  />
                </div>
              </div>
            }

            @if (selectedMethod() === 'YAPE_PLIN_EMPRESA') {
              <div class="p-4 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] bg-slate-50/70 dark:bg-[#0A2535]/70 flex flex-col sm:flex-row items-center gap-4 text-xs">
                <div class="w-28 h-28 rounded-2xl bg-white p-2 border border-[#CFE4EE] shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" class="w-full h-full text-[#04202E]" aria-hidden="true">
                    <rect x="6" y="6" width="28" height="28" fill="none" stroke="currentColor" stroke-width="6" />
                    <rect x="14" y="14" width="12" height="12" fill="currentColor" />
                    <rect x="66" y="6" width="28" height="28" fill="none" stroke="currentColor" stroke-width="6" />
                    <rect x="74" y="14" width="12" height="12" fill="currentColor" />
                    <rect x="6" y="66" width="28" height="28" fill="none" stroke="currentColor" stroke-width="6" />
                    <rect x="14" y="74" width="12" height="12" fill="currentColor" />
                    <path d="M44 10h12v12H44zM44 34h12v12H44zM60 44h12v12H60zM44 58h12v12H44zM72 68h18v18H72zM58 78h10v14H58z" fill="currentColor" />
                  </svg>
                </div>
                <div class="flex-1 space-y-2 w-full">
                  <div class="font-bold text-[#04202E] dark:text-[#F2F9FC]">Escanea el QR Corporativo Yape / Plin</div>
                  <p class="text-[11px] text-[#527588] dark:text-[#9FCBE0]">Ingresa el código de aprobación de 6 dígitos generado por tu aplicativo móvil empresarial.</p>
                  <input
                    type="text"
                    formControlName="qrCode"
                    maxlength="8"
                    placeholder="Código de aprobación (ej. 482910)"
                    class="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-mono text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4]"
                  />
                </div>
              </div>
            }

            @if (selectedMethod() === 'LINEA_CREDITO_B2B') {
              <div class="p-4 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] bg-slate-50/70 dark:bg-[#0A2535]/70 space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#04202E] dark:text-[#F2F9FC]">Línea de Crédito Corporativa a 30 días</span>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">Línea Habilitada</span>
                </div>
                <p class="text-[11px] text-[#527588] dark:text-[#9FCBE0]">
                  Se emitirán las facturas electrónicas con vencimiento neto a 30 días calendario y el despacho se programará inmediatamente tras la confirmación.
                </p>
              </div>
            }

            <!-- Opción de prueba para simular rechazo -->
            <label class="flex items-center gap-2 text-[11px] text-[#527588] dark:text-[#9FCBE0] cursor-pointer select-none">
              <input type="checkbox" formControlName="simulateDecline" class="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
              <span>Simular rechazo de pasarela (para pruebas de error y reintento)</span>
            </label>

            @if (gatewayError()) {
              <div class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                ⚠ {{ gatewayError() }}
              </div>
            }

            @if (externalError) {
              <div class="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
                ⚠ {{ externalError }}
              </div>
            }

            <!-- Botonera -->
            <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E1F2FA] dark:border-[#1D4960]">
              <button
                type="button"
                (click)="closeModal.emit()"
                [disabled]="isProcessing() || isSubmitting"
                class="px-5 py-2.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-semibold text-[#527588] dark:text-[#B8DFEF] hover:bg-slate-50 dark:hover:bg-[#0A2535] disabled:opacity-50"
              >
                Cancelar y volver
              </button>

              <button
                type="submit"
                [disabled]="isProcessing() || isSubmitting"
                class="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                @if (isProcessing() || isSubmitting) {
                  <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{{ isProcessing() ? 'Validando pago en pasarela...' : 'Generando Split Order...' }}</span>
                } @else {
                  <span>Autorizar Pago · S/ {{ totalAmount | number:'1.2-2' }}</span>
                }
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  `,
})
export class PaymentGatewayModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) totalAmount = 0;
  @Input({ required: true }) suborderCount = 1;
  @Input({ required: true }) ruc = '';
  @Input({ required: true }) razonSocial = '';
  @Input() initialMethod: PaymentGatewayMethod = 'TARJETA_EMPRESARIAL';
  @Input() isSubmitting = false;
  @Input() externalError: string | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentAuthorized = new EventEmitter<PaymentGatewayMethod>();

  public readonly selectedMethod = signal<PaymentGatewayMethod>('TARJETA_EMPRESARIAL');
  public readonly isProcessing = signal<boolean>(false);
  public readonly gatewayError = signal<string | null>(null);

  public readonly methodOptions: { id: PaymentGatewayMethod; icon: string; label: string; hint: string }[] = [
    { id: 'TARJETA_EMPRESARIAL', icon: '💳', label: 'Tarjeta Corp.', hint: 'Visa / MC' },
    { id: 'TRANSFERENCIA_BANCARIA', icon: '🏦', label: 'Transferencia', hint: 'CCI / BCP' },
    { id: 'YAPE_PLIN_EMPRESA', icon: '📱', label: 'Yape / Plin', hint: 'QR inmediato' },
    { id: 'LINEA_CREDITO_B2B', icon: '📄', label: 'Crédito 30d', hint: 'Factura B2B' },
  ];

  public form!: FormGroup;

  public ngOnInit(): void {
    this.selectedMethod.set(this.initialMethod || 'TARJETA_EMPRESARIAL');
    this.form = this.fb.group({
      cardNumber: ['4532 8900 1234 5678', [Validators.minLength(12)]],
      cardHolder: [this.razonSocial || 'EMPRESA COMPRADORA SAC'],
      cardExpiry: ['12/28'],
      cardCvv: ['842'],
      operationCode: ['OP-2026-884920'],
      qrCode: ['482910'],
      simulateDecline: [false],
    });
  }

  public selectMethod(method: PaymentGatewayMethod): void {
    this.selectedMethod.set(method);
    this.gatewayError.set(null);
  }

  public fillDemoCard(): void {
    this.form.patchValue({
      cardNumber: '4532 8900 1234 5678',
      cardHolder: this.razonSocial || 'COMERCIAL TECH MYPE SAC',
      cardExpiry: '12/28',
      cardCvv: '842',
    });
    this.gatewayError.set(null);
  }

  public submitPayment(): void {
    if (this.isProcessing() || this.isSubmitting) return;
    this.gatewayError.set(null);

    const method = this.selectedMethod();
    const v = this.form.value;

    if (method === 'TARJETA_EMPRESARIAL') {
      const digits = String(v.cardNumber || '').replace(/\s+/g, '');
      if (digits.length < 13 || !v.cardHolder?.trim() || !v.cardExpiry?.trim() || String(v.cardCvv || '').trim().length < 3) {
        this.gatewayError.set('Completa los datos válidos de la tarjeta corporativa para continuar.');
        return;
      }
    } else if (method === 'TRANSFERENCIA_BANCARIA' && !String(v.operationCode || '').trim()) {
      this.gatewayError.set('Ingresa el número de operación bancaria para validar la transferencia.');
      return;
    } else if (method === 'YAPE_PLIN_EMPRESA' && String(v.qrCode || '').trim().length < 4) {
      this.gatewayError.set('Ingresa el código de aprobación generado por Yape/Plin.');
      return;
    }

    this.isProcessing.set(true);
    setTimeout(() => {
      this.isProcessing.set(false);
      if (v.simulateDecline) {
        this.gatewayError.set('Pago rechazado por la entidad emisora (simulación). Verifica fondos o cambia de método.');
        return;
      }
      this.paymentAuthorized.emit(method);
    }, 1050);
  }
}
