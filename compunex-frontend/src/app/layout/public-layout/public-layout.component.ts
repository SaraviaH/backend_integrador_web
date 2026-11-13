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
      <!-- Cabecera Limpia Oficial -->
      <app-store-navbar></app-store-navbar>

      <!-- Contenido Principal -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- Notificaciones Flotantes -->
      <app-toast-container></app-toast-container>

      <!-- Pie de Página Limpio y Elegante -->
      <footer class="site-footer"><div class="wrap footer-grid"><div><a routerLink="/" class="brand"><span class="brand-mark">C</span><span><strong>COMPUNEX<span>B2B</span></strong><small>MAYORISTA TECNOLÓGICO</small></span></a><p>Una comunidad para conectar empresas y tecnología.</p></div><div><strong>Explora COMPUNEX</strong><a href="/#categorias">Categorías</a><a href="/#comunidad">Comunidad</a><a href="/#como-funciona">Cómo funciona</a></div><div><strong>Hecho para crecer</strong><p>Compra, conecta y descubre oportunidades en el sector tecnológico.</p></div></div></footer>
    </div>
  `
})
export class PublicLayoutComponent {}
