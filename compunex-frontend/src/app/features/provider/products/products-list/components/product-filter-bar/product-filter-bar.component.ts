import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export type ProductFilterTab = 'ALL' | 'ACTIVE' | 'PAUSED' | 'LOW_STOCK';

@Component({
  selector: 'app-product-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Pestañas de estado rápido -->
        <div class="flex items-center gap-1.5 p-1 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            (click)="selectTab('ALL')"
            [ngClass]="activeTab === 'ALL'
              ? 'bg-[#1786B4] dark:bg-[#4FB3DA] text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-[#1786B4] dark:hover:text-[#4FB3DA]'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Todos ({{ totalCount }})
          </button>
          <button
            type="button"
            (click)="selectTab('ACTIVE')"
            [ngClass]="activeTab === 'ACTIVE'
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-emerald-600 dark:hover:text-emerald-300'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Activos ({{ activeCount }})
          </button>
          <button
            type="button"
            (click)="selectTab('PAUSED')"
            [ngClass]="activeTab === 'PAUSED'
              ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-amber-600 dark:hover:text-amber-300'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Pausados ({{ pausedCount }})
          </button>
          <button
            type="button"
            (click)="selectTab('LOW_STOCK')"
            [ngClass]="activeTab === 'LOW_STOCK'
              ? 'bg-rose-600 dark:bg-rose-500 text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-rose-600 dark:hover:text-rose-300'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Stock Crítico ({{ lowStockCount }})
          </button>
        </div>

        <!-- Botón de acción principal: Crear Producto -->
        <a
          routerLink="/panel/products/new"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1786B4] hover:bg-[#0F5E83] text-white rounded-xl text-xs font-bold transition-colors shadow-sm shrink-0"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Publicar Producto
        </a>
      </div>

      <!-- Buscador contra servidor -->
      <div class="flex flex-col md:flex-row md:items-center gap-3 pt-3 border-t border-[#E1F2FA] dark:border-[#1D4960]">
        <div class="relative flex-1">
          <label for="provider-product-search" class="sr-only">Buscar en mi catálogo</label>
          <input
            id="provider-product-search"
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Buscar en todo tu catálogo por título o descripción..."
            class="w-full pl-9 pr-4 py-2.5 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl text-xs text-[#04202E] dark:text-[#F2F9FC] placeholder-[#527588] dark:placeholder-[#6EA6C0] focus:outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-all"
          />
          <svg class="w-4 h-4 text-[#527588] dark:text-[#98D5EE] absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span class="text-[11px] text-[#527588] dark:text-[#98D5EE] shrink-0">
          Las pestañas filtran la página visible; el buscador consulta el servidor.
        </span>
      </div>
    </div>
  `
})
export class ProductFilterBarComponent {
  @Input() totalCount = 0;
  @Input() activeCount = 0;
  @Input() pausedCount = 0;
  @Input() lowStockCount = 0;
  @Input() activeTab: ProductFilterTab = 'ALL';

  @Output() tabChange = new EventEmitter<ProductFilterTab>();
  @Output() searchChange = new EventEmitter<string>();

  public searchQuery = '';

  public selectTab(tab: ProductFilterTab): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }

  public onSearchChange(query: string): void {
    this.searchChange.emit(query);
  }
}
