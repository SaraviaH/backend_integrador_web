import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full text-center space-y-6">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-black text-2xl shadow-xs">
          403
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Acceso Denegado</h1>
          <p class="text-xs text-slate-500 leading-relaxed">
            Tu cuenta no cuenta con los permisos necesarios (Rol requerido: Proveedor Mayorista o Administrador) para visualizar esta sección corporativa.
          </p>
        </div>
        <div class="flex items-center justify-center gap-3">
          <a
            routerLink="/"
            class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors shadow-xs"
          >
            Volver a la Tienda
          </a>
          <a
            routerLink="/auth/login"
            class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cambiar de Cuenta
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForbiddenViewComponent {}
