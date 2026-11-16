import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderMetrics } from '../../../../core/models/provider.model';

@Component({
  selector: 'app-provider-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      <!-- KPI 1: Facturación Acumulada -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Facturación Activa</span>
          <div class="w-10 h-10 rounded-2xl bg-brand-tint text-brand-primary flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-brand-night font-mono">
            S/ {{ (metrics?.ventasMesActual || 0) | number:'1.2-2' }}
          </div>
          <span class="text-[11px] text-slate-500 mt-1 block">
            Subórdenes no canceladas (inc. IGV)
          </span>
        </div>
      </div>

      <!-- KPI 2: Pedidos Pendientes de Despacho -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendientes Despacho</span>
          <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-brand-night font-mono">
            {{ metrics?.pedidosPendientes || 0 }}
          </div>
          <span class="text-[11px] font-semibold text-amber-700 flex items-center gap-1 mt-1">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pendientes o en preparación
          </span>
        </div>
      </div>

      <!-- KPI 3: Productos Publicados -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Productos Registrados</span>
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-brand-night font-mono">
            {{ metrics?.productosPublicados || 0 }}
          </div>
          <span class="text-[11px] text-slate-500 mt-1 block">
            En catálogo mayorista
          </span>
        </div>
      </div>

      <!-- KPI 4: Valorización Referencial -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Referencial</span>
          <div class="w-10 h-10 rounded-2xl bg-slate-100 text-brand-night flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-brand-night font-mono">
            S/ {{ (metrics?.valorInventario || 0) | number:'1.2-2' }}
          </div>
          <span class="text-[11px] text-slate-500 mt-1 block">
            Calculado sobre stock referencial activo
          </span>
        </div>
      </div>

    </div>
  `
})
export class ProviderKpiCardsComponent {
  @Input() metrics: ProviderMetrics | null = null;
}
