import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/cuenta/perfil" class="hover:text-[#2456C6] transition-colors">Mi Cuenta</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Activar Perfil Proveedor</span>
      </nav>

      <!-- Si ya tiene rol de proveedor activo -->
      @if (authState.isProveedor()) {
        <div class="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-5 shadow-xs max-w-xl mx-auto">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl">
            ✓
          </div>
          <div class="space-y-1">
            <h2 class="text-xl font-bold text-[#142238]">¡Tu Perfil de Proveedor ya está Activo!</h2>
            <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Tu cuenta cuenta con los permisos de <strong>ROLE_PROVEEDOR</strong>. Ya puedes gestionar tu catálogo mayorista y despachar ventas desde tu panel.
            </p>
          </div>
          <div class="pt-2">
            <a
              routerLink="/panel"
              class="px-8 py-3 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <span>Ir al Panel de Proveedor</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      } @else {
        
        <!-- Encabezado de la Pantalla P-18 -->
        <div class="bg-gradient-to-r from-[#142238] to-[#1E50C0] rounded-3xl p-6 md:p-10 text-white space-y-4 shadow-md">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs">
            <span>🚀</span> Expande tu canal mayorista B2B
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight font-display">
            Activar Cuenta de Proveedor Mayorista
          </h1>
          <p class="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Publica tus inventarios de hardware y componentes en el marketplace COMPUNEX. Recibe órdenes consolidadas, gestiona despachos y emite facturas electrónicas con Split Order ACID.
          </p>

          <!-- Beneficios Clave -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs text-blue-100">
            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span class="text-emerald-300 font-bold">✓</span>
              <span>Comisiones B2B preferenciales</span>
            </div>
            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span class="text-emerald-300 font-bold">✓</span>
              <span>Facturación directa con tu RUC</span>
            </div>
            <div class="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span class="text-emerald-300 font-bold">✓</span>
              <span>Panel de métricas y catálogo propio</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Activación P-18 -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
          
          <h2 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Datos Comerciales de Distribución
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Nombre Comercial -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Nombre Comercial de la Marca / Tienda *
              </label>
              <input
                type="text"
                formControlName="nombreComercial"
                placeholder="Ej. AndesTech Mayorista"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                [class.border-rose-400]="isFieldInvalid('nombreComercial')"
                [class.border-slate-200]="!isFieldInvalid('nombreComercial')"
              />
              @if (isFieldInvalid('nombreComercial')) {
                <p class="text-[11px] text-rose-500 mt-1">Ingresa el nombre comercial.</p>
              }
            </div>

            <!-- Categoría Principal -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Línea Principal de Distribución *
              </label>
              <select
                formControlName="categoriaPrincipal"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
              >
                <option value="Laptops y Computadoras">Laptops, Workstations y Servidores</option>
                <option value="Componentes">Tarjetas de Video, Procesadores, Placas</option>
                <option value="Almacenamiento">SSDs NVMe, Discos Duros Enterprise</option>
                <option value="Monitores">Monitores Profesionales y Gaming</option>
                <option value="Redes">Switches, Routers, Racks y Conectividad</option>
                <option value="Periféricos">Teclados, Ratones, Fuentes de Poder</option>
              </select>
            </div>
          </div>

          <!-- Teléfono / WhatsApp Comercial -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp de Ventas Mayoristas *
              </label>
              <input
                type="tel"
                formControlName="telefonoComercial"
                placeholder="999 888 777"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                [class.border-rose-400]="isFieldInvalid('telefonoComercial')"
                [class.border-slate-200]="!isFieldInvalid('telefonoComercial')"
              />
              @if (isFieldInvalid('telefonoComercial')) {
                <p class="text-[11px] text-rose-500 mt-1">Ingresa un teléfono válido.</p>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Almacén / Ciudad de Despacho Principal *
              </label>
              <input
                type="text"
                formControlName="ciudadAlmacen"
                placeholder="Ej. Lima Metropolitana"
                class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                [class.border-slate-200]="true"
              />
            </div>
          </div>

          <!-- Descripción del Catálogo -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              Descripción Comercial y Marcas Oficiales Representadas *
            </label>
            <textarea
              formControlName="descripcion"
              rows="3"
              placeholder="Detalla las marcas que distribuyes (ej. Asus, Lenovo, Kingston), tiempos promedio de despacho y políticas de garantía..."
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none resize-none"
              [class.border-rose-400]="isFieldInvalid('descripcion')"
              [class.border-slate-200]="!isFieldInvalid('descripcion')"
            ></textarea>
            @if (isFieldInvalid('descripcion')) {
              <p class="text-[11px] text-rose-500 mt-1">La descripción debe tener al menos 15 caracteres.</p>
            }
          </div>

          <!-- Términos y Condiciones -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                formControlName="aceptaTerminos"
                class="w-4 h-4 rounded text-[#1E50C0] border-slate-300 focus:ring-[#1E50C0] mt-0.5"
              />
              <span class="text-xs text-slate-600 leading-relaxed">
                Acepto los términos de intermediación mayorista de COMPUNEX B2B, me comprometo a despachar con Guía de Remisión física/electrónica y emitir Facturas Electrónicas SUNAT válidas por cada orden confirmada.
              </span>
            </label>
            @if (isFieldInvalid('aceptaTerminos')) {
              <p class="text-[11px] text-rose-500 font-medium">Debes aceptar los términos comerciales para activar tu rol de proveedor.</p>
            }
          </div>

          <!-- Botón de Activación -->
          <div class="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              [disabled]="form.invalid || isActivating()"
              class="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              @if (isActivating()) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Activando Rol de Proveedor...</span>
              } @else {
                <span>Activar Perfil Mayorista Ahora</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    nombreComercial: ['', [Validators.required, Validators.minLength(3)]],
    categoriaPrincipal: ['Laptops y Computadoras', [Validators.required]],
    telefonoComercial: ['', [Validators.required, Validators.minLength(7)]],
    ciudadAlmacen: ['Lima Metropolitana', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(15)]],
    aceptaTerminos: [false, [Validators.requiredTrue]]
  });

  constructor() {
    const user = this.authState.currentUser();
    if (user) {
      this.form.patchValue({
        nombreComercial: user.razonSocial || user.nombreCompleto || '',
        telefonoComercial: user.telefono || ''
      });
    }
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

    this.isActivating.set(true);

    const payload = {
      nombreComercial: this.form.value.nombreComercial,
      descripcion: this.form.value.descripcion
    };

    this.providerApi.activateProvider(payload).subscribe({
      next: () => {
        this.isActivating.set(false);
        // Actualizar el estado local con ROLE_PROVEEDOR
        this.authState.setProviderRole();
        this.toastState.success(
          '¡Perfil de Proveedor Activado!',
          'Bienvenido a la red de proveedores mayoristas de COMPUNEX. Ya tienes acceso a tu panel.'
        );
        this.router.navigate(['/panel']);
      },
      error: () => {
        this.isActivating.set(false);
        this.toastState.error('Error al activar', 'Ocurrió un error al procesar tu solicitud.');
      }
    });
  }
}
