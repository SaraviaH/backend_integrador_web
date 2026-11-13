import { Component, inject, OnInit, signal } from '@angular/core';
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
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/panel" class="hover:text-[#2456C6] transition-colors">Panel</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Dashboard Comercial</span>
      </nav>

      <!-- Encabezado de la Pantalla P-19 -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Canal Proveedor Mayorista Verificado
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
            Panel de Control del Proveedor
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisa el rendimiento comercial de tus marcas, despacha subórdenes de clientes y actualiza inventarios.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a
            routerLink="/panel/perfil-comercial"
            class="px-4 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors"
          >
            Perfil de Tienda (P-26)
          </a>
          
          <a
            routerLink="/panel/productos/nuevo"
            class="px-5 py-2.5 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Publicar Producto (P-21)</span>
          </a>
        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-19)                                             -->
      <!-- ========================================================================= -->

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
            class="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold"
          >
            Reintentar
          </button>
        </div>
      }

      <!-- 3. ESTADO CON DATOS: KPIS + VENTAS RECIENTES + ACCESOS RÁPIDOS -->
      @else {
        
        <!-- Tarjetas KPI Modulares (Dumb Component) -->
        <app-provider-kpi-cards [metrics]="metrics()" />

        <!-- Accesos Directos a Flujos Clave -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <a
            routerLink="/panel/productos"
            class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center gap-4 hover:border-[#1E50C0] hover:shadow-xs transition-all group"
          >
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E50C0] flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              🖥️
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#142238] group-hover:text-[#1E50C0] transition-colors">Mis Productos (P-20)</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Control de catálogo, stock y precios</p>
            </div>
          </a>

          <a
            routerLink="/panel/ventas"
            class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center gap-4 hover:border-emerald-600 hover:shadow-xs transition-all group"
          >
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              🚚
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#142238] group-hover:text-emerald-700 transition-colors">Despacho de Ventas (P-24)</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Cambio de estado y guías de remisión</p>
            </div>
          </a>

          <a
            routerLink="/panel/perfil-comercial"
            class="bg-white rounded-3xl border border-slate-200/80 p-5 flex items-center gap-4 hover:border-purple-600 hover:shadow-xs transition-all group"
          >
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
              🏢
            </div>
            <div>
              <h4 class="text-sm font-bold text-[#142238] group-hover:text-purple-700 transition-colors">Perfil de Marca (P-26)</h4>
              <p class="text-[11px] text-slate-500 mt-0.5">Logo, banner y datos de contacto</p>
            </div>
          </a>
        </div>

        <!-- Tabla de Ventas Recientes (Dumb Component) -->
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

    this.providerApi.getDashboardMetrics().subscribe({
      next: (m) => {
        this.metrics.set(m);
        this.loadSales();
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private loadSales(): void {
    this.providerApi.getMySales(0, 5).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.recentSales.set(res.content || []);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
