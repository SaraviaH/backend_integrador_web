import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService, AdminDashboardMetrics } from '../../../core/services/admin-api.service';
import { AdminKpiCardsComponent } from './components/admin-kpi-cards.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminKpiCardsComponent],
  template: `
    <section class="space-y-6">
      <!-- Breadcrumb -->
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Dashboard y KPIs</span>
      </nav>

      <!-- Header Hero Card -->
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE] dark:border-[#1D4960] text-[11px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">
            Consola Ejecutiva COMPUNEX
          </span>
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Rendimiento del Marketplace B2B
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Supervisión en tiempo real de ventas GMV, cumplimiento logístico, suscripciones SUNAT y salud del catálogo.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            (click)="loadMetrics()"
            [disabled]="loading()"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            <svg class="w-4 h-4" [class.animate-spin]="loading()" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>{{ loading() ? 'Actualizando...' : 'Actualizar KPIs' }}</span>
          </button>

          <a
            routerLink="/admin/subscriptions"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC] dark:bg-[#0A2535] hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] text-xs sm:text-sm font-semibold text-[#0A3C55] dark:text-[#E1F2FA] transition-colors"
          >
            <span>Planes SaaS SUNAT</span>
          </a>
        </div>
      </div>

      <!-- Loading Skeleton -->
      @if (loading() && !metrics()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          @for (item of [1, 2, 3, 4]; track item) {
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 h-[148px] animate-pulse space-y-4">
              <div class="h-3.5 w-28 bg-[#E1F2FA] dark:bg-[#1D4960] rounded"></div>
              <div class="h-7 w-24 bg-[#CFE4EE] dark:bg-[#153F58] rounded"></div>
              <div class="h-3 w-40 bg-[#E1F2FA] dark:bg-[#1D4960] rounded"></div>
            </div>
          }
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-5 flex items-center justify-between gap-4">
          <p class="text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-200">
            {{ errorMessage() }}
          </p>
          <button
            type="button"
            (click)="loadMetrics()"
            class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0"
          >
            Reintentar
          </button>
        </div>
      }

      <!-- Contenido Métricas -->
      @if (metrics(); as m) {
        <app-admin-kpi-cards [metrics]="m" />

        <!-- Tablas y Desglose -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Top Proveedores B2B -->
          <div class="xl:col-span-2 bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-[#CFE4EE] dark:border-[#1D4960] flex items-center justify-between gap-3">
              <div>
                <h2 class="text-sm sm:text-base font-bold text-[#04202E] dark:text-white">
                  Top Proveedores por Volumen de Venta
                </h2>
                <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
                  Ranking comercial acumulado por órdenes pagadas y procesadas
                </p>
              </div>
              <a routerLink="/admin/providers" class="text-xs font-semibold text-[#1786B4] dark:text-[#4FB3DA] hover:underline shrink-0">
                Ver todos &rarr;
              </a>
            </div>

            <div class="b2b-table-wrapper overflow-x-auto">
              <table class="b2b-table w-full min-w-[540px] text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                    <th class="py-3 px-4">Proveedor</th>
                    <th class="py-3 px-4">RUC</th>
                    <th class="py-3 px-4 text-right">Subórdenes</th>
                    <th class="py-3 px-4 text-right">Facturación</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
                  @for (prov of m.topProveedores; track prov.proveedorId) {
                    <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                      <td class="py-3 px-4 font-semibold text-[#04202E] dark:text-white">
                        {{ prov.razonSocial }}
                      </td>
                      <td class="py-3 px-4 font-mono text-[#527588] dark:text-[#B8DFEF]">
                        {{ prov.ruc }}
                      </td>
                      <td class="py-3 px-4 text-right font-mono font-semibold text-[#04202E] dark:text-white">
                        {{ prov.ventasCount }}
                      </td>
                      <td class="py-3 px-4 text-right font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA]">
                        S/ {{ prov.montoTotal | number:'1.2-2' }}
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="py-8 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
                        No hay transacciones registradas todavía.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Salud Operativa y Comunidad -->
          <div class="space-y-4">
            <!-- Estado Subórdenes y Pagos -->
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm space-y-4">
              <h2 class="text-sm font-bold text-[#04202E] dark:text-white">
                Estado Logístico &amp; Pagos
              </h2>

              <div class="space-y-2">
                <p class="text-[11px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">
                  Subórdenes por estado
                </p>
                <div class="space-y-1.5">
                  @for (item of subordenEntries(); track item.key) {
                    <div class="flex items-center justify-between text-xs py-1 border-b border-[#E1F2FA] dark:border-[#1D4960]/60 last:border-b-0">
                      <span class="font-medium text-[#0A3C55] dark:text-[#E1F2FA]">{{ item.key }}</span>
                      <span class="px-2 py-0.5 rounded-md bg-[#E1F2FA] dark:bg-[#0A2535] font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA]">
                        {{ item.value }}
                      </span>
                    </div>
                  }
                </div>
              </div>

              <div class="pt-2 border-t border-[#CFE4EE] dark:border-[#1D4960] space-y-2">
                <p class="text-[11px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">
                  Métodos de Pago
                </p>
                <div class="flex flex-wrap gap-2">
                  @for (pm of paymentEntries(); track pm.key) {
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] text-xs">
                      <span class="font-semibold text-[#04202E] dark:text-white">{{ pm.key }}</span>
                      <span class="font-mono text-[#1786B4] dark:text-[#4FB3DA] font-bold">{{ pm.value }}</span>
                    </span>
                  }
                </div>
              </div>
            </div>

            <!-- Comunidad y Catálogo -->
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm space-y-3">
              <h2 class="text-sm font-bold text-[#04202E] dark:text-white">
                Catálogo &amp; Comunidad B2B
              </h2>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] p-3">
                  <p class="text-[#527588] dark:text-[#B8DFEF] text-[11px]">Proveedores</p>
                  <p class="mt-0.5 text-lg font-extrabold font-mono text-[#04202E] dark:text-white">{{ m.totalProveedores }}</p>
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{{ m.proveedoresVerificados }} verificados</p>
                </div>
                <div class="rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] p-3">
                  <p class="text-[#527588] dark:text-[#B8DFEF] text-[11px]">Clientes B2B</p>
                  <p class="mt-0.5 text-lg font-extrabold font-mono text-[#04202E] dark:text-white">{{ m.totalClientes }}</p>
                  <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">{{ m.totalUsuarios }} usuarios totales</p>
                </div>
                <div class="rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] p-3">
                  <p class="text-[#527588] dark:text-[#B8DFEF] text-[11px]">Productos Activos</p>
                  <p class="mt-0.5 text-lg font-extrabold font-mono text-[#1786B4] dark:text-[#4FB3DA]">{{ m.productosActivos }}</p>
                  <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">de {{ m.totalProductos }} publicados</p>
                </div>
                <div class="rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] p-3">
                  <p class="text-[#527588] dark:text-[#B8DFEF] text-[11px]">Moderación</p>
                  <p class="mt-0.5 text-lg font-extrabold font-mono text-amber-600 dark:text-amber-400">{{ m.productosOcultosAdmin }}</p>
                  <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">{{ m.productosDeshabilitados }} deshabilitados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <a
            routerLink="/admin/subscriptions"
            class="group bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 hover:border-[#1786B4] dark:hover:border-[#4FB3DA] hover:shadow-md transition-all"
          >
            <h3 class="text-sm font-bold text-[#04202E] dark:text-white group-hover:text-[#1786B4] dark:group-hover:text-[#4FB3DA]">
              Gestionar Suscripciones SaaS &rarr;
            </h3>
            <p class="mt-1 text-xs text-[#527588] dark:text-[#B8DFEF]">
              Activa planes Pro o Enterprise SUNAT con emisión CPE y GRE Transportista por proveedor.
            </p>
          </a>

          <a
            routerLink="/admin/products"
            class="group bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 hover:border-[#1786B4] dark:hover:border-[#4FB3DA] hover:shadow-md transition-all"
          >
            <h3 class="text-sm font-bold text-[#04202E] dark:text-white group-hover:text-[#1786B4] dark:group-hover:text-[#4FB3DA]">
              Moderar Catálogo Global &rarr;
            </h3>
            <p class="mt-1 text-xs text-[#527588] dark:text-[#B8DFEF]">
              Revisa precios, stock y aprueba u oculta publicaciones que incumplan políticas B2B.
            </p>
          </a>

          <a
            routerLink="/admin/orders"
            class="group bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 hover:border-[#1786B4] dark:hover:border-[#4FB3DA] hover:shadow-md transition-all"
          >
            <h3 class="text-sm font-bold text-[#04202E] dark:text-white group-hover:text-[#1786B4] dark:group-hover:text-[#4FB3DA]">
              Auditar Órdenes Globales &rarr;
            </h3>
            <p class="mt-1 text-xs text-[#527588] dark:text-[#B8DFEF]">
              Inspecciona códigos de autorización, compradores RUC y estados consolidados de despacho.
            </p>
          </a>
        </div>
      }
    </section>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);

  public readonly metrics = signal<AdminDashboardMetrics | null>(null);
  public readonly loading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly subordenEntries = computed(() => {
    const map = this.metrics()?.subordenesPorEstado ?? {};
    return Object.entries(map).map(([key, value]) => ({ key, value }));
  });

  public readonly paymentEntries = computed(() => {
    const map = this.metrics()?.ordenesPorMetodoPago ?? {};
    return Object.entries(map).map(([key, value]) => ({ key, value }));
  });

  ngOnInit(): void {
    this.loadMetrics();
  }

  public loadMetrics(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.adminApi.getDashboard().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'No se pudieron cargar los KPIs administrativos.');
        this.loading.set(false);
      }
    });
  }
}
