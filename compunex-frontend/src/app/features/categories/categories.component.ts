import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { Category, Subcategory } from '../../core/models/catalog.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Categorías de Hardware</span>
      </nav>

      <!-- Encabezado -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-brand-primary">Taxonomía Oficial B2B</span>
          <h1 class="text-3xl sm:text-4xl font-black text-brand-night tracking-tight font-display mt-1">
            Explorador de Categorías
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Navega por las líneas de hardware mayorista, infraestructura de servidor, estaciones de trabajo y periféricos corporativos disponibles en la plataforma.
          </p>
        </div>

        <!-- Buscador Local Rápido de Categorías -->
        <div class="w-full md:w-72">
          <div class="relative">
            <label for="category-search" class="sr-only">Filtrar categorías</label>
            <input
              id="category-search"
              type="text"
              [ngModel]="searchFilter()"
              (ngModelChange)="searchFilter.set($event)"
              placeholder="Filtrar categorías..."
              class="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          @for (n of [1,2,3,4,5,6]; track n) {
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <div class="flex justify-between items-center">
                <div class="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                <div class="h-6 bg-slate-150 rounded-full w-24"></div>
              </div>
              <div class="space-y-2">
                <div class="h-4 bg-slate-200 rounded w-2/3"></div>
                <div class="h-3 bg-slate-150 rounded w-full"></div>
                <div class="h-3 bg-slate-150 rounded w-4/5"></div>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <div class="h-9 bg-slate-150 rounded-xl w-full"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
          <div class="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-rose-900">No se pudieron cargar las categorías</h3>
            <p class="text-xs text-rose-700 mt-1">Ocurrió un error al consultar el catálogo. Intenta nuevamente.</p>
          </div>
          <button
            type="button"
            (click)="loadCategories()"
            class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            Reintentar conexión
          </button>
        </div>
      }

      <!-- 3. ESTADO VACÍO -->
      @else if (filteredCategories().length === 0) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-brand-night">No se encontraron categorías</h3>
          <p class="text-xs text-slate-500">
            @if (searchFilter()) {
              No hay categorías que coincidan con tu criterio de búsqueda.
            } @else {
              Aún no hay categorías disponibles en el servidor.
            }
          </p>
          @if (searchFilter()) {
            <button
              type="button"
              (click)="searchFilter.set('')"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-brand-primary transition-colors"
            >
              Limpiar filtro
            </button>
          }
        </div>
      }

      <!-- 4. ESTADO CON DATOS -->
      @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (cat of filteredCategories(); track cat.id) {
            <article class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-brand-primary/45 hover:shadow-md transition-all group">
              <div class="space-y-4">
                <div class="flex items-center justify-between gap-2">
                  <div class="w-12 h-12 rounded-2xl bg-brand-tint border border-brand-tint text-brand-primary flex items-center justify-center motion-safe:group-hover:scale-105 transition-transform">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  @if (cat.totalProductos != null) {
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {{ cat.totalProductos }} {{ cat.totalProductos === 1 ? 'producto' : 'productos' }}
                    </span>
                  }
                </div>

                <div>
                  <h2 class="text-base sm:text-lg font-bold text-brand-night group-hover:text-brand-primary transition-colors">
                    {{ cat.nombre }}
                  </h2>
                  <p class="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {{ cat.descripcion || 'Línea de equipamiento y suministros tecnológicos para empresas.' }}
                  </p>
                </div>

                <!-- Subcategorías bajo demanda desde GET /categories/{id} -->
                <div class="pt-3 border-t border-slate-100">
                  @if (!isSubcategoryLoaded(cat.id)) {
                    <button
                      type="button"
                      (click)="loadSubcategories(cat)"
                      [disabled]="isLoadingSubcategory(cat.id)"
                      class="text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      @if (isLoadingSubcategory(cat.id)) {
                        <span>Cargando subcategorías...</span>
                      } @else {
                        <span>Ver subcategorías</span>
                        <span aria-hidden="true">↓</span>
                      }
                    </button>
                  } @else if (getSubcategories(cat.id).length > 0) {
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Subcategorías</p>
                    <div class="flex flex-wrap gap-1.5">
                      @for (sub of getSubcategories(cat.id); track sub.id) {
                        <a
                          [routerLink]="['/catalog']"
                          [queryParams]="{ categoryId: cat.id, search: sub.nombre }"
                          class="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-brand-tint text-[11px] text-slate-600 hover:text-brand-primary border border-slate-200/70 transition-colors"
                        >
                          {{ sub.nombre }}
                        </a>
                      }
                    </div>
                  } @else {
                    <p class="text-[11px] text-slate-400">Sin subcategorías adicionales registradas.</p>
                  }
                </div>
              </div>

              <!-- Enlace a Catálogo Filtrado -->
              <div class="mt-6 pt-4 border-t border-slate-100">
                <a
                  [routerLink]="['/catalog']"
                  [queryParams]="{ categoryId: cat.id }"
                  class="w-full py-2.5 px-4 rounded-xl border border-brand-primary text-brand-primary hover:bg-brand-tint font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Explorar {{ cat.nombre }}
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </article>
          }
        </div>
      }

    </div>
  `
})
export class CategoriesComponent implements OnInit {
  private readonly catalogApi = inject(CatalogApiService);

  public readonly categories = signal<Category[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly searchFilter = signal<string>('');

  private readonly subcategoriesMap = signal<Record<string, Subcategory[]>>({});
  private readonly loadedSubcategories = signal<Record<string, boolean>>({});
  private readonly loadingSubcategories = signal<Record<string, boolean>>({});

  public readonly filteredCategories = computed(() => {
    const q = this.searchFilter().trim().toLowerCase();
    const list = this.categories();
    if (!q) return list;
    return list.filter(c =>
      c.nombre.toLowerCase().includes(q) || (c.descripcion && c.descripcion.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  public loadCategories(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.catalogApi.getCategories().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.categories.set(data || []);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public loadSubcategories(category: Category): void {
    const key = String(category.id);
    if (this.loadedSubcategories()[key] || this.loadingSubcategories()[key]) return;

    this.loadingSubcategories.update(m => ({ ...m, [key]: true }));

    this.catalogApi.getCategoryById(category.id).subscribe({
      next: (detail) => {
        this.subcategoriesMap.update(m => ({ ...m, [key]: detail.subcategorias || [] }));
        this.loadedSubcategories.update(m => ({ ...m, [key]: true }));
        this.loadingSubcategories.update(m => ({ ...m, [key]: false }));
      },
      error: () => {
        this.subcategoriesMap.update(m => ({ ...m, [key]: [] }));
        this.loadedSubcategories.update(m => ({ ...m, [key]: true }));
        this.loadingSubcategories.update(m => ({ ...m, [key]: false }));
      }
    });
  }

  public isSubcategoryLoaded(id: string | number): boolean {
    return !!this.loadedSubcategories()[String(id)];
  }

  public isLoadingSubcategory(id: string | number): boolean {
    return !!this.loadingSubcategories()[String(id)];
  }

  public getSubcategories(id: string | number): Subcategory[] {
    return this.subcategoriesMap()[String(id)] || [];
  }
}
