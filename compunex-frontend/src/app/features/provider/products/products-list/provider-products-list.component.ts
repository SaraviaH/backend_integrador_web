import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { ToastStateService } from '../../../../core/state/toast-state.service';
import { ProviderProductItem } from '../../../../core/models/provider.model';
import { ProductFilterBarComponent, ProductFilterTab } from './components/product-filter-bar/product-filter-bar.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { PaginationBarComponent } from '../../../../shared/components/pagination-bar/pagination-bar.component';

@Component({
  selector: 'app-provider-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFilterBarComponent, ProductTableComponent, PaginationBarComponent],
  template: `
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1" aria-label="Ruta de navegación">
            <a routerLink="/panel/dashboard" class="hover:text-brand-primary transition-colors">Panel</a>
            <span>/</span>
            <span class="text-slate-800 font-medium">Catálogo de Productos</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight font-display">
            Gestión de Mi Catálogo B2B
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Administra tus ítems publicados, consulta todo tu inventario paginado y gestiona su estado de publicación.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="loadCatalog(currentPage(), searchFilter())"
            class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ bannerMessage() }}</span>
          </div>
          <button type="button" (click)="bannerMessage.set(null)" class="text-emerald-700 hover:text-emerald-900 cursor-pointer" aria-label="Cerrar notificación">✕</button>
        </div>
      }

      @if (actionError()) {
        <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800" role="alert">
          <span>{{ actionError() }}</span>
          <button type="button" (click)="actionError.set(null)" class="text-rose-700 hover:text-rose-900 font-bold cursor-pointer" aria-label="Cerrar error">✕</button>
        </div>
      }

      <!-- Barra de Filtros -->
      <app-product-filter-bar
        [totalCount]="totalElements()"
        [activeCount]="countActive()"
        [pausedCount]="countPaused()"
        [lowStockCount]="countLowStock()"
        [activeTab]="currentTab()"
        (tabChange)="onTabChanged($event)"
        (searchChange)="onSearchChanged($event)"
      ></app-product-filter-bar>

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
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-slate-900">Error al consultar el catálogo</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            No se pudo sincronizar el listado con el servidor de inventario mayorista.
          </p>
          <button
            type="button"
            (click)="loadCatalog(currentPage(), searchFilter())"
            class="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover transition-colors cursor-pointer"
          >
            Reintentar Conexión
          </button>
        </div>
      }

      <!-- 3. ESTADO VACÍO SIN PRODUCTOS -->
      @else if (totalElements() === 0 && !searchFilter()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div class="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Publicar Mi Primer Producto
          </a>
        </div>
      }

      <!-- 4. ESTADO CON DATOS -->
      @else {
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          @if (filteredProducts().length === 0) {
            <div class="p-8 text-center text-slate-500 text-xs">
              No se encontraron productos que coincidan con la búsqueda o el filtro de pestaña actual.
            </div>
          } @else {
            <app-product-table
              [products]="filteredProducts()"
              [busyProductIds]="busyProductIds()"
              (toggleStatus)="onToggleProductStatus($event)"
              (deleteProduct)="onRequestDelete($event)"
            ></app-product-table>
          }

          <app-pagination-bar
            [totalItems]="totalElements()"
            [pageSize]="pageSize"
            [currentPage]="currentPage()"
            (pageChange)="onPageChange($event)"
          ></app-pagination-bar>
        </div>
      }

      <!-- Modal de Confirmación de Eliminación -->
      @if (productToDelete(); as target) {
        <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" (click)="cancelDelete()"></div>
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div class="text-center space-y-1">
                <h2 id="delete-modal-title" class="text-base font-bold text-brand-night">¿Retirar producto del catálogo?</h2>
                <p class="text-xs text-slate-500">
                  Se eliminará <strong class="text-brand-night">"{{ target.nombre }}"</strong> (SKU: {{ target.sku }}) de tu catálogo público.
                </p>
              </div>
              <div class="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  (click)="cancelDelete()"
                  [disabled]="isDeleting()"
                  class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  (click)="confirmDeleteProduct()"
                  [disabled]="isDeleting()"
                  class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  {{ isDeleting() ? 'Retirando...' : 'Sí, retirar producto' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProviderProductsListComponent implements OnInit, OnDestroy {
  private readonly providerApi = inject(ProviderApiService);
  private readonly toastState = inject(ToastStateService);

  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly rawProducts = signal<ProviderProductItem[]>([]);
  public readonly bannerMessage = signal<string | null>(null);
  public readonly actionError = signal<string | null>(null);

  public readonly currentTab = signal<ProductFilterTab>('ALL');
  public readonly searchFilter = signal<string>('');
  public readonly currentPage = signal<number>(1);
  public readonly totalElements = signal<number>(0);
  public readonly pageSize = 10;

  public readonly productToDelete = signal<ProviderProductItem | null>(null);
  public readonly isDeleting = signal<boolean>(false);
  public readonly busyProductIds = signal<ReadonlySet<number>>(new Set<number>());

  private readonly searchDebounce$ = new Subject<string>();
  private searchSub?: Subscription;

  public readonly countActive = computed(() => this.rawProducts().filter(p => p.activo).length);
  public readonly countPaused = computed(() => this.rawProducts().filter(p => !p.activo).length);
  public readonly countLowStock = computed(() =>
    this.rawProducts().filter(p => p.stock != null && p.stock <= 5).length
  );

  public readonly filteredProducts = computed(() => {
    const list = this.rawProducts();
    const tab = this.currentTab();

    if (tab === 'ACTIVE') return list.filter(p => p.activo);
    if (tab === 'PAUSED') return list.filter(p => !p.activo);
    if (tab === 'LOW_STOCK') return list.filter(p => p.stock != null && p.stock <= 5);
    return list;
  });

  public ngOnInit(): void {
    this.searchSub = this.searchDebounce$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchFilter.set(query);
      this.loadCatalog(1, query);
    });

    this.loadCatalog(1, '');
  }

  public ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  public loadCatalog(page: number = this.currentPage(), search: string = this.searchFilter()): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.currentPage.set(page);

    this.providerApi.getMyCatalog(page - 1, this.pageSize, search).subscribe({
      next: (res) => {
        const items = res.content || [];
        this.rawProducts.set(items);
        this.totalElements.set(res.totalElements ?? items.length);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  public onPageChange(page: number): void {
    this.loadCatalog(page, this.searchFilter());
  }

  public onTabChanged(tab: ProductFilterTab): void {
    this.currentTab.set(tab);
  }

  public onSearchChanged(query: string): void {
    this.searchDebounce$.next(query);
  }

  public onToggleProductStatus(item: ProviderProductItem): void {
    if (this.busyProductIds().has(item.id)) {
      return;
    }

    const nuevoEstado = !item.activo;
    this.actionError.set(null);
    this.setProductBusy(item.id, true);

    this.providerApi.toggleProductStatus(item.id, nuevoEstado).subscribe({
      next: () => {
        this.setProductBusy(item.id, false);
        this.rawProducts.update(prods =>
          prods.map(p => p.id === item.id ? { ...p, activo: nuevoEstado } : p)
        );
        const msg = `Producto "${item.nombre}" marcado como ${nuevoEstado ? 'Activo' : 'Pausado'}.`;
        this.bannerMessage.set(msg);
        this.toastState.success('Estado actualizado', msg, `toggle-prod-${item.id}`);
      },
      error: (err) => {
        this.setProductBusy(item.id, false);
        const msg = err?.error?.mensaje || err?.error?.detail || `No se pudo cambiar el estado de "${item.nombre}".`;
        this.actionError.set(msg);
        this.toastState.error('Error al actualizar estado', msg, `toggle-prod-err-${item.id}`);
      }
    });
  }

  public onRequestDelete(item: ProviderProductItem): void {
    if (this.busyProductIds().has(item.id) || this.isDeleting()) {
      return;
    }
    this.productToDelete.set(item);
  }

  public cancelDelete(): void {
    if (this.isDeleting()) return;
    this.productToDelete.set(null);
  }

  public confirmDeleteProduct(): void {
    if (this.isDeleting()) return;
    const item = this.productToDelete();
    if (!item) return;

    this.isDeleting.set(true);
    this.actionError.set(null);

    this.providerApi.deleteProduct(item.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.productToDelete.set(null);
        this.bannerMessage.set(`Producto "${item.nombre}" retirado exitosamente.`);
        this.toastState.success('Producto retirado', `"${item.nombre}" fue eliminado de tu catálogo.`, `delete-prod-${item.id}`);
        const nextPage = this.rawProducts().length === 1 && this.currentPage() > 1
          ? this.currentPage() - 1
          : this.currentPage();
        this.loadCatalog(nextPage, this.searchFilter());
      },
      error: (err) => {
        this.isDeleting.set(false);
        const msg = err?.error?.mensaje || err?.error?.detail || `No se pudo retirar "${item.nombre}".`;
        this.actionError.set(msg);
        this.toastState.error('Error al retirar producto', msg, `delete-prod-err-${item.id}`);
      }
    });
  }

  private setProductBusy(id: number, busy: boolean): void {
    this.busyProductIds.update(current => {
      const next = new Set(current);
      if (busy) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }
}
