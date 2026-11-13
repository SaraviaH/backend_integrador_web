import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogApiService } from '../../core/services/catalog-api.service';
import { Category } from '../../core/models/catalog.model';
import { ToastStateService } from '../../core/state/toast-state.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Categorías de Hardware</span>
      </nav>

      <!-- Encabezado de la Pantalla P-02 -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 class="text-3xl sm:text-4xl font-black text-[#142238] tracking-tight font-display">
            Explorador de Categorías
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Navega por nuestra taxonomía de hardware mayorista, componentes de servidor, estaciones de trabajo y periféricos corporativos.
          </p>
        </div>

        <!-- Buscador Local Rápido de Categorías -->
        <div class="w-full md:w-72">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchFilter"
              placeholder="Filtrar categorías..."
              class="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-250 rounded-full text-xs text-[#142238] placeholder-slate-400 focus:bg-white focus:border-[#2456C6] outline-none transition-all"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-02)                                             -->
      <!-- ========================================================================= -->

      <!-- 1. ESTADO DE CARGA (Skeleton Shimmer) -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          @for (n of [1,2,3,4,5,6]; track n) {
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
              <div class="w-12 h-12 bg-slate-200 rounded-2xl"></div>
              <div class="space-y-2">
                <div class="h-4 bg-slate-200 rounded w-2/3"></div>
                <div class="h-3 bg-slate-150 rounded w-full"></div>
                <div class="h-3 bg-slate-150 rounded w-4/5"></div>
              </div>
              <div class="pt-4 border-t border-slate-100 flex gap-2">
                <div class="h-6 bg-slate-100 rounded-full w-20"></div>
                <div class="h-6 bg-slate-100 rounded-full w-24"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
          <div class="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-rose-900">No se pudieron cargar las categorías</h3>
            <p class="text-xs text-rose-600 mt-1">Ocurrió un error al consultar el catálogo. Intenta nuevamente.</p>
          </div>
          <button
            type="button"
            (click)="loadCategories()"
            class="px-5 py-2.5 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-semibold transition-colors shadow-2xs"
          >
            Reintentar conexión
          </button>
        </div>
      }

      <!-- 3. ESTADO VACÍO -->
      @else if (filteredCategories().length === 0) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-[#142238]">No se encontraron categorías</h3>
          <p class="text-xs text-slate-500">No hay categorías que coincidan con tu criterio de búsqueda.</p>
          <button
            type="button"
            (click)="searchFilter = ''"
            class="text-xs font-bold text-[#2456C6] hover:underline"
          >
            Limpiar filtro
          </button>
        </div>
      }

      <!-- 4. ESTADO CON DATOS (Grid de Categorías) -->
      @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (cat of filteredCategories(); track cat.id) {
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all group">
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 text-[#1E50C0] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  @if (cat.totalProductos != null) {
                    <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {{ cat.totalProductos }} productos
                    </span>
                  }
                </div>

                <div>
                  <h3 class="text-base sm:text-lg font-bold text-[#142238] group-hover:text-[#2456C6] transition-colors">
                    {{ cat.nombre }}
                  </h3>
                  <p class="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {{ cat.descripcion || 'Línea de equipamiento y suministros para empresas y centros de datos.' }}
                  </p>
                </div>

                <!-- Subcategorías Asociadas -->
                @if (cat.subcategorias && cat.subcategorias.length > 0) {
                  <div class="pt-3 border-t border-slate-100">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Subcategorías</p>
                    <div class="flex flex-wrap gap-1.5">
                      @for (sub of cat.subcategorias; track sub.id) {
                        <a
                          [routerLink]="['/catalog']"
                          [queryParams]="{ categoriaId: cat.id, subcategoria: sub.slug || sub.id }"
                          class="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-[11px] text-slate-600 hover:text-[#2456C6] border border-slate-200/60 transition-colors"
                        >
                          {{ sub.nombre }}
                        </a>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Enlace a Catálogo Filtrado -->
              <div class="mt-6 pt-4 border-t border-slate-100">
                <a
                  [routerLink]="['/catalog']"
                  [queryParams]="{ categoriaId: cat.id }"
                  class="w-full py-2.5 px-4 rounded-full border border-[#1E50C0] text-[#1E50C0] hover:bg-blue-50/60 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Explorar catálogo de {{ cat.nombre }}
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>
          }
        </div>
      }

    </div>
  `
})
export class CategoriesComponent implements OnInit {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly toast = inject(ToastStateService);

  public categories = signal<Category[]>([]);
  public isLoading = signal<boolean>(true);
  public hasError = signal<boolean>(false);
  public searchFilter: string = '';

  public get filteredCategories(): () => Category[] {
    return () => {
      const q = this.searchFilter.trim().toLowerCase();
      if (!q) return this.categories();
      return this.categories().filter(c =>
        c.nombre.toLowerCase().includes(q) || (c.descripcion && c.descripcion.toLowerCase().includes(q))
      );
    };
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  public loadCategories(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.catalogApi.getCategories().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        if (data && data.length > 0) {
          this.categories.set(data);
        } else {
          this.categories.set([]);
        }
      },
      error: (_err) => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private getMockCategories(): Category[] {
    return [
      {
        id: 'laptops-workstations',
        nombre: 'Laptops & Workstations',
        descripcion: 'Portátiles empresariales, estaciones de trabajo móviles y equipos para alto rendimiento computacional.',
        totalProductos: 38,
        subcategorias: [
          { id: 'laptops-empresariales', nombre: 'Laptops Empresariales' },
          { id: 'workstations-moviles', nombre: 'Workstations Móviles' },
          { id: 'ultrabooks', nombre: 'Ultrabooks Ejecutivas' }
        ]
      },
      {
        id: 'servidores-redes',
        nombre: 'Servidores & Redes',
        descripcion: 'Servidores en rack, servidores en torre, switches gestionables y enrutadores de alta capacidad.',
        totalProductos: 24,
        subcategorias: [
          { id: 'servidores-rack', nombre: 'Servidores Rack 1U/2U' },
          { id: 'switches-gestionables', nombre: 'Switches Gestionables' },
          { id: 'access-points', nombre: 'Access Points Corporativos' }
        ]
      },
      {
        id: 'monitores-pantallas',
        nombre: 'Monitores & Pantallas',
        descripcion: 'Pantallas IPS para diseño, monitores ultrawide, pantallas de alta tasa de refresco y brazos ergonómicos.',
        totalProductos: 42,
        subcategorias: [
          { id: 'monitores-ips', nombre: 'Monitores 27" y 32" IPS' },
          { id: 'pantallas-ultrawide', nombre: 'Ultrawide 34"' },
          { id: 'accesorios-monitores', nombre: 'Soportes y Brazos VESA' }
        ]
      },
      {
        id: 'componentes',
        nombre: 'Componentes de Computadora',
        descripcion: 'Tarjetas de video GDDR6, procesadores de servidor, placas madre industriales y fuentes certificadas.',
        totalProductos: 65,
        subcategorias: [
          { id: 'tarjetas-video', nombre: 'Tarjetas de Video' },
          { id: 'procesadores', nombre: 'Procesadores Intel / AMD' },
          { id: 'fuentes-poder', nombre: 'Fuentes 80 Plus Gold/Platinum' }
        ]
      },
      {
        id: 'almacenamiento',
        nombre: 'Almacenamiento',
        descripcion: 'Unidades SSD NVMe PCIe Gen4, memorias RAM ECC para servidor y discos duros enterprise.',
        totalProductos: 51,
        subcategorias: [
          { id: 'ssd-nvme', nombre: 'SSD NVMe M.2' },
          { id: 'hdd-enterprise', nombre: 'Discos SAS/SATA Enterprise' },
          { id: 'memorias-ram', nombre: 'Memorias RAM DDR4 / DDR5' }
        ]
      },
      {
        id: 'impresion-consumibles',
        nombre: 'Impresión & Consumibles',
        descripcion: 'Impresoras multifuncionales de alto volumen de ciclo mensual, tóners originales y plotters.',
        totalProductos: 19,
        subcategorias: [
          { id: 'impresoras-laser', nombre: 'Multifuncionales Láser' },
          { id: 'toners-suministros', nombre: 'Tóners y Cartuchos B2B' }
        ]
      }
    ];
  }
}
