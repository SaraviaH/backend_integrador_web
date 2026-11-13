import { Component, inject, OnInit, signal } from '@angular/core';
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
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/panel" class="hover:text-[#2456C6] transition-colors">Panel</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Perfil Comercial y Marca</span>
      </nav>

      <!-- Encabezado de la Pantalla P-26 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold mb-2">
            <span>✨</span> Branding e Identidad Mayorista
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
            Perfil Comercial del Proveedor
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Personaliza el logo, portada de marca, datos de contacto y descripción que verán tus clientes en el catálogo.
          </p>
        </div>

        <a
          routerLink="/panel"
          class="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          ← Volver al Dashboard
        </a>
      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-26)                                             -->
      <!-- ========================================================================= -->

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
          <button type="button" (click)="loadProfile()" class="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold">
            Reintentar
          </button>
        </div>
      } @else {
        
        <!-- PREVISUALIZACIÓN EN VIVO (Live Brand Preview) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div class="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-400 uppercase tracking-wider">Vista Previa de tu Tienda Mayorista</span>
            <span class="text-[11px] text-[#1E50C0] font-semibold">Cómo te ven los compradores B2B</span>
          </div>

          <!-- Banner de Portada -->
          <div class="h-44 sm:h-52 w-full bg-slate-800 relative overflow-hidden">
            @if (form.get('urlBanner')?.value) {
              <img [src]="form.get('urlBanner')?.value" alt="Banner del proveedor" class="w-full h-full object-cover" />
            } @else {
              <div class="w-full h-full bg-gradient-to-r from-[#142238] to-[#1E50C0] flex items-center justify-center text-white/50 text-xs">
                Sin imagen de portada
              </div>
            }
          </div>

          <!-- Ficha de Tienda sobrepuesta -->
          <div class="p-6 sm:p-8 relative pt-0 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div class="flex items-end gap-4">
              <!-- Logo Circular -->
              <div class="w-24 h-24 rounded-3xl bg-white p-2 border-4 border-white shadow-md shrink-0 overflow-hidden">
                @if (form.get('urlLogo')?.value) {
                  <img [src]="form.get('urlLogo')?.value" alt="Logo de tienda" class="w-full h-full object-contain rounded-2xl" />
                } @else {
                  <div class="w-full h-full bg-blue-100 text-[#1E50C0] font-black text-2xl flex items-center justify-center rounded-2xl font-display">
                    P
                  </div>
                }
              </div>

              <div class="pb-1">
                <div class="flex items-center gap-2">
                  <h2 class="text-xl font-black text-[#142238]">{{ form.get('nombreComercial')?.value || 'Nombre Comercial' }}</h2>
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Verificado B2B
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ profile()?.razonSocial }} · RUC: <strong class="text-slate-700 font-mono">{{ profile()?.ruc }}</strong>
                </p>
              </div>
            </div>

            <div class="text-left sm:text-right pb-1 text-xs text-slate-500">
              <div>📍 {{ form.get('ciudad')?.value || 'Lima' }} · {{ form.get('anosMercado')?.value || '10+ años' }}</div>
              <div>📞 {{ form.get('telefono')?.value || '01 000-0000' }}</div>
            </div>
          </div>
        </div>

        <!-- FORMULARIO DE EDICIÓN Y CARGA PREVIA DE IMÁGENES CON MEDIA API -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-8 shadow-xs">
          
          <!-- SECCIÓN 1: Subida de Imágenes con MediaApiService (POST /api/v1/media/upload) -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              1. Imágenes de Marca (Subida previa al módulo Media)
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <!-- Subida de Logo -->
              <div class="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                <label class="block text-xs font-bold text-slate-800">
                  Logo de la Empresa Mayorista (1:1)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  (change)="onFileSelected($event, 'logo')"
                  class="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-[#1E50C0] hover:file:bg-blue-200 cursor-pointer"
                />
                @if (isUploadingLogo()) {
                  <span class="text-xs text-[#1E50C0] flex items-center gap-1 font-semibold">
                    <svg class="animate-spin w-3 h-3 text-[#1E50C0]" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Subiendo logo a /api/v1/media/upload...
                  </span>
                }
              </div>

              <!-- Subida de Banner -->
              <div class="p-5 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                <label class="block text-xs font-bold text-slate-800">
                  Banner / Portada de Tienda (16:9)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  (change)="onFileSelected($event, 'banner')"
                  class="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-[#1E50C0] hover:file:bg-blue-200 cursor-pointer"
                />
                @if (isUploadingBanner()) {
                  <span class="text-xs text-[#1E50C0] flex items-center gap-1 font-semibold">
                    <svg class="animate-spin w-3 h-3 text-[#1E50C0]" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Subiendo banner a /api/v1/media/upload...
                  </span>
                }
              </div>

            </div>
          </div>

          <!-- SECCIÓN 2: Información Comercial del Proveedor -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              2. Datos Comerciales de Contacto y Almacén
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <!-- Nombre Comercial -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre Comercial de la Marca *
                </label>
                <input
                  type="text"
                  formControlName="nombreComercial"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                />
              </div>

              <!-- Años en el mercado -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Años en el Mercado Tecnológico
                </label>
                <input
                  type="text"
                  formControlName="anosMercado"
                  placeholder="Ej. 12 años"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                />
              </div>

              <!-- Teléfono Comercial -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teléfono / WhatsApp de Atención B2B *
                </label>
                <input
                  type="tel"
                  formControlName="telefono"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                />
              </div>

              <!-- Ciudad -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ciudad de Ubicación Principal *
                </label>
                <input
                  type="text"
                  formControlName="ciudad"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                />
              </div>

              <!-- Dirección del Almacén -->
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dirección del Centro de Distribución y Almacén Mayorista *
                </label>
                <input
                  type="text"
                  formControlName="direccion"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none"
                />
              </div>

              <!-- Descripción Comercial -->
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Descripción de la Empresa y Portafolio de Marcas *
                </label>
                <textarea
                  formControlName="descripcion"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none resize-none"
                ></textarea>
              </div>

            </div>
          </div>

          <!-- Botón de Guardado -->
          <div class="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              [disabled]="form.invalid || isSaving()"
              class="px-8 py-3 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              @if (isSaving()) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Guardando perfil...</span>
              } @else {
                <span>Guardar Perfil de Marca</span>
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
      ciudad: ['Lima', [Validators.required]],
      anosMercado: ['10 años'],
      urlLogo: [''],
      urlBanner: ['']
    });

    this.loadProfile();
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
          anosMercado: data.anosMercado || '10 años',
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
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (type === 'logo') {
      this.isUploadingLogo.set(true);
      this.mediaApi.uploadImage(file, 'profiles').subscribe({
        next: (res) => {
          this.isUploadingLogo.set(false);
          this.form.patchValue({ urlLogo: res.url });
          this.toastState.success('Logo Subido', 'Imagen de marca cargada con éxito.');
        },
        error: () => {
          this.isUploadingLogo.set(false);
          this.toastState.error('Error', 'No se pudo subir la imagen del logo.');
        }
      });
    } else {
      this.isUploadingBanner.set(true);
      this.mediaApi.uploadImage(file, 'profiles').subscribe({
        next: (res) => {
          this.isUploadingBanner.set(false);
          this.form.patchValue({ urlBanner: res.url });
          this.toastState.success('Banner Subido', 'Imagen de portada cargada con éxito.');
        },
        error: () => {
          this.isUploadingBanner.set(false);
          this.toastState.error('Error', 'No se pudo subir la imagen del banner.');
        }
      });
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    this.providerApi.updateProfile(this.form.value).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.profile.set(res.data);
        this.toastState.success('Perfil Guardado', 'Los datos comerciales han sido actualizados.');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastState.error('Error', 'No se pudieron guardar los cambios.');
      }
    });
  }
}
