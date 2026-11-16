import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { AuthStateService } from '../../core/state/auth-state.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { HomeSearchService } from '../../core/state/home-search.service';
import { ToastStateService } from '../../core/state/toast-state.service';
import { Category, ProductCard } from '../../core/models/catalog.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { HomeHeroComponent, HeroSlide } from './components/home-hero/home-hero.component';
import { BubbleButtonDirective } from '../../shared/directives/bubble-button.directive';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, HomeHeroComponent, BubbleButtonDirective],
  template: `
    <div class="home-page pt-5 sm:pt-6 pb-8">
      <!-- HERO MODULAR CON CARRUSEL AUTOMÁTICO Y PROGRESO LINEAL -->
      <div class="wrap">
        <app-home-hero [slides]="slides" />
      </div>

      <!-- SECCIÓN DE CATEGORÍAS REALES -->
      <section class="wrap home-section" id="categorias">
        <div class="section-heading">
          <div>
            <span class="section-kicker">TAXONOMÍA MAYORISTA</span>
            <h2>Explora por categorías</h2>
            <p>Líneas oficiales de hardware, redes, almacenamiento y equipamiento corporativo.</p>
          </div>
          <a
            routerLink="/categories"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:text-[#0F5E83] dark:hover:text-[#98D5EE] transition-colors shrink-0"
          >
            Ver todas las categorías <span aria-hidden="true">→</span>
          </a>
        </div>

        @if (isLoadingCategories()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            @for (n of [1,2,3,4,5,6]; track n) {
              <div class="bg-[#F4F9FC] dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] rounded-2xl p-5 space-y-3">
                <div class="flex justify-between items-center">
                  <div class="w-10 h-10 rounded-xl bg-[#98D5EE]/40 dark:bg-[#1D4960]"></div>
                  <div class="h-5 w-20 rounded-full bg-[#98D5EE]/40 dark:bg-[#1D4960]"></div>
                </div>
                <div class="h-4 w-2/3 rounded bg-[#98D5EE]/40 dark:bg-[#1D4960]"></div>
                <div class="h-3 w-full rounded bg-[#E1F2FA] dark:bg-[#0A2535]"></div>
              </div>
            }
          </div>
        } @else if (categoriesError()) {
          <div class="bg-rose-50 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-bold text-rose-900 dark:text-rose-200">No se pudieron cargar las categorías</h3>
              <p class="text-xs text-rose-700 dark:text-rose-300 mt-0.5">Verifica tu conexión con el servidor de catálogo.</p>
            </div>
            <button
              type="button"
              appBubbleButton
              (click)="loadCategories()"
              class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors self-start sm:self-auto"
            >
              Reintentar
            </button>
          </div>
        } @else if (categories().length === 0) {
          <div class="bg-[#F4F9FC] dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] rounded-2xl p-8 text-center">
            <p class="text-xs text-[#476577] dark:text-[#98D5EE]">No hay categorías registradas en el catálogo actualmente.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (cat of visibleCategories(); track cat.id) {
              <a
                [routerLink]="['/catalog']"
                [queryParams]="{ categoryId: cat.id }"
                class="group bg-[#F4F9FC] dark:bg-[#0F3043] hover:bg-white dark:hover:bg-[#133A50] border border-[#CFE4EE] dark:border-[#1D4960] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md"
              >
                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-3">
                    <div class="w-10 h-10 rounded-xl bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] border border-[#98D5EE]/60 dark:border-[#1D4960] flex items-center justify-center shrink-0">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    @if (cat.totalProductos != null) {
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white dark:bg-[#0A2535] text-[#0A3C55] dark:text-[#98D5EE] border border-[#CFE4EE] dark:border-[#1D4960]">
                        {{ cat.totalProductos }} {{ cat.totalProductos === 1 ? 'producto' : 'productos' }}
                      </span>
                    }
                  </div>
                  <div>
                    <h3 class="text-sm font-extrabold text-[#04202E] dark:text-[#E1F2FA] group-hover:text-[#1786B4] dark:group-hover:text-[#4FB3DA] transition-colors">
                      {{ cat.nombre }}
                    </h3>
                    @if (cat.descripcion) {
                      <p class="text-xs text-[#476577] dark:text-[#98D5EE] mt-1 line-clamp-2 leading-relaxed">
                        {{ cat.descripcion }}
                      </p>
                    }
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] pt-2 border-t border-[#CFE4EE]/70 dark:border-[#1D4960]">
                  <span>Explorar línea</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </a>
            }
          </div>
        }
      </section>

      <!-- ECOSISTEMA B2B INSTITUCIONAL -->
      <section class="community-section border-y border-[#CFE4EE] dark:border-[#1D4960]" id="comunidad">
        <div class="wrap grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="section-kicker">ARQUITECTURA OPERATIVA B2B</span>
            <h2>Abastecimiento empresarial <em>en una sola orden</em></h2>
            <p class="text-sm text-[#0A3C55] dark:text-[#98D5EE] leading-relaxed">
              Centraliza tus adquisiciones tecnológicas con múltiples mayoristas verificados, facturación individual por proveedor y seguimiento logístico directo.
            </p>
            <div class="flex flex-wrap gap-3 pt-2">
              <a
                routerLink="/catalog"
                appBubbleButton
                class="px-5 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-bold shadow-xs"
              >
                Ir al catálogo mayorista
              </a>
              <a
                [routerLink]="sellerCtaRoute()"
                appBubbleButton
                class="px-5 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#98D5EE] dark:border-[#1D4960] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] text-[#04202E] dark:text-[#E1F2FA] text-xs font-bold"
              >
                {{ sellerCtaLabel() }}
              </a>
            </div>
          </div>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 space-y-2.5 shadow-2xs">
              <div class="w-9 h-9 rounded-xl bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 class="text-sm font-extrabold text-[#04202E] dark:text-[#E1F2FA]">Split Order Automático</h3>
              <p class="text-xs text-[#476577] dark:text-[#98D5EE] leading-relaxed">
                Cada compra multi-proveedor se divide en subórdenes independientes para despacho directo.
              </p>
            </div>

            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 space-y-2.5 shadow-2xs">
              <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-sm font-extrabold text-[#04202E] dark:text-[#E1F2FA]">Comprobantes B2B</h3>
              <p class="text-xs text-[#476577] dark:text-[#98D5EE] leading-relaxed">
                Cálculo automático de base imponible, IGV (18%) y emisión de factura por cada emisor.
              </p>
            </div>

            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 space-y-2.5 shadow-2xs">
              <div class="w-9 h-9 rounded-xl bg-[#E1F2FA] dark:bg-[#0A2535] text-[#0A3C55] dark:text-[#4FB3DA] flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-sm font-extrabold text-[#04202E] dark:text-[#E1F2FA]">Trazabilidad Real</h3>
              <p class="text-xs text-[#476577] dark:text-[#98D5EE] leading-relaxed">
                Monitorea cada etapa de tus subórdenes desde la preparación en almacén hasta la entrega.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CÓMO FUNCIONA -->
      <section class="wrap home-section how-section" id="como-funciona">
        <div class="how-intro">
          <span class="section-kicker">FLUJO DE COMPRA CORPORATIVA</span>
          <h2>Operación directa en 3 pasos</h2>
          <p>Diseñado para áreas de compras, TI e integradores que requieren agilidad y trazabilidad.</p>
        </div>
        <div class="steps">
          <article class="bg-white dark:bg-[#0F3043]">
            <span>01</span>
            <h3>Explora el catálogo</h3>
            <p>Filtra equipamiento por categoría o término técnico y revisa especificaciones reales.</p>
          </article>
          <article class="bg-white dark:bg-[#0F3043]">
            <span>02</span>
            <h3>Consolida tu carrito</h3>
            <p>Agrupa ítems de distintos proveedores con desglose inmediato de subtotal e IGV.</p>
          </article>
          <article class="bg-white dark:bg-[#0F3043]">
            <span>03</span>
            <h3>Factura y da seguimiento</h3>
            <p>Completa tus datos fiscales en el checkout y consulta cada comprobante y despacho.</p>
          </article>
        </div>
      </section>

      <!-- PRODUCTOS DESTACADOS REALES -->
      <section class="wrap home-section" id="productos">
        <div class="section-heading">
          <div>
            <span class="section-kicker">CATÁLOGO EN VIVO</span>
            <h2>Productos disponibles</h2>
            <p>
              @if (search.query().trim()) {
                Coincidencias rápidas para “{{ search.query() }}” en la selección principal.
              } @else {
                Selección actualizada directamente desde el catálogo B2B de proveedores activos.
              }
            </p>
          </div>
          <a
            [routerLink]="['/catalog']"
            [queryParams]="search.query().trim() ? { search: search.query().trim() } : {}"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:text-[#0F5E83] dark:hover:text-[#98D5EE] transition-colors shrink-0"
          >
            {{ search.query().trim() ? 'Buscar en todo el catálogo' : 'Explorar catálogo completo' }}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        @if (isLoadingProducts()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
            @for (n of [1,2,3,4]; track n) {
              <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 space-y-4">
                <div class="aspect-[4/3] bg-[#E1F2FA] dark:bg-[#0A2535] rounded-xl w-full"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-[#E1F2FA] dark:bg-[#1D4960] rounded w-1/3"></div>
                  <div class="h-4 bg-[#98D5EE]/40 dark:bg-[#1D4960] rounded w-4/5"></div>
                  <div class="h-3 bg-[#E1F2FA] dark:bg-[#1D4960] rounded w-1/2"></div>
                </div>
                <div class="h-9 bg-[#E1F2FA] dark:bg-[#1D4960] rounded-xl w-full"></div>
              </div>
            }
          </div>
        } @else if (productsError()) {
          <div class="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-sm font-bold text-rose-900 dark:text-rose-200">No pudimos cargar los productos del catálogo</h3>
              <p class="text-xs text-rose-700 dark:text-rose-300 mt-0.5">Ocurrió un problema al consultar el servidor de productos.</p>
            </div>
            <button
              type="button"
              appBubbleButton
              (click)="loadFeaturedProducts()"
              class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors self-start sm:self-auto"
            >
              Reintentar
            </button>
          </div>
        } @else if (filteredProducts().length === 0) {
          <div class="search-empty flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p role="status" class="m-0 text-xs">
              @if (search.query().trim()) {
                No hay coincidencias para “{{ search.query() }}” entre los productos recientes. Puedes buscar en todo el servidor de catálogo.
              } @else {
                Aún no hay productos activos publicados en el catálogo.
              }
            </p>
            <a
              [routerLink]="['/catalog']"
              [queryParams]="search.query().trim() ? { search: search.query().trim() } : {}"
              appBubbleButton
              class="px-4 py-2 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-bold transition-colors shrink-0 text-center"
            >
              Buscar en el catálogo completo
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (prod of filteredProducts(); track prod.id) {
              <app-product-card [product]="prod" (addToCart)="onAddToCart($event)" />
            }
          </div>
        }
      </section>

      <!-- BANNER PARA VENDEDORES / PROVEEDORES -->
      <section class="wrap home-section">
        <div class="sell-banner">
          <div>
            <span class="sell-kicker">CRECE CON COMPUNEX</span>
            <h2 class="sell-title">¿Quieres vender?<br /><em>Publica tu catálogo B2B.</em></h2>
          </div>
          <div class="space-y-4">
            <p class="m-0">Conecta con empresas compradoras y gestiona inventario, ventas y despacho desde un solo panel.</p>
            <a
              [routerLink]="sellerCtaRoute()"
              appBubbleButton
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-bold shadow-xs"
            >
              <span>{{ sellerCtaLabel() }}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeViewComponent implements OnInit {
  private readonly catalogApi = inject(CatalogApiService);
  public readonly authState = inject(AuthStateService);
  public readonly cartState = inject(CartStateService);
  public readonly search = inject(HomeSearchService);
  private readonly toastState = inject(ToastStateService);

  public readonly categories = signal<Category[]>([]);
  public readonly isLoadingCategories = signal<boolean>(true);
  public readonly categoriesError = signal<boolean>(false);

  public readonly featuredProducts = signal<ProductCard[]>([]);
  public readonly isLoadingProducts = signal<boolean>(true);
  public readonly productsError = signal<boolean>(false);

  public readonly visibleCategories = computed(() => this.categories().slice(0, 6));

  public readonly filteredProducts = computed<ProductCard[]>(() => {
    const query = this.search.query().trim().toLocaleLowerCase();
    const list = this.featuredProducts();
    if (!query) return list;
    return list.filter(product =>
      `${product.nombre} ${product.proveedorRazonSocial} ${product.categoriaNombre} ${product.sku}`
        .toLocaleLowerCase()
        .includes(query)
    );
  });

  public slides: HeroSlide[] = [
    {
      id: 1,
      tituloPre: 'Conecta con el',
      tituloDestacado: 'mundo del hardware',
      descripcion: 'El marketplace mayorista para empresas de tecnología. Explora equipamiento real, consolida órdenes multi-proveedor y gestiona tus comprobantes.',
      botonTexto: 'Explorar catálogo',
      botonRuta: '/catalog',
      imagenUrl: '/images/compunex-hero.png'
    },
    {
      id: 2,
      tituloPre: 'Aprovisionamiento en',
      tituloDestacado: 'servidores y redes',
      descripcion: 'Infraestructura empresarial, conectividad gestionable y componentes certificados para proyectos corporativos.',
      botonTexto: 'Ver categorías',
      botonRuta: '/categories',
      imagenUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      tituloPre: 'Componentes y',
      tituloDestacado: 'almacenamiento masivo',
      descripcion: 'Workstations, aceleradores gráficos, memoria de alta frecuencia y almacenamiento NVMe con gestión directa por proveedor.',
      botonTexto: 'Ver catálogo completo',
      botonRuta: '/catalog',
      imagenUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80'
    }
  ];

  public sellerCtaRoute(): string {
    if (this.authState.isProveedor()) return '/panel/dashboard';
    if (this.authState.isAuthenticated()) return '/cuenta/activar-proveedor';
    return '/auth/registro-empresa';
  }

  public sellerCtaLabel(): string {
    if (this.authState.isProveedor()) return 'Ir a mi Panel de Proveedor';
    if (this.authState.isAuthenticated()) return 'Activar perfil de proveedor';
    return 'Registrar empresa para comprar o vender';
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  public loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.categoriesError.set(false);
    this.catalogApi.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats || []);
        this.isLoadingCategories.set(false);
      },
      error: () => {
        this.categoriesError.set(true);
        this.isLoadingCategories.set(false);
      }
    });
  }

  public loadFeaturedProducts(): void {
    this.isLoadingProducts.set(true);
    this.productsError.set(false);
    this.catalogApi.getProducts({ page: 0, size: 8 }).subscribe({
      next: (res) => {
        this.featuredProducts.set(res.content || res.contenido || []);
        this.isLoadingProducts.set(false);
      },
      error: () => {
        this.productsError.set(true);
        this.isLoadingProducts.set(false);
      }
    });
  }

  public onAddToCart(product: ProductCard): void {
    const result = this.cartState.addItem(product, 1);
    if (!result.added) {
      this.toastState.warning(
        'Stock máximo alcanzado',
        result.reason === 'OUT_OF_STOCK'
          ? `"${product.nombre}" se encuentra temporalmente sin stock disponible.`
          : `Ya tienes la cantidad máxima disponible de "${product.nombre}" en tu carrito.`,
        `stock-limit-${product.id}`
      );
      return;
    }

    this.toastState.success(
      'Producto agregado al carrito',
      `${result.addedQty} un. de "${product.nombre}" agregada a tu orden de compra.`,
      `cart-add-${product.id}`
    );
  }
}
