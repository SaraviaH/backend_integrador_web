import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SerieMensualMetric } from '../../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-sales-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-sm sm:text-base font-bold text-[#04202E] dark:text-white">
            {{ mode() === 'gmv' ? 'Evolución Mensual de GMV y Órdenes' : 'Tiempo Promedio de Despacho (SLA)' }}
          </h2>
          <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
            {{ mode() === 'gmv' ? 'Tendencia últimos 6 meses en S/ (sin canceladas)' : 'Horas promedio entre creación y despacho por mes' }}
          </p>
        </div>

        <div class="inline-flex rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] p-1 self-start">
          <button
            type="button"
            (click)="mode.set('gmv')"
            [class]="mode() === 'gmv'
              ? 'bg-[#1786B4] text-white shadow-xs'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-[#04202E] dark:hover:text-white'"
            class="px-3 py-1 rounded-lg text-[11px] font-bold transition-colors"
          >
            GMV &amp; Órdenes
          </button>
          <button
            type="button"
            (click)="mode.set('sla')"
            [class]="mode() === 'sla'
              ? 'bg-[#1786B4] text-white shadow-xs'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-[#04202E] dark:hover:text-white'"
            class="px-3 py-1 rounded-lg text-[11px] font-bold transition-colors"
          >
            Despacho (h)
          </button>
        </div>
      </div>

      <!-- Detalle mes seleccionado / hover -->
      @if (activePoint(); as pt) {
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] px-3.5 py-2.5 text-xs">
          <div>
            <span class="block text-[10px] font-bold uppercase text-[#527588] dark:text-[#B8DFEF]">Mes</span>
            <span class="font-bold text-[#04202E] dark:text-white">{{ pt.etiqueta }}</span>
          </div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-[#527588] dark:text-[#B8DFEF]">GMV</span>
            <span class="font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA]">S/ {{ pt.gmv | number:'1.2-2' }}</span>
          </div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-[#527588] dark:text-[#B8DFEF]">Órdenes</span>
            <span class="font-mono font-bold text-[#04202E] dark:text-white">{{ pt.ordenesCount }} (Ticket S/ {{ pt.ticketPromedio | number:'1.0-0' }})</span>
          </div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-[#527588] dark:text-[#B8DFEF]">SLA Despacho</span>
            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ pt.horasDespachoPromedio | number:'1.1-1' }} h</span>
          </div>
        </div>
      }

      <!-- Gráfica SVG -->
      <div class="w-full overflow-x-auto">
        <svg viewBox="0 0 640 220" class="w-full h-56 select-none" role="img" aria-label="Gráfica de evolución mensual">
          <defs>
            <linearGradient id="compunexBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1786B4" stop-opacity="0.92" />
              <stop offset="100%" stop-color="#4FB3DA" stop-opacity="0.45" />
            </linearGradient>
            <linearGradient id="compunexSlaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.32" />
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          <!-- Líneas guía horizontales -->
          @for (tick of gridTicks(); track tick.y) {
            <line
              x1="54"
              [attr.y1]="tick.y"
              x2="620"
              [attr.y2]="tick.y"
              stroke="currentColor"
              class="text-[#D8ECF6] dark:text-[#1D4960]"
              stroke-dasharray="4 4"
              stroke-width="1"
            />
            <text
              x="46"
              [attr.y]="tick.y + 4"
              text-anchor="end"
              class="fill-[#527588] dark:fill-[#B8DFEF] text-[10px] font-mono"
            >
              {{ tick.label }}
            </text>
          }

          @if (mode() === 'sla' && slaAreaPath()) {
            <path [attr.d]="slaAreaPath()" fill="url(#compunexSlaGrad)" />
            <path [attr.d]="slaLinePath()" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          }

          <!-- Barras / Puntos por mes -->
          @for (bar of chartBars(); track bar.periodo; let idx = $index) {
            <g
              class="cursor-pointer"
              (mouseenter)="hoveredIdx.set(idx)"
              (focus)="hoveredIdx.set(idx)"
            >
              @if (mode() === 'gmv') {
                <rect
                  [attr.x]="bar.barX"
                  [attr.y]="bar.barY"
                  [attr.width]="bar.barW"
                  [attr.height]="bar.barH"
                  rx="7"
                  [attr.fill]="hoveredIdx() === idx ? '#0F5E83' : 'url(#compunexBarGrad)'"
                  class="transition-all duration-150"
                />
                <text
                  [attr.x]="bar.centerX"
                  [attr.y]="bar.barY - 6"
                  text-anchor="middle"
                  class="fill-[#04202E] dark:fill-[#E1F2FA] text-[10px] font-mono font-bold"
                >
                  {{ bar.ordenesCount }} ord
                </text>
              } @else {
                <circle
                  [attr.cx]="bar.centerX"
                  [attr.cy]="bar.slaY"
                  [attr.r]="hoveredIdx() === idx ? 6 : 4.5"
                  fill="#10B981"
                  stroke="#FFFFFF"
                  stroke-width="2"
                />
                <text
                  [attr.x]="bar.centerX"
                  [attr.y]="bar.slaY - 10"
                  text-anchor="middle"
                  class="fill-[#04202E] dark:fill-[#E1F2FA] text-[10px] font-mono font-bold"
                >
                  {{ bar.horasDespachoPromedio | number:'1.1-1' }}h
                </text>
              }

              <!-- Zona táctil invisible amplia -->
              <rect
                [attr.x]="bar.centerX - 38"
                y="14"
                width="76"
                height="185"
                fill="transparent"
              />

              <!-- Etiqueta eje X -->
              <text
                [attr.x]="bar.centerX"
                y="206"
                text-anchor="middle"
                [class]="hoveredIdx() === idx
                  ? 'fill-[#1786B4] dark:fill-[#4FB3DA] font-bold text-[11px]'
                  : 'fill-[#527588] dark:fill-[#B8DFEF] text-[11px]'"
              >
                {{ bar.etiqueta }}
              </text>
            </g>
          }
        </svg>
      </div>
    </article>
  `
})
export class AdminSalesChartComponent {
  private readonly _series = signal<SerieMensualMetric[]>([]);

  @Input({ required: true })
  set series(val: SerieMensualMetric[]) {
    this._series.set(val ?? []);
    if (val && val.length > 0 && this.hoveredIdx() >= val.length) {
      this.hoveredIdx.set(val.length - 1);
    }
  }

  public readonly mode = signal<'gmv' | 'sla'>('gmv');
  public readonly hoveredIdx = signal<number>(5);

  public readonly activePoint = computed(() => {
    const list = this._series();
    if (!list.length) return null;
    const idx = Math.min(Math.max(0, this.hoveredIdx()), list.length - 1);
    return list[idx];
  });

  private readonly maxGmv = computed(() => {
    const maxVal = Math.max(...this._series().map(s => Number(s.gmv ?? 0)), 100);
    return Math.ceil(maxVal / 500) * 500;
  });

  private readonly maxHoras = computed(() => {
    const maxVal = Math.max(...this._series().map(s => Number(s.horasDespachoPromedio ?? 0)), 12);
    return Math.ceil(maxVal / 10) * 10;
  });

  public readonly gridTicks = computed(() => {
    const topY = 24;
    const bottomY = 182;
    const maxVal = this.mode() === 'gmv' ? this.maxGmv() : this.maxHoras();
    return [0, 0.25, 0.5, 0.75, 1].map(ratio => {
      const y = bottomY - ratio * (bottomY - topY);
      const val = Math.round(maxVal * ratio);
      const label = this.mode() === 'gmv'
        ? (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`)
        : `${val}h`;
      return { y, label };
    });
  });

  public readonly chartBars = computed(() => {
    const list = this._series();
    if (!list.length) return [];
    const left = 72;
    const right = 602;
    const step = list.length > 1 ? (right - left) / (list.length - 1) : 0;
    const topY = 24;
    const bottomY = 182;
    const spanY = bottomY - topY;
    const maxG = this.maxGmv() || 1;
    const maxH = this.maxHoras() || 1;

    return list.map((item, idx) => {
      const centerX = list.length === 1 ? 330 : left + idx * step;
      const gmvVal = Number(item.gmv ?? 0);
      const barH = Math.max(gmvVal > 0 ? 8 : 2, (gmvVal / maxG) * spanY);
      const barW = 42;
      const horas = Number(item.horasDespachoPromedio ?? 0);
      const slaY = bottomY - (horas / maxH) * spanY;
      return {
        ...item,
        centerX,
        barX: centerX - barW / 2,
        barY: bottomY - barH,
        barW,
        barH,
        slaY
      };
    });
  });

  public readonly slaLinePath = computed(() => {
    const pts = this.chartBars();
    if (!pts.length) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.centerX} ${p.slaY}`).join(' ');
  });

  public readonly slaAreaPath = computed(() => {
    const pts = this.chartBars();
    if (pts.length < 2) return '';
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.centerX} ${p.slaY}`).join(' ');
    return `${line} L ${pts[pts.length - 1].centerX} 182 L ${pts[0].centerX} 182 Z`;
  });
}
