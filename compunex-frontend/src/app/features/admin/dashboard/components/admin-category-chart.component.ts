import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaMetric } from '../../../../core/services/admin-api.service';

const PALETTE = ['#1786B4', '#0A3C55', '#4FB3DA', '#10B981', '#F59E0B', '#6366F1', '#64748B'];

@Component({
  selector: 'app-admin-category-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4">
      <div>
        <h2 class="text-sm sm:text-base font-bold text-[#04202E] dark:text-white">
          Distribución por Categoría
        </h2>
        <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
          Participación comercial sobre órdenes B2B válidas
        </p>
      </div>

      @if (slices().length > 0) {
        <div class="flex flex-col sm:flex-row items-center gap-5">
          <!-- Donut SVG -->
          <div class="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="44"
                fill="none"
                stroke="currentColor"
                class="text-[#E1F2FA] dark:text-[#0A2535]"
                stroke-width="16"
              />
              @for (slice of slices(); track slice.categoria; let i = $index) {
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  [attr.stroke]="slice.color"
                  [attr.stroke-width]="hoveredIndex() === i ? 19 : 16"
                  [attr.stroke-dasharray]="slice.dashArray"
                  [attr.stroke-dashoffset]="slice.dashOffset"
                  class="cursor-pointer transition-all duration-150"
                  (mouseenter)="hoveredIndex.set(i)"
                />
              }
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-3 pointer-events-none">
              <span class="text-[10px] font-bold uppercase text-[#527588] dark:text-[#B8DFEF] truncate max-w-[84px]">
                {{ activeSlice()?.categoria || 'Total' }}
              </span>
              <span class="text-sm font-extrabold font-mono text-[#04202E] dark:text-white">
                {{ activeSlice()?.porcentajeParticipacion ?? 100 | number:'1.0-1' }}%
              </span>
            </div>
          </div>

          <!-- Lista con barras -->
          <div class="flex-1 w-full space-y-2.5">
            @for (cat of slices(); track cat.categoria; let i = $index) {
              <div
                (mouseenter)="hoveredIndex.set(i)"
                class="space-y-1 cursor-pointer rounded-lg px-2 py-1 hover:bg-[#F4F9FC] dark:hover:bg-[#0A2535] transition-colors"
              >
                <div class="flex items-center justify-between gap-2 text-xs">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" [style.background-color]="cat.color"></span>
                    <span class="font-semibold text-[#04202E] dark:text-white truncate">{{ cat.categoria }}</span>
                  </div>
                  <span class="font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA] shrink-0">
                    S/ {{ cat.montoTotal | number:'1.0-0' }}
                  </span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-[#E1F2FA] dark:bg-[#0A2535] overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    [style.width.%]="cat.porcentajeParticipacion"
                    [style.background-color]="cat.color"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="py-10 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
          Sin ventas categorizadas todavía.
        </div>
      }
    </article>
  `
})
export class AdminCategoryChartComponent {
  private readonly _categories = signal<CategoriaMetric[]>([]);
  public readonly hoveredIndex = signal<number>(0);

  @Input({ required: true })
  set categories(val: CategoriaMetric[]) {
    this._categories.set((val ?? []).slice(0, 6));
  }

  public readonly slices = computed(() => {
    const list = this._categories();
    const circumference = 2 * Math.PI * 44; // ~276.46
    let accumulatedPct = 0;

    return list.map((item, idx) => {
      const pct = Math.max(0, Number(item.porcentajeParticipacion ?? 0));
      const segLen = (pct / 100) * circumference;
      const offset = -((accumulatedPct / 100) * circumference);
      accumulatedPct += pct;
      return {
        ...item,
        color: PALETTE[idx % PALETTE.length],
        dashArray: `${segLen} ${circumference}`,
        dashOffset: offset
      };
    });
  });

  public readonly activeSlice = computed(() => {
    const list = this.slices();
    if (!list.length) return null;
    const idx = Math.min(Math.max(0, this.hoveredIndex()), list.length - 1);
    return list[idx];
  });
}
