import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/state/auth-state.service';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { UserProfile } from '../../../core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <span class="text-slate-500 font-medium">Mi Cuenta</span>
        <span>/</span>
        <span class="text-[#142238] font-bold">Perfil Corporativo</span>
      </nav>

      <!-- Barra de Pestañas de la Cuenta -->
      <div class="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-bold">
        <a
          routerLink="/cuenta/perfil"
          class="pb-3 border-b-2 border-[#1E50C0] text-[#1E50C0] transition-colors shrink-0"
        >
          Perfil Corporativo
        </a>
        <a
          routerLink="/cuenta/seguridad"
          class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        >
          Seguridad y Contraseña
        </a>
        <a
          routerLink="/cuenta/mis-compras"
          class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        >
          Mis Compras
        </a>
        @if (!authState.isProveedor()) {
          <a
            routerLink="/cuenta/activar-proveedor"
            class="pb-3 border-b-2 border-transparent text-amber-600 hover:text-amber-700 font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            <span>★</span> Activar como Proveedor
          </a>
        } @else {
          <a
            routerLink="/panel"
            class="pb-3 border-b-2 border-transparent text-emerald-600 hover:text-emerald-700 font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            <span>⚡</span> Mi Panel Proveedor
          </a>
        }
      </div>

      <!-- Encabezado de la Pantalla P-16 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-blue-100 text-[#1E50C0] font-black text-xl flex items-center justify-center font-display shrink-0">
            {{ user()?.nombreCompleto?.substring(0, 2)?.toUpperCase() || 'EM' }}
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                    [class.bg-emerald-50]="user()?.rol === 'ROLE_PROVEEDOR'"
                    [class.text-emerald-700]="user()?.rol === 'ROLE_PROVEEDOR'"
                    [class.border-emerald-200]="user()?.rol === 'ROLE_PROVEEDOR'"
                    [class.bg-blue-50]="user()?.rol === 'ROLE_CLIENTE'"
                    [class.text-[#1E50C0]]="user()?.rol === 'ROLE_CLIENTE'"
                    [class.border-blue-100]="user()?.rol === 'ROLE_CLIENTE'">
                {{ user()?.rol === 'ROLE_PROVEEDOR' ? 'Proveedor Autorizado' : 'Cliente Corporativo B2B' }}
              </span>
              <span class="text-xs text-slate-400">RUC: <strong class="text-slate-700 font-mono">{{ user()?.ruc || '20601234567' }}</strong></span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-[#142238] tracking-tight font-display">
              {{ user()?.razonSocial || user()?.nombreCompleto || 'EMPRESA B2B SAC' }}
            </h1>
            <p class="text-xs text-slate-500 mt-0.5">
              Administra la información comercial, domicilio fiscal y contacto para órdenes y facturación.
            </p>
          </div>
        </div>

        @if (!authState.isProveedor()) {
          <div class="shrink-0">
            <a
              routerLink="/cuenta/activar-proveedor"
              class="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Vender como Proveedor (P-18)</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        }
      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-16)                                             -->
      <!-- ========================================================================= -->

      @if (isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 animate-pulse shadow-xs">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-10 bg-slate-200 rounded-2xl"></div>
            <div class="h-10 bg-slate-200 rounded-2xl"></div>
            <div class="h-10 bg-slate-200 rounded-2xl"></div>
            <div class="h-10 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      } @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto">
          <h3 class="text-base font-bold text-rose-900">Error al cargar datos del perfil</h3>
          <p class="text-xs text-rose-700">Ocurrió un error al obtener tus datos corporativos. Intenta nuevamente.</p>
          <button type="button" (click)="loadProfile()" class="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold">
            Reintentar
          </button>
        </div>
      } @else {
        <!-- Formulario Reactivo de Edición de Perfil -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">
          
          <h2 class="text-sm font-bold text-[#142238] uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Datos Fiscales y de Contacto
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- RUC (Solo lectura) -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                RUC de la Empresa (Registrado ante SUNAT)
              </label>
              <input
                type="text"
                formControlName="ruc"
                readonly
                class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-500 font-mono outline-none cursor-not-allowed"
              />
              <span class="text-[10px] text-slate-400 mt-1 block">El RUC no puede modificarse una vez validado.</span>
            </div>

            <!-- Razón Social -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Razón Social *
              </label>
              <input
                type="text"
                formControlName="razonSocial"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none focus:bg-white focus:border-[#2456C6]"
              />
            </div>

            <!-- Nombre de Contacto -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Representante / Contacto *
              </label>
              <input
                type="text"
                formControlName="nombreCompleto"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none focus:bg-white focus:border-[#2456C6]"
              />
            </div>

            <!-- Correo Corporativo -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Correo Electrónico *
              </label>
              <input
                type="email"
                formControlName="correo"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none focus:bg-white focus:border-[#2456C6]"
              />
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Teléfono / WhatsApp Móvil *
              </label>
              <input
                type="tel"
                formControlName="telefono"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none focus:bg-white focus:border-[#2456C6]"
              />
            </div>

            <!-- Domicilio Fiscal -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Domicilio Fiscal / Destino *
              </label>
              <input
                type="text"
                formControlName="direccion"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-[#142238] outline-none focus:bg-white focus:border-[#2456C6]"
              />
            </div>

          </div>

          <!-- Botón de Guardar Cambios -->
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
                <span>Guardando cambios...</span>
              } @else {
                <span>Guardar Cambios de Perfil</span>
              }
            </button>
          </div>

        </form>
      }

    </div>
  `
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  public readonly authState = inject(AuthStateService);
  private readonly toastState = inject(ToastStateService);

  public readonly user = signal<UserProfile | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly isSaving = signal<boolean>(false);

  public form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      ruc: [{ value: '', disabled: false }, [Validators.required]],
      razonSocial: ['', [Validators.required, Validators.minLength(3)]],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]]
    });

    this.loadProfile();
  }

  public loadProfile(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    // Si ya hay usuario en sesión usarlo y sincronizar con API
    const cached = this.authState.currentUser();
    if (cached) {
      this.populateForm(cached);
      this.isLoading.set(false);
    }

    this.authApi.getProfile().subscribe({
      next: (profile) => {
        this.isLoading.set(false);
        this.populateForm(profile);
        this.authState.updateProfile(profile);
      },
      error: () => {
        if (!cached) {
          this.isLoading.set(false);
          this.hasError.set(true);
        }
      }
    });
  }

  private populateForm(profile: UserProfile): void {
    this.user.set(profile);
    this.form.patchValue({
      ruc: profile.ruc || '20601234567',
      razonSocial: profile.razonSocial || profile.nombreCompleto || 'EMPRESA B2B SAC',
      nombreCompleto: profile.nombreCompleto || profile.nombre || 'Carlos Mendoza',
      correo: profile.correo || 'cmendoza@ciatecperu.pe',
      telefono: profile.telefono || '993456789',
      direccion: profile.direccion || 'Av. Las Begonias 441, Of. 802, San Isidro, Lima'
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    const updatedData: Partial<UserProfile> = this.form.value;

    this.authApi.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.user.set(res);
        this.authState.updateProfile(res);
        this.toastState.success('Perfil Actualizado', 'Los datos fiscales de tu empresa han sido guardados.');
      },
      error: () => {
        this.isSaving.set(false);
        this.toastState.error('Error', 'No se pudieron guardar los cambios.');
      }
    });
  }
}
