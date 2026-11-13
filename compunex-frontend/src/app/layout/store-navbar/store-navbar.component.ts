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
        <form class="header-search" (ngSubmit)="onSearch()" role="search"><span aria-hidden="true">⌕</span><label class="sr-only" for="home-search">Buscar en productos de ejemplo</label><input id="home-search" name="searchQuery" type="search" placeholder="Buscar productos de ejemplo..." [ngModel]="search.query()" (ngModelChange)="search.query.set($event)" /><button type="submit">Buscar</button></form>
        <div class="header-actions">@if (authState.isAuthenticated()) { <a class="header-login" routerLink="/panel">Mi panel</a> } @else { <a class="header-login" routerLink="/auth/login">Ingresar</a><a class="header-register" routerLink="/auth/registro-empresa">Registrar empresa</a> }</div>
      </div>
      <nav class="header-nav" aria-label="Navegación principal"><div class="wrap header-links"><a routerLink="/">Inicio</a><a routerLink="/categories">Categorías</a><a href="/#comunidad">Comunidad</a><a href="/#productos">Productos</a><a href="/#como-funciona">Cómo funciona</a><span class="header-nav-note">Un espacio para conectar y crecer</span></div></nav>
    </header>
  `
})
export class StoreNavbarComponent {
  public readonly authState = inject(AuthStateService);
  public readonly cartState = inject(CartStateService);
  private readonly router = inject(Router);

  public readonly search = inject(HomeSearchService);

  public onSearch(): void {
    if (typeof document === 'undefined') return;
    if (this.router.url.split('?')[0].split('#')[0] !== '/') {
      void this.router.navigate(['/']).then(() => setTimeout(() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' }), 0));
    } else {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
