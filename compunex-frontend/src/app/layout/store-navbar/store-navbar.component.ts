import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../../core/state/auth-state.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { HomeSearchService } from '../../core/state/home-search.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { BubbleButtonDirective } from '../../shared/directives/bubble-button.directive';

@Component({
  selector: 'app-store-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ThemeToggleComponent, BubbleButtonDirective],
  template: `
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-brand-dark-secondary/95 backdrop-blur-md border-b border-brand-tint dark:border-brand-dark-border transition-colors duration-200">
      <!-- FILA 1: Header Principal (Ancho completo equilibrado) -->
      <div class="wrap min-h-[76px] py-2.5 md:py-0 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-5">
        <!-- Marca -->
        <a routerLink="/" class="brand shrink-0" aria-label="COMPUNEX inicio" (click)="closeAllMenus()">
          <img
            src="/images/compunex-icon.png"
            alt="COMPUNEX B2B"
            class="w-10 h-10 rounded-xl object-contain shrink-0"
          />
          <span>
            <strong>COMPUNEX<span>B2B</span></strong>
            <small>MAYORISTA TECNOLÓGICO</small>
          </span>
        </a>

        <!-- Buscador central expansivo -->
        <form
          class="order-3 md:order-2 w-full md:w-auto md:flex-1 min-w-0 flex items-center h-11 pl-3.5 pr-1.5 rounded-xl border border-brand-ice dark:border-brand-dark-border bg-brand-bg dark:bg-brand-dark-bg focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary transition-all"
          (ngSubmit)="onSearch()"
          role="search"
        >
          <svg class="w-4 h-4 text-brand-petrol dark:text-brand-sky shrink-0 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <label class="sr-only" for="home-search">Buscar en catálogo mayorista</label>
          <input
            id="home-search"
            name="searchQuery"
            type="search"
            placeholder="Buscar por procesador, modelo, SKU..."
            class="w-full min-w-0 border-0 bg-transparent outline-none text-sm text-brand-night dark:text-brand-tint placeholder:text-slate-400 dark:placeholder:text-brand-ice/50"
            [ngModel]="search.query()"
            (ngModelChange)="search.query.set($event)"
          />
          <button
            type="submit"
            appBubbleButton
            class="shrink-0 h-8 px-4 rounded-lg bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors"
          >
            Buscar
          </button>
        </form>

        <!-- Acciones derechas alineadas y protegidas contra compresión -->
        <div class="order-2 md:order-3 ml-auto md:ml-0 shrink-0 flex items-center gap-2 sm:gap-2.5">
          <!-- Selector de Tema Claro / Oscuro -->
          <app-theme-toggle />

          <!-- Carrito -->
          <a
            routerLink="/carrito"
            (click)="closeAllMenus()"
            class="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark-card hover:bg-brand-tint dark:hover:bg-brand-petrol/40 text-brand-night dark:text-brand-tint transition-colors flex items-center justify-center"
            title="Ver carrito B2B"
            aria-label="Ver carrito B2B"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            @if (cartState.totalItemsCount() > 0) {
              <span class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-brand-dark-secondary shadow-xs">
                {{ cartState.totalItemsCount() }}
              </span>
            }
          </a>

          @if (authState.isAuthenticated()) {
            @if (authState.canAccessPanel()) {
              <a
                routerLink="/panel"
                appBubbleButton
                (click)="closeAllMenus()"
                class="hidden sm:inline-flex items-center gap-1.5 h-10 sm:h-11 px-4 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold whitespace-nowrap transition-colors shadow-xs shrink-0"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Mi Panel
              </a>
            } @else {
              <a
                routerLink="/cuenta/activar-proveedor"
                appBubbleButton
                (click)="closeAllMenus()"
                class="hidden sm:inline-flex items-center gap-1.5 h-10 sm:h-11 px-4 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold whitespace-nowrap transition-colors shadow-xs shrink-0"
              >
                Activar Panel
              </a>
            }

            <!-- Menú de Usuario -->
            <div class="relative shrink-0">
              <button
                type="button"
                (click)="toggleUserMenu($event)"
                [attr.aria-expanded]="userMenuOpen()"
                aria-haspopup="menu"
                aria-controls="user-menu"
                aria-label="Abrir menú de cuenta"
                class="inline-flex items-center gap-2 h-10 sm:h-11 pl-2 pr-2.5 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card hover:bg-slate-50 dark:hover:bg-brand-petrol/40 text-brand-night dark:text-brand-tint transition-colors"
                title="Cuenta de usuario"
              >
                <span class="w-7 h-7 rounded-lg bg-brand-primary/15 text-brand-primary dark:text-brand-sky font-extrabold text-xs flex items-center justify-center uppercase">
                  {{ getUserInitial() }}
                </span>
                <span class="hidden lg:block text-left max-w-[110px] truncate text-xs font-bold">
                  {{ getShortUserName() }}
                </span>
                <svg class="w-3.5 h-3.5 text-slate-400 dark:text-brand-ice transition-transform" [class.rotate-180]="userMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (userMenuOpen()) {
                <div
                  id="user-menu"
                  role="menu"
                  class="absolute right-0 mt-2 w-64 bg-white dark:bg-brand-dark-card rounded-2xl border border-slate-200 dark:border-brand-dark-border shadow-dropdown py-2 z-50"
                >
                  <div class="px-4 py-2.5 border-b border-slate-100 dark:border-brand-dark-border">
                    <p class="text-xs font-bold text-brand-night dark:text-brand-tint truncate">
                      {{ authState.currentUser()?.nombre || 'Usuario COMPUNEX' }}
                    </p>
                    <p class="text-[11px] text-slate-500 dark:text-brand-ice truncate">
                      {{ authState.currentUser()?.correo }}
                    </p>
                    <span class="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-tint text-brand-primary dark:text-brand-sky">
                      {{ getRoleLabel() }}
                    </span>
                  </div>

                  <div class="py-1">
                    @if (authState.canAccessPanel()) {
                      <a
                        routerLink="/panel"
                        (click)="closeAllMenus()"
                        role="menuitem"
                        class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-brand-primary dark:text-brand-sky hover:bg-brand-tint/70 transition-colors sm:hidden"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Ir a Mi Panel
                      </a>
                    } @else {
                      <a
                        routerLink="/cuenta/activar-proveedor"
                        (click)="closeAllMenus()"
                        role="menuitem"
                        class="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-brand-primary dark:text-brand-sky hover:bg-brand-tint/70 transition-colors sm:hidden"
                      >
                        Activar Perfil Proveedor
                      </a>
                    }

                    <a
                      routerLink="/cuenta/perfil"
                      (click)="closeAllMenus()"
                      role="menuitem"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-brand-tint hover:bg-slate-50 dark:hover:bg-brand-petrol/40 transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400 dark:text-brand-ice" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi cuenta y perfil
                    </a>

                    <a
                      routerLink="/cuenta/mis-compras"
                      (click)="closeAllMenus()"
                      role="menuitem"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-brand-tint hover:bg-slate-50 dark:hover:bg-brand-petrol/40 transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400 dark:text-brand-ice" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Mis compras
                    </a>

                    <a
                      routerLink="/cuenta/seguridad"
                      (click)="closeAllMenus()"
                      role="menuitem"
                      class="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-brand-tint hover:bg-slate-50 dark:hover:bg-brand-petrol/40 transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400 dark:text-brand-ice" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Cambiar contraseña
                    </a>
                  </div>

                  <div class="border-t border-slate-100 dark:border-brand-dark-border mt-1 pt-1">
                    <button
                      type="button"
                      (click)="logout()"
                      role="menuitem"
                      class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <a
              routerLink="/auth/login"
              (click)="closeAllMenus()"
              class="hidden sm:inline-flex items-center justify-center h-10 sm:h-11 px-4 rounded-xl border border-brand-ice dark:border-brand-dark-border bg-white dark:bg-brand-dark-card hover:bg-brand-tint dark:hover:bg-brand-petrol/40 hover:border-brand-primary text-brand-night dark:text-brand-tint text-xs font-bold whitespace-nowrap transition-colors shrink-0"
            >
              Ingresar
            </a>
            <a
              routerLink="/auth/registro-empresa"
              appBubbleButton
              (click)="closeAllMenus()"
              class="hidden sm:inline-flex items-center justify-center h-10 sm:h-11 px-4 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold whitespace-nowrap transition-colors shadow-xs shrink-0"
            >
              Registrar empresa
            </a>
          }

          <!-- Botón Hamburguesa (móvil) -->
          <button
            type="button"
            (click)="toggleMobileMenu($event)"
            class="md:hidden h-10 w-10 shrink-0 rounded-xl border border-slate-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-brand-night dark:text-brand-tint hover:bg-slate-50 dark:hover:bg-brand-petrol/40 flex items-center justify-center transition-colors"
            [attr.aria-label]="mobileMenuOpen() ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
            aria-controls="mobile-menu"
            [attr.aria-expanded]="mobileMenuOpen()"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              @if (mobileMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- FILA 2: Menú de Navegación Secundario (Ancho completo alineado) -->
      <nav class="hidden md:block border-t border-brand-tint dark:border-brand-dark-border bg-white/90 dark:bg-brand-dark-secondary/95" aria-label="Navegación principal">
        <div class="wrap h-12 flex items-center justify-between gap-6">
          <div class="flex items-center gap-1 lg:gap-2">
            <a
              routerLink="/"
              routerLinkActive="bg-brand-tint dark:bg-brand-petrol/40 text-brand-primary dark:text-brand-sky"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeAllMenus()"
              class="px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
            >
              Inicio
            </a>

            <!-- Dropdown Categorías y Catálogo -->
            <div class="relative">
              <button
                type="button"
                (click)="toggleCatalogMenu($event)"
                [attr.aria-expanded]="catalogMenuOpen()"
                aria-controls="catalog-menu"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
                [class.bg-brand-tint]="catalogMenuOpen()"
                [class.text-brand-primary]="catalogMenuOpen()"
              >
                Categorías y Catálogo
                <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="catalogMenuOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (catalogMenuOpen()) {
                <div
                  id="catalog-menu"
                  class="absolute left-0 top-full mt-1.5 w-60 bg-white dark:bg-brand-dark-card rounded-xl border border-slate-200 dark:border-brand-dark-border shadow-dropdown py-1.5 z-50"
                >
                  <a
                    routerLink="/categories"
                    (click)="closeAllMenus()"
                    class="block px-4 py-2.5 text-xs font-semibold text-brand-night dark:text-brand-tint hover:bg-brand-tint dark:hover:bg-brand-petrol/40 hover:text-brand-primary dark:hover:text-brand-sky transition-colors"
                  >
                    Explorar por Categorías
                  </a>
                  <a
                    routerLink="/catalog"
                    (click)="closeAllMenus()"
                    class="block px-4 py-2.5 text-xs font-semibold text-brand-night dark:text-brand-tint hover:bg-brand-tint dark:hover:bg-brand-petrol/40 hover:text-brand-primary dark:hover:text-brand-sky transition-colors"
                  >
                    Ver Catálogo Completo B2B
                  </a>
                </div>
              }
            </div>

            @if (authState.isAuthenticated()) {
              <a
                routerLink="/cuenta/mis-compras"
                routerLinkActive="bg-brand-tint dark:bg-brand-petrol/40 text-brand-primary dark:text-brand-sky"
                (click)="closeAllMenus()"
                class="px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
              >
                Mis compras
              </a>
              @if (authState.canAccessPanel()) {
                <a
                  routerLink="/panel"
                  routerLinkActive="bg-brand-tint dark:bg-brand-petrol/40 text-brand-primary dark:text-brand-sky"
                  (click)="closeAllMenus()"
                  class="px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
                >
                  Panel de Gestión
                </a>
              }
            }

            <a
              [routerLink]="['/']"
              fragment="comunidad"
              (click)="scrollToSection('comunidad', $event)"
              class="px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
            >
              Ecosistema B2B
            </a>
            <a
              [routerLink]="['/']"
              fragment="productos"
              (click)="scrollToSection('productos', $event)"
              class="px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
            >
              Destacados
            </a>
            <a
              [routerLink]="['/']"
              fragment="como-funciona"
              (click)="scrollToSection('como-funciona', $event)"
              class="px-3.5 py-1.5 rounded-lg text-[13px] font-bold text-brand-deep dark:text-brand-tint hover:bg-brand-tint/70 dark:hover:bg-brand-petrol/30 hover:text-brand-primary dark:hover:text-brand-sky transition-colors whitespace-nowrap"
            >
              Cómo funciona
            </a>
          </div>

          <span class="hidden lg:inline-flex items-center gap-2 text-[11px] font-semibold text-brand-petrol dark:text-brand-ice shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-sky" aria-hidden="true"></span>
            @if (authState.isAuthenticated()) {
              Sesión activa · {{ getRoleLabel() }}
            } @else {
              Plataforma mayorista para empresas
            }
          </span>
        </div>
      </nav>

      <!-- Menú móvil desplegable -->
      @if (mobileMenuOpen()) {
        <div id="mobile-menu" class="md:hidden border-t border-brand-tint dark:border-brand-dark-border bg-white dark:bg-brand-dark-secondary px-4 py-3.5 space-y-1.5">
          <a routerLink="/" (click)="closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-bold text-brand-night dark:text-brand-tint hover:bg-brand-tint dark:hover:bg-brand-petrol/40">Inicio</a>
          <a routerLink="/categories" (click)="closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-bold text-brand-night dark:text-brand-tint hover:bg-brand-tint dark:hover:bg-brand-petrol/40">Explorar por Categorías</a>
          <a routerLink="/catalog" (click)="closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-bold text-brand-night dark:text-brand-tint hover:bg-brand-tint dark:hover:bg-brand-petrol/40">Catálogo Completo B2B</a>
          <a [routerLink]="['/']" fragment="comunidad" (click)="scrollToSection('comunidad', $event); closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-brand-ice hover:bg-brand-tint dark:hover:bg-brand-petrol/40">Ecosistema B2B</a>
          <a [routerLink]="['/']" fragment="productos" (click)="scrollToSection('productos', $event); closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-brand-ice hover:bg-brand-tint dark:hover:bg-brand-petrol/40">Destacados</a>
          <a [routerLink]="['/']" fragment="como-funciona" (click)="scrollToSection('como-funciona', $event); closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-brand-ice hover:bg-brand-tint dark:hover:bg-brand-petrol/40">Cómo funciona</a>

          @if (authState.isAuthenticated()) {
            <div class="pt-2 mt-2 border-t border-slate-100 dark:border-brand-dark-border space-y-1.5">
              <a routerLink="/cuenta/mis-compras" (click)="closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-bold text-brand-night dark:text-brand-tint">Mis compras</a>
              @if (authState.canAccessPanel()) {
                <a routerLink="/panel" (click)="closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-bold text-brand-primary dark:text-brand-sky">Mi Panel</a>
              } @else {
                <a routerLink="/cuenta/activar-proveedor" (click)="closeAllMenus()" class="block px-3 py-2 rounded-lg text-xs font-bold text-brand-primary dark:text-brand-sky">Activar Panel Proveedor</a>
              }
            </div>
          } @else {
            <div class="sm:hidden pt-3 mt-2 border-t border-slate-100 dark:border-brand-dark-border grid grid-cols-2 gap-2">
              <a routerLink="/auth/login" (click)="closeAllMenus()" class="py-2.5 text-center rounded-xl border border-brand-ice dark:border-brand-dark-border text-xs font-bold text-brand-night dark:text-brand-tint">
                Ingresar
              </a>
              <a routerLink="/auth/registro-empresa" (click)="closeAllMenus()" class="py-2.5 text-center rounded-xl bg-brand-primary text-white text-xs font-bold">
                Registrar empresa
              </a>
            </div>
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
