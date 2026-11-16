import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderApiService } from '../../../core/services/provider-api.service';
import { MediaApiService } from '../../../core/services/media-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { ProviderProfile } from '../../../core/models/provider.model';

@Component({
  selector: 'app-provider-company-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/panel" class="hover:text-brand-primary transition-colors">Panel</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Perfil Comercial y Marca</span>
      </nav>

      <!-- Encabezado -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint border border-brand-tint text-brand-primary text-xs font-semibold mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
            Identidad y Datos Comerciales
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display">
            Perfil Comercial del Proveedor
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Administra los datos comerciales, sede de despacho y políticas de tu cuenta mayorista.
          </p>
        </div>

        <a
          routerLink="/panel"
          class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start md:self-auto"
        >
          ← Volver al Dashboard
        </a>
      </div>

      @if (isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 animate-pulse shadow-xs">
          <div class="h-32 bg-slate-200 rounded-2xl w-full"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-10 bg-slate-200 rounded-xl"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      } @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto">
          <h3 class="text-base font-bold text-rose-900">Error al cargar perfil comercial</h3>
          <p class="text-xs text-rose-700">No se pudo obtener la información de tu tienda mayorista.</p>
          <button type="button" (click)="loadProfile()" class="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold">
            Reintentar
          </button>
        </div>
      } @else {

        <!-- PREVISUALIZACIÓN -->
        <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div class="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-400 uppercase tracking-wider">Vista Previa Comercial</span>
            <span class="text-[11px] text-brand-primary font-semibold">Ficha de tienda mayorista</span>
          </div>

          <div class="h-44 sm:h-52 w-full bg-brand-night relative overflow-hidden">
            @if (form.get('urlBanner')?.value) {
              <img [src]="form.get('urlBanner')?.value" alt="Banner del proveedor" class="w-full h-full object-cover" />
            } @else {
              <div class="w-full h-full bg-gradient-to-r from-brand-night to-brand-primary flex items-center justify-center text-white/70 text-xs">
                Sin imagen de portada en sesión
              </div>
            }
          </div>

          <div class="p-6 sm:p-8 relative pt-0 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div class="flex items-end gap-4">
              <div class="w-24 h-24 rounded-3xl bg-white p-2 border-4 border-white shadow-md shrink-0 overflow-hidden">
                @if (form.get('urlLogo')?.value) {
                  <img [src]="form.get('urlLogo')?.value" alt="Logo de tienda" class="w-full h-full object-contain rounded-2xl" />
                } @else {
                  <div class="w-full h-full bg-brand-tint text-brand-primary font-black text-2xl flex items-center justify-center rounded-2xl font-display">
                    {{ (form.get('nombreComercial')?.value || profile()?.razonSocial || 'P').charAt(0).toUpperCase() }}
                  </div>
                }
              </div>

              <div class="pb-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl font-black text-brand-night">{{ form.get('nombreComercial')?.value || profile()?.razonSocial }}</h2>
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Proveedor Activo
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ profile()?.razonSocial }} · RUC: <strong class="text-slate-700 font-mono">{{ profile()?.ruc }}</strong>
                </p>
              </div>
            </div>

            <div class="text-left sm:text-right pb-1 text-xs text-slate-500 space-y-0.5">
              <div>
                {{ form.get('ciudad')?.value || 'Sin ciudad' }}
                @if (form.get('anosMercado')?.value) {
                  <span> · {{ form.get('anosMercado')?.value }}</span>
                }
              </div>
              <div>{{ form.get('telefono')?.value || 'Sin teléfono' }}</div>
            </div>
          </div>
        </div>

        <!-- FORMULARIO -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-8 shadow-xs" novalidate>

          <!-- SECCIÓN 1: Subida de Imágenes -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-brand-night uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              1. Imágenes de Marca (Media API)
            </h3>

            <!-- Aviso explícito sobre limitación de persistencia de logo/banner -->
            <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong class="block mb-0.5">Nota sobre persistencia de logo y portada</strong>
              Los archivos seleccionados se suben al servidor multimedia (<code>/api/v1/media/upload</code>) para la vista previa de esta sesión, pero la persistencia permanente de <code>urlLogo</code> y <code>urlBanner</code> en base de datos está pendiente del endpoint <code>PUT /api/v1/providers/me/profile</code> en el backend.
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                <label for="logo-upload" class="block text-xs font-bold text-slate-800">
                  Logo de la Empresa Mayorista (1:1)
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  [disabled]="isUploadingLogo()"
                  (change)="onFileSelected($event, 'logo')"
                  class="text-xs text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-tint file:text-brand-primary hover:file:bg-brand-ice/40 cursor-pointer"
                />
                @if (isUploadingLogo()) {
                  <span class="text-xs text-brand-primary flex items-center gap-1.5 font-semibold">
                    Subiendo logo...
                  </span>
                }
              </div>

              <div class="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                <label for="banner-upload" class="block text-xs font-bold text-slate-800">
                  Banner / Portada de Tienda (16:9)
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  [disabled]="isUploadingBanner()"
                  (change)="onFileSelected($event, 'banner')"
                  class="text-xs text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-tint file:text-brand-primary hover:file:bg-brand-ice/40 cursor-pointer"
                />
                @if (isUploadingBanner()) {
                  <span class="text-xs text-brand-primary flex items-center gap-1.5 font-semibold">
                    Subiendo banner...
                  </span>
                }
              </div>
            </div>
          </div>

          <!-- SECCIÓN 2: Información Comercial -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-brand-night uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              2. Datos Comerciales de Contacto y Almacén
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="cp-nombre" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre Comercial de la Marca *
                </label>
                <input
                  id="cp-nombre"
                  type="text"
                  formControlName="nombreComercial"
                  class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                  [class.border-rose-400]="isFieldInvalid('nombreComercial')"
                  [class.border-slate-200]="!isFieldInvalid('nombreComercial')"
                />
                @if (isFieldInvalid('nombreComercial')) {
                  <p class="text-[11px] text-rose-500 mt-1">Ingresa el nombre comercial (mínimo 3 caracteres).</p>
                }
              </div>

              <div>
                <label for="cp-anos" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Años en el Mercado Tecnológico
                </label>
                <input
                  id="cp-anos"
                  type="text"
                  formControlName="anosMercado"
                  placeholder="Ej. 12 años"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                />
              </div>

              <div>
                <label for="cp-tel" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teléfono / WhatsApp de Atención B2B *
                </label>
                <input
                  id="cp-tel"
                  type="tel"
                  formControlName="telefono"
                  class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                  [class.border-rose-400]="isFieldInvalid('telefono')"
                  [class.border-slate-200]="!isFieldInvalid('telefono')"
                />
                @if (isFieldInvalid('telefono')) {
                  <p class="text-[11px] text-rose-500 mt-1">El teléfono de contacto es obligatorio.</p>
                }
              </div>

              <div>
                <label for="cp-ciudad" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ciudad de Ubicación Principal *
                </label>
                <input
                  id="cp-ciudad"
                  type="text"
                  formControlName="ciudad"
                  class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                  [class.border-rose-400]="isFieldInvalid('ciudad')"
                  [class.border-slate-200]="!isFieldInvalid('ciudad')"
                />
                @if (isFieldInvalid('ciudad')) {
                  <p class="text-[11px] text-rose-500 mt-1">La ciudad es obligatoria.</p>
                }
              </div>

              <div class="sm:col-span-2">
                <label for="cp-dir" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dirección del Centro de Distribución y Almacén Mayorista *
                </label>
                <input
                  id="cp-dir"
                  type="text"
                  formControlName="direccion"
                  class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
                  [class.border-rose-400]="isFieldInvalid('direccion')"
                  [class.border-slate-200]="!isFieldInvalid('direccion')"
                />
                @if (isFieldInvalid('direccion')) {
                  <p class="text-[11px] text-rose-500 mt-1">La dirección del almacén es obligatoria.</p>
                }
              </div>

              <div class="sm:col-span-2">
                <label for="cp-desc" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Descripción de la Empresa y Portafolio de Marcas *
                </label>
                <textarea
                  id="cp-desc"
                  formControlName="descripcion"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none resize-none"
                  [class.border-rose-400]="isFieldInvalid('descripcion')"
                  [class.border-slate-200]="!isFieldInvalid('descripcion')"
                ></textarea>
                @if (isFieldInvalid('descripcion')) {
                  <p class="text-[11px] text-rose-500 mt-1">La descripción debe tener al menos 10 caracteres.</p>
                }
              </div>

              <div class="sm:col-span-2">
                <label for="cp-politica" class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Política Comercial, Envíos y Garantía (Opcional)
                </label>
                <textarea
                  id="cp-politica"
                  formControlName="politicaComercial"
                  rows="2"
                  placeholder="Indica plazos de despacho, condiciones de garantía y cobertura de entrega..."
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-brand-night outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              [disabled]="form.invalid || isSaving()"
              class="px-8 py-3 rounded-xl bg-brand-primary hover:bg-brand-petrol disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              @if (isSaving()) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Guardando datos...</span>
              } @else {
                <span>Actualizar Datos Comerciales</span>
              }
            </button>
          </div>

        </form>

      }

    </div>
  `
})
export class ProviderCompanyProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly providerApi = inject(ProviderApiService);
  private readonly mediaApi = inject(MediaApiService);
  private readonly toastState = inject(ToastStateService);

  public readonly profile = signal<ProviderProfile | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);
  public readonly isUploadingLogo = signal<boolean>(false);
  public readonly isUploadingBanner = signal<boolean>(false);

  public form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      nombreComercial: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      anosMercado: [''],
      politicaComercial: [''],
      urlLogo: [''],
      urlBanner: ['']
    });

    this.loadProfile();
  }

  public isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public loadProfile(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.providerApi.getProfile().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const data = res.data;
        this.profile.set(data);
        this.form.patchValue({
          nombreComercial: data.nombreComercial || data.razonSocial,
          descripcion: data.descripcion || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          ciudad: data.ciudad || 'Lima',
          anosMercado: data.anosMercado || '',
          politicaComercial: data.politicaComercial || '',
          urlLogo: data.urlLogo || '',
          urlBanner: data.urlBanner || ''
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public onFileSelected(event: Event, type: 'logo' | 'banner'): void {
    const input = event.target as HTMLInputElement;
    if ((type === 'logo' && this.isUploadingLogo()) || (type === 'banner' && this.isUploadingBanner())) {
      input.value = '';
      return;
    }
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    input.value = '';

    if (type === 'logo') {
      this.isUploadingLogo.set(true);
      this.mediaApi.uploadImage(file, 'profiles').subscribe({
        next: (res) => {
          this.isUploadingLogo.set(false);
          this.form.patchValue({ urlLogo: res.url });
          this.toastState.info('Archivo cargado correctamente', 'Logo cargado en vista previa; su persistencia permanente requiere PUT en el backend.', 'upload-logo');
        },
        error: () => {
          this.isUploadingLogo.set(false);
          this.toastState.error('No se pudo completar la carga del archivo', 'Error al subir la imagen del logo.', 'upload-logo-err');
        }
      });
    } else {
      this.isUploadingBanner.set(true);
      this.mediaApi.uploadImage(file, 'profiles').subscribe({
        next: (res) => {
          this.isUploadingBanner.set(false);
          this.form.patchValue({ urlBanner: res.url });
          this.toastState.info('Archivo cargado correctamente', 'Banner cargado en vista previa; su persistencia permanente requiere PUT en el backend.', 'upload-banner');
        },
        error: () => {
          this.isUploadingBanner.set(false);
          this.toastState.error('No se pudo completar la carga del archivo', 'Error al subir la imagen del banner.', 'upload-banner-err');
        }
      });
    }
  }

  public onSubmit(): void {
    if (this.isSaving()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.providerApi.updateProfile(this.form.value).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.profile.set(res.data);
        this.toastState.success('Cambios guardados correctamente', 'La información comercial del proveedor fue actualizada.', 'profile-save');
      },
      error: (err) => {
        this.isSaving.set(false);
        const msg = err?.error?.mensaje || err?.error?.detail || 'No se pudieron guardar los cambios.';
        this.toastState.error('No se pudieron guardar los cambios', msg, 'profile-save-err');
      }
    });
  }
}
