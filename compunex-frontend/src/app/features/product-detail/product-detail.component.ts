import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { ToastStateService } from '../../core/state/toast-state.service';
import { ProductDetail, ProductCard } from '../../core/models/catalog.model';
import { ProductContactModalComponent } from './product-contact-modal/product-contact-modal.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductContactModalComponent, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-04)                                             -->
      <!-- ========================================================================= -->

      <!-- 1. ESTADO DE CARGA (Skeleton Loader Completo) -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <!-- Migas de pan skeleton -->
          <div class="h-4 bg-slate-200 rounded w-1/3"></div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Galería skeleton (5 cols) -->
            <div class="lg:col-span-5 space-y-4">
              <div class="aspect-square bg-slate-200 rounded-3xl w-full"></div>
              <div class="flex gap-3">
                <div class="w-20 h-20 bg-slate-200 rounded-2xl"></div>
                <div class="w-20 h-20 bg-slate-200 rounded-2xl"></div>
                <div class="w-20 h-20 bg-slate-200 rounded-2xl"></div>
              </div>
            </div>

            <!-- Información skeleton (7 cols) -->
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
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-[#142238]">Producto no disponible</h2>
            <p class="text-xs text-slate-500 leading-relaxed">
              El producto solicitado no fue encontrado o ha sido pausado por el proveedor. Puedes explorar otros artículos disponibles en el catálogo.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              (click)="loadProduct()"
              class="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reintentar
            </button>
            <a
              routerLink="/catalog"
              class="px-6 py-2.5 rounded-full bg-[#1E50C0] text-white text-xs font-semibold hover:bg-[#1842A0] transition-colors shadow-xs"
            >
              Ir al Catálogo Mayorista
            </a>
          </div>
        </div>
      }

      <!-- 3. ESTADO CON DATOS: FICHA TÉCNICA DETALLADA P-04 -->
      @else {
        @if (product(); as p) {
        <!-- Migas de Pan (Breadcrumbs) -->
        <nav class="flex items-center gap-2 text-xs text-slate-400">
          <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
          <span>/</span>
          <a routerLink="/catalog" class="hover:text-[#2456C6] transition-colors">Catálogo B2B</a>
          <span>/</span>
          <span class="text-slate-500 font-medium">{{ p.categoriaNombre }}</span>
          <span>/</span>
          <span class="text-[#142238] font-bold truncate max-w-xs">{{ p.nombre }}</span>
        </nav>

        <!-- Cabecera y Grilla Principal (Galería + Compra) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- ===================================================================== -->
          <!-- COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES (5 Columnas)                   -->
          <!-- ===================================================================== -->
          <div class="lg:col-span-5 space-y-4">
            
            <!-- Vista Principal de Imagen -->
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex items-center justify-center aspect-square overflow-hidden relative shadow-xs">
              <img
                [src]="activeImage()"
                [alt]="p.nombre"
                class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
              @if (p.destacado) {
                <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1E50C0] text-white shadow-xs">
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
                [class.ring-[#1E50C0]]="activeImage() === p.imagenPrincipalUrl"
                class="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 shrink-0 overflow-hidden transition-all hover:border-[#1E50C0]"
              >
                <img [src]="p.imagenPrincipalUrl" alt="Miniatura principal" class="w-full h-full object-contain" />
              </button>

              @for (img of p.imagenesSecundarias; track img) {
                <button
                  type="button"
                  (click)="activeImage.set(img)"
                  [class.ring-2]="activeImage() === img"
                  [class.ring-[#1E50C0]]="activeImage() === img"
                  class="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 shrink-0 overflow-hidden transition-all hover:border-[#1E50C0]"
                >
                  <img [src]="img" alt="Miniatura secundaria" class="w-full h-full object-contain" />
                </button>
              }
            </div>

            <!-- Tarjeta Informativa de Garantía Oficial -->
            <div class="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 text-[#1E50C0] flex items-center justify-center shrink-0">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="text-xs">
                <h4 class="font-bold text-[#142238]">Garantía Corporativa Oficial: {{ p.garantiaMeses }} meses</h4>
                <p class="text-slate-500 text-[11px] mt-0.5">Soporte directo con fabricante y reposición mayorista inmediata por defectos de fábrica.</p>
              </div>
            </div>

          </div>

          <!-- ===================================================================== -->
          <!-- COLUMNA DERECHA: INFORMACIÓN TÉCNICA Y CAJA DE COMPRA (7 Columnas)     -->
          <!-- ===================================================================== -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- Bloque de Título y Metadatos -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1E50C0] border border-blue-100">
                  {{ p.categoriaNombre }}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Marca: {{ p.marca }}
                </span>
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Condición: {{ p.condicion }}
                </span>
              </div>

              <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display leading-snug">
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
                  @if (p.stockDisponible > 0) {
                    <span class="text-emerald-600 font-bold flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {{ p.stockDisponible }} unidades listas en almacén
                    </span>
                  } @else {
                    <span class="text-rose-600 font-bold">Agotado temporalmente</span>
                  }
                </div>
              </div>
            </div>

            <!-- Ficha del Proveedor Mayorista con CTA de Contacto P-05 -->
            <div class="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-[#1E50C0] flex items-center justify-center font-bold text-lg font-display">
                  {{ p.proveedorRazonSocial.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-sm font-bold text-[#142238]">{{ p.proveedorRazonSocial }}</h3>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verificado
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">
                    RUC: <strong class="text-slate-700">{{ p.proveedorRuc }}</strong> · Calificación: ★ {{ p.proveedorCalificacion || '4.9' }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                (click)="isContactModalOpen.set(true)"
                class="px-4 py-2.5 rounded-full border border-[#1E50C0] text-[#1E50C0] hover:bg-blue-50/60 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contactar Proveedor (P-05)
              </button>
            </div>

            <!-- CAJA DE LIQUIDACIÓN Y COMPRA MAYORISTA B2B -->
            <div class="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl border border-blue-100 p-6 space-y-6 shadow-xs">
              
              <!-- Comparativa de Precios Unitario vs Mayorista -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Precio Estándar -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                    Precio por Unidad
                  </span>
                  <div class="text-2xl font-black text-slate-800 mt-1">
                    S/ {{ p.precioUnitario | number:'1.2-2' }}
                    <span class="text-xs font-normal text-slate-400">sin IGV</span>
                  </div>
                  <span class="text-[10px] text-slate-400 mt-0.5 block">
                    Para pedidos menores a {{ p.cantidadMinimaMayorista || 3 }} un.
                  </span>
                </div>

                <!-- Precio Especial por Volumen -->
                @if (p.precioMayorista) {
                  <div class="bg-blue-600 text-white p-4 rounded-2xl border border-blue-700 shadow-xs relative overflow-hidden">
                    <span class="absolute top-2 right-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Descuento Mayorista
                    </span>
                    <span class="text-[11px] text-blue-100 uppercase tracking-wider font-semibold block">
                      Precio Mayorista ({{ p.cantidadMinimaMayorista }}+ un.)
                    </span>
                    <div class="text-2xl font-black text-white mt-1">
                      S/ {{ p.precioMayorista | number:'1.2-2' }}
                      <span class="text-xs font-normal text-blue-200">sin IGV</span>
                    </div>
                    <span class="text-[10px] text-blue-100 mt-0.5 block">
                      Ahorro de S/ {{ (p.precioUnitario - p.precioMayorista) | number:'1.2-2' }} por unidad
                    </span>
                  </div>
                }
              </div>

              <!-- Selector de Cantidad Dinámico -->
              <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-slate-700">
                    Cantidad a Pedir:
                  </label>
                  <span class="text-xs text-slate-500">
                    Pedido mínimo sugerido: <strong class="text-[#1E50C0]">{{ p.cantidadMinimaMayorista || 1 }} un.</strong>
                  </span>
                </div>

                <div class="flex items-center gap-4">
                  <div class="inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-2xs">
                    <button
                      type="button"
                      (click)="decreaseQty()"
                      [disabled]="quantity() <= 1"
                      class="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      [ngModel]="quantity()"
                      (ngModelChange)="setQuantity($event)"
                      [min]="1"
                      [max]="p.stockDisponible"
                      class="w-16 text-center text-sm font-bold text-[#142238] bg-transparent outline-none"
                    />
                    <button
                      type="button"
                      (click)="increaseQty()"
                      [disabled]="quantity() >= p.stockDisponible"
                      class="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <!-- Botón de compra rápida por volumen -->
                  @if (p.cantidadMinimaMayorista && quantity() < p.cantidadMinimaMayorista) {
                    <button
                      type="button"
                      (click)="quantity.set(p.cantidadMinimaMayorista)"
                      class="text-xs font-semibold text-[#1E50C0] hover:underline"
                    >
                      Aplicar volumen mayorista ({{ p.cantidadMinimaMayorista }} un.)
                    </button>
                  }
                </div>
              </div>

              <!-- Desglose de Liquidación B2B con IGV -->
              <div class="bg-white/80 rounded-2xl p-4 border border-slate-200/60 space-y-2 text-xs">
                <div class="flex justify-between text-slate-600">
                  <span>Subtotal ({{ quantity() }} {{ quantity() === 1 ? 'unidad' : 'unidades' }} × S/ {{ currentUnitPrice() | number:'1.2-2' }}):</span>
                  <span class="font-semibold text-slate-800">S/ {{ calculatedSubtotal() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>IGV Ley (18%):</span>
                  <span class="font-semibold text-slate-800">S/ {{ calculatedIgv() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-sm font-extrabold text-[#142238] pt-2 border-t border-slate-100">
                  <span>Total Liquidación Estimado:</span>
                  <span class="text-[#1E50C0]">S/ {{ calculatedTotal() | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Botones de Acción Primaria -->
              <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  (click)="addToCart()"
                  [disabled]="p.stockDisponible === 0"
                  class="flex-1 py-3.5 px-6 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Agregar {{ quantity() }} un. a la Orden
                </button>

                <a
                  routerLink="/catalog"
                  class="py-3.5 px-5 rounded-full border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold flex items-center justify-center transition-colors text-center"
                >
                  Seguir Comprando
                </a>
              </div>

            </div>

          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- PESTAÑAS TÉCNICAS (Especificaciones, Descripción, Garantía)              -->
        <!-- ========================================================================= -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs mt-10">
          
          <!-- Encabezado de Pestañas -->
          <div class="flex border-b border-slate-200 gap-6 overflow-x-auto">
            <button
              type="button"
              (click)="activeTab.set('specs')"
              [class.border-[#1E50C0]]="activeTab() === 'specs'"
              [class.text-[#1E50C0]]="activeTab() === 'specs'"
              [class.font-bold]="activeTab() === 'specs'"
              class="pb-4 text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-all shrink-0"
            >
              Especificaciones Técnicas
            </button>
            <button
              type="button"
              (click)="activeTab.set('desc')"
              [class.border-[#1E50C0]]="activeTab() === 'desc'"
              [class.text-[#1E50C0]]="activeTab() === 'desc'"
              [class.font-bold]="activeTab() === 'desc'"
              class="pb-4 text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-all shrink-0"
            >
              Descripción Corporativa
            </button>
            <button
              type="button"
              (click)="activeTab.set('warranty')"
              [class.border-[#1E50C0]]="activeTab() === 'warranty'"
              [class.text-[#1E50C0]]="activeTab() === 'warranty'"
              [class.font-bold]="activeTab() === 'warranty'"
              class="pb-4 text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition-all shrink-0"
            >
              Garantía y Despacho Mayorista
            </button>
          </div>

          <!-- Contenido Pestaña 1: Especificaciones Técnicas (Tabla Elegante) -->
          @if (activeTab() === 'specs') {
            <div class="space-y-4">
              <h3 class="text-base font-bold text-[#142238]">Ficha de Homologación de Hardware</h3>
              <div class="overflow-hidden rounded-2xl border border-slate-200">
                <table class="w-full text-left text-xs">
                  <tbody class="divide-y divide-slate-100">
                    @for (spec of p.especificaciones; track spec.clave; let even = $even) {
                      <tr [class.bg-slate-50]="even" class="hover:bg-blue-50/40 transition-colors">
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
            </div>
          }

          <!-- Contenido Pestaña 2: Descripción -->
          @if (activeTab() === 'desc') {
            <div class="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
              <p>{{ p.descripcion }}</p>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 class="font-bold text-[#142238] text-xs">Casos de Uso Corporativos:</h4>
                <ul class="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>Equipamiento de puestos de trabajo administrativo, operativo y técnico.</li>
                  <li>Infraestructura homologable para licitaciones públicas y compras directas B2B.</li>
                  <li>Total compatibilidad con estándares de red y seguridad empresarial.</li>
                </ul>
              </div>
            </div>
          }

          <!-- Contenido Pestaña 3: Garantía y Despacho -->
          @if (activeTab() === 'warranty') {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 class="font-bold text-[#142238] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-blue-600"></span>
                  Garantía del Fabricante
                </h4>
                <p>
                  Este producto cuenta con <strong>{{ p.garantiaMeses }} meses</strong> de garantía oficial respaldada por {{ p.proveedorRazonSocial }}. Cubre fallas de hardware, circuitos y defectos de ensamblaje.
                </p>
              </div>

              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 class="font-bold text-[#142238] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Despacho y Trazabilidad (Split Order)
                </h4>
                <p>
                  El despacho se coordina de manera directa por el proveedor con guía de remisión física y electrónica. Recibirás actualizaciones de estado desde la preparación hasta la entrega final.
                </p>
              </div>
            </div>
          }

        </div>

        <!-- Modal de Contacto P-05 -->
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
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogApi = inject(CatalogApiService);
  private readonly cartState = inject(CartStateService);
  private readonly toastState = inject(ToastStateService);

  public readonly product = signal<ProductDetail | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly activeImage = signal<string>('');
  public readonly activeTab = signal<'specs' | 'desc' | 'warranty'>('specs');
  public readonly isContactModalOpen = signal<boolean>(false);
  public readonly quantity = signal<number>(1);

  // Precios y cálculos computados
  public readonly currentUnitPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    if (p.precioMayorista && p.cantidadMinimaMayorista && this.quantity() >= p.cantidadMinimaMayorista) {
      return p.precioMayorista;
    }
    return p.precioUnitario;
  });

  public readonly calculatedSubtotal = computed(() => {
    return Math.round(this.currentUnitPrice() * this.quantity() * 100) / 100;
  });

  public readonly calculatedIgv = computed(() => {
    return Math.round(this.calculatedSubtotal() * 0.18 * 100) / 100;
  });

  public readonly calculatedTotal = computed(() => {
    return Math.round((this.calculatedSubtotal() + this.calculatedIgv()) * 100) / 100;
  });

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

    // Si viene con parámetro ?contacto=true, abrir automáticamente el modal P-05
    this.route.queryParamMap.subscribe(qp => {
      if (qp.get('contacto') === 'true') {
        this.isContactModalOpen.set(true);
      }
    });
  }

  public loadProduct(id?: number): void {
    const productId = id ?? (this.product()?.id || 101);
    this.isLoading.set(true);
    this.hasError.set(false);

    this.catalogApi.getProductDetail(productId).subscribe({
      next: (detail) => {
        this.isLoading.set(false);
        this.product.set(detail);
        this.activeImage.set(detail.imagenPrincipalUrl);
        // Inicializar cantidad con el mínimo mayorista o 1
        this.quantity.set(detail.cantidadMinimaMayorista || 1);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public increaseQty(): void {
    const p = this.product();
    if (p && this.quantity() < p.stockDisponible) {
      this.quantity.update(q => q + 1);
    }
  }

  public decreaseQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  public setQuantity(val: number): void {
    const p = this.product();
    if (!p) return;
    const clamped = Math.max(1, Math.min(val || 1, p.stockDisponible));
    this.quantity.set(clamped);
  }

  public addToCart(): void {
    const p = this.product();
    if (!p) return;

    this.cartState.addItem(p, this.quantity());
    this.toastState.success(
      'Producto Agregado al Carrito',
      `${this.quantity()} un. de "${p.nombre}" añadidas a tu pedido B2B.`
    );
  }
}
