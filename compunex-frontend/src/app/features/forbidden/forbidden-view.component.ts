import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div class="max-w-lg w-full text-center space-y-6">
        <!-- Ícono e Identificador 403 -->
        <div class="relative inline-block">
          <div class="w-24 h-24 mx-auto rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black text-3xl shadow-xs">
            403
          </div>
          <div class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-md">
            🔒
          </div>
        </div>

        <!-- Títulos y Explicación -->
        <div class="space-y-2">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Acceso Corporativo Restringido</h1>
          <p class="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            La sección a la que intentas ingresar requiere privilegios de <strong class="text-slate-800">Proveedor Mayorista (ROLE_PROVEEDOR)</strong> o <strong class="text-slate-800">Administrador</strong> de la plataforma COMPUNEX.
          </p>
        </div>

        <!-- Opciones de Resolución -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-2.5">
          <p class="text-xs font-bold text-slate-800">¿Deseas vender tus componentes en COMPUNEX?</p>
          <p class="text-[11px] text-slate-500">
            Puedes activar tu perfil de proveedor de forma inmediata si ya cuentas con una empresa registrada y RUC válido.
          </p>
          <a
            routerLink="/cuenta/activar-proveedor"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-primary-hover"
          >
            <span>Activar perfil de proveedor ahora</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <!-- Botones de Acción -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            routerLink="/"
            class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors shadow-xs"
          >
            Volver a la Tienda B2B
          </a>
          <a
            routerLink="/auth/login"
            class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Iniciar con Otra Cuenta
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForbiddenViewComponent {}
