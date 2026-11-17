import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardMetrics } from '../../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      <!-- KPI 1: GMV Total e IGV -->
      <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 min-h-[148px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">
              GMV Plataforma (S/)
            </p>
            <p class="mt-1.5 text-2xl sm:text-[26px] leading-tight font-extrabold font-mono text-[#04202E] dark:text-white tracking-tight whitespace-nowrap">
              S/ {{ metrics.gmvTotal | number:'1.2-2' }}
            </p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </span>
        </div>
        <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
          IGV recaudado SUNAT:
          <strong class="font-mono text-[#04202E] dark:text-white">S/ {{ metrics.igvTotalRecaudado | number:'1.2-2' }}</strong>
        </p>
      </article>

      <!-- KPI 2: Órdenes y Ticket Promedio -->
      <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 min-h-[148px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">
              Órdenes Totales
            </p>
            <p class="mt-1.5 text-2xl sm:text-[26px] leading-tight font-extrabold font-mono text-[#04202E] dark:text-white">
              {{ metrics.totalOrdenes }}
            </p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
            {{ metrics.ordenesPagadas }} pagadas
          </span>
        </div>
        <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
          Ticket promedio B2B:
          <strong class="font-mono text-[#04202E] dark:text-white">S/ {{ metrics.ticketPromedio | number:'1.2-2' }}</strong>
        </p>
      </article>

      <!-- KPI 3: Despacho y Tasa de Entrega -->
      <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 min-h-[148px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">
              Tiempo Prom. Despacho
            </p>
            <p class="mt-1.5 text-2xl sm:text-[26px] leading-tight font-extrabold font-mono text-[#04202E] dark:text-white">
              {{ metrics.tiempoPromedioDespachoHoras | number:'1.1-1' }} h
            </p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
          Entrega completada:
          <strong class="font-mono text-[#04202E] dark:text-white">{{ metrics.tasaEntregaPorcentaje | number:'1.1-1' }}%</strong>
          ({{ metrics.totalSubordenes }} subórdenes)
        </p>
      </article>

      <!-- KPI 4: MRR Suscripciones SaaS -->
      <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 min-h-[148px] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">
              MRR SaaS Proveedores
            </p>
            <p class="mt-1.5 text-2xl sm:text-[26px] leading-tight font-extrabold font-mono text-[#1786B4] dark:text-[#4FB3DA]">
              S/ {{ metrics.mrrSuscripciones | number:'1.2-2' }}
            </p>
          </div>
          <span class="w-10 h-10 rounded-xl bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </span>
        </div>
        <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
          <strong class="font-mono text-[#04202E] dark:text-white">{{ metrics.suscripcionesActivas }}</strong> activas ·
          {{ metrics.proveedoresConFacturacion }} con SUNAT
        </p>
      </article>
    </div>
  `
})
export class AdminKpiCardsComponent {
  @Input({ required: true }) metrics!: AdminDashboardMetrics;
}
