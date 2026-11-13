import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { ProviderSaleItem } from '../../../../core/models/provider.model';
import { SuborderStatus } from '../../../../core/models/order.model';
import { SaleFilterStatus, SalesFilterTabsComponent } from './components/sales-filter-tabs/sales-filter-tabs.component';
import { SalesTableComponent } from './components/sales-table/sales-table.component';

@Component({
  selector: 'app-provider-sales-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SalesFilterTabsComponent, SalesTableComponent],
  template: `
    <div class="space-y-6">
      <!-- Encabezado de la Pantalla P-24 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/panel/dashboard" class="hover:text-brand-primary transition-colors">Panel</a>
            <span>/</span>
            <span class="text-slate-800 font-medium">Ventas Recibidas</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            Ventas B2B & Despacho de Pedidos
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Revisa las subórdenes asignadas a tu empresa, emite comprobantes y actualiza los hitos logísticos.
          </p>
        </div>

        <button
          type="button"
          (click)="loadSales()"
          class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refrescar Ventas
        </button>
      </div>

      <!-- 4 ESTADOS DE UI -->

      <!-- 1. CARGA -->
      @if (isLoading()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse space-y-4">
          <div class="h-10 bg-slate-100 rounded-xl w-full"></div>
          <div class="h-64 bg-slate-100 rounded-xl w-full"></div>
        </div>
      }

      <!-- 2. ERROR -->
      @else if (hasError()) {
        <div class="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-slate-900">Error al consultar el listado de ventas</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            No se pudo establecer conexión con el servicio de órdenes comerciales.
          </p>
          <button
            type="button"
            (click)="loadSales()"
            class="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      }

      <!-- 3. VACÍO (SIN VENTAS REGISTRADAS) -->
      @else if (rawSales().length === 0) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div class="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-slate-900">Aún no registras ventas</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Cuando las empresas de la red compren productos de tu catálogo, sus subórdenes aparecerán en este panel.
          </p>
          <a
            routerLink="/panel/products"
            class="inline-block text-xs text-brand-primary font-bold hover:underline"
          >
            Ver mis productos en venta
          </a>
        </div>
      }

      <!-- 4. CON DATOS -->
      @else {
        <!-- Barra de Filtros Dumb Component -->
        <app-sales-filter-tabs
          [totalCount]="rawSales().length"
          [pendingCount]="countPending()"
          [inPrepCount]="countInPrep()"
          [dispatchedCount]="countDispatched()"
          [activeStatus]="currentFilter()"
          (statusChange)="onStatusChanged($event)"
          (searchChange)="onSearchChanged($event)"
        ></app-sales-filter-tabs>

        <!-- Tabla de Ventas Dumb Component -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          @if (filteredSales().length === 0) {
            <div class="p-8 text-center text-slate-500 text-xs">
              No hay subórdenes que coincidan con el filtro aplicado.
            </div>
          } @else {
            <app-sales-table [sales]="filteredSales()"></app-sales-table>
          }
        </div>
      }
    </div>
  `
})
export class ProviderSalesListComponent implements OnInit {
  private readonly providerApi = inject(ProviderApiService);

  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly rawSales = signal<ProviderSaleItem[]>([]);
  public readonly currentFilter = signal<SaleFilterStatus>('ALL');
  public readonly searchFilter = signal<string>('');

  public readonly countPending = computed(() =>
    this.rawSales().filter(s => s.estado === 'PENDIENTE_DESPACHO').length
  );
  public readonly countInPrep = computed(() =>
    this.rawSales().filter(s => s.estado === 'EN_PREPARACION').length
  );
  public readonly countDispatched = computed(() =>
    this.rawSales().filter(s => s.estado === 'DESPACHADO' || s.estado === 'ENTREGADO').length
  );

  public readonly filteredSales = computed(() => {
    let list = this.rawSales();
    const filter = this.currentFilter();
    const query = this.searchFilter().toLowerCase().trim();

    if (filter !== 'ALL') {
      list = list.filter(s => s.estado === filter);
    }

    if (query) {
      list = list.filter(s =>
        s.codigoOrden.toLowerCase().includes(query) ||
        s.clienteRazonSocial.toLowerCase().includes(query) ||
        s.clienteRuc.toLowerCase().includes(query) ||
        s.subordenId.toString().includes(query)
      );
    }

    return list;
  });

  public ngOnInit(): void {
    this.loadSales();
  }

  public loadSales(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.providerApi.getMySales().subscribe({
      next: (res) => {
        this.rawSales.set(res.content || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  public onStatusChanged(status: SaleFilterStatus): void {
    this.currentFilter.set(status);
  }

  public onSearchChanged(query: string): void {
    this.searchFilter.set(query);
  }
}
