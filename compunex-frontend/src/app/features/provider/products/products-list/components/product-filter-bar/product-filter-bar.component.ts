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
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Pestañas de estado rápido -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            (click)="selectTab('ALL')"
            [class.bg-white]="activeTab === 'ALL'"
            [class.text-brand-primary]="activeTab === 'ALL'"
            [class.shadow-xs]="activeTab === 'ALL'"
            [class.text-slate-600]="activeTab !== 'ALL'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-brand-primary"
          >
            Todos ({{ totalCount }})
          </button>
          <button
            type="button"
            (click)="selectTab('ACTIVE')"
            [class.bg-white]="activeTab === 'ACTIVE'"
            [class.text-emerald-600]="activeTab === 'ACTIVE'"
            [class.shadow-xs]="activeTab === 'ACTIVE'"
            [class.text-slate-600]="activeTab !== 'ACTIVE'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-emerald-600"
          >
            Activos ({{ activeCount }})
          </button>
          <button
            type="button"
            (click)="selectTab('PAUSED')"
            [class.bg-white]="activeTab === 'PAUSED'"
            [class.text-amber-600]="activeTab === 'PAUSED'"
            [class.shadow-xs]="activeTab === 'PAUSED'"
            [class.text-slate-600]="activeTab !== 'PAUSED'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-amber-600"
          >
            Pausados ({{ pausedCount }})
          </button>
          <button
            type="button"
            (click)="selectTab('LOW_STOCK')"
            [class.bg-white]="activeTab === 'LOW_STOCK'"
            [class.text-rose-600]="activeTab === 'LOW_STOCK'"
            [class.shadow-xs]="activeTab === 'LOW_STOCK'"
            [class.text-slate-600]="activeTab !== 'LOW_STOCK'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-rose-600"
          >
            Stock Crítico ({{ lowStockCount }})
          </button>
        </div>

        <!-- Botón de acción principal: Crear Producto -->
        <a
          routerLink="/panel/products/new"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary-hover transition-colors shadow-xs shrink-0"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Publicar Producto
        </a>
      </div>

      <!-- Buscador y filtro de categoría -->
      <div class="flex flex-col md:flex-row gap-3 pt-2 border-t border-slate-100">
        <div class="relative flex-1">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Buscar por SKU, marca o denominación de hardware..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
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
