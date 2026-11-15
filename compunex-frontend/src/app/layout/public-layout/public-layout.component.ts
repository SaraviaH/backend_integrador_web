import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreNavbarComponent } from '../store-navbar/store-navbar.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, StoreNavbarComponent, ToastContainerComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-white text-[#142238]">
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[1100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-primary focus:text-white focus:text-sm focus:font-bold"
      >
        Saltar al contenido principal
      </a>

      <!-- Cabecera Limpia Oficial -->
      <app-store-navbar></app-store-navbar>

      <!-- Contenido Principal -->
      <main id="main-content" tabindex="-1" class="flex-1 outline-none">
        <router-outlet></router-outlet>
      </main>

      <!-- Notificaciones Flotantes -->
      <app-toast-container></app-toast-container>

      <!-- Pie de Página Limpio y Elegante -->
      <footer class="site-footer" aria-label="Pie de página">
        <div class="wrap footer-grid">
          <div>
            <a routerLink="/" class="brand" aria-label="COMPUNEX inicio">
              <span class="brand-mark" aria-hidden="true">C</span>
              <span><strong>COMPUNEX<span>B2B</span></strong><small>MAYORISTA TECNOLÓGICO</small></span>
            </a>
            <p>Una comunidad para conectar empresas y tecnología.</p>
          </div>
          <nav aria-label="Enlaces de exploración">
            <strong>Explora COMPUNEX</strong>
            <a [routerLink]="['/']" fragment="categorias">Categorías</a>
            <a [routerLink]="['/']" fragment="comunidad">Comunidad</a>
            <a [routerLink]="['/']" fragment="como-funciona">Cómo funciona</a>
          </nav>
          <nav aria-label="Información legal">
            <strong>Legal</strong>
            <a routerLink="/terminos">Términos y Condiciones</a>
            <a routerLink="/privacidad">Política de Privacidad</a>
          </nav>
        </div>
      </footer>
    </div>
  `
})
export class PublicLayoutComponent {}
