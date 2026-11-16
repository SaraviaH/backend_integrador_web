import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../core/services/provider-api.service';
import { AuthStateService } from '../../../core/state/auth-state.service';
import { ProviderMetrics, ProviderSaleItem } from '../../../core/models/provider.model';
import { ProviderKpiCardsComponent } from './kpi-cards/provider-kpi-cards.component';
import { ProviderRecentSalesComponent } from './recent-sales/provider-recent-sales.component';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProviderKpiCardsComponent,
    ProviderRecentSalesComponent
  ],
  template: `
    <div class="space-y-8">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/panel" class="hover:text-brand-primary transition-colors">Panel</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Dashboard Comercial</span>
      </nav>

      <!-- Encabezado -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Canal Proveedor Mayorista Verificado
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display">
            Panel de Control del Proveedor
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisa tu catálogo activo, atiende subórdenes de compra y gestiona los despachos corporativos.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a
            routerLink="/panel/profile"
            class="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-primary text-brand-night hover:text-brand-primary text-xs font-bold transition-colors"
          >
            Perfil de Tienda
          </a>

          <a
            routerLink="/panel/products/new"
            class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Publicar Producto</span>
          </a>
        </div>
      </div>

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="h-28 bg-slate-200 rounded-3xl"></div>
            <div class="h-28 bg-slate-200 rounded-3xl"></div>
            <div class="h-28 bg-slate-200 rounded-3xl"></div>
            <div class="h-28 bg-slate-200 rounded-3xl"></div>
          </div>
          <div class="h-64 bg-slate-100 rounded-3xl"></div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto my-8">
          <h3 class="text-base font-bold text-rose-900">Error al cargar el dashboard</h3>
          <p class="text-xs text-rose-700">No se pudieron obtener las métricas del proveedor. Intenta nuevamente.</p>
          <button
            type="button"
            (click)="loadDashboardData()"
            class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
          >
            Reintentar
          </button>
        </div>
      }

      <!-- 3. ESTADO CON DATOS -->
      @else {
        <app-provider-kpi-cards [metrics]="metrics()" />

        <!-- Accesos Directos a Flujos Clave -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <a
            routerLink="/panel/products"
            class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center gap-4 hover:border-brand-primary hover:shadow-xs transition-all group"
          >
            <div class="w-12 h-12 rounded-2xl bg-brand-tint text-brand-primary flex items-center justify-center shrink-0 motion-safe:group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-night group-hover:text-brand-primary transition-colors">Mis Productos</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Control de catálogo, stock referencial y precios</p>
            </div>
          </a>

          <a
            routerLink="/panel/sales"
            class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center gap-4 hover:border-emerald-600 hover:shadow-xs transition-all group"
          >
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 motion-safe:group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-night group-hover:text-emerald-700 transition-colors">Despacho de Ventas</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Atención de subórdenes y transiciones de estado</p>
            </div>
          </a>

          <a
            routerLink="/panel/profile"
            class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center gap-4 hover:border-brand-night hover:shadow-xs transition-all group"
          >
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-brand-night flex items-center justify-center shrink-0 motion-safe:group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-night group-hover:text-brand-primary transition-colors">Perfil Comercial</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Datos de tienda, sede y políticas B2B</p>
            </div>
          </a>
        </div>

        <app-provider-recent-sales [sales]="recentSales()" />
      }

    </div>
  `
})
export class ProviderDashboardComponent implements OnInit {
  private readonly providerApi = inject(ProviderApiService);
  public readonly authState = inject(AuthStateService);

  public readonly metrics = signal<ProviderMetrics | null>(null);
  public readonly recentSales = signal<ProviderSaleItem[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  public loadDashboardData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.providerApi.getDashboardOverview().subscribe({
      next: (overview) => {
        this.metrics.set(overview.metrics);
        this.recentSales.set(overview.recentSales);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }
}
