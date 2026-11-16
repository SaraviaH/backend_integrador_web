import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderApiService } from '../../../core/services/order-api.service';
import { OrderDetail } from '../../../core/models/order.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/cuenta/mis-compras" class="hover:text-brand-primary transition-colors">Mis Compras</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Detalle y Trazabilidad</span>
      </nav>

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="space-y-6 animate-pulse">
          <div class="h-28 bg-slate-200 rounded-3xl w-full"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="h-44 bg-slate-100 rounded-3xl"></div>
            <div class="h-44 bg-slate-100 rounded-3xl"></div>
          </div>
          <div class="h-64 bg-slate-100 rounded-3xl"></div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError() || !order()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-xs">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-brand-night">No pudimos cargar la orden</h2>
          <p class="text-xs text-slate-500">
            No encontramos los detalles de esta orden de compra o no tienes permisos para verla.
          </p>
          <div class="pt-2">
            <a routerLink="/cuenta/mis-compras" class="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold inline-block">
              Volver a Mis Compras
            </a>
          </div>
        </div>
      }

      <!-- 3. ESTADO CON DATOS -->
      @else {
        @if (order(); as ord) {

          <!-- Encabezado de la Orden -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div>
              <div class="flex flex-wrap items-center gap-2.5 mb-2">
                <app-status-badge [status]="ord.estado" />
                <span class="text-xs text-slate-400">Emisión: {{ ord.fechaEmision | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display">
                Orden de Compra {{ ord.codigoOrden }}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                Desglose de subórdenes, estados de despacho independiente y comprobantes tributarios.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <a
                [routerLink]="['/pedidos', ord.ordenId, 'comprobante']"
                class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Ver Comprobante Electrónico</span>
              </a>
            </div>
          </div>

          <!-- Tarjetas de Resumen -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-2.5 text-xs text-slate-600 shadow-xs">
              <h3 class="text-xs font-bold uppercase tracking-wider text-brand-night pb-2 border-b border-slate-100">
                Datos Fiscales de Facturación
              </h3>
              <div>Empresa: <strong class="text-slate-800">{{ ord.razonSocialFacturacion }}</strong></div>
              <div>RUC: <strong class="text-slate-800 font-mono">{{ ord.rucFacturacion }}</strong></div>
              <div>Dirección: {{ ord.direccionFiscal }}</div>
              <div>Condición de Pago: <span class="font-semibold text-slate-700">{{ ord.metodoPago }}</span></div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-2.5 text-xs text-slate-600 shadow-xs">
              <h3 class="text-xs font-bold uppercase tracking-wider text-brand-night pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Resumen Financiero</span>
                <span class="text-slate-400 font-normal">Soles (PEN)</span>
              </h3>
              <div class="flex justify-between">
                <span>Base Imponible Consolidada:</span>
                <span class="font-mono font-bold text-slate-800">S/ {{ ord.subtotalGeneral | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span>IGV Total (18% Ley):</span>
                <span class="font-mono font-bold text-slate-800">S/ {{ ord.igvGeneral | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-sm font-extrabold text-brand-night pt-2 border-t border-slate-100">
                <span>Total Orden:</span>
                <span class="font-mono text-brand-primary text-base">S/ {{ ord.totalGeneral | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <!-- Trazabilidad por Cada Suborden -->
          <div class="space-y-6">
            <h2 class="text-base font-bold text-brand-night">
              Trazabilidad y Despacho por Suborden ({{ ord.subordenes.length }} {{ ord.subordenes.length === 1 ? 'Proveedor' : 'Proveedores' }})
            </h2>

            <div class="space-y-6">
              @for (sub of ord.subordenes; track sub.subordenId; let i = $index) {
                <div class="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-6 shadow-xs">

                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suborden {{ i + 1 }}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          Comprobante: {{ sub.numeroFacturaSimulada }}
                        </span>
                        <app-status-badge [status]="sub.estado" />
                      </div>
                      <h3 class="text-base font-bold text-brand-night mt-1.5">{{ sub.proveedorRazonSocial }}</h3>
                      <p class="text-xs text-slate-400">RUC Proveedor: <span class="font-mono">{{ sub.proveedorRuc }}</span></p>
                    </div>

                    <div class="text-left sm:text-right">
                      <span class="text-xs text-slate-400 block">Total Suborden (con IGV)</span>
                      <span class="text-base font-black font-mono text-brand-primary">S/ {{ sub.total | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <!-- LÍNEA DE TIEMPO DEL DESPACHO B2B -->
                  <div class="p-4 sm:p-6 rounded-2xl border"
                    [ngClass]="sub.estado === 'CANCELADO' ? 'bg-rose-50/60 border-rose-200/80' : 'bg-slate-50/80 border-slate-200/60'"
                  >
                    <span class="text-[11px] font-bold uppercase tracking-wider block mb-4"
                      [ngClass]="sub.estado === 'CANCELADO' ? 'text-rose-700' : 'text-slate-400'"
                    >
                      Trazabilidad Logística de Almacén
                    </span>

                    @if (sub.estado === 'CANCELADO') {
                      <div class="flex items-center gap-3 p-4 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs">
                        <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">✕</div>
                        <div>
                          <p class="font-bold text-rose-900">Suborden Cancelada</p>
                          <p class="text-[11px] text-rose-700 mt-0.5">
                            Esta suborden fue cancelada por el proveedor y no continuará con el despacho logístico.
                          </p>
                        </div>
                      </div>
                    } @else {
                      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                        <!-- Hito 1: Confirmada -->
                        <div class="flex items-start gap-3">
                          <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            ✓
                          </div>
                          <div>
                            <h4 class="text-xs font-bold text-brand-night">1. Confirmada</h4>
                            <p class="text-[10px] text-slate-500 mt-0.5">Orden y comprobante registrados</p>
                          </div>
                        </div>

                        <!-- Hito 2: En Preparación -->
                        <div class="flex items-start gap-3">
                          <div
                            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                            [ngClass]="sub.estado === 'EN_PREPARACION' || sub.estado === 'DESPACHADO' || sub.estado === 'ENTREGADO'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-brand-primary text-white'"
                          >
                            @if (sub.estado === 'EN_PREPARACION' || sub.estado === 'DESPACHADO' || sub.estado === 'ENTREGADO') { ✓ } @else { 2 }
                          </div>
                          <div>
                            <h4 class="text-xs font-bold text-brand-night">2. En Preparación</h4>
                            <p class="text-[10px] text-slate-500 mt-0.5">Picking & embalaje de lote</p>
                          </div>
                        </div>

                        <!-- Hito 3: Despachada -->
                        <div class="flex items-start gap-3">
                          <div
                            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                            [ngClass]="sub.estado === 'DESPACHADO' || sub.estado === 'ENTREGADO'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'"
                          >
                            @if (sub.estado === 'DESPACHADO' || sub.estado === 'ENTREGADO') { ✓ } @else { 3 }
                          </div>
                          <div>
                            <h4 class="text-xs font-bold text-brand-night">3. En Ruta</h4>
                            <p class="text-[10px] text-slate-500 mt-0.5">
                              {{ sub.estado === 'DESPACHADO' || sub.estado === 'ENTREGADO' ? 'Despacho en tránsito' : 'Pendiente de salida' }}
                            </p>
                          </div>
                        </div>

                        <!-- Hito 4: Entregada -->
                        <div class="flex items-start gap-3">
                          <div
                            class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                            [ngClass]="sub.estado === 'ENTREGADO' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'"
                          >
                            @if (sub.estado === 'ENTREGADO') { ✓ } @else { 4 }
                          </div>
                          <div>
                            <h4 class="text-xs font-bold text-brand-night">4. Entregada</h4>
                            <p class="text-[10px] text-slate-500 mt-0.5">Conformidad en destino</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Lista de Artículos -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Productos incluidos en este lote:
                    </span>

                    <div class="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      @for (item of sub.items; track item.productoId) {
                        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 sm:gap-4 hover:bg-slate-50/50">
                          <div class="flex items-center gap-3 min-w-0">
                            <span class="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 shrink-0">
                              ID: {{ item.productoId }}
                            </span>
                            <span class="font-bold text-brand-night truncate">{{ item.nombre }}</span>
                          </div>
                          <div class="flex items-center gap-4 shrink-0 font-mono">
                            <span class="text-slate-500 font-semibold">{{ item.cantidad }} un. × S/ {{ item.precioUnitario | number:'1.2-2' }}</span>
                            <span class="font-bold text-brand-night">S/ {{ item.subtotal | number:'1.2-2' }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>

        }
      }

    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderApi = inject(OrderApiService);

  public readonly order = signal<OrderDetail | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const ordenId = idParam ? Number(idParam) : 0;
      if (ordenId > 0) {
        this.loadOrderDetail(ordenId);
      } else {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public loadOrderDetail(ordenId: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.orderApi.getOrderDetail(ordenId).subscribe({
      next: (detail) => {
        this.isLoading.set(false);
        this.order.set(detail);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }
}
