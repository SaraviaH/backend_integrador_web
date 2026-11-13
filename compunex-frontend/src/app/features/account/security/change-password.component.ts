import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { AuthStateService } from '../../../core/state/auth-state.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-change-password',
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
        <span class="text-[#142238] font-bold">Seguridad y Credenciales</span>
      </nav>

      <!-- Barra de Pestañas de la Cuenta -->
      <div class="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-bold">
        <a
          routerLink="/cuenta/perfil"
          class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        >
          Perfil Corporativo
        </a>
        <a
          routerLink="/cuenta/seguridad"
          class="pb-3 border-b-2 border-[#1E50C0] text-[#1E50C0] transition-colors shrink-0"
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
        }
      </div>

      <!-- Encabezado de la Pantalla P-17 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-1.5 shadow-xs">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1E50C0] text-xs font-semibold mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#1E50C0]"></span>
          Seguridad B2B
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-[#142238] tracking-tight font-display">
          Cambiar Contraseña de Acceso
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Protege tu cuenta corporativa. Recomendamos usar al menos 8 caracteres combinando mayúsculas, minúsculas, números y símbolos.
        </p>
      </div>

      <!-- Formulario de Seguridad -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs max-w-xl mx-auto">
        
        <!-- Contraseña Actual -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Contraseña Actual *
          </label>
          <div class="relative">
            <input
              [type]="showCurrent() ? 'text' : 'password'"
              formControlName="contrasenaActual"
              placeholder="••••••••••••"
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none pr-10"
              [class.border-rose-400]="isFieldInvalid('contrasenaActual')"
              [class.border-slate-200]="!isFieldInvalid('contrasenaActual')"
            />
            <button
              type="button"
              (click)="showCurrent.set(!showCurrent())"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              @if (showCurrent()) { 👁️ } @else { 🔒 }
            </button>
          </div>
          @if (isFieldInvalid('contrasenaActual')) {
            <p class="text-[11px] text-rose-500 mt-1">Ingresa tu contraseña actual.</p>
          }
        </div>

        <!-- Nueva Contraseña -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Nueva Contraseña *
          </label>
          <div class="relative">
            <input
              [type]="showNew() ? 'text' : 'password'"
              formControlName="nuevaContrasena"
              placeholder="Mínimo 8 caracteres"
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none pr-10"
              [class.border-rose-400]="isFieldInvalid('nuevaContrasena')"
              [class.border-slate-200]="!isFieldInvalid('nuevaContrasena')"
            />
            <button
              type="button"
              (click)="showNew.set(!showNew())"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              @if (showNew()) { 👁️ } @else { 🔒 }
            </button>
          </div>
          @if (isFieldInvalid('nuevaContrasena')) {
            <p class="text-[11px] text-rose-500 mt-1">La nueva contraseña debe tener al menos 8 caracteres.</p>
          }
        </div>

        <!-- Confirmar Nueva Contraseña -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1.5">
            Confirmar Nueva Contraseña *
          </label>
          <div class="relative">
            <input
              [type]="showNew() ? 'text' : 'password'"
              formControlName="confirmarContrasena"
              placeholder="Repite la nueva contraseña"
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-[#142238] outline-none pr-10"
              [class.border-rose-400]="isFieldInvalid('confirmarContrasena') || hasMismatchError()"
              [class.border-slate-200]="!isFieldInvalid('confirmarContrasena') && !hasMismatchError()"
            />
          </div>
          @if (hasMismatchError()) {
            <p class="text-[11px] text-rose-500 mt-1">Las contraseñas no coinciden.</p>
          }
        </div>

        <!-- Botón de Envío -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            [disabled]="form.invalid || hasMismatchError() || isSubmitting()"
            class="px-8 py-3 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            @if (isSubmitting()) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Actualizando contraseña...</span>
            } @else {
              <span>Actualizar Contraseña</span>
            }
          </button>
        </div>

      </form>

    </div>
  `
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  public readonly authState = inject(AuthStateService);
  private readonly toastState = inject(ToastStateService);

  public readonly isSubmitting = signal<boolean>(false);
  public readonly showCurrent = signal<boolean>(false);
  public readonly showNew = signal<boolean>(false);

  public readonly form: FormGroup = this.fb.group({
    contrasenaActual: ['', [Validators.required]],
    nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmarContrasena: ['', [Validators.required]]
  });

  public isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  public hasMismatchError(): boolean {
    const p1 = this.form.get('nuevaContrasena')?.value;
    const p2 = this.form.get('confirmarContrasena')?.value;
    const touched = this.form.get('confirmarContrasena')?.touched;
    return !!(touched && p1 && p2 && p1 !== p2);
  }

  public onSubmit(): void {
    if (this.form.invalid || this.hasMismatchError()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      contrasenaActual: this.form.value.contrasenaActual,
      nuevaContrasena: this.form.value.nuevaContrasena
    };

    this.authApi.changePassword(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
        this.toastState.success('Seguridad Actualizada', 'Tu contraseña ha sido cambiada exitosamente.');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toastState.error('Error', 'La contraseña actual no es válida.');
      }
    });
  }
}
