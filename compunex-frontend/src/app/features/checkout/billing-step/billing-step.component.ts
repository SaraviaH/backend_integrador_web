import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutStateService, CheckoutBillingData } from '../../../core/state/checkout-state.service';
import { AuthStateService } from '../../../core/state/auth-state.service';

@Component({
  selector: 'app-billing-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Encabezado del Paso P-10 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div class="flex items-center gap-2 text-xs font-bold text-[#1E50C0] uppercase tracking-wider mb-1">
          <span class="w-2 h-2 rounded-full bg-[#1E50C0]"></span>
          Paso 1 de 3 · Facturación Electrónica SUNAT
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-[#142238] tracking-tight font-display">
          Datos Fiscales de Facturación y Despacho
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Ingresa la información fiscal de tu empresa. Cada proveedor emitirá su factura electrónica individual a este RUC.
        </p>
      </div>

      <!-- Formulario de Facturación Reactivo -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Bloque 1: Identificación Fiscal de la Empresa -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-5 shadow-xs">
          <h3 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            1. Razón Social y Domicilio Fiscal
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- RUC -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                RUC de la Empresa (11 dígitos) *
              </label>
              <input
                type="text"
                formControlName="ruc"
                maxlength="11"
                placeholder="20XXXXXXXXX"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] font-mono outline-none transition-colors"
                [class.border-rose-400]="isFieldInvalid('ruc')"
                [class.border-slate-200]="!isFieldInvalid('ruc')"
              />
              @if (isFieldInvalid('ruc')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">El RUC debe tener exactamente 11 dígitos numéricos.</p>
              }
            </div>

            <!-- Razón Social -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Razón Social *
              </label>
              <input
                type="text"
                formControlName="razonSocial"
                placeholder="Ej. TECNOLOGIAS DEL SUR SAC"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none transition-colors"
                [class.border-rose-400]="isFieldInvalid('razonSocial')"
                [class.border-slate-200]="!isFieldInvalid('razonSocial')"
              />
              @if (isFieldInvalid('razonSocial')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">Ingresa la razón social completa.</p>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Dirección Fiscal -->
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Dirección Fiscal / Destino de Despacho *
              </label>
              <input
                type="text"
                formControlName="direccionFiscal"
                placeholder="Av. Principal 123, Of. 401"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none transition-colors"
                [class.border-rose-400]="isFieldInvalid('direccionFiscal')"
                [class.border-slate-200]="!isFieldInvalid('direccionFiscal')"
              />
              @if (isFieldInvalid('direccionFiscal')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">La dirección es requerida para la guía de remisión.</p>
              }
            </div>

            <!-- Departamento -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Departamento *
              </label>
              <select
                formControlName="departamento"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
              >
                <option value="Lima">Lima</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Cusco">Cusco</option>
                <option value="La Libertad">La Libertad</option>
                <option value="Piura">Piura</option>
                <option value="Junín">Junín</option>
                <option value="Lambayeque">Lambayeque</option>
                <option value="Ancash">Ancash</option>
                <option value="Ica">Ica</option>
                <option value="Puno">Puno</option>
              </select>
            </div>
          </div>

        </div>

        <!-- Bloque 2: Contacto de Recepción y Despacho -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-5 shadow-xs">
          <h3 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            2. Contacto de Recepción en Almacén
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <!-- Nombre de Contacto -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Responsable de Recepción *
              </label>
              <input
                type="text"
                formControlName="contactoNombre"
                placeholder="Ej. Ing. Juan Pérez"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                [class.border-rose-400]="isFieldInvalid('contactoNombre')"
                [class.border-slate-200]="!isFieldInvalid('contactoNombre')"
              />
            </div>

            <!-- Teléfono Celular -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp Móvil *
              </label>
              <input
                type="tel"
                formControlName="contactoTelefono"
                placeholder="999 888 777"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                [class.border-rose-400]="isFieldInvalid('contactoTelefono')"
                [class.border-slate-200]="!isFieldInvalid('contactoTelefono')"
              />
            </div>

            <!-- Correo Comprobantes -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Correo para Facturas XML/PDF *
              </label>
              <input
                type="email"
                formControlName="contactoCorreo"
                placeholder="facturacion@tuempresa.pe"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                [class.border-rose-400]="isFieldInvalid('contactoCorreo')"
                [class.border-slate-200]="!isFieldInvalid('contactoCorreo')"
              />
            </div>
          </div>
        </div>

        <!-- Bloque 3: Método de Pago B2B -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-5 shadow-xs">
          <h3 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            3. Método de Pago Corporativo B2B
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Opción 1: Transferencia -->
            <label
              class="relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between"
              [class.border-blue-600]="form.get('metodoPagoSimulado')?.value === 'TRANSFERENCIA_BANCARIA'"
              [class.bg-blue-50]="form.get('metodoPagoSimulado')?.value === 'TRANSFERENCIA_BANCARIA'"
              [class.border-slate-200]="form.get('metodoPagoSimulado')?.value !== 'TRANSFERENCIA_BANCARIA'"
            >
              <input
                type="radio"
                formControlName="metodoPagoSimulado"
                value="TRANSFERENCIA_BANCARIA"
                class="sr-only"
              />
              <div class="space-y-2">
                <div class="w-9 h-9 rounded-xl bg-blue-100 text-[#1E50C0] flex items-center justify-center font-bold">
                  🏦
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-[#142238]">Transferencia Bancaria</h4>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  Pago contra orden mediante cuentas corrientes BCP, BBVA o Interbank en Soles.
                </p>
              </div>
              <span class="mt-3 text-[10px] font-bold text-[#1E50C0]">Recomendado Mayorista</span>
            </label>

            <!-- Opción 2: Línea de Crédito -->
            <label
              class="relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between"
              [class.border-blue-600]="form.get('metodoPagoSimulado')?.value === 'LINEA_CREDITO_B2B'"
              [class.bg-blue-50]="form.get('metodoPagoSimulado')?.value === 'LINEA_CREDITO_B2B'"
              [class.border-slate-200]="form.get('metodoPagoSimulado')?.value !== 'LINEA_CREDITO_B2B'"
            >
              <input
                type="radio"
                formControlName="metodoPagoSimulado"
                value="LINEA_CREDITO_B2B"
                class="sr-only"
              />
              <div class="space-y-2">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  📄
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-[#142238]">Línea de Crédito 30 días</h4>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  Facturación diferida para empresas homologadas con línea aprobada por el proveedor.
                </p>
              </div>
              <span class="mt-3 text-[10px] font-bold text-emerald-700">Crédito B2B</span>
            </label>

            <!-- Opción 3: Tarjeta Corporativa -->
            <label
              class="relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between"
              [class.border-blue-600]="form.get('metodoPagoSimulado')?.value === 'TARJETA_EMPRESARIAL'"
              [class.bg-blue-50]="form.get('metodoPagoSimulado')?.value === 'TARJETA_EMPRESARIAL'"
              [class.border-slate-200]="form.get('metodoPagoSimulado')?.value !== 'TARJETA_EMPRESARIAL'"
            >
              <input
                type="radio"
                formControlName="metodoPagoSimulado"
                value="TARJETA_EMPRESARIAL"
                class="sr-only"
              />
              <div class="space-y-2">
                <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  💳
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-[#142238]">Tarjeta Empresarial</h4>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  Cargo inmediato con tarjeta Visa o Mastercard Business / Corporate sin recargos.
                </p>
              </div>
              <span class="mt-3 text-[10px] font-bold text-purple-700">Procesamiento Seguro</span>
            </label>

          </div>

          <!-- Notas del Pedido -->
          <div class="pt-3">
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              Instrucciones de Despacho u Horario de Recepción (Opcional)
            </label>
            <textarea
              formControlName="notasPedido"
              rows="2"
              placeholder="Ej. Dejar en puerta 3 con orden de entrega; horario de almacén hasta las 17:00..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Botón de Continuación al Paso 2 -->
        <div class="flex items-center justify-between pt-4">
          <a
            routerLink="/carrito"
            class="px-6 py-3 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            ← Volver al Carrito
          </a>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="px-8 py-3.5 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>Continuar a Revisión del Pedido</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </form>

    </div>
  `
})
export class BillingStepComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly checkoutState = inject(CheckoutStateService);
  private readonly authState = inject(AuthStateService);

  @Output() nextStep = new EventEmitter<void>();

  public form!: FormGroup;

  ngOnInit(): void {
    const existing = this.checkoutState.billingData();
    const user = this.authState.currentUser();

    this.form = this.fb.group({
      ruc: [existing?.ruc || user?.ruc || '', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      razonSocial: [existing?.razonSocial || user?.razonSocial || user?.nombreCompleto || '', [Validators.required, Validators.minLength(4)]],
      direccionFiscal: [existing?.direccionFiscal || user?.direccion || '', [Validators.required, Validators.minLength(6)]],
      departamento: [existing?.departamento || 'Lima', [Validators.required]],
      contactoNombre: [existing?.contactoNombre || user?.nombreCompleto || user?.nombre || '', [Validators.required]],
      contactoTelefono: [existing?.contactoTelefono || user?.telefono || '', [Validators.required, Validators.minLength(7)]],
      contactoCorreo: [existing?.contactoCorreo || user?.correo || '', [Validators.required, Validators.email]],
      metodoPagoSimulado: [existing?.metodoPagoSimulado || 'TRANSFERENCIA_BANCARIA', [Validators.required]],
      notasPedido: [existing?.notasPedido || '']
    });
  }

  public isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: CheckoutBillingData = this.form.value;
    this.checkoutState.setBillingData(data);
    this.nextStep.emit();
  }
}
