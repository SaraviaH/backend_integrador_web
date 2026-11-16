import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { ToastStateService } from '../../core/state/toast-state.service';
import { ActionTracker } from '../../core/state/action-state.util';
import { ProductCard, ProductDetail } from '../../core/models/catalog.model';
import { ProductContactModalComponent } from './product-contact-modal/product-contact-modal.component';
import { ProductPurchasePanelComponent } from './product-purchase-panel/product-purchase-panel.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductContactModalComponent, ProductPurchasePanelComponent, ProductCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <div class="h-4 bg-slate-200 dark:bg-[#1D4960] rounded w-1/3"></div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-5 space-y-4">
              <div class="aspect-square bg-slate-200 dark:bg-[#0F3043] rounded-3xl w-full"></div>
              <div class="flex gap-3">
                <div class="w-20 h-20 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
                <div class="w-20 h-20 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
                <div class="w-20 h-20 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
              </div>
            </div>
            <div class="lg:col-span-7 space-y-6">
              <div class="space-y-3">
                <div class="h-6 bg-slate-200 dark:bg-[#1D4960] rounded w-1/4"></div>
                <div class="h-8 bg-slate-200 dark:bg-[#1D4960] rounded w-4/5"></div>
                <div class="h-4 bg-slate-200 dark:bg-[#0F3043] rounded w-1/2"></div>
              </div>
              <div class="h-32 bg-slate-100 dark:bg-[#0F3043] rounded-3xl p-6"></div>
              <div class="h-24 bg-slate-100 dark:bg-[#0F3043] rounded-3xl p-6"></div>
            </div>
          </div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR / NO ENCONTRADO -->
      @else if (hasError() || !product()) {
        <div class="bg-white dark:bg-[#0F3043] rounded-3xl border border-[#CFE4EE] dark:border-[#1D4960] p-12 text-center space-y-5 max-w-lg mx-auto my-12 shadow-sm">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-300 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-[#04202E] dark:text-[#F2F9FC]">Producto no disponible</h2>
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF] leading-relaxed">
              El producto solicitado no fue encontrado o fue pausado por el proveedor. Puedes explorar otros artículos disponibles en el catálogo.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              (click)="loadProduct()"
              class="px-5 py-2.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-semibold text-[#0A3C55] dark:text-[#E1F2FA] hover:bg-[#E1F2FA]/50 dark:hover:bg-[#1D4960]/60 transition-colors"
            >
              Reintentar
            </button>
            <a
              routerLink="/catalog"
              class="px-6 py-2.5 rounded-xl bg-[#1786B4] text-white text-xs font-semibold hover:bg-[#0F5E83] transition-colors shadow-sm"
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
          <nav class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#98D5EE]" aria-label="Ruta de navegación">
            <a routerLink="/" class="hover:text-[#1786B4] dark:hover:text-[#4FB3DA] transition-colors">Inicio</a>
            <span>/</span>
            <a routerLink="/catalog" class="hover:text-[#1786B4] dark:hover:text-[#4FB3DA] transition-colors">Catálogo B2B</a>
            <span>/</span>
            <span class="font-medium">{{ p.categoriaNombre }}</span>
            <span>/</span>
            <span class="text-[#04202E] dark:text-[#F2F9FC] font-bold truncate max-w-xs">{{ p.nombre }}</span>
          </nav>

          <!-- Cabecera y Grilla Principal -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES -->
            <div class="lg:col-span-5 space-y-4">
              <div class="bg-white dark:bg-[#0F3043] rounded-3xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 flex items-center justify-center aspect-square overflow-hidden relative shadow-sm">
                <img
                  [src]="activeImage()"
                  [alt]="p.nombre"
                  class="w-full h-full object-contain motion-safe:hover:scale-105 motion-safe:transition-transform motion-safe:duration-300"
                />
                @if (p.destacado) {
                  <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold bg-[#04202E] dark:bg-[#1786B4] text-white shadow-sm">
                    Destacado Mayorista
                  </span>
                }
                <span class="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#F4F9FC] dark:bg-[#0A2535] text-[#0A3C55] dark:text-[#B8DFEF] border border-[#CFE4EE] dark:border-[#1D4960]">
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
                  class="w-20 h-20 rounded-2xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] p-2 shrink-0 overflow-hidden transition-all hover:border-[#1786B4]"
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
                    class="w-20 h-20 rounded-2xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] p-2 shrink-0 overflow-hidden transition-all hover:border-[#1786B4]"
                    [attr.aria-label]="'Ver imagen ' + (i + 2)"
                  >
                    <img [src]="img" alt="Miniatura secundaria" class="w-full h-full object-contain" />
                  </button>
                }
              </div>

              <!-- Tarjeta Informativa de Garantía Oficial -->
              <div class="bg-[#F4F9FC] dark:bg-[#0A2535] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#E1F2FA] dark:bg-[#0F3043] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div class="text-xs">
                  <h4 class="font-bold text-[#04202E] dark:text-[#F2F9FC]">Garantía Corporativa Oficial: {{ p.garantiaMeses }} meses</h4>
                  <p class="text-[#527588] dark:text-[#B8DFEF] text-[11px] mt-0.5">Respaldada directamente por el proveedor según términos comerciales del lote.</p>
                </div>
              </div>
            </div>

            <!-- COLUMNA DERECHA: INFORMACIÓN TÉCNICA Y COMPRA -->
            <div class="lg:col-span-7 space-y-6">

              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#E1F2FA] dark:bg-[#0F3043] text-[#0F5E83] dark:text-[#98D5EE] border border-[#98D5EE]/60 dark:border-[#1D4960]">
                    {{ p.categoriaNombre }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-[#F4F9FC] dark:bg-[#0A2535] text-[#0A3C55] dark:text-[#E1F2FA] border border-[#CFE4EE] dark:border-[#1D4960]">
                    Marca: {{ p.marca }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    Condición: {{ p.condicion }}
                  </span>
                </div>

                <h1 class="text-2xl sm:text-3xl font-black text-[#04202E] dark:text-[#F2F9FC] tracking-tight font-display leading-snug">
                  {{ p.nombre }}
                </h1>

                <div class="flex flex-wrap items-center gap-4 text-xs text-[#527588] dark:text-[#B8DFEF] pt-1">
                  <div class="flex items-center gap-1.5">
                    <span class="font-semibold text-[#04202E] dark:text-[#F2F9FC]">Modelo:</span>
                    <span>{{ p.modelo }}</span>
                  </div>
                  <span>•</span>
                  <div class="flex items-center gap-1.5">
                    <span class="font-semibold text-[#04202E] dark:text-[#F2F9FC]">Disponibilidad:</span>
                    @if (p.stockDisponible === 0) {
                      <span class="text-rose-600 dark:text-rose-400 font-bold">Agotado temporalmente</span>
                    } @else if (p.stockDisponible != null) {
                      <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {{ p.stockDisponible }} unidades referenciales en almacén
                      </span>
                    } @else {
                      <span class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Disponible para despacho mayorista
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Ficha del Proveedor Mayorista -->
              <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center font-bold text-lg font-display shrink-0">
                    {{ p.proveedorRazonSocial.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">{{ p.proveedorRazonSocial }}</h3>
                      <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        ✓ Proveedor Activo
                      </span>
                    </div>
                    <p class="text-xs text-[#527588] dark:text-[#B8DFEF] mt-0.5">
                      RUC: <strong class="text-[#04202E] dark:text-[#F2F9FC] font-mono">{{ p.proveedorRuc }}</strong>
                      @if (p.proveedorCiudad) {
                        <span> · {{ p.proveedorCiudad }}</span>
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  (click)="isContactModalOpen.set(true)"
                  class="px-4 py-2.5 rounded-xl border border-[#1786B4] dark:border-[#4FB3DA] text-[#1786B4] dark:text-[#4FB3DA] hover:bg-[#E1F2FA]/60 dark:hover:bg-[#1786B4]/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contactar Proveedor
                </button>
              </div>

              <!-- PROCESO DE COMPRA MAYORISTA B2B EN DOS PANELES -->
              <app-product-purchase-panel
                [product]="p"
                [quantity]="quantity()"
                [unitPrice]="currentUnitPrice()"
                [subtotal]="calculatedSubtotal()"
                [igv]="calculatedIgv()"
                [totalWithIgv]="calculatedTotal()"
                [isAdding]="cartAction.isLoading('add-main')"
                [justAdded]="cartAction.isSuccess('add-main')"
                (quantityChange)="setQuantity($event)"
                (addToCart)="addToCart()"
              />

            </div>

          </div>

          <!-- PESTAÑAS TÉCNICAS -->
          <div class="bg-white dark:bg-[#0F3043] rounded-3xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 md:p-8 space-y-6 shadow-sm mt-10">

            <div class="flex border-b border-[#CFE4EE] dark:border-[#1D4960] gap-6 overflow-x-auto" role="tablist">
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="activeTab() === 'specs'"
                (click)="activeTab.set('specs')"
                [class.border-brand-primary]="activeTab() === 'specs'"
                [class.text-brand-primary]="activeTab() === 'specs'"
                [class.font-bold]="activeTab() === 'specs'"
                class="pb-4 text-sm text-[#527588] dark:text-[#B8DFEF] hover:text-[#04202E] dark:hover:text-[#F2F9FC] border-b-2 border-transparent transition-all shrink-0"
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
                class="pb-4 text-sm text-[#527588] dark:text-[#B8DFEF] hover:text-[#04202E] dark:hover:text-[#F2F9FC] border-b-2 border-transparent transition-all shrink-0"
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
                class="pb-4 text-sm text-[#527588] dark:text-[#B8DFEF] hover:text-[#04202E] dark:hover:text-[#F2F9FC] border-b-2 border-transparent transition-all shrink-0"
              >
                Garantía y Despacho Mayorista
              </button>
            </div>

            @if (activeTab() === 'specs') {
              <div class="space-y-4">
                <h3 class="text-base font-bold text-[#04202E] dark:text-[#F2F9FC]">Ficha de Homologación de Hardware</h3>
                @if (p.especificaciones.length > 0) {
                  <div class="overflow-hidden rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960]">
                    <table class="w-full text-left text-xs">
                      <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                        @for (spec of p.especificaciones; track spec.clave; let even = $even) {
                          <tr [ngClass]="even ? 'bg-[#F4F9FC] dark:bg-[#0A2535]' : 'bg-white dark:bg-[#0F3043]'" class="hover:bg-[#E1F2FA]/40 dark:hover:bg-[#1D4960]/40 transition-colors">
                            <td class="px-5 py-3.5 font-bold text-[#04202E] dark:text-[#F2F9FC] w-1/3 border-r border-[#E1F2FA] dark:border-[#1D4960]">
                              {{ spec.clave }}
                            </td>
                            <td class="px-5 py-3.5 text-[#527588] dark:text-[#B8DFEF]">
                              {{ spec.valor }}
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                } @else {
                  <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">El proveedor no registró especificaciones técnicas adicionales para este ítem.</p>
                }
              </div>
            }

            @if (activeTab() === 'desc') {
              <div class="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF] leading-relaxed space-y-4">
                <p>{{ p.descripcion }}</p>
              </div>
            }

            @if (activeTab() === 'warranty') {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#527588] dark:text-[#B8DFEF]">
                <div class="p-5 rounded-2xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] space-y-2">
                  <h4 class="font-bold text-[#04202E] dark:text-[#F2F9FC] flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#1786B4] dark:bg-[#4FB3DA]"></span>
                    Garantía del Proveedor
                  </h4>
                  <p>
                    Este producto cuenta con <strong class="text-[#04202E] dark:text-[#F2F9FC]">{{ p.garantiaMeses }} meses</strong> de garantía respaldada por {{ p.proveedorRazonSocial }}.
                  </p>
                </div>

                <div class="p-5 rounded-2xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] space-y-2">
                  <h4 class="font-bold text-[#04202E] dark:text-[#F2F9FC] flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
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
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#1786B4] dark:text-[#4FB3DA]">Más opciones B2B</span>
                    <h2 class="text-xl font-black text-[#04202E] dark:text-[#F2F9FC] font-display">Otros productos del catálogo</h2>
                  </div>
                  <a routerLink="/catalog" class="text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:underline">
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
