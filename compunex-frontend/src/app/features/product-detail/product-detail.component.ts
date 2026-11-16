import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { ToastStateService } from '../../core/state/toast-state.service';
import { ActionTracker } from '../../core/state/action-state.util';
import { BubbleButtonDirective } from '../../shared/directives/bubble-button.directive';
import { ProductCard, ProductDetail } from '../../core/models/catalog.model';
import { ProductContactModalComponent } from './product-contact-modal/product-contact-modal.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductContactModalComponent, ProductCardComponent, BubbleButtonDirective],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <div class="h-4 bg-slate-200 rounded w-1/3"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-5 space-y-4">
              <div class="aspect-square bg-slate-200 rounded-3xl w-full"></div>
              <div class="flex gap-3">
                <div class="w-20 h-20 bg-slate-200 rounded-2xl"></div>
                <div class="w-20 h-20 bg-slate-200 rounded-2xl"></div>
                <div class="w-20 h-20 bg-slate-200 rounded-2xl"></div>
              </div>
            </div>
            <div class="lg:col-span-7 space-y-6">
              <div class="space-y-3">
                <div class="h-6 bg-slate-200 rounded w-1/4"></div>
                <div class="h-8 bg-slate-200 rounded w-4/5"></div>
                <div class="h-4 bg-slate-150 rounded w-1/2"></div>
              </div>
              <div class="h-32 bg-slate-100 rounded-3xl p-6"></div>
              <div class="h-24 bg-slate-100 rounded-3xl p-6"></div>
            </div>
          </div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR / NO ENCONTRADO -->
      @else if (hasError() || !product()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-5 max-w-lg mx-auto my-12">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-brand-night">Producto no disponible</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              El producto solicitado no fue encontrado o fue pausado por el proveedor. Puedes explorar otros artículos disponibles en el catálogo.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              (click)="loadProduct()"
              class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reintentar
            </button>
            <a
              routerLink="/catalog"
              class="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-petrol transition-colors shadow-xs"
            >
              Ir al Catálogo Mayorista
            </a>
          </div>
        </div>
      }

      <!-- 3. ESTADO CON DATOS: FICHA TÉCNICA DETALLADA -->
      @else {
        @if (product(); as p) {
          <!-- Migas de Pan -->
          <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
            <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
            <span>/</span>
            <a routerLink="/catalog" class="hover:text-brand-primary transition-colors">Catálogo B2B</a>
            <span>/</span>
            <span class="text-slate-500 font-medium">{{ p.categoriaNombre }}</span>
            <span>/</span>
            <span class="text-brand-night font-bold truncate max-w-xs">{{ p.nombre }}</span>
          </nav>

          <!-- Cabecera y Grilla Principal -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES -->
            <div class="lg:col-span-5 space-y-4">
              <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex items-center justify-center aspect-square overflow-hidden relative shadow-xs">
                <img
                  [src]="activeImage()"
                  [alt]="p.nombre"
                  class="w-full h-full object-contain motion-safe:hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                />
                @if (p.destacado) {
                  <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold bg-brand-night text-white shadow-xs">
                    Destacado Mayorista
                  </span>
                }
                <span class="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200/60">
                  SKU: {{ p.sku }}
                </span>
              </div>

              <!-- Tira de Miniaturas Seleccionables -->
              <div class="flex items-center gap-3 overflow-x-auto pb-2">
                <button
                  type="button"
                  (click)="activeImage.set(p.imagenPrincipalUrl)"
                  [class.ring-2]="activeImage() === p.imagenPrincipalUrl"
                  [class.ring-brand-primary]="activeImage() === p.imagenPrincipalUrl"
                  class="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 shrink-0 overflow-hidden transition-all hover:border-brand-primary"
                  aria-label="Ver imagen principal"
                >
                  <img [src]="p.imagenPrincipalUrl" alt="Miniatura principal" class="w-full h-full object-contain" />
                </button>

                @for (img of p.imagenesSecundarias; track img; let i = $index) {
                  <button
                    type="button"
                    (click)="activeImage.set(img)"
                    [class.ring-2]="activeImage() === img"
                    [class.ring-brand-primary]="activeImage() === img"
                    class="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 shrink-0 overflow-hidden transition-all hover:border-brand-primary"
                    [attr.aria-label]="'Ver imagen ' + (i + 2)"
                  >
                    <img [src]="img" alt="Miniatura secundaria" class="w-full h-full object-contain" />
                  </button>
                }
              </div>

              <!-- Tarjeta Informativa de Garantía Oficial -->
              <div class="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="text-xs">
                  <h4 class="font-bold text-brand-night">Garantía Corporativa Oficial: {{ p.garantiaMeses }} meses</h4>
                  <p class="text-slate-500 text-[11px] mt-0.5">Respaldada directamente por el proveedor según términos comerciales del lote.</p>
                </div>
              </div>
            </div>

            <!-- COLUMNA DERECHA: INFORMACIÓN TÉCNICA Y COMPRA -->
            <div class="lg:col-span-7 space-y-6">

              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-brand-tint text-brand-primary border border-brand-tint">
                    {{ p.categoriaNombre }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    Marca: {{ p.marca }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Condición: {{ p.condicion }}
                  </span>
                </div>

                <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display leading-snug">
                  {{ p.nombre }}
                </h1>

                <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div class="flex items-center gap-1.5">
                    <span class="font-semibold text-slate-700">Modelo:</span>
                    <span>{{ p.modelo }}</span>
                  </div>
                  <span>•</span>
                  <div class="flex items-center gap-1.5">
                    <span class="font-semibold text-slate-700">Disponibilidad:</span>
                    @if (p.stockDisponible === 0) {
                      <span class="text-rose-600 font-bold">Agotado temporalmente</span>
                    } @else if (p.stockDisponible != null) {
                      <span class="text-emerald-600 font-bold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {{ p.stockDisponible }} unidades referenciales en almacén
                      </span>
                    } @else {
                      <span class="text-emerald-600 font-bold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Disponible para despacho mayorista
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Ficha del Proveedor Mayorista -->
              <div class="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-brand-primary flex items-center justify-center font-bold text-lg font-display shrink-0">
                    {{ p.proveedorRazonSocial.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="text-sm font-bold text-brand-night">{{ p.proveedorRazonSocial }}</h3>
                      <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Proveedor Activo
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 mt-0.5">
                      RUC: <strong class="text-slate-700 font-mono">{{ p.proveedorRuc }}</strong>
                      @if (p.proveedorCiudad) {
                        <span> · {{ p.proveedorCiudad }}</span>
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  (click)="isContactModalOpen.set(true)"
                  class="px-4 py-2.5 rounded-xl border border-brand-primary text-brand-primary hover:bg-brand-tint text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contactar Proveedor
                </button>
              </div>

              <!-- CAJA DE LIQUIDACIÓN Y COMPRA MAYORISTA B2B -->
              <div class="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl border border-brand-tint p-6 space-y-6 shadow-xs">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white p-4 rounded-2xl border border-slate-200/80">
                    <span class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                      Precio por Unidad
                    </span>
                    <div class="text-2xl font-black text-brand-night font-mono mt-1">
                      S/ {{ p.precioUnitario | number:'1.2-2' }}
                      <span class="text-xs font-sans font-normal text-slate-400">sin IGV</span>
                    </div>
                    <span class="text-[10px] text-slate-400 mt-0.5 block">
                      Precio aplicado en el carrito y checkout.
                    </span>
                  </div>

                  @if (p.precioTotalCaja) {
                    <div class="bg-brand-primary text-white p-4 rounded-2xl border border-brand-petrol shadow-xs relative overflow-hidden">
                      <span class="absolute top-2 right-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                        Caja completa
                      </span>
                      <span class="text-[11px] text-brand-tint uppercase tracking-wider font-semibold block">
                        Total de caja
                      </span>
                      <div class="text-2xl font-black text-white font-mono mt-1">
                        S/ {{ p.precioTotalCaja | number:'1.2-2' }}
                        <span class="text-xs font-sans font-normal text-brand-ice">sin IGV</span>
                      </div>
                      <span class="text-[10px] text-brand-tint mt-0.5 block">
                        {{ p.unidadesPorPaqueteTexto || 'Paquete completo' }}. Referencial.
                      </span>
                    </div>
                  } @else {
                    <div class="bg-white p-4 rounded-2xl border border-slate-200/80">
                      <span class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                        Pedido mínimo
                      </span>
                      <div class="text-lg font-black text-brand-night mt-1">
                        {{ p.pedidoMinimoTexto || 'Consultar con el proveedor' }}
                      </div>
                      <span class="text-[10px] text-slate-400 mt-0.5 block">
                        Condición comercial informada por el proveedor.
                      </span>
                    </div>
                  }
                </div>

                <!-- Selector de Cantidad -->
                <div class="space-y-3 pt-2">
                  <div class="flex items-center justify-between gap-3">
                    <label for="qty-input" class="text-xs font-bold text-slate-700">
                      Cantidad a Pedir:
                    </label>
                    <span class="text-xs text-slate-500 text-right">
                      Pedido mínimo: <strong class="text-brand-primary">{{ p.pedidoMinimoTexto || 'No especificado' }}</strong>
                    </span>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-2xs">
                      <button
                        type="button"
                        (click)="decreaseQty()"
                        [disabled]="quantity() <= 1"
                        class="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <input
                        id="qty-input"
                        type="number"
                        [ngModel]="quantity()"
                        (ngModelChange)="setQuantity($event)"
                        [min]="1"
                        [max]="p.stockDisponible ?? null"
                        class="w-16 text-center text-sm font-bold text-brand-night bg-transparent outline-none"
                      />
                      <button
                        type="button"
                        (click)="increaseQty()"
                        [disabled]="p.stockDisponible != null && quantity() >= p.stockDisponible"
                        class="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Desglose de Liquidación B2B con IGV -->
                <div class="bg-white/90 rounded-2xl p-4 border border-slate-200/60 space-y-2 text-xs">
                  <div class="flex justify-between text-slate-600">
                    <span>Subtotal ({{ quantity() }} {{ quantity() === 1 ? 'unidad' : 'unidades' }} × S/ {{ currentUnitPrice() | number:'1.2-2' }}):</span>
                    <span class="font-mono font-semibold text-slate-800">S/ {{ calculatedSubtotal() | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-slate-600">
                    <span>IGV Ley (18%):</span>
                    <span class="font-mono font-semibold text-slate-800">S/ {{ calculatedIgv() | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-extrabold text-brand-night pt-2 border-t border-slate-100">
                    <span>Total Liquidación Estimado:</span>
                    <span class="font-mono text-brand-primary">S/ {{ calculatedTotal() | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Botones de Acción Primaria -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    (click)="addToCart()"
                    [disabled]="p.stockDisponible === 0 || cartAction.isLoading('add-main')"
                    appBubbleButton
                    class="flex-1 py-3.5 px-6 rounded-xl disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                    [ngClass]="cartAction.isSuccess('add-main')
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : (p.stockDisponible === 0
                        ? 'bg-slate-300 dark:bg-brand-dark-border text-slate-500'
                        : 'bg-brand-primary hover:bg-brand-petrol')"
                  >
                    @if (cartAction.isLoading('add-main')) {
                      <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span>Agregando...</span>
                    } @else if (cartAction.isSuccess('add-main')) {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Agregado al carrito</span>
                    } @else {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>{{ p.stockDisponible === 0 ? 'Producto Agotado' : 'Agregar ' + quantity() + ' un. a la Orden' }}</span>
                    }
                  </button>

                  <a
                    routerLink="/catalog"
                    class="py-3.5 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold flex items-center justify-center transition-colors text-center"
                  >
                    Seguir Comprando
                  </a>
                </div>

              </div>

            </div>

          </div>

          <!-- PESTAÑAS TÉCNICAS -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs mt-10">

            <div class="flex border-b border-slate-200 gap-6 overflow-x-auto" role="tablist">
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === 'specs'"
                (click)="activeTab.set('specs')"
                [class.border-brand-primary]="activeTab() === 'specs'"
                [class.text-brand-primary]="activeTab() === 'specs'"
                [class.font-bold]="activeTab() === 'specs'"
                class="pb-4 text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-all shrink-0"
              >
                Especificaciones Técnicas
              </button>
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === 'desc'"
                (click)="activeTab.set('desc')"
                [class.border-brand-primary]="activeTab() === 'desc'"
                [class.text-brand-primary]="activeTab() === 'desc'"
                [class.font-bold]="activeTab() === 'desc'"
                class="pb-4 text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-all shrink-0"
              >
                Descripción Corporativa
              </button>
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === 'warranty'"
                (click)="activeTab.set('warranty')"
                [class.border-brand-primary]="activeTab() === 'warranty'"
                [class.text-brand-primary]="activeTab() === 'warranty'"
                [class.font-bold]="activeTab() === 'warranty'"
                class="pb-4 text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-all shrink-0"
              >
                Garantía y Despacho Mayorista
              </button>
            </div>

            @if (activeTab() === 'specs') {
              <div class="space-y-4">
                <h3 class="text-base font-bold text-brand-night">Ficha de Homologación de Hardware</h3>
                @if (p.especificaciones.length > 0) {
                  <div class="overflow-hidden rounded-2xl border border-slate-200">
                    <table class="w-full text-left text-xs">
                      <tbody class="divide-y divide-slate-100">
                        @for (spec of p.especificaciones; track spec.clave; let even = $even) {
                          <tr [class.bg-slate-50]="even" class="hover:bg-brand-tint/40 transition-colors">
                            <td class="px-5 py-3.5 font-bold text-slate-700 w-1/3 border-r border-slate-100">
                              {{ spec.clave }}
                            </td>
                            <td class="px-5 py-3.5 text-slate-600">
                              {{ spec.valor }}
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <p class="text-xs text-slate-500">El proveedor no registró especificaciones técnicas adicionales para este ítem.</p>
                }
              </div>
            }

            @if (activeTab() === 'desc') {
              <div class="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>{{ p.descripcion }}</p>
              </div>
            }

            @if (activeTab() === 'warranty') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 class="font-bold text-brand-night flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-brand-primary"></span>
                    Garantía del Proveedor
                  </h4>
                  <p>
                    Este producto cuenta con <strong>{{ p.garantiaMeses }} meses</strong> de garantía respaldada por {{ p.proveedorRazonSocial }}.
                  </p>
                </div>

                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 class="font-bold text-brand-night flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Despacho y Trazabilidad (Split Order)
                  </h4>
                  <p>
                    El despacho se coordina directamente por el proveedor en suborden independiente con seguimiento de estado hasta la entrega.
                  </p>
                </div>
              </div>
            }

          </div>

          <!-- PRODUCTOS RELACIONADOS CON CARGA DIFERIDA (@defer) -->
          @defer (on viewport) {
            @if (relatedProducts().length > 0) {
              <section class="pt-4 space-y-5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary">Más opciones B2B</span>
                    <h2 class="text-xl font-black text-brand-night font-display">Otros productos del catálogo</h2>
                  </div>
                  <a routerLink="/catalog" class="text-xs font-bold text-brand-primary hover:underline">
                    Ver catálogo completo →
                  </a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  @for (item of relatedProducts(); track item.id) {
                    <app-product-card [product]="item" (addToCart)="onAddRelatedToCart($event)" />
                  }
                </div>
              </section>
            }
          } @placeholder {
            <div class="h-16"></div>
          }

          <!-- Modal de Contacto -->
          <app-product-contact-modal
            [isOpen]="isContactModalOpen()"
            [product]="product()"
            (close)="isContactModalOpen.set(false)"
          />
        }
      }

    </div>
  `
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogApi = inject(CatalogApiService);
  private readonly cartState = inject(CartStateService);
  private readonly toastState = inject(ToastStateService);

  public readonly cartAction = new ActionTracker<'add-main'>();
  public readonly product = signal<ProductDetail | null>(null);
  public readonly relatedProducts = signal<ProductCard[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly activeImage = signal<string>('');
  public readonly activeTab = signal<'specs' | 'desc' | 'warranty'>('specs');
  public readonly isContactModalOpen = signal<boolean>(false);
  public readonly quantity = signal<number>(1);

  public readonly currentUnitPrice = computed(() => this.product()?.precioUnitario ?? 0);

  public readonly calculatedSubtotal = computed(() =>
    Math.round(this.currentUnitPrice() * this.quantity() * 100) / 100
  );

  public readonly calculatedIgv = computed(() =>
    Math.round(this.calculatedSubtotal() * 0.18 * 100) / 100
  );

  public readonly calculatedTotal = computed(() =>
    Math.round((this.calculatedSubtotal() + this.calculatedIgv()) * 100) / 100
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : 0;
      if (id > 0) {
        this.loadProduct(id);
      } else {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });

    this.route.queryParamMap.subscribe(qp => {
      if (qp.get('contacto') === 'true') {
        this.isContactModalOpen.set(true);
      }
    });
  }

  public loadProduct(id?: number): void {
    const productId = id ?? this.product()?.id;
    if (!productId || productId <= 0) {
      this.isLoading.set(false);
      this.hasError.set(true);
      return;
    }

    this.isLoading.set(true);
    this.hasError.set(false);

    this.catalogApi.getProductDetail(productId).subscribe({
      next: (detail) => {
        this.isLoading.set(false);
        this.product.set(detail);
        this.activeImage.set(detail.imagenPrincipalUrl);
        this.quantity.set(1);
        this.loadRelatedProducts(detail.id);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private loadRelatedProducts(currentId: number): void {
    this.catalogApi.getFeaturedProducts().subscribe({
      next: (items) => {
        this.relatedProducts.set((items || []).filter(item => item.id !== currentId).slice(0, 4));
      },
      error: () => {
        this.relatedProducts.set([]);
      }
    });
  }

  public increaseQty(): void {
    const p = this.product();
    if (!p) return;
    if (p.stockDisponible != null && this.quantity() >= p.stockDisponible) return;
    this.quantity.update(q => q + 1);
  }

  public decreaseQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  public setQuantity(val: number): void {
    const p = this.product();
    if (!p) return;
    const parsed = Math.max(1, Math.floor(Number(val) || 1));
    const clamped = p.stockDisponible != null
      ? Math.min(parsed, Math.max(1, p.stockDisponible))
      : parsed;
    this.quantity.set(clamped);
  }

  public ngOnDestroy(): void {
    this.cartAction.clearAll();
  }

  public addToCart(): void {
    const p = this.product();
    if (!p || p.stockDisponible === 0 || this.cartAction.isSuccess('add-main')) return;
    if (!this.cartAction.start('add-main')) return;

    const result = this.cartState.addItem(p, this.quantity());
    if (!result.added) {
      this.cartAction.fail('add-main');
      this.toastState.warning(
        'Stock máximo alcanzado',
        `Ya agregaste la cantidad máxima disponible de "${p.nombre}" en tu carrito.`,
        `detail-stock-${p.id}`
      );
      return;
    }

    this.cartAction.succeed('add-main', 950);
    this.toastState.success(
      'Producto agregado al carrito',
      `${result.addedQty} un. de "${p.nombre}" añadidas a tu pedido B2B.`,
      `detail-add-${p.id}`
    );
  }

  public onAddRelatedToCart(item: ProductCard): void {
    const result = this.cartState.addItem(item, 1);
    if (!result.added) {
      this.toastState.warning(
        'Stock máximo alcanzado',
        `Ya agregaste la cantidad máxima disponible de "${item.nombre}" en tu carrito.`,
        `related-stock-${item.id}`
      );
      return;
    }

    this.toastState.success(
      'Producto agregado al carrito',
      `${result.addedQty} un. de "${item.nombre}" añadida a tu pedido B2B.`,
      `related-add-${item.id}`
    );
  }
}
