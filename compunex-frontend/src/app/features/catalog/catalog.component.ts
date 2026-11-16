import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogStateService } from '../../core/state/catalog-state.service';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { ToastStateService } from '../../core/state/toast-state.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { PaginationBarComponent } from '../../shared/components/pagination-bar/pagination-bar.component';
import { Category, ProductCard } from '../../core/models/catalog.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, PaginationBarComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/categories" class="hover:text-brand-primary transition-colors">Categorías</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Catálogo B2B</span>
      </nav>

      <!-- Encabezado y Barra de Búsqueda Principal -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint border border-brand-tint text-brand-primary text-xs font-semibold mb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
              Catálogo Mayorista Certificado
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display">
              Catálogo de Hardware y Tecnología B2B
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              Precios referenciales por unidad, pedidos mínimos por proveedor y facturación directa.
            </p>
          </div>

          <!-- Barra de Búsqueda Reactiva (Debounce 300ms) -->
          <div class="w-full lg:w-96">
            <div class="relative">
              <label for="catalog-search-input" class="sr-only">Buscar productos en el catálogo</label>
              <input
                id="catalog-search-input"
                type="text"
                [ngModel]="searchInput()"
                (ngModelChange)="onSearchInput($event)"
                placeholder="Buscar por modelo, procesador, categoría..."
                class="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              @if (searchInput()) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Barra de Filtros Activos Rápidos (Chips) -->
        @if (hasActiveFilters()) {
          <div class="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-slate-400">Filtros aplicados:</span>

            @if (catalogState.searchTerm()) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                Búsqueda: "{{ catalogState.searchTerm() }}"
                <button type="button" (click)="clearSearch()" class="hover:text-rose-600" aria-label="Quitar búsqueda">×</button>
              </span>
            }

            @if (catalogState.selectedCategory()) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-tint text-brand-primary text-xs font-medium border border-brand-tint">
                Categoría: {{ getSelectedCategoryName() }}
                <button type="button" (click)="selectCategory(null)" class="hover:text-rose-600 font-bold" aria-label="Quitar categoría">×</button>
              </span>
            }

            @if (catalogState.priceMin() !== null || catalogState.priceMax() !== null) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                Precio (página): S/ {{ catalogState.priceMin() ?? 0 }} - S/ {{ catalogState.priceMax() ?? 'Máx' }}
                <button type="button" (click)="clearPriceFilter()" class="hover:text-rose-600" aria-label="Quitar filtro de precio">×</button>
              </span>
            }

            @if (catalogState.onlyInStock()) {
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                Solo disponibles (página)
                <button type="button" (click)="toggleStockFilter(false)" class="hover:text-rose-600 font-bold" aria-label="Quitar filtro de stock">×</button>
              </span>
            }

            <button
              type="button"
              (click)="resetAllFilters()"
              class="text-xs text-rose-600 hover:text-rose-700 hover:underline font-semibold ml-2"
            >
              Restablecer todo
            </button>
          </div>
        }
      </div>

      <!-- Botón móvil para alternar filtros -->
      <div class="lg:hidden">
        <button
          type="button"
          (click)="showMobileFilters.set(!showMobileFilters())"
          class="w-full py-3 px-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-brand-night flex items-center justify-between shadow-2xs"
          [attr.aria-expanded]="showMobileFilters()"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros de catálogo
          </span>
          <span class="text-brand-primary">{{ showMobileFilters() ? 'Ocultar' : 'Mostrar' }}</span>
        </button>
      </div>

      <!-- Layout de Dos Columnas: Filtros Laterales + Rejilla de Productos -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- COLUMNA IZQUIERDA: FILTROS -->
        <aside class="lg:col-span-1 space-y-6" [class.hidden]="!showMobileFilters()" [class.lg:block]="true">
          <div class="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-6 lg:sticky lg:top-24 shadow-xs">

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 class="text-sm font-black text-brand-night uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtros
              </h2>
              @if (hasActiveFilters()) {
                <button
                  type="button"
                  (click)="resetAllFilters()"
                  class="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Limpiar
                </button>
              }
            </div>

            <!-- Filtro 1: Categorías (Servidor) -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700">Categoría de Hardware</span>
                <span class="text-[10px] font-semibold text-brand-primary bg-brand-tint px-2 py-0.5 rounded-full">Global</span>
              </div>
              <div class="space-y-1 max-h-60 overflow-y-auto pr-1">
                <button
                  type="button"
                  (click)="selectCategory(null)"
                  [class.bg-brand-tint]="catalogState.selectedCategory() === null"
                  [class.text-brand-primary]="catalogState.selectedCategory() === null"
                  [class.font-bold]="catalogState.selectedCategory() === null"
                  class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span>Todas las categorías</span>
                  @if (catalogState.selectedCategory() === null) {
                    <svg class="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  }
                </button>

                @for (cat of categories(); track cat.id) {
                  <button
                    type="button"
                    (click)="selectCategory(cat.id)"
                    [class.bg-brand-tint]="isCategorySelected(cat.id)"
                    [class.text-brand-primary]="isCategorySelected(cat.id)"
                    [class.font-bold]="isCategorySelected(cat.id)"
                    class="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span class="truncate">{{ cat.nombre }}</span>
                    @if (isCategorySelected(cat.id)) {
                      <svg class="w-3.5 h-3.5 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  </button>
                }
              </div>
            </div>

            <!-- Filtro 2: Rango de Precios (Refinamiento de página actual) -->
            <div class="space-y-3 pt-3 border-t border-slate-100">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700">Rango de Precio (S/)</span>
                <span class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Página actual</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label for="price-min" class="text-[10px] text-slate-400 block mb-1">Mínimo</label>
                  <input
                    id="price-min"
                    type="number"
                    [(ngModel)]="tempPriceMin"
                    placeholder="0"
                    min="0"
                    class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night focus:bg-white focus:border-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label for="price-max" class="text-[10px] text-slate-400 block mb-1">Máximo</label>
                  <input
                    id="price-max"
                    type="number"
                    [(ngModel)]="tempPriceMax"
                    placeholder="Sin límite"
                    min="0"
                    class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night focus:bg-white focus:border-brand-primary outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                (click)="applyPriceFilter()"
                class="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                Refinar página por precio
              </button>
            </div>

            <!-- Filtro 3: Solo disponibles -->
            <div class="pt-3 border-t border-slate-100">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  [checked]="catalogState.onlyInStock()"
                  (change)="toggleStockFilter($any($event.target).checked)"
                  class="w-4 h-4 rounded text-brand-primary border-slate-300 focus:ring-brand-primary transition-colors"
                />
                <span class="text-xs font-semibold text-slate-700 group-hover:text-brand-primary transition-colors">
                  Ocultar productos agotados (página)
                </span>
              </label>
            </div>

            <!-- Nota técnica sobre alcance de filtros -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-600 space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold text-brand-night">
                <svg class="w-4 h-4 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Búsqueda e IGV B2B
              </div>
              <p class="text-[11px] leading-relaxed">
                La búsqueda y la categoría filtran todo el catálogo en el servidor. El rango de precio y el orden refinan la página actual. Los precios unitarios no incluyen IGV (18%) hasta el checkout.
              </p>
            </div>

          </div>
        </aside>

        <!-- COLUMNA DERECHA: BARRA DE ORDEN Y REJILLA DE PRODUCTOS -->
        <main class="lg:col-span-3 space-y-6">

          <!-- Barra de Control Superior -->
          <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div class="text-xs text-slate-600">
              Mostrando <strong class="text-brand-night">{{ catalogState.products().length }}</strong> de
              <strong class="text-brand-night">{{ catalogState.totalElements() }}</strong> productos encontrados
            </div>

            <div class="flex items-center gap-2">
              <label for="sortBySelect" class="text-xs text-slate-500 shrink-0 font-medium">Ordenar página:</label>
              <select
                id="sortBySelect"
                [ngModel]="catalogState.sortBy()"
                (ngModelChange)="onSortChange($event)"
                class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night focus:bg-white focus:border-brand-primary outline-none"
              >
                <option value="relevancia">Orden del catálogo</option>
                <option value="precio_asc">Menor precio (página)</option>
                <option value="precio_desc">Mayor precio (página)</option>
                <option value="nombre_asc">Nombre: A - Z (página)</option>
              </select>
            </div>
          </div>

          <!-- 1. ESTADO DE CARGA -->
          @if (catalogState.isLoading()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              @for (n of [1,2,3,4,5,6,7,8,9]; track n) {
                <div class="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                  <div class="aspect-[4/3] bg-slate-200 rounded-xl w-full"></div>
                  <div class="space-y-2">
                    <div class="h-3 bg-slate-150 rounded w-1/3"></div>
                    <div class="h-4 bg-slate-200 rounded w-4/5"></div>
                    <div class="h-3 bg-slate-150 rounded w-1/2"></div>
                  </div>
                  <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div class="h-5 bg-slate-200 rounded w-20"></div>
                    <div class="h-8 bg-slate-150 rounded-xl w-24"></div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- 2. ESTADO DE ERROR -->
          @else if (catalogState.hasError()) {
            <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto my-12">
              <div class="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-rose-900">
                No pudimos conectar con el catálogo
              </h3>
              <p class="text-xs text-rose-700 leading-relaxed">
                Ocurrió un error al consultar los productos desde el servidor mayorista. Por favor, verifica tu conexión o vuelve a intentar.
              </p>
              <button
                type="button"
                (click)="catalogState.fetchProducts()"
                class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Reintentar carga
              </button>
            </div>
          }

          <!-- 3. ESTADO VACÍO -->
          @else if (catalogState.products().length === 0) {
            <div class="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-5 my-8">
              <div class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div class="space-y-1">
                <h3 class="text-base font-bold text-brand-night">
                  No se encontraron productos coincidentes
                </h3>
                <p class="text-xs text-slate-500 max-w-md mx-auto">
                  No hay componentes ni equipos que coincidan con los filtros aplicados. Intenta ampliar tus términos de búsqueda o restablecer los filtros.
                </p>
              </div>
              <button
                type="button"
                (click)="resetAllFilters()"
                class="px-6 py-2.5 bg-brand-primary hover:bg-brand-petrol text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Restablecer todos los filtros
              </button>
            </div>
          }

          <!-- 4. ESTADO DE DATOS -->
          @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (product of catalogState.products(); track product.id) {
                <app-product-card
                  [product]="product"
                  (addToCart)="onAddToCart($event)"
                />
              }
            </div>

            <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs mt-8">
              <app-pagination-bar
                [totalItems]="catalogState.totalElements()"
                [pageSize]="catalogState.pageSize()"
                [currentPage]="catalogState.currentPage() + 1"
                (pageChange)="goToPage($event - 1)"
              />
            </div>
          }

        </main>

      </div>

    </div>
  `
})
export class CatalogComponent implements OnInit, OnDestroy {
  public readonly catalogState = inject(CatalogStateService);
  private readonly catalogApi = inject(CatalogApiService);
  private readonly cartState = inject(CartStateService);
  private readonly toastState = inject(ToastStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly categories = signal<Category[]>([]);
  public readonly searchInput = signal<string>('');
  public readonly showMobileFilters = signal<boolean>(false);
  public tempPriceMin: number | null = null;
  public tempPriceMax: number | null = null;

  private readonly searchDebounce$ = new Subject<string>();
  private querySub?: Subscription;
  private searchSub?: Subscription;

  ngOnInit(): void {
    this.catalogApi.getCategories().subscribe({
      next: (cats) => this.categories.set(cats || []),
      error: () => this.categories.set([])
    });

    this.searchSub = this.searchDebounce$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.updateQueryParams({ search: term.trim() || null, q: null, page: null });
    });

    this.querySub = this.route.queryParams.subscribe(params => {
      const search = (params['search'] || params['q'] || '').toString();
      const categoryId = params['categoryId'] || params['categoriaId'] || null;
      const page = params['page'] ? Math.max(0, Number(params['page']) || 0) : 0;

      this.searchInput.set(search);
      this.catalogState.syncFromQueryParams({ search, categoryId, page });
    });
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  public isCategorySelected(catId: string | number): boolean {
    const selected = this.catalogState.selectedCategory();
    return selected !== null && String(selected) === String(catId);
  }

  public onSearchInput(term: string): void {
    this.searchInput.set(term);
    this.searchDebounce$.next(term);
  }

  public clearSearch(): void {
    this.searchInput.set('');
    this.updateQueryParams({ search: null, q: null, page: null });
  }

  public selectCategory(catId: string | number | null): void {
    this.updateQueryParams({ categoryId: catId, categoriaId: null, page: null });
    this.showMobileFilters.set(false);
  }

  public applyPriceFilter(): void {
    this.catalogState.setPriceRange(this.tempPriceMin, this.tempPriceMax);
  }

  public clearPriceFilter(): void {
    this.tempPriceMin = null;
    this.tempPriceMax = null;
    this.catalogState.setPriceRange(null, null);
  }

  public toggleStockFilter(only: boolean): void {
    this.catalogState.setOnlyInStock(only);
  }

  public onSortChange(sortBy: string): void {
    this.catalogState.setSort(sortBy);
  }

  public goToPage(page: number): void {
    this.updateQueryParams({ page: page > 0 ? page : null });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  public resetAllFilters(): void {
    this.tempPriceMin = null;
    this.tempPriceMax = null;
    this.searchInput.set('');
    this.catalogState.priceMin.set(null);
    this.catalogState.priceMax.set(null);
    this.catalogState.onlyInStock.set(false);
    this.catalogState.sortBy.set('relevancia');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
  }

  public hasActiveFilters(): boolean {
    return !!(
      this.catalogState.searchTerm() ||
      this.catalogState.selectedCategory() !== null ||
      this.catalogState.priceMin() !== null ||
      this.catalogState.priceMax() !== null ||
      this.catalogState.onlyInStock()
    );
  }

  public getSelectedCategoryName(): string {
    const id = this.catalogState.selectedCategory();
    if (!id) return '';
    const match = this.categories().find(c => String(c.id) === String(id));
    return match ? match.nombre : `Categoría #${id}`;
  }

  public onAddToCart(product: ProductCard): void {
    const cantidad = 1;
    const result = this.cartState.addItem(product, cantidad);
    if (!result.added) {
      this.toastState.warning(
        'Stock máximo alcanzado',
        result.reason === 'OUT_OF_STOCK'
          ? `"${product.nombre}" no cuenta con stock disponible.`
          : `Ya agregaste todo el stock disponible de "${product.nombre}".`,
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

  private updateQueryParams(params: Record<string, any>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
