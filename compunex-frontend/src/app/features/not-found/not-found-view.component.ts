import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div class="max-w-lg w-full text-center space-y-6">
        <!-- Ícono e Identificador 404 -->
        <div class="w-24 h-24 mx-auto rounded-3xl bg-blue-50 border border-blue-200 text-brand-primary flex items-center justify-center font-black text-3xl shadow-xs">
          404
        </div>

        <!-- Título y Mensaje -->
        <div class="space-y-2">
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Página No Encontrada</h1>
          <p class="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            La URL o recurso de hardware al que intentas ingresar no existe, fue renombrado o se encuentra temporalmente fuera de línea.
          </p>
        </div>

        <!-- Buscador Rápido de Catálogo -->
        <div class="max-w-sm mx-auto">
          <form (ngSubmit)="onSearch()" class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              name="search"
              placeholder="Buscar en el catálogo mayorista..."
              class="w-full pl-9 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              type="submit"
              class="absolute right-1.5 top-1.5 px-3 py-1 bg-brand-primary text-white text-[11px] font-bold rounded-lg hover:bg-brand-primary-hover transition-colors cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>

        <!-- Enlaces Rápidos -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            routerLink="/"
            class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-colors shadow-xs"
          >
            Ir a Inicio B2B
          </a>
          <a
            routerLink="/catalog"
            class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Explorar Todo el Catálogo
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotFoundViewComponent {
  public searchQuery = '';

  constructor(private router: Router) {}

  public onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalog'], { queryParams: { q: this.searchQuery.trim() } });
    } else {
      this.router.navigate(['/catalog']);
    }
  }
}
