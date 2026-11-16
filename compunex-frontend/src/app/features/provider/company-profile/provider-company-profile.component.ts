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
    <div class="max-w-5xl mx-auto space-y-7 pb-8">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#98D5EE]" aria-label="Ruta de navegación">
        <a routerLink="/panel" class="hover:text-[#1786B4] dark:hover:text-[#4FB3DA] transition-colors">Panel</a>
        <span>/</span>
        <span class="text-[#04202E] dark:text-[#F2F9FC] font-bold">Perfil Comercial y Marca</span>
      </nav>

      <!-- Encabezado -->
      <section class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE]/60 dark:border-[#1D4960] text-[#0F5E83] dark:text-[#98D5EE] text-xs font-semibold mb-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-[#1786B4] dark:bg-[#4FB3DA]"></span>
            Identidad y Datos Comerciales
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#04202E] dark:text-[#F2F9FC] tracking-tight font-display">
            Perfil Comercial del Proveedor
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF] mt-1">
            Administra los datos comerciales, sede de despacho y políticas de tu cuenta mayorista.
          </p>
        </div>

        <a
          routerLink="/panel"
          class="px-5 py-2.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0A2535] text-xs font-bold text-[#0A3C55] dark:text-[#E1F2FA] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] transition-colors self-start md:self-auto shrink-0"
        >
          ← Volver al Dashboard
        </a>
      </section>

      @if (isLoading()) {
        <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-8 space-y-6 animate-pulse shadow-sm">
          <div class="h-32 bg-slate-200 dark:bg-[#0A2535] rounded-2xl w-full"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-10 bg-slate-200 dark:bg-[#0A2535] rounded-xl"></div>
            <div class="h-10 bg-slate-200 dark:bg-[#0A2535] rounded-xl"></div>
          </div>
        </div>
      } @else if (hasError()) {
        <div class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
          <h3 class="text-base font-bold text-rose-900 dark:text-rose-200">Error al cargar perfil comercial</h3>
          <p class="text-xs text-rose-700 dark:text-rose-300">No se pudo obtener la información de tu tienda mayorista.</p>
          <button type="button" (click)="loadProfile()" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors">
            Reintentar
          </button>
        </div>
      } @else {

        <!-- PREVISUALIZACIÓN DE IDENTIDAD CORPORATIVA -->
        <section class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
          <div class="px-6 py-3.5 bg-[#F4F9FC] dark:bg-[#0A2535] border-b border-[#CFE4EE] dark:border-[#1D4960] flex items-center justify-between text-xs">
            <span class="font-bold text-[#527588] dark:text-[#B8DFEF] uppercase tracking-wider">Vista Previa Comercial</span>
            <span class="text-[11px] text-[#1786B4] dark:text-[#4FB3DA] font-semibold">Ficha de tienda mayorista</span>
          </div>

          <div class="h-44 sm:h-52 w-full bg-[#04202E] relative overflow-hidden">
            @if (form.get('urlBanner')?.value) {
              <img [src]="form.get('urlBanner')?.value" alt="Banner del proveedor" class="w-full h-full object-cover" />
            } @else {
              <div class="w-full h-full bg-gradient-to-r from-[#04202E] via-[#0A3C55] to-[#1786B4] flex items-center justify-center text-[#E1F2FA]/80 text-xs font-medium">
                Sin imagen de portada en sesión
              </div>
            }
          </div>

          <div class="p-6 sm:p-8 relative pt-0 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div class="flex items-end gap-4">
              <div class="w-24 h-24 rounded-2xl bg-white dark:bg-[#0F3043] p-2 border-4 border-white dark:border-[#0F3043] shadow-md shrink-0 overflow-hidden">
                @if (form.get('urlLogo')?.value) {
                  <img [src]="form.get('urlLogo')?.value" alt="Logo de tienda" class="w-full h-full object-contain rounded-xl" />
                } @else {
                  <div class="w-full h-full bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] font-black text-2xl flex items-center justify-center rounded-xl font-display">
                    {{ (form.get('nombreComercial')?.value || profile()?.razonSocial || 'P').charAt(0).toUpperCase() }}
                  </div>
                }
              </div>

              <div class="pb-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-xl font-black text-[#04202E] dark:text-[#F2F9FC]">{{ form.get('nombreComercial')?.value || profile()?.razonSocial }}</h2>
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    ✓ Proveedor Activo
                  </span>
                </div>
                <p class="text-xs text-[#527588] dark:text-[#B8DFEF] mt-0.5">
                  {{ profile()?.razonSocial }} · RUC: <strong class="text-[#04202E] dark:text-[#F2F9FC] font-mono">{{ profile()?.ruc }}</strong>
                </p>
              </div>
            </div>

            <div class="text-left sm:text-right pb-1 text-xs text-[#527588] dark:text-[#B8DFEF] space-y-0.5">
              <div>
                {{ form.get('ciudad')?.value || 'Sin ciudad' }}
                @if (form.get('anosMercado')?.value) {
                  <span> · {{ form.get('anosMercado')?.value }}</span>
                }
              </div>
              <div class="font-mono">{{ form.get('telefono')?.value || 'Sin teléfono' }}</div>
            </div>
          </div>
        </section>

        <!-- FORMULARIO EN TARJETAS INDEPENDIENTES Y BIEN ESPACIADAS -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6" novalidate>

          <!-- TARJETA INDEPENDIENTE 1: IMÁGENES DE MARCA -->
          <section class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 space-y-5 shadow-sm">
            <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] uppercase tracking-wider pb-3 border-b border-[#E1F2FA] dark:border-[#1D4960] flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1786B4] dark:text-[#4FB3DA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              1. Imágenes de Marca (Media API)
            </h3>

            <!-- Aviso explícito sobre limitación de persistencia de logo/banner -->
            <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-700/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong class="block mb-1 text-amber-950 dark:text-amber-100">Nota sobre persistencia de logo y portada</strong>
              Los archivos seleccionados se suben al servidor multimedia (<code class="px-1 py-0.5 rounded bg-amber-100/80 dark:bg-amber-900/50 font-mono">/api/v1/media/upload</code>) para la vista previa de esta sesión, pero la persistencia permanente de <code class="px-1 py-0.5 rounded bg-amber-100/80 dark:bg-amber-900/50 font-mono">urlLogo</code> y <code class="px-1 py-0.5 rounded bg-amber-100/80 dark:bg-amber-900/50 font-mono">urlBanner</code> en base de datos está pendiente del endpoint <code class="px-1 py-0.5 rounded bg-amber-100/80 dark:bg-amber-900/50 font-mono">PUT /api/v1/providers/me/profile</code> en el backend.
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="p-5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] space-y-3 bg-[#F4F9FC] dark:bg-[#0A2535]">
                <label for="logo-upload" class="block text-xs font-bold text-[#04202E] dark:text-[#F2F9FC]">
                  Logo de la Empresa Mayorista (1:1)
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  [disabled]="isUploadingLogo()"
                  (change)="onFileSelected($event, 'logo')"
                  class="block w-full text-xs text-[#527588] dark:text-[#B8DFEF] disabled:opacity-50 disabled:cursor-not-allowed file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E1F2FA] dark:file:bg-[#0F3043] file:text-[#0F5E83] dark:file:text-[#4FB3DA] hover:file:bg-[#98D5EE]/50 cursor-pointer"
                />
                @if (isUploadingLogo()) {
                  <span class="text-xs text-[#1786B4] dark:text-[#4FB3DA] flex items-center gap-1.5 font-semibold">
                    Subiendo logo...
                  </span>
                }
              </div>

              <div class="p-5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] space-y-3 bg-[#F4F9FC] dark:bg-[#0A2535]">
                <label for="banner-upload" class="block text-xs font-bold text-[#04202E] dark:text-[#F2F9FC]">
                  Banner / Portada de Tienda (16:9)
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  [disabled]="isUploadingBanner()"
                  (change)="onFileSelected($event, 'banner')"
                  class="block w-full text-xs text-[#527588] dark:text-[#B8DFEF] disabled:opacity-50 disabled:cursor-not-allowed file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E1F2FA] dark:file:bg-[#0F3043] file:text-[#0F5E83] dark:file:text-[#4FB3DA] hover:file:bg-[#98D5EE]/50 cursor-pointer"
                />
                @if (isUploadingBanner()) {
                  <span class="text-xs text-[#1786B4] dark:text-[#4FB3DA] flex items-center gap-1.5 font-semibold">
                    Subiendo banner...
                  </span>
                }
              </div>
            </div>
          </section>

          <!-- TARJETA INDEPENDIENTE 2: DATOS COMERCIALES -->
          <section class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 space-y-6 shadow-sm">
            <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] uppercase tracking-wider pb-3 border-b border-[#E1F2FA] dark:border-[#1D4960] flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1786B4] dark:text-[#4FB3DA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              2. Datos Comerciales de Contacto y Almacén
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="cp-nombre" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Nombre Comercial de la Marca *
                </label>
                <input
                  id="cp-nombre"
                  type="text"
                  formControlName="nombreComercial"
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                  [ngClass]="isFieldInvalid('nombreComercial') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                />
                @if (isFieldInvalid('nombreComercial')) {
                  <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5">Ingresa el nombre comercial (mínimo 3 caracteres).</p>
                }
              </div>

              <div>
                <label for="cp-anos" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Años en el Mercado Tecnológico
                </label>
                <input
                  id="cp-anos"
                  type="text"
                  formControlName="anosMercado"
                  placeholder="Ej. 12 años"
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                />
              </div>

              <div>
                <label for="cp-tel" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Teléfono / WhatsApp de Atención B2B *
                </label>
                <input
                  id="cp-tel"
                  type="tel"
                  formControlName="telefono"
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                  [ngClass]="isFieldInvalid('telefono') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                />
                @if (isFieldInvalid('telefono')) {
                  <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5">El teléfono de contacto es obligatorio.</p>
                }
              </div>

              <div>
                <label for="cp-ciudad" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Ciudad de Ubicación Principal *
                </label>
                <input
                  id="cp-ciudad"
                  type="text"
                  formControlName="ciudad"
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                  [ngClass]="isFieldInvalid('ciudad') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                />
                @if (isFieldInvalid('ciudad')) {
                  <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5">La ciudad es obligatoria.</p>
                }
              </div>

              <div class="md:col-span-2">
                <label for="cp-dir" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Dirección del Centro de Distribución y Almacén Mayorista *
                </label>
                <input
                  id="cp-dir"
                  type="text"
                  formControlName="direccion"
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                  [ngClass]="isFieldInvalid('direccion') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                />
                @if (isFieldInvalid('direccion')) {
                  <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5">La dirección del almacén es obligatoria.</p>
                }
              </div>

              <div class="md:col-span-2">
                <label for="cp-desc" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Descripción de la Empresa y Portafolio de Marcas *
                </label>
                <textarea
                  id="cp-desc"
                  formControlName="descripcion"
                  rows="3"
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none resize-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                  [ngClass]="isFieldInvalid('descripcion') ? 'border-rose-400 dark:border-rose-500' : 'border-[#CFE4EE] dark:border-[#1D4960]'"
                ></textarea>
                @if (isFieldInvalid('descripcion')) {
                  <p class="text-[11px] text-rose-500 dark:text-rose-400 mt-1.5">La descripción debe tener al menos 10 caracteres.</p>
                }
              </div>

              <div class="md:col-span-2">
                <label for="cp-politica" class="block text-xs font-semibold text-[#04202E] dark:text-[#F2F9FC] mb-2">
                  Política Comercial, Envíos y Garantía (Opcional)
                </label>
                <textarea
                  id="cp-politica"
                  formControlName="politicaComercial"
                  rows="2"
                  placeholder="Indica plazos de despacho, condiciones de garantía y cobertura de entrega..."
                  class="w-full px-4 py-3 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl text-xs sm:text-sm text-[#04202E] dark:text-[#F2F9FC] outline-none resize-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-colors"
                ></textarea>
              </div>
            </div>
          </section>

          <!-- BARRA DE ACCIÓN -->
          <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:px-7 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
              Los cambios se reflejarán de inmediato en tu ficha pública mayorista.
            </p>
            <button
              type="submit"
              [disabled]="form.invalid || isSaving()"
              class="px-8 py-3 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] disabled:bg-slate-300 dark:disabled:bg-[#1D4960] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              @if (isSaving()) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Guardando datos...</span>
              } @else {
                <span>Guardar Perfil Corporativo</span>
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
