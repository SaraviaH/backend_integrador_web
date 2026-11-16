import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2.5 w-full" role="tablist" aria-label="Progreso de diapositivas">
      @for (idx of indices; track idx) {
        <button
          type="button"
          role="tab"
          (click)="onSelect(idx)"
          [attr.aria-selected]="activeIndex === idx"
          [attr.aria-label]="'Ir a diapositiva ' + (idx + 1)"
          class="group flex-1 h-7 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:focus-visible:ring-brand-sky rounded-md px-0.5"
        >
          <span class="w-full h-1.5 rounded-full overflow-hidden bg-brand-ice/50 dark:bg-brand-dark-border group-hover:h-2 transition-all duration-150 block">
            <span
              class="block h-full rounded-full transition-colors duration-200"
              [ngClass]="getFillClasses(idx)"
              [style.width.%]="getSegmentWidth(idx)"
            ></span>
          </span>
        </button>
      }
    </div>
  `
})
export class HeroProgressComponent {
  @Input({ required: true }) slidesCount = 0;
  @Input({ required: true }) activeIndex = 0;
  @Input({ required: true }) progress = 0;
  @Input() isPaused = false;
  @Output() selectSlide = new EventEmitter<number>();

  public get indices(): number[] {
    return Array.from({ length: Math.max(0, this.slidesCount) }, (_, i) => i);
  }

  public getFillClasses(index: number): string {
    if (index === this.activeIndex) {
      return 'bg-brand-primary dark:bg-brand-sky';
    }
    if (index < this.activeIndex) {
      return 'bg-brand-petrol dark:bg-brand-sky opacity-65';
    }
    return 'bg-transparent';
  }

  public getSegmentWidth(index: number): number {
    if (index < this.activeIndex) return 100;
    if (index === this.activeIndex) return Math.min(100, Math.max(0, this.progress));
    return 0;
  }

  public onSelect(index: number): void {
    this.selectSlide.emit(index);
  }
}
