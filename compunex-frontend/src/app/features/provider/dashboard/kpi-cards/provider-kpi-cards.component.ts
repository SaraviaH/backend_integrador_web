import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderMetrics } from '../../../../core/models/provider.model';

@Component({
  selector: 'app-provider-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <!-- KPI 1: Ventas del Mes -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ventas del Mes</span>
          <div class="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E50C0] flex items-center justify-center font-bold">
            💰
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-[#142238] font-mono">
            S/ {{ (metrics?.ventasMesActual || 0) | number:'1.2-2' }}
          </div>
          <span class="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <span>↑ 14.8%</span> vs mes anterior
          </span>
        </div>
      </div>

      <!-- KPI 2: Pedidos Pendientes de Despacho -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendientes Despacho</span>
          <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            📦
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-[#142238] font-mono">
            {{ metrics?.pedidosPendientes || 0 }}
          </div>
          <span class="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mt-1">
            <span>●</span> Requieren preparación
          </span>
        </div>
      </div>

      <!-- KPI 3: Productos Publicados en Catálogo -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Productos Activos</span>
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            🏷️
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-[#142238] font-mono">
            {{ metrics?.productosPublicados || 0 }}
          </div>
          <span class="text-[11px] text-slate-500 mt-1 block">
            En catálogo mayorista
          </span>
        </div>
      </div>

      <!-- KPI 4: Valorización del Inventario -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor de Inventario</span>
          <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            🏬
          </div>
        </div>
        <div class="mt-4">
          <div class="text-2xl font-black text-[#142238] font-mono">
            S/ {{ (metrics?.valorInventario || 0) | number:'1.2-2' }}
          </div>
          <span class="text-[11px] text-slate-500 mt-1 block">
            Stock total en almacén
          </span>
        </div>
      </div>

    </div>
  `
})
export class ProviderKpiCardsComponent {
  @Input() metrics: ProviderMetrics | null = null;
}
