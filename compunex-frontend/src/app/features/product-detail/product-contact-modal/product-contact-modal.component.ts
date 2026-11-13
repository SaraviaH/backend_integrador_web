import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDetail, ProductContactInquiry } from '../../../core/models/catalog.model';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { AuthStateService } from '../../../core/state/auth-state.service';

@Component({
  selector: 'app-product-contact-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen && product) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop Blur -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" (click)="onClose()"></div>

        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-slate-200">
            
            <!-- Encabezado del Modal P-05 -->
            <div class="bg-gradient-to-r from-[#142238] to-[#1E50C0] p-6 text-white relative">
              <button
                type="button"
                (click)="onClose()"
                class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Cerrar modal"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="flex items-center gap-2 text-xs text-blue-200 font-semibold mb-1">
                <svg class="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Canal Directo Proveedor · B2B
              </div>

              <h2 id="modal-title" class="text-xl font-bold tracking-tight">
                Contactar a {{ product.proveedorRazonSocial }}
              </h2>
              <p class="text-xs text-blue-100/90 mt-1 line-clamp-1">
                Consulta sobre: <span class="font-semibold">{{ product.nombre }}</span> (SKU: {{ product.sku }})
              </p>
            </div>

            <!-- Ficha resumida del Proveedor -->
            <div class="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>RUC: <strong class="text-slate-800">{{ product.proveedorRuc }}</strong></span>
              </div>
              <div class="flex items-center gap-1 text-amber-600 font-semibold">
                <span>★</span>
                <span>{{ product.proveedorCalificacion || '4.9' }} Calificación</span>
              </div>
            </div>

            <!-- Cuerpo del Modal -->
            <div class="p-6">

              @if (isSubmitted()) {
                <!-- Estado Exitoso de Envío -->
                <div class="text-center py-8 space-y-4">
                  <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-[#142238]">¡Solicitud de Contacto Enviada!</h3>
                    <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                      El equipo comercial de <strong>{{ product.proveedorRazonSocial }}</strong> ha recibido tu mensaje. Te responderán a la brevedad con tu cotización por volumen.
                    </p>
                  </div>
                  <button
                    type="button"
                    (click)="onClose()"
                    class="px-6 py-2.5 rounded-full bg-[#1E50C0] text-white text-xs font-semibold hover:bg-[#1842A0] transition-colors shadow-xs"
                  >
                    Entendido y Volver
                  </button>
                </div>
              } @else {
                <!-- Formulario de Consulta Comercial -->
                <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Nombre Contacto -->
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre o Contacto *
                      </label>
                      <input
                        type="text"
                        formControlName="nombreContacto"
                        placeholder="Ej. Ing. Juan Morales"
                        class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-[#142238] outline-none transition-colors"
                        [class.border-rose-400]="isFieldInvalid('nombreContacto')"
                        [class.border-slate-200]="!isFieldInvalid('nombreContacto')"
                      />
                      @if (isFieldInvalid('nombreContacto')) {
                        <p class="text-[10px] text-rose-500 mt-1">Ingresa el nombre del solicitante.</p>
                      }
                    </div>

                    <!-- RUC Empresa -->
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        RUC de tu Empresa (Opcional)
                      </label>
                      <input
                        type="text"
                        formControlName="empresaRuc"
                        maxlength="11"
                        placeholder="20XXXXXXXXX"
                        class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-[#142238] outline-none transition-colors"
                        [class.border-rose-400]="isFieldInvalid('empresaRuc')"
                        [class.border-slate-200]="!isFieldInvalid('empresaRuc')"
                      />
                      @if (isFieldInvalid('empresaRuc')) {
                        <p class="text-[10px] text-rose-500 mt-1">El RUC debe tener 11 dígitos numéricos.</p>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- Correo Corporativo -->
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Correo Corporativo *
                      </label>
                      <input
                        type="email"
                        formControlName="correo"
                        placeholder="compras@tuempresa.pe"
                        class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-[#142238] outline-none transition-colors"
                        [class.border-rose-400]="isFieldInvalid('correo')"
                        [class.border-slate-200]="!isFieldInvalid('correo')"
                      />
                      @if (isFieldInvalid('correo')) {
                        <p class="text-[10px] text-rose-500 mt-1">Ingresa un correo electrónico válido.</p>
                      }
                    </div>

                    <!-- Teléfono / WhatsApp -->
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        formControlName="telefono"
                        placeholder="999 000 000"
                        class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-[#142238] outline-none transition-colors"
                        [class.border-rose-400]="isFieldInvalid('telefono')"
                        [class.border-slate-200]="!isFieldInvalid('telefono')"
                      />
                      @if (isFieldInvalid('telefono')) {
                        <p class="text-[10px] text-rose-500 mt-1">Ingresa un número telefónico de contacto.</p>
                      }
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <!-- Tipo de Consulta -->
                    <div class="sm:col-span-2">
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Tipo de Consulta Comercial *
                      </label>
                      <select
                        formControlName="tipoConsulta"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#142238] outline-none"
                      >
                        <option value="COTIZACION_VOLUMEN">Cotización por lote mayorista especial</option>
                        <option value="CREDITO_MAYORISTA">Solicitud de línea de crédito a 30 días</option>
                        <option value="STOCK_INMEDIATO">Consulta de disponibilidad para entrega inmediata</option>
                        <option value="FICHA_TECNICA">Ficha técnica y homologación para licitación</option>
                        <option value="OTRO">Otra consulta comercial</option>
                      </select>
                    </div>

                    <!-- Cantidad Estimada -->
                    <div>
                      <label class="block text-xs font-semibold text-slate-700 mb-1">
                        Unidades aprox.
                      </label>
                      <input
                        type="number"
                        formControlName="cantidadEstimada"
                        [min]="product.cantidadMinimaMayorista || 1"
                        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#142238] outline-none"
                      />
                    </div>
                  </div>

                  <!-- Mensaje -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">
                      Mensaje o requerimiento técnico *
                    </label>
                    <textarea
                      formControlName="mensaje"
                      rows="3"
                      placeholder="Indica detalles de entrega, destino, especificaciones particulares o preguntas sobre el lote..."
                      class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-[#142238] outline-none resize-none transition-colors"
                      [class.border-rose-400]="isFieldInvalid('mensaje')"
                      [class.border-slate-200]="!isFieldInvalid('mensaje')"
                    ></textarea>
                    @if (isFieldInvalid('mensaje')) {
                      <p class="text-[10px] text-rose-500 mt-1">El mensaje debe tener al menos 10 caracteres.</p>
                    }
                  </div>

                  <!-- Botones de Acción -->
                  <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      (click)="onClose()"
                      class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      [disabled]="form.invalid || isSending()"
                      class="px-6 py-2 rounded-xl bg-[#1E50C0] hover:bg-[#1842A0] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      @if (isSending()) {
                        <svg class="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Enviando...</span>
                      } @else {
                        <span>Enviar Consulta Directa</span>
                      }
                    </button>
                  </div>

                </form>
              }

            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class ProductContactModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toastState = inject(ToastStateService);
  private readonly authState = inject(AuthStateService);

  @Input() isOpen = false;
  @Input() product: ProductDetail | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() inquirySent = new EventEmitter<ProductContactInquiry>();

  public readonly isSending = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);

  public readonly form: FormGroup = this.fb.group({
    nombreContacto: ['', [Validators.required, Validators.minLength(3)]],
    empresaRuc: ['', [Validators.pattern(/^[0-9]{11}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(7)]],
    tipoConsulta: ['COTIZACION_VOLUMEN', [Validators.required]],
    cantidadEstimada: [10],
    mensaje: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor() {
    // Si el usuario ya está autenticado, autocompletar sus datos comerciales
    const user = this.authState.currentUser();
    if (user) {
      this.form.patchValue({
        nombreContacto: user.nombreCompleto || user.nombre || '',
        empresaRuc: user.ruc || '',
        correo: user.correo || '',
        telefono: user.telefono || ''
      });
    }
  }

  public isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public onSubmit(): void {
    if (this.form.invalid || !this.product) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSending.set(true);

    const inquiry: ProductContactInquiry = {
      productoId: this.product.id,
      proveedorId: this.product.proveedorId,
      ...this.form.value
    };

    // Simulación de envío al servicio del proveedor
    setTimeout(() => {
      this.isSending.set(false);
      this.isSubmitted.set(true);
      this.inquirySent.emit(inquiry);
      this.toastState.success(
        'Mensaje Enviado',
        `Tu consulta comercial fue entregada al proveedor ${this.product?.proveedorRazonSocial}.`
      );
    }, 700);
  }

  public onClose(): void {
    this.isSubmitted.set(false);
    this.close.emit();
  }
}
