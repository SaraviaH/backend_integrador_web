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
    <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <!-- Pestañas de estado -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            (click)="selectStatus('ALL')"
            [class.bg-white]="activeStatus === 'ALL'"
            [class.text-brand-primary]="activeStatus === 'ALL'"
            [class.shadow-xs]="activeStatus === 'ALL'"
            [class.text-slate-600]="activeStatus !== 'ALL'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-brand-primary"
          >
            Todas ({{ totalCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('PENDIENTE_DESPACHO')"
            [class.bg-white]="activeStatus === 'PENDIENTE_DESPACHO'"
            [class.text-amber-600]="activeStatus === 'PENDIENTE_DESPACHO'"
            [class.shadow-xs]="activeStatus === 'PENDIENTE_DESPACHO'"
            [class.text-slate-600]="activeStatus !== 'PENDIENTE_DESPACHO'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-amber-600"
          >
            Pendientes ({{ pendingCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('EN_PREPARACION')"
            [class.bg-white]="activeStatus === 'EN_PREPARACION'"
            [class.text-indigo-600]="activeStatus === 'EN_PREPARACION'"
            [class.shadow-xs]="activeStatus === 'EN_PREPARACION'"
            [class.text-slate-600]="activeStatus !== 'EN_PREPARACION'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-indigo-600"
          >
            En Preparación ({{ inPrepCount }})
          </button>

          <button
            type="button"
            (click)="selectStatus('DESPACHADO')"
            [class.bg-white]="activeStatus === 'DESPACHADO'"
            [class.text-emerald-600]="activeStatus === 'DESPACHADO'"
            [class.shadow-xs]="activeStatus === 'DESPACHADO'"
            [class.text-slate-600]="activeStatus !== 'DESPACHADO'"
            class="px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer hover:text-emerald-600"
          >
            Despachadas ({{ dispatchedCount }})
          </button>
        </div>

        <!-- Buscador por Orden o Razón Social Cliente -->
        <div class="relative w-full lg:w-72">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Buscar por orden o cliente..."
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
export class SalesFilterTabsComponent {
  @Input() totalCount = 0;
  @Input() pendingCount = 0;
  @Input() inPrepCount = 0;
  @Input() dispatchedCount = 0;
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
