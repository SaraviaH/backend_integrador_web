import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroProgressComponent } from '../hero-progress/hero-progress.component';

@Component({
  selector: 'app-carousel-controls',
  standalone: true,
  imports: [CommonModule, HeroProgressComponent],
  template: `
    <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 pt-3 border-t border-[#98D5EE]/50 dark:border-[#1D4960]">
      <!-- Indicadores lineales sincronizados -->
      <div class="flex-1 min-w-[160px]">
        <app-hero-progress
          [slidesCount]="slidesCount"
          [activeIndex]="activeIndex"
          [progress]="progress"
          [isPaused]="isPaused"
          (selectSlide)="selectSlide.emit($event)"
        />
      </div>

      <!-- Contador y botones de control -->
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="font-mono text-[11px] font-bold text-[#0F5E83] dark:text-[#98D5EE] mr-1.5 select-none">
          {{ formatNumber(activeIndex + 1) }} / {{ formatNumber(slidesCount) }}
        </span>

        <button
          type="button"
          (click)="prev.emit()"
          aria-label="Diapositiva anterior"
          title="Diapositiva anterior"
          class="w-9 h-9 rounded-xl border border-[#98D5EE] dark:border-[#1D4960] bg-white/80 dark:bg-[#0A2535] hover:bg-[#E1F2FA] dark:hover:bg-[#1D4960] text-[#04202E] dark:text-[#E1F2FA] flex items-center justify-center transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4] dark:focus-visible:ring-[#4FB3DA]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          (click)="togglePause.emit()"
          [attr.aria-label]="isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'"
          [attr.aria-pressed]="isPaused"
          [title]="isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'"
          class="w-9 h-9 rounded-xl border border-[#98D5EE] dark:border-[#1D4960] bg-white/80 dark:bg-[#0A2535] hover:bg-[#E1F2FA] dark:hover:bg-[#1D4960] text-[#1786B4] dark:text-[#4FB3DA] flex items-center justify-center transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4] dark:focus-visible:ring-[#4FB3DA]"
        >
          @if (isPaused) {
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          } @else {
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          }
        </button>

        <button
          type="button"
          (click)="next.emit()"
          aria-label="Siguiente diapositiva"
          title="Siguiente diapositiva"
          class="w-9 h-9 rounded-xl border border-[#98D5EE] dark:border-[#1D4960] bg-white/80 dark:bg-[#0A2535] hover:bg-[#E1F2FA] dark:hover:bg-[#1D4960] text-[#04202E] dark:text-[#E1F2FA] flex items-center justify-center transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4] dark:focus-visible:ring-[#4FB3DA]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class CarouselControlsComponent {
  @Input({ required: true }) slidesCount = 0;
  @Input({ required: true }) activeIndex = 0;
  @Input({ required: true }) progress = 0;
  @Input() isPaused = false;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() togglePause = new EventEmitter<void>();
  @Output() selectSlide = new EventEmitter<number>();

  public formatNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
