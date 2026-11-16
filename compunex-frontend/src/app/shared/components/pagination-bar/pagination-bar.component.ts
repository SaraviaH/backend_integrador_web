import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages() > 1) {
      <nav
        aria-label="Paginación de resultados"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC] dark:bg-[#0A2535] text-xs"
      >
        <p class="text-[#527588] dark:text-[#B8DFEF]">
          Mostrando <span class="font-bold text-[#04202E] dark:text-[#F2F9FC]">{{ startItem() }}–{{ endItem() }}</span> de
          <span class="font-bold text-[#04202E] dark:text-[#F2F9FC]">{{ totalItems }}</span> registros
        </p>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage <= 1"
            class="px-3 py-1.5 rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0F3043] text-[#0A3C55] dark:text-[#E1F2FA] font-semibold hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Anterior
          </button>

          @for (page of pages(); track page) {
            <button
              type="button"
              (click)="goToPage(page)"
              [attr.aria-current]="page === currentPage ? 'page' : null"
              class="min-w-8 h-8 px-2 rounded-lg font-bold transition-colors cursor-pointer"
              [ngClass]="page === currentPage
                ? 'bg-[#1786B4] dark:bg-[#4FB3DA] text-white dark:text-[#04202E] shadow-sm'
                : 'border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0F3043] text-[#0A3C55] dark:text-[#E1F2FA] hover:bg-[#E1F2FA] dark:hover:bg-[#153F58]'"
            >
              {{ page }}
            </button>
          }

          <button
            type="button"
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage >= totalPages()"
            class="px-3 py-1.5 rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0F3043] text-[#0A3C55] dark:text-[#E1F2FA] font-semibold hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </nav>
    }
  `
})
export class PaginationBarComponent {
  private readonly _totalItems = signal<number>(0);
  private readonly _pageSize = signal<number>(8);
  private readonly _currentPage = signal<number>(1);

  @Input() set totalItems(value: number) {
    this._totalItems.set(Math.max(0, value || 0));
  }
  get totalItems(): number {
    return this._totalItems();
  }

  @Input() set pageSize(value: number) {
    this._pageSize.set(Math.max(1, value || 8));
  }
  get pageSize(): number {
    return this._pageSize();
  }

  @Input() set currentPage(value: number) {
    this._currentPage.set(Math.max(1, value || 1));
  }
  get currentPage(): number {
    return this._currentPage();
  }

  @Output() pageChange = new EventEmitter<number>();

  public readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this._totalItems() / this._pageSize()))
  );

  public readonly startItem = computed(() => {
    if (this._totalItems() === 0) return 0;
    return (this._currentPage() - 1) * this._pageSize() + 1;
  });

  public readonly endItem = computed(() =>
    Math.min(this._totalItems(), this._currentPage() * this._pageSize())
  );

  public readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, idx) => idx + 1);
  });

  public goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages());
    if (target !== this._currentPage()) {
      this.pageChange.emit(target);
    }
  }
}
