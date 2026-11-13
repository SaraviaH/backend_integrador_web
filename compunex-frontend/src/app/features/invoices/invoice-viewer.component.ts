import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderApiService } from '../../core/services/order-api.service';
import { OrderDetail, SuborderInvoice } from '../../core/models/order.model';

@Component({
  selector: 'app-invoice-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="invoice-page-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- ========================================================================= -->
      <!-- BARRA DE ACCIONES Y MIGAS (Oculto en Impresión)                          -->
      <!-- ========================================================================= -->
      <div class="no-print space-y-4">
        <!-- Migas de Pan (Breadcrumbs) -->
        <nav class="flex items-center gap-2 text-xs text-slate-400">
          <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
          <span>/</span>
          <a routerLink="/cuenta/mis-compras" class="hover:text-[#2456C6] transition-colors">Mis Compras</a>
          <span>/</span>
          <span class="text-[#142238] font-bold">Comprobante de Pago Electrónico</span>
        </nav>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Comprobante Válido SUNAT
              </span>
              <span class="text-xs text-slate-400">Régimen Mayorista B2B</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-[#142238] tracking-tight font-display mt-1">
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
              class="px-5 py-2.5 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>

        <!-- Selector de Suborden / Proveedor (en caso de Split Order) -->
        @if (order() && order()!.subordenes.length > 1) {
          <div class="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2 text-blue-900 font-semibold">
              <svg class="w-4 h-4 text-[#1E50C0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Esta orden contiene facturas de múltiples proveedores:</span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              @for (sub of order()!.subordenes; track sub.subordenId; let idx = $index) {
                <button
                  type="button"
                  (click)="selectedSuborderIndex.set(idx)"
                  [class.bg-[#1E50C0]]="selectedSuborderIndex() === idx"
                  [class.text-white]="selectedSuborderIndex() === idx"
                  [class.bg-white]="selectedSuborderIndex() !== idx"
                  [class.text-slate-700]="selectedSuborderIndex() !== idx"
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
      <!-- 4 ESTADOS DE PANTALLA (P-13)                                             -->
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
          <h2 class="text-base font-bold text-[#142238]">No pudimos cargar la factura</h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            No se encontró el comprobante para la orden indicada o no tienes permisos para visualizarlo.
          </p>
          <div class="pt-2">
            <a routerLink="/cuenta/mis-compras" class="px-6 py-2.5 rounded-full bg-[#1E50C0] text-white text-xs font-semibold">
              Ir a Mis Compras
            </a>
          </div>
        </div>
      }

      <!-- 3. ESTADO CON DATOS: FACTURA ELECTRÓNICA FORMAL SUNAT (HOJA A4) -->
      @else {
        @if (currentSuborder(); as sub) {
        
        <div class="invoice-a4-sheet bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-6 text-[#142238]">
          
          <!-- Encabezado SUNAT: Datos Emisor + Recuadro Fiscal -->
          <div class="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6">
            
            <!-- Datos del Emisor (Proveedor Mayorista) -->
            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-[#142238] text-white font-black text-sm flex items-center justify-center font-display">
                  C
                </span>
                <span class="font-extrabold text-sm tracking-tight font-display text-slate-700">COMPUNEX B2B · RED MAYORISTA</span>
              </div>
              <h2 class="text-base sm:text-lg font-black uppercase text-[#142238] tracking-tight">
                {{ sub.proveedorRazonSocial }}
              </h2>
              <p class="text-xs text-slate-600">Av. Central Industrial 1450, Almacén Central B2B</p>
              <p class="text-xs text-slate-600">Lima - Perú · Teléfono: (01) 680-9900</p>
              <p class="text-xs text-slate-600">Email: facturacion&#64;{{ getProviderSlug(sub.proveedorRazonSocial) }}.pe</p>
            </div>

            <!-- Recuadro Oficial SUNAT (RUC / FACTURA ELECTRÓNICA / NÚMERO) -->
            <div class="border-2 border-slate-800 rounded-xl p-4 sm:p-5 text-center w-full sm:w-64 shrink-0 bg-slate-50/50">
              <div class="text-xs sm:text-sm font-extrabold tracking-wider font-mono">
                R.U.C. N° {{ sub.proveedorRuc }}
              </div>
              <div class="text-sm sm:text-base font-black bg-[#142238] text-white py-1.5 my-2 uppercase tracking-wide rounded-sm font-display">
                Factura Electrónica
              </div>
              <div class="text-base sm:text-lg font-black font-mono text-[#1E50C0]">
                {{ sub.numeroFacturaSimulada }}
              </div>
            </div>

          </div>

          <!-- Datos del Cliente / Adquiriente -->
          <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span class="text-slate-400 block text-[11px]">Señor(es) / Razón Social:</span>
              <strong class="text-slate-900 text-xs sm:text-sm">{{ order()!.razonSocialFacturacion }}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">R.U.C. del Adquiriente:</span>
              <strong class="text-slate-900 font-mono text-xs sm:text-sm">{{ order()!.rucFacturacion }}</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Dirección Fiscal:</span>
              <span class="text-slate-700">{{ order()!.direccionFiscal }}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="text-slate-400 block text-[11px]">Fecha de Emisión:</span>
                <span class="text-slate-700 font-semibold">{{ order()!.fechaEmision | date:'dd/MM/yyyy' }}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Moneda:</span>
                <span class="text-slate-700 font-bold">SOLES (PEN)</span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Forma de Pago:</span>
              <span class="text-slate-700 font-semibold">{{ order()!.metodoPago }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Orden Relacionada:</span>
              <span class="font-mono text-slate-700">{{ order()!.codigoOrden }}</span>
            </div>
          </div>

          <!-- Tabla de Bienes / Ítems Facturados -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="py-2.5 px-3 text-center w-12">Ítem</th>
                  <th class="py-2.5 px-3">Código / SKU</th>
                  <th class="py-2.5 px-3">Descripción Detallada</th>
                  <th class="py-2.5 px-3 text-center">Unidad</th>
                  <th class="py-2.5 px-3 text-center">Cant.</th>
                  <th class="py-2.5 px-3 text-right">Valor Unit.</th>
                  <th class="py-2.5 px-3 text-right">Importe Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of sub.items; track item.productoId; let i = $index) {
                  <tr class="hover:bg-slate-50/60">
                    <td class="py-3 px-3 text-center text-slate-400 font-mono">{{ i + 1 }}</td>
                    <td class="py-3 px-3 font-mono font-semibold text-slate-700 text-[11px]">
                      PROD-{{ item.productoId }}
                    </td>
                    <td class="py-3 px-3 font-medium text-slate-800">
                      {{ item.nombre }}
                    </td>
                    <td class="py-3 px-3 text-center text-slate-500">NIU</td>
                    <td class="py-3 px-3 text-center font-bold text-slate-900">{{ item.cantidad }}</td>
                    <td class="py-3 px-3 text-right font-mono text-slate-700">
                      S/ {{ item.precioUnitario | number:'1.2-2' }}
                    </td>
                    <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      S/ {{ item.subtotal | number:'1.2-2' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Cuadro de Totales y Liquidación Tributaria SUNAT -->
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            
            <!-- Bloque Izquierdo: Leyenda en Letras + Hash + QR -->
            <div class="sm:col-span-7 space-y-3 text-xs">
              
              <!-- Monto en Letras -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">Importe en Letras:</span>
                <span class="font-bold text-slate-800 uppercase text-[11px]">
                  SON: {{ getMontoEnLetras(sub.total) }}
                </span>
              </div>

              <!-- Código QR y Firma Digital SUNAT -->
              <div class="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-200 text-[10px] text-slate-500">
                <!-- Representación QR Simulado -->
                <div class="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                  <svg class="w-14 h-14 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v4h-4v-4zm-4 4h4v4h-4v-4zm4 0h4v4h-4v-4z" />
                  </svg>
                </div>

                <div class="space-y-1 leading-tight">
                  <div class="font-bold text-slate-700">Representación Impresa de la Factura Electrónica</div>
                  <div>Autorizado por Resolución de Superintendencia SUNAT N° 034-005-0005315</div>
                  <div class="font-mono text-[9px] text-slate-400 truncate max-w-xs">
                    Hash: 7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c
                  </div>
                </div>
              </div>

            </div>

            <!-- Bloque Derecho: Desglose Tributario Formal -->
            <div class="sm:col-span-5 space-y-2 text-xs">
              <div class="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                <div class="flex justify-between py-2 px-3 bg-slate-50 text-slate-600">
                  <span>Op. Gravadas (Base Imponible):</span>
                  <span class="font-mono font-bold text-slate-800">S/ {{ sub.subtotal | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between py-2 px-3 bg-slate-50 text-slate-600">
                  <span>Op. Inafectas / Exoneradas:</span>
                  <span class="font-mono text-slate-600">S/ 0.00</span>
                </div>
                <div class="flex justify-between py-2 px-3 bg-slate-50 text-slate-600">
                  <span>I.G.V. (18.00%):</span>
                  <span class="font-mono font-bold text-slate-800">S/ {{ sub.igv | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between py-3 px-3 bg-slate-100 text-sm font-black text-[#142238]">
                  <span>IMPORTE TOTAL:</span>
                  <span class="font-mono text-[#1E50C0] text-base">S/ {{ sub.total | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

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

  public readonly currentSuborder = computed<SuborderInvoice | null>(() => {
    const o = this.order();
    if (!o || o.subordenes.length === 0) return null;
    const idx = Math.min(this.selectedSuborderIndex(), o.subordenes.length - 1);
    return o.subordenes[idx];
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const ordenId = idParam ? Number(idParam) : 10001;
      this.loadInvoice(ordenId);
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

  public getProviderSlug(razonSocial: string): string {
    return razonSocial.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  public getMontoEnLetras(total: number): string {
    const enteros = Math.floor(total);
    const centavos = Math.round((total - enteros) * 100);
    const centavosStr = centavos.toString().padStart(2, '0');
    return `${enteros.toLocaleString('es-PE')} Y ${centavosStr}/100 SOLES`;
  }
}
