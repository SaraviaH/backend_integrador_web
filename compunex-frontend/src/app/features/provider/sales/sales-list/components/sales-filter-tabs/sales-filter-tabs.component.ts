import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuborderStatus } from '../../../../../../core/models/order.model';

export type SaleFilterStatus = 'ALL' | SuborderStatus;

@Component({
  selector: 'app-sales-filter-tabs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <!-- Pestañas de estado (sobre la página actual) -->
        <div class="flex items-center gap-1.5 p-1 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            (click)="selectStatus('ALL')"
            [ngClass]="activeStatus === 'ALL'
              ? 'bg-[#1786B4] dark:bg-[#4FB3DA] text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-[#1786B4] dark:hover:text-[#4FB3DA]'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Todas ({{ totalCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('PENDIENTE_DESPACHO')"
            [ngClass]="activeStatus === 'PENDIENTE_DESPACHO'
              ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-amber-600 dark:hover:text-amber-300'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Pendientes ({{ pendingCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('EN_PREPARACION')"
            [ngClass]="activeStatus === 'EN_PREPARACION'
              ? 'bg-[#1786B4] dark:bg-[#4FB3DA] text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-[#1786B4] dark:hover:text-[#4FB3DA]'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            En Preparación ({{ inPrepCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('DESPACHADO')"
            [ngClass]="activeStatus === 'DESPACHADO'
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-emerald-600 dark:hover:text-emerald-300'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Despachadas ({{ dispatchedCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('CANCELADO')"
            [ngClass]="activeStatus === 'CANCELADO'
              ? 'bg-rose-600 dark:bg-rose-500 text-white dark:text-[#04202E] shadow-sm font-bold'
              : 'text-[#527588] dark:text-[#B8DFEF] hover:text-rose-600 dark:hover:text-rose-300'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Canceladas ({{ cancelledCount }})
          </button>
        </div>

        <!-- Buscador en página actual -->
        <div class="relative w-full lg:w-72">
          <label for="sales-search" class="sr-only">Filtrar ventas en la página actual</label>
          <input
            id="sales-search"
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Filtrar página por orden o cliente..."
            class="w-full pl-9 pr-4 py-2.5 bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] rounded-xl text-xs text-[#04202E] dark:text-[#F2F9FC] placeholder-[#527588] dark:placeholder-[#6EA6C0] focus:outline-none focus:border-[#1786B4] dark:focus:border-[#4FB3DA] transition-all"
          />
          <svg class="w-4 h-4 text-[#527588] dark:text-[#98D5EE] absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  `
})
export class SalesFilterTabsComponent {
  @Input() totalCount = 0;
  @Input() pendingCount = 0;
  @Input() inPrepCount = 0;
  @Input() dispatchedCount = 0;
  @Input() cancelledCount = 0;
  @Input() activeStatus: SaleFilterStatus = 'ALL';

  @Output() statusChange = new EventEmitter<SaleFilterStatus>();
  @Output() searchChange = new EventEmitter<string>();

  public searchQuery = '';

  public selectStatus(status: SaleFilterStatus): void {
    this.activeStatus = status;
    this.statusChange.emit(status);
  }

  public onSearchChange(val: string): void {
    this.searchChange.emit(val);
  }
}
