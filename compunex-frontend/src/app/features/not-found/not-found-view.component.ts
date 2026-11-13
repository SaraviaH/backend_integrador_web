import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div class="max-w-md w-full text-center space-y-6">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-blue-50 border border-blue-200 text-brand-primary flex items-center justify-center font-black text-2xl shadow-xs">
          404
        </div>
        <div class="space-y-2">
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Página No Encontrada</h1>
          <p class="text-xs text-slate-500 leading-relaxed">
            La ruta o recurso mayorista al que intentas acceder no existe o fue movido en el catálogo.
          </p>
        </div>
        <div>
          <a
            routerLink="/"
            class="inline-flex px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors shadow-xs"
          >
            Regresar al Inicio
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundViewComponent {}
