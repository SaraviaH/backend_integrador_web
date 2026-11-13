import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/state/auth-state.service';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div class="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
        
        <!-- Encabezado de la Pantalla P-06 -->
        <div class="text-center space-y-2">
          <div class="inline-flex w-12 h-12 rounded-2xl bg-[#1E50C0] text-white items-center justify-center font-black text-2xl shadow-xs mb-2">
            C
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
            Iniciar sesión
          </h1>
          <p class="text-xs text-slate-500 max-w-xs mx-auto">
            Accede a tu cuenta de empresa para consultar precios mayoristas y gestionar pedidos.
          </p>
        </div>

        <!-- Banner de Error (Estado UI Error) -->
        @if (errorMessage()) {
          <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs animate-shake">
            <svg class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="font-bold">Error de autenticación</p>
              <p class="mt-0.5 text-rose-600">{{ errorMessage() }}</p>
            </div>
            <button type="button" (click)="errorMessage.set(null)" class="text-rose-400 hover:text-rose-600">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }

        <!-- Formulario Reactivo de Login -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
          
          <!-- Campo Correo Electrónico -->
          <div class="space-y-1.5">
            <label for="correo" class="block text-xs font-bold text-[#142238]">
              Correo corporativo <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="correo"
                type="email"
                formControlName="correo"
                placeholder="ejemplo@tuempresa.pe"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-[#142238] placeholder-slate-400 focus:bg-white focus:border-[#2456C6] focus:ring-2 focus:ring-blue-500/15 outline-none transition-all"
                [ngClass]="isFieldInvalid('correo') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
            </div>
            @if (isFieldInvalid('correo')) {
              <p class="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Ingresa un correo electrónico corporativo válido.
              </p>
            }
          </div>

          <!-- Campo Contraseña -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="contrasena" class="block text-xs font-bold text-[#142238]">
                Contraseña <span class="text-rose-500">*</span>
              </label>
              <a routerLink="/auth/recuperar-password" class="text-[11px] font-semibold text-[#2456C6] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="contrasena"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="contrasena"
                placeholder="Ingresa tu contraseña"
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-[#142238] placeholder-slate-400 focus:bg-white focus:border-[#2456C6] focus:ring-2 focus:ring-blue-500/15 outline-none transition-all"
                [ngClass]="isFieldInvalid('contrasena') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
              <button
                type="button"
                (click)="toggleShowPassword()"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                tabindex="-1"
              >
                @if (showPassword()) {
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                } @else {
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              </button>
            </div>
            @if (isFieldInvalid('contrasena')) {
              <p class="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                La contraseña debe tener al menos 6 caracteres.
              </p>
            }
          </div>

          <!-- Recordar Sesión -->
          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                formControlName="recordarSesion"
                class="w-4 h-4 rounded text-[#1E50C0] focus:ring-[#1E50C0]/20 border-slate-300"
              />
              Recordar mi sesión en este equipo
            </label>
          </div>

          <!-- Botón de Envío (Estado UI Carga) -->
          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full py-3 px-4 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            } @else {
              Iniciar sesión
            }
          </button>
        </form>

        <!-- Pie de Registro -->
        <div class="pt-4 border-t border-slate-100 text-center space-y-2">
          <p class="text-xs text-slate-500">
            ¿Tu empresa aún no tiene cuenta?
          </p>
          <a
            routerLink="/auth/registro-empresa"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#2456C6] hover:text-[#1842A0] transition-colors"
          >
            Registrar mi empresa en COMPUNEX
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public showPassword = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  public loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    recordarSesion: [true]
  });

  public isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { correo, contrasena } = this.loginForm.value;

    this.authApi.login({ correo, contrasena }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.authState.setAuth(response);
        this.toast.success('Sesión iniciada', 'Bienvenido a COMPUNEX B2B.');

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const msg = error.error?.mensaje || error.error?.detail || 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        this.errorMessage.set(msg);
      }
    });
  }
}
