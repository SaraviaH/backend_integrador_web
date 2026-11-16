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
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 shadow-sm">
        <div class="flex items-center gap-2 text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] uppercase tracking-wider mb-1">
          <span class="w-2 h-2 rounded-full bg-[#1786B4] dark:bg-[#4FB3DA]"></span>
          Paso 1 de 3 · Facturación Electrónica SUNAT
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-[#04202E] dark:text-[#F2F9FC] tracking-tight font-display">
          Datos Fiscales de Facturación y Despacho
        </h2>
        <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF] mt-1">
          Ingresa la información fiscal de tu empresa (RUC, razón social, dirección fiscal y modalidad de pago) para la emisión de los comprobantes por cada proveedor.
        </p>
      </div>

      <!-- Formulario de Facturación Reactivo -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- PRIMERA FILA: DOS COLUMNAS CON ALTURAS ARMONIZADAS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch" data-testid="billing-top-row">

          <!-- Columna Izquierda: 1. Razón Social y Domicilio Fiscal -->
          <section
            class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-sm h-full"
            data-testid="billing-fiscal-card"
          >
            <div class="space-y-5">
              <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] uppercase tracking-wider pb-3 border-b border-[#E1F2FA] dark:border-[#1D4960] flex items-center gap-2">
                <svg class="w-4 h-4 text-[#1786B4] dark:text-[#4FB3DA] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                1. Razón Social y Domicilio Fiscal
              </h3>

              <!-- 2 filas de campos alineadas -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5">
                <!-- Fila 1 Col A: RUC -->
                <div class="sm:col-span-5">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    RUC de la Empresa (11 dígitos) *
                  </label>
                  <input
                    type="text"
                    formControlName="ruc"
                    maxlength="11"
                    placeholder="20XXXXXXXXX"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] font-mono outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                    [ngClass]="isFieldInvalid('ruc') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                  />
                  @if (isFieldInvalid('ruc')) {
                    <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5 font-medium">El RUC debe tener exactamente 11 dígitos numéricos.</p>
                  }
                </div>

                <!-- Fila 1 Col B: Razón Social -->
                <div class="sm:col-span-7">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    Razón Social *
                  </label>
                  <input
                    type="text"
                    formControlName="razonSocial"
                    placeholder="Ej. TECNOLOGIAS DEL SUR SAC"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                    [ngClass]="isFieldInvalid('razonSocial') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                  />
                  @if (isFieldInvalid('razonSocial')) {
                    <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5 font-medium">Ingresa la razón social completa.</p>
                  }
                </div>

                <!-- Fila 2 Col A: Dirección Fiscal -->
                <div class="sm:col-span-8">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    Dirección Fiscal / Destino de Despacho *
                  </label>
                  <input
                    type="text"
                    formControlName="direccionFiscal"
                    placeholder="Av. Principal 123, Of. 401"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                    [ngClass]="isFieldInvalid('direccionFiscal') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                  />
                  @if (isFieldInvalid('direccionFiscal')) {
                    <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5 font-medium">La dirección es requerida para la guía de remisión.</p>
                  }
                </div>

                <!-- Fila 2 Col B: Departamento -->
                <div class="sm:col-span-4">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    Departamento *
                  </label>
                  <select
                    formControlName="departamento"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
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

            <div class="pt-3 border-t border-[#E1F2FA] dark:border-[#1D4960] text-[11px] text-[#527588] dark:text-[#B8DFEF]">
              Información fiscal obligatoria para emisión de comprobantes electrónicos SUNAT y guía de remisión.
            </div>
          </section>

          <!-- Columna Derecha: 2. Contacto de Recepción en Almacén -->
          <section
            class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 flex flex-col justify-between gap-5 shadow-sm h-full"
            data-testid="billing-contact-card"
          >
            <div class="space-y-5">
              <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] uppercase tracking-wider pb-3 border-b border-[#E1F2FA] dark:border-[#1D4960] flex items-center gap-2">
                <svg class="w-4 h-4 text-[#1786B4] dark:text-[#4FB3DA] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                2. Contacto de Recepción en Almacén
              </h3>

              <!-- 2 filas de campos armonizadas con la tarjeta izquierda -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <!-- Fila 1 Col A: Nombre de Contacto -->
                <div class="sm:col-span-1">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    Responsable de Recepción *
                  </label>
                  <input
                    type="text"
                    formControlName="contactoNombre"
                    placeholder="Ej. Ing. Juan Pérez"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                    [ngClass]="isFieldInvalid('contactoNombre') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                  />
                </div>

                <!-- Fila 1 Col B: Teléfono Celular -->
                <div class="sm:col-span-1">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    Teléfono / WhatsApp Móvil *
                  </label>
                  <input
                    type="tel"
                    formControlName="contactoTelefono"
                    placeholder="999 888 777"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                    [ngClass]="isFieldInvalid('contactoTelefono') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                  />
                </div>

                <!-- Fila 2 Ancho Completo: Correo Comprobantes -->
                <div class="sm:col-span-2">
                  <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                    Correo para Facturas XML/PDF *
                  </label>
                  <input
                    type="email"
                    formControlName="contactoCorreo"
                    placeholder="facturacion@tuempresa.pe"
                    class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                    [ngClass]="isFieldInvalid('contactoCorreo') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                  />
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-[#E1F2FA] dark:border-[#1D4960] text-[11px] text-[#527588] dark:text-[#B8DFEF]">
              Contacto autorizado en almacén para coordinación de entrega y envío de facturas XML/PDF.
            </div>
          </section>

        </div>

        <!-- SEGUNDA FILA: ANCHO COMPLETO — 3. MÉTODO DE PAGO CORPORATIVO B2B -->
        <section
          class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 space-y-6 shadow-sm"
          data-testid="billing-payment-card"
        >
          <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] uppercase tracking-wider pb-3 border-b border-[#E1F2FA] dark:border-[#1D4960] flex items-center gap-2">
            <svg class="w-4 h-4 text-[#1786B4] dark:text-[#4FB3DA] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            3. Método de Pago Corporativo B2B
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            <!-- Opción 1: Transferencia -->
            <label
              class="relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between"
              [ngClass]="form.get('metodoPagoSimulado')?.value === 'TRANSFERENCIA_BANCARIA'
                ? 'border-[#1786B4] dark:border-[#4FB3DA] bg-[#E1F2FA]/50 dark:bg-[#1786B4]/20 shadow-sm'
                : 'border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC]/60 dark:bg-[#0A2535] hover:border-[#4FB3DA]'"
            >
              <input
                type="radio"
                formControlName="metodoPagoSimulado"
                value="TRANSFERENCIA_BANCARIA"
                class="sr-only"
              />
              <div class="space-y-2.5">
                <div class="w-9 h-9 rounded-xl bg-[#E1F2FA] dark:bg-[#0F3043] text-[#1786B4] dark:text-[#4FB3DA] border border-[#98D5EE]/50 dark:border-[#1D4960] flex items-center justify-center font-bold">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">Transferencia Bancaria</h4>
                <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] leading-relaxed">
                  Pago contra orden mediante cuentas corrientes BCP, BBVA o Interbank en Soles.
                </p>
              </div>
              <span class="mt-3 text-[10px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">Recomendado Mayorista</span>
            </label>

            <!-- Opción 2: Línea de Crédito -->
            <label
              class="relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between"
              [ngClass]="form.get('metodoPagoSimulado')?.value === 'LINEA_CREDITO_B2B'
                ? 'border-[#1786B4] dark:border-[#4FB3DA] bg-[#E1F2FA]/50 dark:bg-[#1786B4]/20 shadow-sm'
                : 'border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC]/60 dark:bg-[#0A2535] hover:border-[#4FB3DA]'"
            >
              <input
                type="radio"
                formControlName="metodoPagoSimulado"
                value="LINEA_CREDITO_B2B"
                class="sr-only"
              />
              <div class="space-y-2.5">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-bold">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">Línea de Crédito 30 días</h4>
                <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] leading-relaxed">
                  Facturación diferida para empresas homologadas con línea aprobada por el proveedor.
                </p>
              </div>
              <span class="mt-3 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Crédito B2B</span>
            </label>

            <!-- Opción 3: Tarjeta Corporativa -->
            <label
              class="relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between sm:col-span-2 lg:col-span-1"
              [ngClass]="form.get('metodoPagoSimulado')?.value === 'TARJETA_EMPRESARIAL'
                ? 'border-[#1786B4] dark:border-[#4FB3DA] bg-[#E1F2FA]/50 dark:bg-[#1786B4]/20 shadow-sm'
                : 'border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC]/60 dark:bg-[#0A2535] hover:border-[#4FB3DA]'"
            >
              <input
                type="radio"
                formControlName="metodoPagoSimulado"
                value="TARJETA_EMPRESARIAL"
                class="sr-only"
              />
              <div class="space-y-2.5">
                <div class="w-9 h-9 rounded-xl bg-[#F4F9FC] dark:bg-[#0F3043] text-[#04202E] dark:text-[#E1F2FA] border border-[#CFE4EE] dark:border-[#1D4960] flex items-center justify-center font-bold">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 class="text-xs sm:text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">Tarjeta Empresarial</h4>
                <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] leading-relaxed">
                  Cargo inmediato con tarjeta Visa o Mastercard Business / Corporate sin recargos.
                </p>
              </div>
              <span class="mt-3 text-[10px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">Procesamiento Corporativo</span>
            </label>

          </div>

          <!-- Instrucciones de despacho debajo de las opciones de pago -->
          <div class="pt-5 border-t border-[#E1F2FA] dark:border-[#1D4960] space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                Instrucciones de Despacho u Horario de Recepción (Opcional)
              </label>
              <textarea
                formControlName="notasPedido"
                rows="2"
                placeholder="Ej. Dejar en puerta 3 con orden de entrega; horario de almacén hasta las 17:00..."
                class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none resize-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
              ></textarea>
            </div>

            <!-- Nota de alcance de datos -->
            <div class="p-4 rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] text-[11px] text-[#527588] dark:text-[#B8DFEF]">
              El <strong class="text-[#04202E] dark:text-[#F2F9FC]">RUC, razón social, dirección fiscal y método de pago</strong> se registran en la orden enviada al servidor; el departamento, contacto en almacén e instrucciones quedan como referencia operativa de esta sesión.
            </div>
          </div>
        </section>

        <!-- Botón de Continuación al Paso 2 -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
          <a
            routerLink="/carrito"
            class="px-6 py-3 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0F3043] text-xs font-semibold text-[#0A3C55] dark:text-[#E1F2FA] hover:bg-[#E1F2FA]/50 dark:hover:bg-[#1D4960]/60 transition-colors"
          >
            ← Volver al Carrito
          </a>

          <button
            type="submit"
            [disabled]="form.invalid"
            class="px-8 py-3.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] disabled:bg-slate-300 dark:disabled:bg-[#1D4960] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
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
