import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../core/state/auth-state.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { HomeSearchService } from '../../core/state/home-search.service';

@Component({
  selector: 'app-store-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="store-header">
      <div class="header-main wrap">
        <a routerLink="/" class="brand" aria-label="COMPUNEX inicio"><span class="brand-mark">C</span><span><strong>COMPUNEX<span>B2B</span></strong><small>MAYORISTA TECNOLÓGICO</small></span></a>
        <form class="header-search" (ngSubmit)="onSearch()" role="search">
          <span aria-hidden="true">⌕</span>
          <label class="sr-only" for="home-search">Buscar en catálogo mayorista</label>
          <input id="home-search" name="searchQuery" type="search" placeholder="Buscar por procesador, modelo, SKU..." [ngModel]="search.query()" (ngModelChange)="search.query.set($event)" />
          <button type="submit">Buscar</button>
        </form>
        <div class="header-actions">
          <a routerLink="/catalog" class="px-4 py-2 rounded-full bg-[#1E50C0] text-white text-xs font-bold hover:bg-[#1842A0] transition-colors flex items-center gap-1.5 shadow-2xs">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Catálogo B2B
          </a>
        </div>
      </div>
      <nav class="header-nav" aria-label="Navegación principal">
        <div class="wrap header-links">
          <a routerLink="/catalog">Catálogo B2B</a>
          <a routerLink="/categories">Categorías</a>
          <a href="/#comunidad">Comunidad</a>
          <a href="/#productos">Destacados</a>
          <a href="/#como-funciona">Cómo funciona</a>
          <span class="header-nav-note">Un espacio para conectar y crecer</span>
        </div>
      </nav>
    </header>
  `
})
export class StoreNavbarComponent {
  public readonly authState = inject(AuthStateService);
  public readonly cartState = inject(CartStateService);
  private readonly router = inject(Router);

  public readonly search = inject(HomeSearchService);

  public onSearch(): void {
    const term = this.search.query();
    if (term && term.trim().length > 0) {
      this.router.navigate(['/catalog'], { queryParams: { search: term.trim() } });
    } else {
      this.router.navigate(['/catalog']);
    }
  }
}
