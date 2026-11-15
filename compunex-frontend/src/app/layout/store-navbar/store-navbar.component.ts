import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
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
    <header class="store-header sticky top-0 z-40">
      <div class="header-main wrap">
        <!-- Marca -->
        <a routerLink="/" class="brand" aria-label="COMPUNEX inicio" (click)="closeAllMenus()">
          <span class="brand-mark">C</span>
          <span>
            <strong>COMPUNEX<span>B2B</span></strong>
            <small>MAYORISTA TECNOLÓGICO</small>
          </span>
        </a>

        <!-- Buscador central -->
        <form class="header-search" (ngSubmit)="onSearch()" role="search">
          <span aria-hidden="true">⌕</span>
          <label class="sr-only" for="home-search">Buscar en catálogo mayorista</label>
          <input
            id="home-search"
            name="searchQuery"
            type="search"
            placeholder="Buscar por procesador, modelo, SKU..."
            [ngModel]="search.query()"
            (ngModelChange)="search.query.set($event)"
          />
          <button type="submit">Buscar</button>
        </form>

        <!-- Acciones principales (sin redundancias) -->
        <div class="header-actions">
          @if (authState.isAuthenticated()) {
            <!-- Acceso visible y directo al Panel -->
            @if (authState.canAccessPanel()) {
              <a
                routerLink="/panel"
                (click)="closeAllMenus()"
                class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2456C6] hover:bg-[#1B429B] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Mi Panel
              </a>
            } @else {
              <a
                routerLink="/cuenta/activar-proveedor"
                (click)="closeAllMenus()"
                class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2456C6] hover:bg-[#1B429B] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Activar Panel
              </a>
            }
          } @else {
            <a class="header-login" routerLink="/auth/login">Ingresar</a>
            <a class="header-register" routerLink="/auth/registro-empresa">Registrar empresa</a>
          }

          <!-- Carrito único -->
          <a
            routerLink="/carrito"
            (click)="closeAllMenus()"
            class="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center"
            title="Ver carrito B2B"
            aria-label="Ver carrito B2B"
          >
            <svg class="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            @if (cartState.totalItemsCount() > 0) {
              <span class="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#2456C6] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {{ cartState.totalItemsCount() }}
              </span>
            }
          </a>

          <!-- Menú de Usuario (solo autenticado) -->
          @if (authState.isAuthenticated()) {
            <div class="relative">
              <button
                type="button"
                (click)="toggleUserMenu($event)"
                [attr.aria-expanded]="userMenuOpen()"
                aria-haspopup="menu"
                aria-controls="user-menu"
                aria-label="Abrir menú de cuenta"
                class="inline-flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#142238] transition-colors"
                title="Cuenta de usuario"
              >
                <span class="w-7 h-7 rounded-lg bg-[#2456C6]/10 text-[#2456C6] font-extrabold text-xs flex items-center justify-center uppercase">
                  {{ getUserInitial() }}
                </span>
                <span class="hidden md:block text-left max-w-[110px] truncate text-xs font-bold">
                  {{ getShortUserName() }}
                </span>
                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform" [class.rotate-180]="userMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (userMenuOpen()) {
                <div
                  id="user-menu"
                  role="menu"
                  class="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50"
                >
                  <div class="px-4 py-2.5 border-b border-slate-100">
                    <p class="text-xs font-bold text-[#142238] truncate">
                      {{ authState.currentUser()?.nombre || 'Usuario COMPUNEX' }}
                    </p>
                    <p class="text-[11px] text-slate-500 truncate">
                      {{ authState.currentUser()?.correo }}
                    </p>
                    <span class="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2456C6]">
                      {{ getRoleLabel() }}
                    </span>
                  </div>

                  <div class="py-1">
                    @if (authState.canAccessPanel()) {
                      <a
                        routerLink="/panel"
                        (click)="closeAllMenus()"
                        role="menuitem"
                        class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#2456C6] hover:bg-blue-50/70 transition-colors sm:hidden"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Ir a Mi Panel
                      </a>
                    } @else {
                      <a
                        routerLink="/cuenta/activar-proveedor"
                        (click)="closeAllMenus()"
                        role="menuitem"
                        class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#2456C6] hover:bg-blue-50/70 transition-colors sm:hidden"
                      >
                        Activar Perfil Proveedor
                      </a>
                    }

                    <a
                      routerLink="/cuenta/perfil"
                      (click)="closeAllMenus()"
                      role="menuitem"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi cuenta y perfil
                    </a>

                    <a
                      routerLink="/cuenta/mis-compras"
                      (click)="closeAllMenus()"
                      role="menuitem"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Mis compras
                    </a>

                    <a
                      routerLink="/cuenta/seguridad"
                      (click)="closeAllMenus()"
                      role="menuitem"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Cambiar contraseña
                    </a>
                  </div>

                  <div class="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      (click)="logout()"
                      role="menuitem"
                      class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Botón Hamburguesa (móvil) -->
          <button
            type="button"
            (click)="toggleMobileMenu($event)"
            class="md:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            [attr.aria-label]="mobileMenuOpen() ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
            aria-controls="mobile-menu"
            [attr.aria-expanded]="mobileMenuOpen()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              @if (mobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Barra de navegación secundaria (adaptada a Público vs Autenticado, sin duplicados) -->
      <nav class="header-nav hidden md:block" aria-label="Navegación principal">
        <div class="wrap header-links">
          <a routerLink="/" routerLinkActive="text-[#2456c6]" [routerLinkActiveOptions]="{ exact: true }">Inicio</a>

          <!-- Bloque único de Catálogo y Categorías (sin redundancia) -->
          <div class="relative">
            <button
              type="button"
              (click)="toggleCatalogMenu($event)"
              [attr.aria-expanded]="catalogMenuOpen()"
              aria-controls="catalog-menu"
              class="inline-flex items-center gap-1 text-[13px] font-bold text-[#41516a] hover:text-[#2456c6] transition-colors"
            >
              Categorías y Catálogo
              <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="catalogMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            @if (catalogMenuOpen()) {
              <div id="catalog-menu" class="absolute left-0 mt-3 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50">
                <a
                  routerLink="/categories"
                  (click)="closeAllMenus()"
                  class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#2456c6]"
                >
                  Explorar por Categorías
                </a>
                <a
                  routerLink="/catalog"
                  (click)="closeAllMenus()"
                  class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#2456c6]"
                >
                  Ver Catálogo Completo B2B
                </a>
              </div>
            }
          </div>

          @if (authState.isAuthenticated()) {
            <!-- Navegación enfocada en operación cuando ya inició sesión -->
            <a routerLink="/cuenta/mis-compras" routerLinkActive="text-[#2456c6]">Mis compras</a>
            @if (authState.canAccessPanel()) {
              <a routerLink="/panel" routerLinkActive="text-[#2456c6]">Panel de Gestión</a>
            }
            <span class="header-nav-note">Sesión activa · {{ getRoleLabel() }}</span>
          } @else {
            <!-- Navegación informativa para visitante público -->
            <a [routerLink]="['/']" fragment="comunidad" (click)="scrollToSection('comunidad', $event)">Comunidad</a>
            <a [routerLink]="['/']" fragment="productos" (click)="scrollToSection('productos', $event)">Destacados</a>
            <a [routerLink]="['/']" fragment="como-funciona" (click)="scrollToSection('como-funciona', $event)">Cómo funciona</a>
            <span class="header-nav-note">Un espacio para conectar y crecer</span>
          }
        </div>
      </nav>

      <!-- Menú móvil desplegable -->
      @if (mobileMenuOpen()) {
        <div id="mobile-menu" class="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5">
          <a routerLink="/" (click)="closeAllMenus()" class="block py-2 text-xs font-bold text-[#142238]">Inicio</a>
          <a routerLink="/categories" (click)="closeAllMenus()" class="block py-2 text-xs font-bold text-[#142238]">Explorar por Categorías</a>
          <a routerLink="/catalog" (click)="closeAllMenus()" class="block py-2 text-xs font-bold text-[#142238]">Catálogo Completo B2B</a>
          @if (authState.isAuthenticated()) {
            <a routerLink="/cuenta/mis-compras" (click)="closeAllMenus()" class="block py-2 text-xs font-bold text-[#142238]">Mis compras</a>
            @if (authState.canAccessPanel()) {
              <a routerLink="/panel" (click)="closeAllMenus()" class="block py-2 text-xs font-bold text-[#2456C6]">Mi Panel</a>
            } @else {
              <a routerLink="/cuenta/activar-proveedor" (click)="closeAllMenus()" class="block py-2 text-xs font-bold text-[#2456C6]">Activar Panel Proveedor</a>
            }
          } @else {
            <a [routerLink]="['/']" fragment="comunidad" (click)="scrollToSection('comunidad', $event); closeAllMenus()" class="block py-2 text-xs font-medium text-slate-600">Comunidad</a>
            <a [routerLink]="['/']" fragment="productos" (click)="scrollToSection('productos', $event); closeAllMenus()" class="block py-2 text-xs font-medium text-slate-600">Destacados</a>
            <a [routerLink]="['/']" fragment="como-funciona" (click)="scrollToSection('como-funciona', $event); closeAllMenus()" class="block py-2 text-xs font-medium text-slate-600">Cómo funciona</a>
          }
        </div>
      }
    </header>
  `
})
export class StoreNavbarComponent {
  public readonly authState = inject(AuthStateService);
  public readonly cartState = inject(CartStateService);
  public readonly search = inject(HomeSearchService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  public readonly userMenuOpen = signal<boolean>(false);
  public readonly catalogMenuOpen = signal<boolean>(false);
  public readonly mobileMenuOpen = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeAllMenus();
    }
  }

  public toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.catalogMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.userMenuOpen.update(open => !open);
  }

  public toggleCatalogMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.catalogMenuOpen.update(open => !open);
  }

  public toggleMobileMenu(event: Event): void {
    event.stopPropagation();
    this.userMenuOpen.set(false);
    this.catalogMenuOpen.set(false);
    this.mobileMenuOpen.update(open => !open);
  }

  public closeAllMenus(): void {
    this.userMenuOpen.set(false);
    this.catalogMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
  }

  public getUserInitial(): string {
    const name = this.authState.currentUser()?.nombre || this.authState.currentUser()?.correo || 'U';
    return name.trim().charAt(0).toUpperCase();
  }

  public getShortUserName(): string {
    const name = this.authState.currentUser()?.nombre?.trim();
    if (!name) return 'Mi cuenta';
    return name.split(' ')[0];
  }

  public getRoleLabel(): string {
    if (this.authState.isAdmin()) return 'ADMIN';
    if (this.authState.isProveedor()) return 'PROVEEDOR';
    return 'COMPRADOR';
  }

  public logout(): void {
    this.closeAllMenus();
    this.authState.clearAuth();
    this.router.navigateByUrl('/');
  }

  public onSearch(): void {
    this.closeAllMenus();
    const term = this.search.query();
    if (term && term.trim().length > 0) {
      this.router.navigate(['/catalog'], { queryParams: { search: term.trim() } });
    } else {
      this.router.navigate(['/catalog']);
    }
  }

  public scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.closeAllMenus();
    const currentUrl = this.router.url.split('#')[0];
    if (currentUrl === '/' || currentUrl === '') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `/#${sectionId}`);
        return;
      }
    }
    this.router.navigate(['/'], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    });
  }
}
