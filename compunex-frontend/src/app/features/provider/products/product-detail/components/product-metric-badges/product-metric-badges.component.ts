import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetail } from '../../../../../../core/models/catalog.model';
import { CurrencySymbolPipe } from '../../../../../../shared/pipes/currency-symbol.pipe';

@Component({
  selector: 'app-product-metric-badges',
  standalone: true,
  imports: [CommonModule, CurrencySymbolPipe],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Stock Referencial -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stock Referencial</p>
        @if (product.stockDisponible == null) {
          <p class="text-xl font-black text-slate-900 mt-1">No especificado</p>
          <div class="mt-2 flex items-center gap-1.5 text-[11px]">
            <span class="w-2 h-2 rounded-full bg-slate-400"></span>
            <span class="text-slate-600 font-semibold">Sin dato en ficha</span>
          </div>
        } @else {
          <p class="text-xl font-black text-slate-900 mt-1">
            {{ product.stockDisponible }} <span class="text-xs font-semibold text-slate-500">unidades</span>
          </p>
          <div class="mt-2 flex items-center gap-1.5 text-[11px]">
            @if (product.stockDisponible > 5) {
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="text-emerald-700 font-semibold">Nivel Óptimo</span>
            } @else if (product.stockDisponible > 0) {
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span class="text-amber-700 font-semibold">Stock Crítico</span>
            } @else {
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
              <span class="text-rose-700 font-semibold">Agotado</span>
            }
          </div>
        }
      </div>

      <!-- Precio Base Unitario -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Precio Unitario Base</p>
        <p class="text-xl font-black text-brand-primary mt-1">
          {{ product.moneda | currencySymbol }} {{ product.precioUnitario | number:'1.2-2' }}
        </p>
        <p class="mt-2 text-[11px] text-slate-500">
          Con IGV (18%): {{ product.moneda | currencySymbol }} {{ (product.precioUnitario * 1.18) | number:'1.2-2' }}
        </p>
      </div>

      <!-- Total de caja -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total de Caja</p>
        <p class="text-xl font-black text-emerald-600 mt-1">
          {{ product.moneda | currencySymbol }} {{ (product.precioTotalCaja || product.precioUnitario) | number:'1.2-2' }}
        </p>
        <p class="mt-2 text-[11px] text-emerald-700 font-medium">
          {{ product.unidadesPorPaqueteTexto || '1 unidad' }} por paquete
        </p>
        @if (product.pedidoMinimoTexto) {
          <p class="mt-0.5 text-[10px] text-slate-500">Pedido mínimo: {{ product.pedidoMinimoTexto }}</p>
        }
      </div>

      <!-- Garantía B2B -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Garantía Corporativa</p>
        <p class="text-xl font-black text-slate-900 mt-1">
          {{ product.garantiaMeses || 12 }} <span class="text-xs font-semibold text-slate-500">meses</span>
        </p>
        <p class="mt-2 text-[11px] text-slate-500 truncate">
          Condición: {{ product.condicion }}
        </p>
      </div>
    </div>
  `
})
export class ProductMetricBadgesComponent {
  @Input({ required: true }) product!: ProductDetail;
}
