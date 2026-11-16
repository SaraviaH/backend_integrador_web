import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderApiService } from '../../../core/services/provider-api.service';
import { AuthStateService } from '../../../core/state/auth-state.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-activate-provider',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/cuenta/perfil" class="hover:text-brand-primary transition-colors">Mi Cuenta</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Activar Perfil Proveedor</span>
      </nav>

      @if (authState.isProveedor()) {
        <div class="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-5 shadow-xs max-w-xl mx-auto">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl">
            ✓
          </div>
          <div class="space-y-1">
            <h2 class="text-xl font-bold text-brand-night">¡Tu Perfil de Proveedor ya está Activo!</h2>
            <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Tu cuenta cuenta con los permisos de proveedor. Ya puedes gestionar tu catálogo mayorista y despachar ventas desde tu panel.
            </p>
          </div>
          <div class="pt-2">
            <a
              routerLink="/panel"
              class="px-8 py-3 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <span>Ir al Panel de Proveedor</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      } @else {

        <!-- Encabezado -->
        <div class="bg-gradient-to-r from-brand-night to-brand-primary rounded-3xl p-6 md:p-10 text-white space-y-4 shadow-md">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-ice text-xs font-semibold backdrop-blur-xs">
            Expande tu canal mayorista B2B
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight font-display">
            Activar Cuenta de Proveedor Mayorista
          </h1>
          <p class="text-xs sm:text-sm text-brand-tint max-w-2xl leading-relaxed">
            Publica tus productos en el marketplace COMPUNEX, recibe subórdenes corporativas independientes y gestiona tus despachos desde el panel de proveedor.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-brand-tint">
            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span class="text-emerald-300 font-bold">✓</span>
              <span>Catálogo B2B propio</span>
            </div>
            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span class="text-emerald-300 font-bold">✓</span>
              <span>Emisión directa con tu RUC</span>
            </div>
            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span class="text-emerald-300 font-bold">✓</span>
              <span>Gestión de ventas y despacho</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Activación alineado con ActivarProveedorRequestDTO -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">

          <h2 class="text-sm font-bold text-brand-night uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Datos Comerciales de Distribución
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="prov-ruc" class="block text-xs font-semibold text-slate-700 mb-1.5">
                RUC de la Empresa (11 dígitos) *
              </label>
              <input
                id="prov-ruc"
                type="text"
                maxlength="11"
                formControlName="ruc"
                placeholder="Ej. 20601234567"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night font-mono outline-none"
                [class.border-rose-400]="isFieldInvalid('ruc')"
                [class.border-slate-200]="!isFieldInvalid('ruc')"
              />
              @if (isFieldInvalid('ruc')) {
                <p class="text-[11px] text-rose-500 mt-1">El RUC debe tener 11 dígitos numéricos.</p>
              }
            </div>

            <div>
              <label for="prov-razon" class="block text-xs font-semibold text-slate-700 mb-1.5">
                Razón Social *
              </label>
              <input
                id="prov-razon"
                type="text"
                formControlName="razonSocial"
                placeholder="Ej. AndesTech Mayorista S.A.C."
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                [class.border-rose-400]="isFieldInvalid('razonSocial')"
                [class.border-slate-200]="!isFieldInvalid('razonSocial')"
              />
              @if (isFieldInvalid('razonSocial')) {
                <p class="text-[11px] text-rose-500 mt-1">Ingresa la razón social (mínimo 3 caracteres).</p>
              }
            </div>

            <div class="sm:col-span-2">
              <label for="prov-dir" class="block text-xs font-semibold text-slate-700 mb-1.5">
                Dirección Fiscal / Almacén *
              </label>
              <input
                id="prov-dir"
                type="text"
                formControlName="direccion"
                placeholder="Ej. Av. Javier Prado Este 4200, Lima"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                [class.border-rose-400]="isFieldInvalid('direccion')"
                [class.border-slate-200]="!isFieldInvalid('direccion')"
              />
              @if (isFieldInvalid('direccion')) {
                <p class="text-[11px] text-rose-500 mt-1">Ingresa la dirección del almacén o sede fiscal.</p>
              }
            </div>

            <div>
              <label for="prov-nombre" class="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre Comercial de la Marca / Tienda *
              </label>
              <input
                id="prov-nombre"
                type="text"
                formControlName="nombreComercial"
                placeholder="Ej. AndesTech Mayorista"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                [class.border-rose-400]="isFieldInvalid('nombreComercial')"
                [class.border-slate-200]="!isFieldInvalid('nombreComercial')"
              />
              @if (isFieldInvalid('nombreComercial')) {
                <p class="text-[11px] text-rose-500 mt-1">Ingresa el nombre comercial.</p>
              }
            </div>

            <div>
              <label for="prov-anos" class="block text-xs font-semibold text-slate-700 mb-1.5">
                Experiencia en el Mercado (Opcional)
              </label>
              <input
                id="prov-anos"
                type="text"
                formControlName="anosMercado"
                placeholder="Ej. 8 años en distribución TI"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="prov-tel" class="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp de Ventas Mayoristas *
              </label>
              <input
                id="prov-tel"
                type="tel"
                formControlName="telefonoComercial"
                placeholder="999 888 777"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                [class.border-rose-400]="isFieldInvalid('telefonoComercial')"
                [class.border-slate-200]="!isFieldInvalid('telefonoComercial')"
              />
              @if (isFieldInvalid('telefonoComercial')) {
                <p class="text-[11px] text-rose-500 mt-1">Ingresa un teléfono válido (mínimo 7 dígitos).</p>
              }
            </div>

            <div>
              <label for="prov-ciudad" class="block text-xs font-semibold text-slate-700 mb-1.5">
                Almacén / Ciudad de Despacho Principal *
              </label>
              <input
                id="prov-ciudad"
                type="text"
                formControlName="ciudadAlmacen"
                placeholder="Ej. Lima Metropolitana"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                [class.border-rose-400]="isFieldInvalid('ciudadAlmacen')"
                [class.border-slate-200]="!isFieldInvalid('ciudadAlmacen')"
              />
              @if (isFieldInvalid('ciudadAlmacen')) {
                <p class="text-[11px] text-rose-500 mt-1">Indica la ciudad principal de despacho.</p>
              }
            </div>
          </div>

          <div>
            <label for="prov-desc" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Descripción Comercial y Marcas Oficiales Representadas *
            </label>
            <textarea
              id="prov-desc"
              formControlName="descripcion"
              rows="3"
              placeholder="Detalla las líneas y marcas que distribuyes, tiempos promedio de despacho y cobertura..."
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none resize-none"
              [class.border-rose-400]="isFieldInvalid('descripcion')"
              [class.border-slate-200]="!isFieldInvalid('descripcion')"
            ></textarea>
            @if (isFieldInvalid('descripcion')) {
              <p class="text-[11px] text-rose-500 mt-1">La descripción debe tener al menos 15 caracteres.</p>
            }
          </div>

          <div>
            <label for="prov-politica" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Política Comercial y Garantía (Opcional)
            </label>
            <textarea
              id="prov-politica"
              formControlName="politicaComercial"
              rows="2"
              placeholder="Ej. Despacho en 24-48 horas hábiles en Lima. Garantía oficial directa con el fabricante..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-brand-night outline-none resize-none"
            ></textarea>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                formControlName="aceptaTerminos"
                class="w-4 h-4 rounded text-brand-primary border-slate-300 focus:ring-brand-primary mt-0.5"
              />
              <span class="text-xs text-slate-600 leading-relaxed">
                Acepto los términos de intermediación mayorista de COMPUNEX B2B y me comprometo a atender las subórdenes asignadas con comprobante válido.
              </span>
            </label>
            @if (isFieldInvalid('aceptaTerminos')) {
              <p class="text-[11px] text-rose-500 font-medium">Debes aceptar los términos comerciales para activar tu rol de proveedor.</p>
            }
          </div>

          <div class="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              [disabled]="form.invalid || isActivating()"
              class="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              @if (isActivating()) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Activando Rol de Proveedor...</span>
              } @else {
                <span>Activar Perfil Mayorista Ahora</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
              }
            </button>
          </div>

        </form>
      }

    </div>
  `
})
export class ActivateProviderComponent {
  private readonly fb = inject(FormBuilder);
  private readonly providerApi = inject(ProviderApiService);
  public readonly authState = inject(AuthStateService);
  private readonly toastState = inject(ToastStateService);
  private readonly router = inject(Router);

  public readonly isActivating = signal<boolean>(false);

  public readonly form: FormGroup = this.fb.group({
    ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    razonSocial: ['', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    nombreComercial: ['', [Validators.required, Validators.minLength(3)]],
    anosMercado: [''],
    telefonoComercial: ['', [Validators.required, Validators.minLength(7)]],
    ciudadAlmacen: ['Lima Metropolitana', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(15)]],
    politicaComercial: [''],
    aceptaTerminos: [false, [Validators.requiredTrue]]
  });

  constructor() {
    const user = this.authState.currentUser();
    if (user) {
      this.form.patchValue({
        ruc: user.ruc || '',
        razonSocial: user.razonSocial || user.nombreCompleto || '',
        direccion: user.direccion || '',
        nombreComercial: user.nombreComercial || user.razonSocial || user.nombreCompleto || '',
        telefonoComercial: user.telefono || ''
      });
    }
  }

  public isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public onSubmit(): void {
    if (this.isActivating()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isActivating.set(true);

    const val = this.form.value;
    const payload = {
      ruc: val.ruc,
      razonSocial: val.razonSocial,
      nombreComercial: val.nombreComercial,
      telefonoContacto: val.telefonoComercial,
      direccion: val.direccion,
      ciudad: val.ciudadAlmacen,
      anosMercado: val.anosMercado?.trim() || undefined,
      descripcion: val.descripcion,
      politicaComercial: val.politicaComercial?.trim() || undefined
    };

    this.providerApi.activateProvider(payload).subscribe({
      next: (res) => {
        this.isActivating.set(false);
        this.authState.setProviderRole(res.data?.token);
        const cur = this.authState.currentUser();
        if (cur) {
          this.authState.updateProfile({
            ...cur,
            rol: 'ROLE_PROVEEDOR',
            tienePerfilProveedor: true,
            ruc: val.ruc,
            razonSocial: val.razonSocial,
            nombreComercial: val.nombreComercial,
            telefono: val.telefonoComercial,
            direccion: val.direccion,
            ciudad: val.ciudadAlmacen
          });
        }
        this.toastState.success(
          '¡Perfil de Proveedor Activado!',
          'Bienvenido a la red de proveedores mayoristas de COMPUNEX. Ya tienes acceso a tu panel.'
        );
        this.router.navigate(['/panel']);
      },
      error: (err) => {
        this.isActivating.set(false);
        const msg = err?.error?.mensaje || err?.error?.message || 'Ocurrió un error al procesar tu solicitud.';
        this.toastState.error('Error al activar', msg);
      }
    });
  }
}
