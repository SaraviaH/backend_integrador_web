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

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/cuenta/perfil" class="hover:text-brand-primary transition-colors">Mi Cuenta</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Seguridad y Credenciales</span>
      </nav>

      <!-- Barra de Pestañas de la Cuenta -->
      <div class="flex items-center gap-5 overflow-x-auto pb-2 border-b border-slate-200/80 text-xs font-bold">
        <a
          routerLink="/cuenta/perfil"
          class="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        >
          Perfil Corporativo
        </a>
        <a
          routerLink="/cuenta/seguridad"
          class="pb-3 border-b-2 border-brand-primary text-brand-primary transition-colors shrink-0"
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
            class="pb-3 border-b-2 border-transparent text-brand-primary hover:text-brand-petrol font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            Activar como Proveedor
          </a>
        } @else {
          <a
            routerLink="/panel"
            class="pb-3 border-b-2 border-transparent text-emerald-700 hover:text-emerald-800 font-bold transition-colors shrink-0 flex items-center gap-1"
          >
            Mi Panel Proveedor
          </a>
        }
      </div>

      <!-- Encabezado -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-1.5 shadow-xs">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint border border-brand-tint text-brand-primary text-xs font-semibold mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
          Seguridad B2B
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-brand-night tracking-tight font-display">
          Cambiar Contraseña de Acceso
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Protege tu cuenta corporativa. Usa al menos 8 caracteres combinando mayúsculas, minúsculas, números y símbolos.
        </p>
      </div>

      <!-- Formulario de Seguridad -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs max-w-xl mx-auto">

        @if (errorMessage()) {
          <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-3" role="alert">
            <span>{{ errorMessage() }}</span>
            <button type="button" (click)="errorMessage.set(null)" class="text-rose-500 hover:text-rose-700 font-bold" aria-label="Cerrar error">✕</button>
          </div>
        }

        <!-- Contraseña Actual -->
        <div>
          <label for="current-pwd" class="block text-xs font-semibold text-slate-700 mb-1.5">
            Contraseña Actual *
          </label>
          <div class="relative">
            <input
              id="current-pwd"
              [type]="showCurrent() ? 'text' : 'password'"
              formControlName="contrasenaActual"
              placeholder="••••••••••••"
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none pr-10"
              [class.border-rose-400]="isFieldInvalid('contrasenaActual')"
              [class.border-slate-200]="!isFieldInvalid('contrasenaActual')"
            />
            <button
              type="button"
              (click)="showCurrent.set(!showCurrent())"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              [attr.aria-label]="showCurrent() ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          @if (isFieldInvalid('contrasenaActual')) {
            <p class="text-[11px] text-rose-500 mt-1">Ingresa tu contraseña actual.</p>
          }
        </div>

        <!-- Nueva Contraseña -->
        <div>
          <label for="new-pwd" class="block text-xs font-semibold text-slate-700 mb-1.5">
            Nueva Contraseña *
          </label>
          <div class="relative">
            <input
              id="new-pwd"
              [type]="showNew() ? 'text' : 'password'"
              formControlName="nuevaContrasena"
              placeholder="Mínimo 8 caracteres"
              class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none pr-10"
              [class.border-rose-400]="isFieldInvalid('nuevaContrasena')"
              [class.border-slate-200]="!isFieldInvalid('nuevaContrasena')"
            />
            <button
              type="button"
              (click)="showNew.set(!showNew())"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              [attr.aria-label]="showNew() ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          @if (isFieldInvalid('nuevaContrasena')) {
            <p class="text-[11px] text-rose-500 mt-1">La nueva contraseña debe tener al menos 8 caracteres.</p>
          }
        </div>

        <!-- Confirmar Nueva Contraseña -->
        <div>
          <label for="confirm-pwd" class="block text-xs font-semibold text-slate-700 mb-1.5">
            Confirmar Nueva Contraseña *
          </label>
          <input
            id="confirm-pwd"
            [type]="showNew() ? 'text' : 'password'"
            formControlName="confirmarContrasena"
            placeholder="Repite la nueva contraseña"
            class="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-xs sm:text-sm text-brand-night outline-none"
            [class.border-rose-400]="isFieldInvalid('confirmarContrasena') || hasMismatchError()"
            [class.border-slate-200]="!isFieldInvalid('confirmarContrasena') && !hasMismatchError()"
          />
          @if (hasMismatchError()) {
            <p class="text-[11px] text-rose-500 mt-1">Las contraseñas no coinciden.</p>
          }
        </div>

        <!-- Botón de Envío -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            [disabled]="form.invalid || hasMismatchError() || isSubmitting()"
            class="px-8 py-3 rounded-xl bg-brand-primary hover:bg-brand-petrol disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            @if (isSubmitting()) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
  public readonly errorMessage = signal<string | null>(null);

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
    if (this.isSubmitting()) {
      return;
    }
    if (this.form.invalid || this.hasMismatchError()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      contrasenaActual: this.form.value.contrasenaActual,
      nuevaContrasena: this.form.value.nuevaContrasena
    };

    this.authApi.changePassword(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.form.reset();
        this.toastState.success('Seguridad Actualizada', res?.message || 'Tu contraseña ha sido cambiada exitosamente.');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err?.error?.mensaje || err?.error?.detail || err?.error?.message || 'La contraseña actual no es válida o no cumple con los requisitos.';
        this.errorMessage.set(msg);
        this.toastState.error('Error al actualizar contraseña', msg);
      }
    });
  }
}
