import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderApiService } from '../../core/services/order-api.service';
import { OrderDetail, SuborderInvoice } from '../../core/models/order.model';
import { SunatFacturaData, SunatFacturaSheetComponent } from '../../shared/components/sunat-factura-sheet/sunat-factura-sheet.component';

@Component({
  selector: 'app-invoice-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, SunatFacturaSheetComponent],
  template: `
    <div class="invoice-page-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- ========================================================================= -->
      <!-- BARRA DE ACCIONES Y MIGAS (Oculto en Impresión)                          -->
      <!-- ========================================================================= -->
      <div class="no-print space-y-4">
        <!-- Migas de Pan (Breadcrumbs) -->
        <nav class="flex items-center gap-2 text-xs text-slate-400">
          <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
          <span>/</span>
          <a routerLink="/cuenta/mis-compras" class="hover:text-brand-primary transition-colors">Mis Compras</a>
          <span>/</span>
          <span class="text-brand-night font-bold">Comprobante de Pago Electrónico</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Comprobante Válido SUNAT
              </span>
              <span class="text-xs text-slate-400">Régimen Mayorista B2B</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-brand-night tracking-tight font-display mt-1">
              Visor de Factura Electrónica
            </h1>
          </div>

          <div class="flex items-center gap-2.5">
            <a
              routerLink="/cuenta/mis-compras"
              class="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              ← Mis Compras
            </a>
            
            <button
              type="button"
              (click)="printInvoice()"
              class="px-5 py-2.5 rounded-full bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>

        <!-- Selector de Comprobante General o Factura Independiente por Proveedor -->
        @if (order(); as ord) {
          <div class="bg-brand-tint/70 border border-brand-ice/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2 text-brand-night font-semibold">
              <svg class="w-4 h-4 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Selecciona el documento a visualizar / descargar:</span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                (click)="viewMode.set('general')"
                [class.bg-[#04202E]]="viewMode() === 'general'"
                [class.text-white]="viewMode() === 'general'"
                [class.bg-white]="viewMode() !== 'general'"
                [class.text-slate-700]="viewMode() !== 'general'"
                class="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold transition-all shadow-2xs"
              >
                📋 Comprobante General COMPUNEX
              </button>

              @for (sub of ord.subordenes; track sub.subordenId; let idx = $index) {
                <button
                  type="button"
                  (click)="viewMode.set('provider'); selectedSuborderIndex.set(idx)"
                  [class.bg-brand-primary]="viewMode() === 'provider' && selectedSuborderIndex() === idx"
                  [class.text-white]="viewMode() === 'provider' && selectedSuborderIndex() === idx"
                  [class.bg-white]="!(viewMode() === 'provider' && selectedSuborderIndex() === idx)"
                  [class.text-slate-700]="!(viewMode() === 'provider' && selectedSuborderIndex() === idx)"
                  class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-2xs"
                >
                  {{ sub.numeroFacturaSimulada }} ({{ sub.proveedorRazonSocial }})
                </button>
              }
            </div>
          </div>
        }
      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA                                                    -->
      <!-- ========================================================================= -->

      <!-- 1. ESTADO DE CARGA (Skeleton Factura A4) -->
      @if (isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-10 space-y-8 animate-pulse shadow-xs max-w-4xl mx-auto">
          <div class="flex justify-between items-start">
            <div class="space-y-3 w-1/2">
              <div class="h-6 bg-slate-200 rounded w-2/3"></div>
              <div class="h-3 bg-slate-150 rounded w-3/4"></div>
              <div class="h-3 bg-slate-150 rounded w-1/2"></div>
            </div>
            <div class="h-28 bg-slate-200 rounded-2xl w-60"></div>
          </div>
          <div class="h-24 bg-slate-100 rounded-2xl"></div>
          <div class="h-48 bg-slate-100 rounded-2xl"></div>
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError() || !order()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-brand-night">No pudimos cargar la factura</h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            No se encontró el comprobante para la orden indicada o no tienes permisos para visualizarlo.
          </p>
          <div class="pt-2">
            <a routerLink="/cuenta/mis-compras" class="px-6 py-2.5 rounded-full bg-brand-primary text-white text-xs font-semibold">
              Ir a Mis Compras
            </a>
          </div>
        </div>
      }

      <!-- 3. ESTADO CON DATOS: COMPROBANTE GENERAL O FACTURA ELECTRÓNICA SUNAT -->
      @else {
        @if (viewMode() === 'general' && order(); as ord) {
          <div class="invoice-a4-sheet bg-white text-black border border-slate-400 p-6 sm:p-8 max-w-4xl mx-auto text-[11px] leading-snug font-sans shadow-sm space-y-5">
            <!-- Cabecera Comprobante Consolidado COMPUNEX -->
            <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3 border-b-2 border-black">
              <div class="space-y-0.5 uppercase">
                <div class="text-base font-extrabold tracking-tight text-[#04202E]">COMPUNEX B2B MARKETPLACE S.A.C.</div>
                <div class="text-[11px] text-slate-700">PLATAFORMA MAYORISTA DE HARDWARE Y TECNOLOGÍA</div>
                <div class="text-[10px] text-slate-600">AV. GARCILASO DE LA VEGA 1348 · LIMA - PERÚ</div>
              </div>
              <div class="border-2 border-black px-5 py-2.5 text-center w-full sm:w-72 shrink-0">
                <div class="font-extrabold text-xs">COMPROBANTE GENERAL DE COMPRA</div>
                <div class="font-bold text-xs mt-0.5">RUC COMPUNEX: 20609998881</div>
                <div class="font-extrabold text-sm font-mono mt-0.5">{{ ord.codigoOrden }}</div>
              </div>
            </div>

            <!-- Datos del Comprador y Pago -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-b border-black pb-3">
              <div class="grid grid-cols-[130px_1fr] gap-y-1">
                <span class="font-semibold">Fecha de Emisión</span>
                <span>: {{ ord.fechaEmision | date:'dd/MM/yyyy HH:mm' }}</span>
                <span class="font-semibold">Empresa Compradora</span>
                <span class="font-bold uppercase">: {{ ord.razonSocialFacturacion }}</span>
                <span class="font-semibold">RUC Comprador</span>
                <span class="font-mono">: {{ ord.rucFacturacion }}</span>
              </div>
              <div class="grid grid-cols-[130px_1fr] gap-y-1">
                <span class="font-semibold">Dirección Fiscal</span>
                <span class="uppercase">: {{ ord.direccionFiscal }}</span>
                <span class="font-semibold">Medio de Pago</span>
                <span>: {{ ord.metodoPago }}</span>
                <span class="font-semibold">Subórdenes Split</span>
                <span>: {{ ord.subordenes.length }} proveedor(es)</span>
              </div>
            </div>

            <!-- Desglose por Proveedor (Facturas Independientes Vinculadas) -->
            <div class="space-y-2">
              <div class="font-bold uppercase text-xs">Resumen de Dispersión y Facturas Independientes por Proveedor</div>
              <div class="border border-black overflow-x-auto">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="border-b border-black bg-slate-100 font-bold">
                      <th class="py-1.5 px-2">Proveedor Emisor</th>
                      <th class="py-1.5 px-2">RUC Emisor</th>
                      <th class="py-1.5 px-2">Factura SUNAT</th>
                      <th class="py-1.5 px-2 text-right">Subtotal</th>
                      <th class="py-1.5 px-2 text-right">IGV 18%</th>
                      <th class="py-1.5 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    @for (sub of ord.subordenes; track sub.subordenId) {
                      <tr>
                        <td class="py-1.5 px-2 font-semibold uppercase">{{ sub.proveedorRazonSocial }}</td>
                        <td class="py-1.5 px-2 font-mono">{{ sub.proveedorRuc }}</td>
                        <td class="py-1.5 px-2 font-mono font-bold">{{ sub.numeroFacturaSimulada }}</td>
                        <td class="py-1.5 px-2 text-right font-mono">S/ {{ sub.subtotal | number:'1.2-2' }}</td>
                        <td class="py-1.5 px-2 text-right font-mono">S/ {{ sub.igv | number:'1.2-2' }}</td>
                        <td class="py-1.5 px-2 text-right font-mono font-bold">S/ {{ sub.total | number:'1.2-2' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Detalle Consolidado de Ítems -->
            <div class="space-y-2">
              <div class="font-bold uppercase text-xs">Detalle Consolidado de Productos Adquiridos</div>
              <div class="border border-black overflow-x-auto">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="border-b border-black bg-slate-100 font-bold">
                      <th class="py-1.5 px-2">Factura</th>
                      <th class="py-1.5 px-2">Descripción</th>
                      <th class="py-1.5 px-2 text-center">Cant.</th>
                      <th class="py-1.5 px-2 text-right">V. Unitario</th>
                      <th class="py-1.5 px-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    @for (sub of ord.subordenes; track sub.subordenId) {
                      @for (it of sub.items; track it.productoId) {
                        <tr>
                          <td class="py-1.5 px-2 font-mono text-[10px]">{{ sub.numeroFacturaSimulada }}</td>
                          <td class="py-1.5 px-2 uppercase">{{ it.nombre }}</td>
                          <td class="py-1.5 px-2 text-center font-mono">{{ it.cantidad }}</td>
                          <td class="py-1.5 px-2 text-right font-mono">S/ {{ it.precioUnitario | number:'1.2-2' }}</td>
                          <td class="py-1.5 px-2 text-right font-mono font-semibold">S/ {{ it.subtotal | number:'1.2-2' }}</td>
                        </tr>
                      }
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Total Consolidado -->
            <div class="flex justify-end">
              <div class="w-full sm:w-72 border border-black text-[11px]">
                <div class="grid grid-cols-[1fr_110px] border-b border-slate-300 px-2 py-1">
                  <span class="text-right pr-2">Subtotal Consolidado:</span>
                  <span class="text-right font-mono">S/ {{ ord.subtotalGeneral | number:'1.2-2' }}</span>
                </div>
                <div class="grid grid-cols-[1fr_110px] border-b border-black px-2 py-1">
                  <span class="text-right pr-2">IGV Consolidado (18%):</span>
                  <span class="text-right font-mono">S/ {{ ord.igvGeneral | number:'1.2-2' }}</span>
                </div>
                <div class="grid grid-cols-[1fr_110px] px-2 py-1.5 font-extrabold bg-slate-100 text-xs">
                  <span class="text-right pr-2">TOTAL PAGADO:</span>
                  <span class="text-right font-mono">S/ {{ ord.totalGeneral | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <div class="border border-black p-2.5 text-center italic text-[11px]">
              Documento consolidado informativo emitido por COMPUNEX B2B. Cada proveedor emite su propia Factura Electrónica SUNAT independiente.
            </div>
          </div>
        } @else {
          @if (currentSunatFactura(); as factura) {
            <div class="invoice-a4-sheet">
              <app-sunat-factura-sheet [data]="factura" />
            </div>
          }
        }
      }

    </div>
  `,
  styles: [`
    @media print {
      .no-print {
        display: none !important;
      }
      .invoice-page-container {
        padding: 0 !important;
        max-width: 100% !important;
      }
      .invoice-a4-sheet {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      body {
        background: white !important;
        color: black !important;
      }
    }
  `]
})
export class InvoiceViewerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderApi = inject(OrderApiService);

  public readonly order = signal<OrderDetail | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly selectedSuborderIndex = signal<number>(0);
  public readonly viewMode = signal<'provider' | 'general'>('provider');

  public readonly currentSuborder = computed<SuborderInvoice | null>(() => {
    const o = this.order();
    if (!o || o.subordenes.length === 0) return null;
    const idx = Math.min(this.selectedSuborderIndex(), o.subordenes.length - 1);
    return o.subordenes[idx];
  });

  public readonly currentSunatFactura = computed<SunatFacturaData | null>(() => {
    const o = this.order();
    const sub = this.currentSuborder();
    if (!o || !sub) return null;
    return {
      numeroFactura: sub.numeroFacturaSimulada,
      fechaEmision: o.fechaEmision,
      formaPago: o.metodoPago === 'LINEA_CREDITO_B2B' ? 'Crédito 30 días' : 'Contado',
      moneda: (o.moneda || 'PEN').toUpperCase() === 'USD' ? 'DÓLARES AMERICANOS' : 'SOLES',
      observacion: `Orden ${o.codigoOrden} · Suborden #${sub.subordenId}`,
      emisorRazonSocial: sub.proveedorRazonSocial,
      emisorRuc: sub.proveedorRuc,
      emisorDireccion: 'LIMA - PERÚ (DISTRIBUIDOR MAYORISTA B2B)',
      receptorRazonSocial: o.razonSocialFacturacion,
      receptorRuc: o.rucFacturacion,
      receptorDireccion: o.direccionFiscal,
      subtotal: sub.subtotal,
      igv: sub.igv,
      total: sub.total,
      items: sub.items.map(it => ({
        codigo: `PROD-${it.productoId}`,
        descripcion: it.nombre,
        unidad: 'UNIDAD',
        cantidad: it.cantidad,
        valorUnitario: it.precioUnitario,
        subtotal: it.subtotal,
      })),
    };
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(qp => {
      const modo = qp.get('modo');
      const subParam = qp.get('sub');
      if (modo === 'general') {
        this.viewMode.set('general');
      } else if (subParam !== null && !Number.isNaN(Number(subParam))) {
        this.viewMode.set('provider');
        this.selectedSuborderIndex.set(Math.max(0, Number(subParam)));
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const ordenId = idParam ? Number(idParam) : 0;
      if (ordenId > 0) {
        this.loadInvoice(ordenId);
      } else {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public loadInvoice(ordenId: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.orderApi.getOrderDetail(ordenId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.order.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public printInvoice(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  public getMontoEnLetras(total: number): string {
    const enteros = Math.floor(total);
    const centavos = Math.round((total - enteros) * 100);
    const centavosStr = centavos.toString().padStart(2, '0');
    const monedaTexto = (this.order()?.moneda || 'PEN').toUpperCase() === 'USD' ? 'DÓLARES AMERICANOS' : 'SOLES';
    return `${enteros.toLocaleString('es-PE')} Y ${centavosStr}/100 ${monedaTexto}`;
  }
}
