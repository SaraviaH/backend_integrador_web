import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDetail } from '../../../core/models/catalog.model';
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

            <!-- Encabezado del Modal -->
            <div class="bg-gradient-to-r from-brand-night to-brand-primary p-6 text-white relative">
              <button
                type="button"
                (click)="onClose()"
                class="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="flex items-center gap-2 text-xs text-brand-ice font-semibold mb-1">
                <svg class="w-4 h-4 text-brand-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contacto Directo con Proveedor B2B
              </div>

              <h2 id="modal-title" class="text-xl font-bold tracking-tight pr-8">
                {{ product.proveedorRazonSocial }}
              </h2>
              <p class="text-xs text-brand-tint/90 mt-1 line-clamp-1">
                Producto: <span class="font-semibold">{{ product.nombre }}</span> (SKU: {{ product.sku }})
              </p>
            </div>

            <!-- Datos reales del proveedor -->
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200/70 space-y-2 text-xs text-slate-600">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>RUC: <strong class="text-brand-night font-mono">{{ product.proveedorRuc }}</strong></span>
                </div>
                @if (product.proveedorCiudad) {
                  <span class="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold">
                    {{ product.proveedorCiudad }}
                  </span>
                }
              </div>

              <div class="flex flex-wrap items-center gap-4 pt-1">
                @if (product.proveedorCorreo) {
                  <a
                    [href]="'mailto:' + product.proveedorCorreo"
                    class="inline-flex items-center gap-1.5 text-brand-primary font-semibold hover:underline"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ product.proveedorCorreo }}
                  </a>
                }
                @if (product.proveedorTelefono) {
                  <a
                    [href]="'tel:' + product.proveedorTelefono"
                    class="inline-flex items-center gap-1.5 text-brand-night font-semibold hover:text-brand-primary"
                  >
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ product.proveedorTelefono }}
                  </a>
                }
              </div>
            </div>

            <!-- Cuerpo del Modal -->
            <div class="p-6 space-y-5">
              <!-- Aviso transparente sobre la limitación del backend -->
              <div class="p-3.5 rounded-2xl bg-brand-tint border border-brand-ice/80 text-[11px] text-brand-night leading-relaxed">
                <strong class="text-brand-primary block mb-0.5">Canal de contacto externo</strong>
                La mensajería interna automatizada no está habilitada en el servidor actual. Completa los datos de tu consulta para copiar el resumen comercial o abrir un correo directo hacia el proveedor.
              </div>

              <form [formGroup]="form" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="contact-name" class="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre o Contacto *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      formControlName="nombreContacto"
                      placeholder="Ej. Ing. Juan Morales"
                      class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-brand-night outline-none transition-colors"
                      [class.border-rose-400]="isFieldInvalid('nombreContacto')"
                      [class.border-slate-200]="!isFieldInvalid('nombreContacto')"
                    />
                  </div>

                  <div>
                    <label for="contact-ruc" class="block text-xs font-semibold text-slate-700 mb-1">
                      RUC de tu Empresa (Opcional)
                    </label>
                    <input
                      id="contact-ruc"
                      type="text"
                      formControlName="empresaRuc"
                      maxlength="11"
                      placeholder="20XXXXXXXXX"
                      class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-brand-night outline-none transition-colors"
                      [class.border-rose-400]="isFieldInvalid('empresaRuc')"
                      [class.border-slate-200]="!isFieldInvalid('empresaRuc')"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="contact-email" class="block text-xs font-semibold text-slate-700 mb-1">
                      Correo Corporativo *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      formControlName="correo"
                      placeholder="compras@tuempresa.pe"
                      class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-brand-night outline-none transition-colors"
                      [class.border-rose-400]="isFieldInvalid('correo')"
                      [class.border-slate-200]="!isFieldInvalid('correo')"
                    />
                  </div>

                  <div>
                    <label for="contact-phone" class="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      formControlName="telefono"
                      placeholder="999 000 000"
                      class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-brand-night outline-none transition-colors"
                      [class.border-rose-400]="isFieldInvalid('telefono')"
                      [class.border-slate-200]="!isFieldInvalid('telefono')"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="sm:col-span-2">
                    <label for="contact-type" class="block text-xs font-semibold text-slate-700 mb-1">
                      Tipo de Consulta Comercial *
                    </label>
                    <select
                      id="contact-type"
                      formControlName="tipoConsulta"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night outline-none"
                    >
                      <option value="Cotización por volumen">Cotización por lote mayorista</option>
                      <option value="Línea de crédito B2B">Solicitud de línea de crédito</option>
                      <option value="Disponibilidad y entrega">Disponibilidad y tiempo de entrega</option>
                      <option value="Ficha técnica y homologación">Ficha técnica y homologación</option>
                      <option value="Otra consulta comercial">Otra consulta comercial</option>
                    </select>
                  </div>

                  <div>
                    <label for="contact-qty" class="block text-xs font-semibold text-slate-700 mb-1">
                      Unidades aprox.
                    </label>
                    <input
                      id="contact-qty"
                      type="number"
                      formControlName="cantidadEstimada"
                      min="1"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label for="contact-msg" class="block text-xs font-semibold text-slate-700 mb-1">
                    Mensaje o requerimiento técnico *
                  </label>
                  <textarea
                    id="contact-msg"
                    formControlName="mensaje"
                    rows="3"
                    placeholder="Indica detalles de entrega, destino, especificaciones particulares o preguntas sobre el lote..."
                    class="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-brand-night outline-none resize-none transition-colors"
                    [class.border-rose-400]="isFieldInvalid('mensaje')"
                    [class.border-slate-200]="!isFieldInvalid('mensaje')"
                  ></textarea>
                  @if (isFieldInvalid('mensaje')) {
                    <p class="text-[10px] text-rose-500 mt-1">El mensaje debe tener al menos 10 caracteres.</p>
                  }
                </div>

                <div class="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    (click)="onClose()"
                    class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    (click)="copyInquirySummary()"
                    class="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-brand-night text-xs font-bold transition-colors"
                  >
                    {{ copied() ? 'Solicitud copiada ✓' : 'Copiar solicitud' }}
                  </button>

                  @if (product.proveedorCorreo) {
                    <a
                      [href]="buildMailtoHref()"
                      (click)="onMailtoClick($event)"
                      class="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-1.5"
                    >
                      Abrir correo al proveedor
                    </a>
                  }
                </div>
              </form>
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

  public readonly copied = signal<boolean>(false);

  public readonly form: FormGroup = this.fb.group({
    nombreContacto: ['', [Validators.required, Validators.minLength(3)]],
    empresaRuc: ['', [Validators.pattern(/^[0-9]{11}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(7)]],
    tipoConsulta: ['Cotización por volumen', [Validators.required]],
    cantidadEstimada: [10, [Validators.min(1)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor() {
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

  public copyInquirySummary(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const text = this.formatSummaryText();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied.set(true);
        this.toastState.success('Resumen copiado', 'Puedes pegarlo en tu correo o canal comercial con el proveedor.');
      }).catch(() => {
        this.toastState.warning('Copiado manual', 'No se pudo acceder al portapapeles automáticamente.');
      });
    }
  }

  public buildMailtoHref(): string {
    if (!this.product?.proveedorCorreo) return '#';
    const subject = encodeURIComponent(`[COMPUNEX B2B] ${this.form.value.tipoConsulta || 'Consulta'} - ${this.product.nombre} (${this.product.sku})`);
    const body = encodeURIComponent(this.formatSummaryText());
    return `mailto:${this.product.proveedorCorreo}?subject=${subject}&body=${body}`;
  }

  public onMailtoClick(event: Event): void {
    if (this.form.invalid) {
      event.preventDefault();
      this.form.markAllAsTouched();
    }
  }

  private formatSummaryText(): string {
    const v = this.form.value;
    const p = this.product;
    return [
      `Producto: ${p?.nombre || ''} (SKU: ${p?.sku || ''})`,
      `Tipo de consulta: ${v.tipoConsulta}`,
      `Cantidad estimada: ${v.cantidadEstimada || 1} unidades`,
      `Solicitante: ${v.nombreContacto}${v.empresaRuc ? ' | RUC: ' + v.empresaRuc : ''}`,
      `Correo: ${v.correo} | Teléfono: ${v.telefono}`,
      `Mensaje: ${v.mensaje}`
    ].join('\n');
  }

  public onClose(): void {
    this.copied.set(false);
    this.close.emit();
  }
}
