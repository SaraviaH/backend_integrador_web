import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthApiService } from '../../../core/services/auth-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';
import { HttpErrorResponse } from '@angular/common/http';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('contrasena');
  const confirm = control.get('confirmarContrasena');
  if (password && confirm && password.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div class="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">

        <div class="text-center space-y-2">
          <img
            src="/images/compunex-icon.png"
            alt="COMPUNEX B2B"
            class="inline-block w-12 h-12 rounded-2xl object-contain shadow-xs mb-2"
          />
          <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display">
            Registrar mi empresa
          </h1>
          <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Crea tu cuenta de comprador mayorista. Podrás consultar el catálogo completo y emitir órdenes de compra. Si deseas vender productos, luego podrás activar tu perfil de proveedor.
          </p>
        </div>

        @if (errorMessage()) {
          <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs animate-shake" role="alert">
            <svg class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <p class="font-bold">No se pudo completar el registro</p>
              <p class="mt-0.5 text-rose-600">{{ errorMessage() }}</p>
            </div>
            <button type="button" (click)="errorMessage.set(null)" class="text-rose-400 hover:text-rose-600" aria-label="Cerrar error">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4" novalidate>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="ruc" class="block text-xs font-bold text-brand-night">
                RUC de la empresa <span class="text-rose-500">*</span>
              </label>
              <input
                id="ruc"
                type="text"
                maxlength="11"
                formControlName="ruc"
                placeholder="Ej. 20601234567"
                class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 font-mono focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
                [ngClass]="isFieldInvalid('ruc') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
              @if (isFieldInvalid('ruc')) {
                <p class="text-[11px] text-rose-500 mt-0.5">El RUC debe tener exactamente 11 dígitos numéricos.</p>
              }
            </div>

            <div class="space-y-1">
              <label for="razonSocial" class="block text-xs font-bold text-brand-night">
                Razón Social <span class="text-rose-500">*</span>
              </label>
              <input
                id="razonSocial"
                type="text"
                formControlName="razonSocial"
                placeholder="Ej. Tecnología Andina S.A.C."
                class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
                [ngClass]="isFieldInvalid('razonSocial') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
              @if (isFieldInvalid('razonSocial')) {
                <p class="text-[11px] text-rose-500 mt-0.5">La razón social es obligatoria.</p>
              }
            </div>
          </div>

          <div class="space-y-1">
            <label for="direccion" class="block text-xs font-bold text-brand-night">
              Dirección Fiscal de la Empresa <span class="text-rose-500">*</span>
            </label>
            <input
              id="direccion"
              type="text"
              formControlName="direccion"
              placeholder="Ej. Av. República de Panamá 3500, San Isidro, Lima"
              class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
              [ngClass]="isFieldInvalid('direccion') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
            />
            @if (isFieldInvalid('direccion')) {
              <p class="text-[11px] text-rose-500 mt-0.5">Ingresa la dirección fiscal (mínimo 5 caracteres).</p>
            }
          </div>

          <div class="space-y-1">
            <label for="nombre" class="block text-xs font-bold text-brand-night">
              Nombre del contacto o representante <span class="text-rose-500">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              formControlName="nombre"
              placeholder="Ej. Carlos Mendoza Ramos"
              class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
              [ngClass]="isFieldInvalid('nombre') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
            />
            @if (isFieldInvalid('nombre')) {
              <p class="text-[11px] text-rose-500 mt-0.5">Ingresa el nombre del representante.</p>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="correo" class="block text-xs font-bold text-brand-night">
                Correo corporativo <span class="text-rose-500">*</span>
              </label>
              <input
                id="correo"
                type="email"
                formControlName="correo"
                placeholder="compras@empresa.com"
                class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
                [ngClass]="isFieldInvalid('correo') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
              @if (isFieldInvalid('correo')) {
                <p class="text-[11px] text-rose-500 mt-0.5">Ingresa un correo electrónico válido.</p>
              }
            </div>

            <div class="space-y-1">
              <label for="telefono" class="block text-xs font-bold text-brand-night">
                Teléfono / WhatsApp B2B <span class="text-rose-500">*</span>
              </label>
              <input
                id="telefono"
                type="text"
                formControlName="telefono"
                placeholder="+51 987 654 321"
                class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
                [ngClass]="isFieldInvalid('telefono') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
              @if (isFieldInvalid('telefono')) {
                <p class="text-[11px] text-rose-500 mt-0.5">El teléfono es obligatorio.</p>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="contrasena" class="block text-xs font-bold text-brand-night">
                Contraseña <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="contrasena"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="contrasena"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full pl-3.5 pr-10 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
                  [ngClass]="isFieldInvalid('contrasena') ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              @if (isFieldInvalid('contrasena')) {
                <p class="text-[11px] text-rose-500 mt-0.5">Mínimo 6 caracteres.</p>
              }
            </div>

            <div class="space-y-1">
              <label for="confirmarContrasena" class="block text-xs font-bold text-brand-night">
                Confirmar contraseña <span class="text-rose-500">*</span>
              </label>
              <input
                id="confirmarContrasena"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="confirmarContrasena"
                placeholder="Repite la contraseña"
                class="w-full px-3.5 py-2.5 bg-slate-50/60 border rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-sky/25 outline-none transition-all"
                [ngClass]="registerForm.hasError('passwordMismatch') && registerForm.get('confirmarContrasena')?.touched ? 'border-rose-400 bg-rose-50/20' : 'border-slate-250'"
              />
              @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmarContrasena')?.touched) {
                <p class="text-[11px] text-rose-500 mt-0.5">Las contraseñas no coinciden.</p>
              }
            </div>
          </div>

          <div class="pt-2">
            <label class="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-600">
              <input
                type="checkbox"
                formControlName="aceptaTerminos"
                class="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20 border-slate-300 mt-0.5"
              />
              <span>
                Declaro que los datos de la empresa son fidedignos y acepto los <a routerLink="/terminos" class="text-brand-primary underline">términos de uso</a> y la <a routerLink="/privacidad" class="text-brand-primary underline">política de privacidad</a> de COMPUNEX B2B.
              </span>
            </label>
            @if (isFieldInvalid('aceptaTerminos')) {
              <p class="text-[11px] text-rose-500 mt-1">Debes aceptar los términos para registrar tu empresa.</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full mt-4 py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta de empresa...
            } @else {
              Registrar empresa
            }
          </button>
        </form>

        <div class="pt-4 border-t border-slate-100 text-center space-y-2">
          <p class="text-xs text-slate-500">¿Tu empresa ya tiene una cuenta registrada?</p>
          <a
            routerLink="/auth/login"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-petrol transition-colors"
          >
            Iniciar sesión con mi cuenta
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  `
})
export class RegisterCompanyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly toast = inject(ToastStateService);
  private readonly router = inject(Router);

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public showPassword = signal<boolean>(false);

  public registerForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    razonSocial: ['', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasena: ['', [Validators.required]],
    aceptaTerminos: [false, [Validators.requiredTrue]]
  }, {
    validators: passwordMatchValidator
  });

  public isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public onSubmit(): void {
    if (this.isLoading()) {
      return;
    }
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { nombre, correo, contrasena, ruc, razonSocial, telefono, direccion } = this.registerForm.value;

    this.authApi.registerCompany({
      nombre,
      correo,
      contrasena,
      ruc,
      razonSocial,
      telefono,
      direccion
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success(
          'Empresa registrada correctamente',
          'Tu cuenta mayorista ha sido creada. Ahora puedes iniciar sesión.',
          'register-ok'
        );
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true', email: correo }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        const msg = error.error?.mensaje || error.error?.detail || 'No se pudo completar el registro de empresa. Verifica los datos ingresados o intenta con otro RUC.';
        this.errorMessage.set(msg);
        this.toast.error('No se pudo registrar la empresa', msg, 'register-err');
      }
    });
  }
}
