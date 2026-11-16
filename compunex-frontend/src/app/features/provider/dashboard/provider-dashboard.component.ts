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
    <div class="space-y-7">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#98D5EE]" aria-label="Ruta de navegación">
        <a routerLink="/panel" class="hover:text-[#1786B4] dark:hover:text-[#4FB3DA] transition-colors">Panel</a>
        <span>/</span>
        <span class="text-[#04202E] dark:text-[#F2F9FC] font-bold">Dashboard Comercial</span>
      </nav>

      <!-- Encabezado -->
      <section class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
            Canal Proveedor Mayorista Verificado
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#04202E] dark:text-[#F2F9FC] tracking-tight font-display">
            Panel de Control del Proveedor
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF] mt-1">
            Supervisa tu catálogo activo, atiende subórdenes de compra y gestiona los despachos corporativos.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <a
            routerLink="/panel/profile"
            class="px-4 py-2.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0A2535] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] text-[#04202E] dark:text-[#F2F9FC] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] text-xs font-bold transition-colors"
          >
            Perfil de Tienda
          </a>

          <a
            routerLink="/panel/products/new"
            class="px-5 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Publicar Producto</span>
          </a>
        </div>
      </section>

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div class="h-36 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
            <div class="h-36 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
            <div class="h-36 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
            <div class="h-36 bg-slate-200 dark:bg-[#0F3043] rounded-2xl"></div>
          </div>
          <div class="h-64 bg-slate-100 dark:bg-[#0F3043] rounded-2xl"></div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError()) {
        <div class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto my-8">
          <h3 class="text-base font-bold text-rose-900 dark:text-rose-200">Error al cargar el dashboard</h3>
          <p class="text-xs text-rose-700 dark:text-rose-300">No se pudieron obtener las métricas del proveedor. Intenta nuevamente.</p>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <a
            routerLink="/panel/products"
            class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 flex items-center justify-between gap-4 hover:border-[#1786B4] dark:hover:border-[#4FB3DA] shadow-sm hover:shadow-md transition-all group"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-12 h-12 rounded-xl bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center shrink-0 motion-safe:group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] group-hover:text-[#1786B4] dark:group-hover:text-[#4FB3DA] transition-colors truncate">Mis Productos</h4>
                <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] mt-0.5 line-clamp-2">Control de catálogo, stock referencial y precios</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-[#527588] dark:text-[#98D5EE] shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            routerLink="/panel/sales"
            class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 flex items-center justify-between gap-4 hover:border-emerald-600 dark:hover:border-emerald-400 shadow-sm hover:shadow-md transition-all group"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 motion-safe:group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors truncate">Despacho de Ventas</h4>
                <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] mt-0.5 line-clamp-2">Atención de subórdenes y transiciones de estado</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-[#527588] dark:text-[#98D5EE] shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            routerLink="/panel/profile"
            class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 flex items-center justify-between gap-4 hover:border-[#1786B4] dark:hover:border-[#4FB3DA] shadow-sm hover:shadow-md transition-all group"
          >
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-12 h-12 rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] text-[#0A3C55] dark:text-[#98D5EE] border border-[#CFE4EE]/60 dark:border-[#1D4960] flex items-center justify-center shrink-0 motion-safe:group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="min-w-0">
                <h4 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC] group-hover:text-[#1786B4] dark:group-hover:text-[#4FB3DA] transition-colors truncate">Perfil Comercial</h4>
                <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF] mt-0.5 line-clamp-2">Datos de tienda, sede y políticas B2B</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-[#527588] dark:text-[#98D5EE] shrink-0 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
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
