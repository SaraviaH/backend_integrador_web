import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService, AdminDashboardMetrics } from '../../../core/services/admin-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Centro de Reportes</span>
      </nav>

      <!-- Header -->
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE] dark:border-[#1D4960] text-[11px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">
            Exportación &amp; Auditoría Gerencial
          </span>
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Centro de Reportes COMPUNEX B2B
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Descarga reportes CSV compatibles con Microsoft Excel (UTF-8) o imprime un resumen ejecutivo en PDF.
          </p>
        </div>

        <button
          type="button"
          (click)="printExecutive()"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#04202E] hover:bg-[#0A3C55] dark:bg-[#1786B4] dark:hover:bg-[#0F5E83] text-white text-xs font-semibold shrink-0 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          <span>Imprimir / Guardar PDF</span>
        </button>
      </div>

      <!-- Tarjetas de Descarga -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm flex flex-col justify-between gap-4">
          <div class="space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-[#E1F2FA] dark:bg-[#0A2535] text-[10px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">EXCEL CSV</span>
            <h2 class="text-sm font-bold text-[#04202E] dark:text-white">Reporte Ejecutivo Consolidado</h2>
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
              Incluye KPIs GMV, IGV, comisiones marketplace (3.5%), MRR SaaS, evolución de 6 meses, categorías y top proveedores.
            </p>
          </div>
          <button
            type="button"
            (click)="download('executive', 'compunex-reporte-ejecutivo.csv')"
            [disabled]="downloading() === 'executive'"
            class="w-full py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] disabled:opacity-60 text-white text-xs font-semibold transition-colors"
          >
            {{ downloading() === 'executive' ? 'Generando...' : 'Descargar Ejecutivo (.csv)' }}
          </button>
        </article>

        <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm flex flex-col justify-between gap-4">
          <div class="space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">AUDITORÍA</span>
            <h2 class="text-sm font-bold text-[#04202E] dark:text-white">Libro de Órdenes B2B</h2>
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
              Detalle transaccional por código de orden, fecha, RUC receptor, método de pago, subtotal, IGV y estado operativo.
            </p>
          </div>
          <button
            type="button"
            (click)="download('orders', 'compunex-ordenes-b2b.csv')"
            [disabled]="downloading() === 'orders'"
            class="w-full py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] disabled:opacity-60 text-white text-xs font-semibold transition-colors"
          >
            {{ downloading() === 'orders' ? 'Generando...' : 'Descargar Órdenes (.csv)' }}
          </button>
        </article>

        <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm flex flex-col justify-between gap-4">
          <div class="space-y-1.5">
            <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-[10px] font-bold text-amber-700 dark:text-amber-300">SAAS SUNAT</span>
            <h2 class="text-sm font-bold text-[#04202E] dark:text-white">Suscripciones &amp; MRR</h2>
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
              Padrón de proveedores con plan activo (Básico, Pro, Enterprise SUNAT), tarifa mensual y vigencia GRE.
            </p>
          </div>
          <button
            type="button"
            (click)="download('subscriptions', 'compunex-suscripciones-saas.csv')"
            [disabled]="downloading() === 'subscriptions'"
            class="w-full py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] disabled:opacity-60 text-white text-xs font-semibold transition-colors"
          >
            {{ downloading() === 'subscriptions' ? 'Generando...' : 'Descargar Suscripciones (.csv)' }}
          </button>
        </article>
      </div>

      <!-- Vista previa de Evolución Mensual -->
      @if (metrics(); as m) {
        <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
          <div class="px-5 py-4 border-b border-[#CFE4EE] dark:border-[#1D4960] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 class="text-sm sm:text-base font-bold text-[#04202E] dark:text-white">
                Serie Histórica Mensual (Últimos 6 Meses)
              </h2>
              <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
                Ingresos acumulados plataforma (Comisión 3.5% + MRR SaaS):
                <strong class="font-mono text-[#1786B4] dark:text-[#4FB3DA]">S/ {{ m.ingresosTotalesPlataforma | number:'1.2-2' }}</strong>
              </p>
            </div>
          </div>

          <div class="b2b-table-wrapper overflow-x-auto">
            <table class="b2b-table w-full min-w-[660px] text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                  <th class="py-3 px-4">Periodo</th>
                  <th class="py-3 px-4 text-right">Órdenes</th>
                  <th class="py-3 px-4 text-right">GMV (S/)</th>
                  <th class="py-3 px-4 text-right">IGV SUNAT (S/)</th>
                  <th class="py-3 px-4 text-right">Ticket Promedio</th>
                  <th class="py-3 px-4 text-right">SLA Despacho</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
                @for (row of m.ventasMensuales; track row.periodo) {
                  <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                    <td class="py-3 px-4 font-bold text-[#04202E] dark:text-white">
                      {{ row.etiqueta }} <span class="font-mono text-[11px] font-normal text-[#527588]">({{ row.periodo }})</span>
                    </td>
                    <td class="py-3 px-4 text-right font-mono font-semibold text-[#04202E] dark:text-white">{{ row.ordenesCount }}</td>
                    <td class="py-3 px-4 text-right font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA]">S/ {{ row.gmv | number:'1.2-2' }}</td>
                    <td class="py-3 px-4 text-right font-mono text-[#527588] dark:text-[#B8DFEF]">S/ {{ row.igv | number:'1.2-2' }}</td>
                    <td class="py-3 px-4 text-right font-mono text-[#04202E] dark:text-white">S/ {{ row.ticketPromedio | number:'1.2-2' }}</td>
                    <td class="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{{ row.horasDespachoPromedio | number:'1.1-1' }} h</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </section>
  `
})
export class AdminReportsComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastStateService);

  public readonly metrics = signal<AdminDashboardMetrics | null>(null);
  public readonly downloading = signal<string | null>(null);

  ngOnInit(): void {
    this.adminApi.getDashboard().subscribe({
      next: (data) => this.metrics.set(data),
      error: () => this.toast.error('Error', 'No se pudo cargar la vista previa de reportes.')
    });
  }

  public download(type: 'executive' | 'orders' | 'subscriptions', filename: string): void {
    this.downloading.set(type);
    this.adminApi.downloadReport(type).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloading.set(null);
        this.toast.success('Reporte descargado', `Archivo ${filename} exportado correctamente.`);
      },
      error: () => {
        this.downloading.set(null);
        this.toast.error('Error de exportación', 'No se pudo generar el archivo CSV.');
      }
    });
  }

  public printExecutive(): void {
    window.print();
  }
}
