import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { ProviderProductItem } from '../../../../core/models/provider.model';
import { ProductFilterBarComponent, ProductFilterTab } from './components/product-filter-bar/product-filter-bar.component';
import { ProductTableComponent } from './components/product-table/product-table.component';

@Component({
  selector: 'app-provider-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFilterBarComponent, ProductTableComponent],
  template: `
    <div class="space-y-6">
      <!-- Encabezado de la Pantalla P-20 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/panel/dashboard" class="hover:text-brand-primary transition-colors">Panel</a>
            <span>/</span>
            <span class="text-slate-800 font-medium">Catálogo de Productos</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            Gestión de Mi Catálogo B2B
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Administra tus ítems publicados, controla el inventario disponible y fija precios mayoristas por volumen.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="loadCatalog()"
            class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refrescar
          </button>
        </div>
      </div>

      <!-- Banner de Notificación -->
      @if (bannerMessage()) {
        <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-fade-in">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ bannerMessage() }}</span>
          </div>
          <button (click)="bannerMessage.set(null)" class="text-emerald-700 hover:text-emerald-900 cursor-pointer">✕</button>
        </div>
      }

      <!-- 4 ESTADOS DE UI -->

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          <div class="space-y-4 animate-pulse">
            <div class="h-10 bg-slate-100 rounded-xl w-full"></div>
            <div class="h-64 bg-slate-100 rounded-xl w-full"></div>
          </div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError()) {
        <div class="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-slate-900">Error al consultar el catálogo</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            No se pudo sincronizar el listado con el servidor de inventario mayorista.
          </p>
          <button
            type="button"
            (click)="loadCatalog()"
            class="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover transition-colors cursor-pointer"
          >
            Reintentar Conexión
          </button>
        </div>
      }

      <!-- 3. ESTADO VACÍO (SIN PRODUCTOS REGISTRADOS) -->
      @else if (rawProducts().length === 0) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div class="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-slate-900">Aún no tienes productos publicados</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Empieza a comercializar tus componentes y soluciones tecnológicas en el Marketplace mayorista de COMPUNEX.
          </p>
          <a
            routerLink="/panel/products/new"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary-hover transition-colors shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Publicar Mi Primer Producto
          </a>
        </div>
      }

      <!-- 4. ESTADO CON DATOS -->
      @else {
        <!-- Barra de Filtros Dumb Component -->
        <app-product-filter-bar
          [totalCount]="rawProducts().length"
          [activeCount]="countActive()"
          [pausedCount]="countPaused()"
          [lowStockCount]="countLowStock()"
          [activeTab]="currentTab()"
          (tabChange)="onTabChanged($event)"
          (searchChange)="onSearchChanged($event)"
        ></app-product-filter-bar>

        <!-- Tabla Dumb Component -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          @if (filteredProducts().length === 0) {
            <div class="p-8 text-center text-slate-500 text-xs">
              No se encontraron productos que coincidan con los filtros seleccionados.
            </div>
          } @else {
            <app-product-table
              [products]="filteredProducts()"
              (toggleStatus)="onToggleProductStatus($event)"
              (deleteProduct)="onDeleteProduct($event)"
            ></app-product-table>
          }
        </div>
      }
    </div>
  `
})
export class ProviderProductsListComponent implements OnInit {
  private readonly providerApi = inject(ProviderApiService);

  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly rawProducts = signal<ProviderProductItem[]>([]);
  public readonly bannerMessage = signal<string | null>(null);

  public readonly currentTab = signal<ProductFilterTab>('ALL');
  public readonly searchFilter = signal<string>('');

  public readonly countActive = computed(() => this.rawProducts().filter(p => p.activo).length);
  public readonly countPaused = computed(() => this.rawProducts().filter(p => !p.activo).length);
  public readonly countLowStock = computed(() => this.rawProducts().filter(p => p.stock <= 5).length);

  public readonly filteredProducts = computed(() => {
    let list = this.rawProducts();
    const tab = this.currentTab();
    const query = this.searchFilter().toLowerCase().trim();

    if (tab === 'ACTIVE') {
      list = list.filter(p => p.activo);
    } else if (tab === 'PAUSED') {
      list = list.filter(p => !p.activo);
    } else if (tab === 'LOW_STOCK') {
      list = list.filter(p => p.stock <= 5);
    }

    if (query) {
      list = list.filter(p =>
        p.nombre.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.categoriaNombre.toLowerCase().includes(query)
      );
    }

    return list;
  });

  public ngOnInit(): void {
    this.loadCatalog();
  }

  public loadCatalog(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.providerApi.getMyCatalog().subscribe({
      next: (res) => {
        this.rawProducts.set(res.content || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  public onTabChanged(tab: ProductFilterTab): void {
    this.currentTab.set(tab);
  }

  public onSearchChanged(query: string): void {
    this.searchFilter.set(query);
  }

  public onToggleProductStatus(item: ProviderProductItem): void {
    const nuevoEstado = !item.activo;
    this.providerApi.toggleProductStatus(item.id, nuevoEstado).subscribe({
      next: () => {
        this.rawProducts.update(prods =>
          prods.map(p => p.id === item.id ? { ...p, activo: nuevoEstado } : p)
        );
        this.bannerMessage.set(`Producto "${item.nombre}" marcado como ${nuevoEstado ? 'Activo' : 'Pausado'}.`);
      }
    });
  }

  public onDeleteProduct(item: ProviderProductItem): void {
    if (confirm(`¿Estás seguro de que deseas retirar del catálogo el producto "${item.nombre}"?`)) {
      this.providerApi.deleteProduct(item.id).subscribe({
        next: () => {
          this.rawProducts.update(prods => prods.filter(p => p.id !== item.id));
          this.bannerMessage.set(`Producto "${item.nombre}" retirado exitosamente.`);
        }
      });
    }
  }
}
