import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { AuthStateService } from '../../../../core/state/auth-state.service';
import { ToastStateService } from '../../../../core/state/toast-state.service';
import { ProviderSaleItem } from '../../../../core/models/provider.model';
import { SuborderStatus } from '../../../../core/models/order.model';
import { DispatchStepperComponent } from './components/dispatch-stepper/dispatch-stepper.component';
import { SaleClientCardComponent } from './components/sale-client-card/sale-client-card.component';
import { SunatFacturaData, SunatFacturaSheetComponent } from '../../../../shared/components/sunat-factura-sheet/sunat-factura-sheet.component';
import { SunatGuiaRemisionModalComponent } from '../../../../shared/components/sunat-guia-remision-modal/sunat-guia-remision-modal.component';

@Component({
  selector: 'app-provider-sale-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DispatchStepperComponent,
    SaleClientCardComponent,
    SunatFacturaSheetComponent,
    SunatGuiaRemisionModalComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Encabezado de la Pantalla P-25 -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/panel/dashboard" class="hover:text-brand-primary transition-colors">Panel</a>
            <span>/</span>
            <a routerLink="/panel/sales" class="hover:text-brand-primary transition-colors">Ventas</a>
            <span>/</span>
            <span class="text-slate-800 font-medium">Detalle de Suborden</span>
          </nav>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">
              Atención de Despacho
            </h1>
            @if (sale(); as s) {
              <span class="font-mono text-xs font-bold px-2.5 py-1 bg-brand-primary/10 text-brand-primary rounded-lg">
                SUB-{{ s.subordenId }}
              </span>
            }
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 self-start md:self-auto">
          @if (sale(); as s) {
            <button
              type="button"
              (click)="showFacturaModal.set(true)"
              class="px-3.5 py-2 border border-[#1786B4] bg-sky-50 hover:bg-sky-100 text-[#04202E] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              📄 Previsualizar Factura SUNAT
            </button>

            @if (s.estado === 'EN_PREPARACION' || s.estado === 'DESPACHADO' || s.estado === 'ENTREGADO') {
              <button
                type="button"
                (click)="showGuiaModal.set(true)"
                class="px-3.5 py-2 bg-[#1786B4] hover:bg-[#136d93] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                🚚 Generar Guía de Remisión Transportista
              </button>
            }
          }

          <a
            routerLink="/panel/sales"
            class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            Volver a Ventas
          </a>
        </div>
      </div>

      <!-- Banner de Notificación de Estado -->
      @if (bannerMessage()) {
        <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 animate-fade-in">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ bannerMessage() }}</span>
          </div>
          <button (click)="bannerMessage.set(null)" class="text-emerald-700 hover:text-emerald-900 cursor-pointer">✕</button>
        </div>
      }

      <!-- Banner de Error en transición -->
      @if (errorMessage()) {
        <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800" role="alert">
          <span>{{ errorMessage() }}</span>
          <button type="button" (click)="errorMessage.set(null)" class="text-rose-700 hover:text-rose-900 font-bold cursor-pointer" aria-label="Cerrar error">✕</button>
        </div>
      }

      <!-- 4 ESTADOS DE UI -->

      <!-- 1. CARGA -->
      @if (isLoading()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse space-y-4">
          <div class="h-28 bg-slate-100 rounded-xl"></div>
          <div class="h-64 bg-slate-100 rounded-xl"></div>
        </div>
      }

      <!-- 2. ERROR -->
      @else if (hasError()) {
        <div class="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-base font-bold text-slate-900">No se pudo cargar la suborden</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            No se encontró el registro de la orden o no cuentas con los privilegios requeridos.
          </p>
          <a
            routerLink="/panel/sales"
            class="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover transition-colors inline-block"
          >
            Regresar a Ventas
          </a>
        </div>
      }

      <!-- 3. VACÍO / NO ENCONTRADO -->
      @else if (!sale()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <h2 class="text-base font-bold text-slate-900">Suborden no disponible</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">La suborden indicada no está registrada en el sistema.</p>
          <a routerLink="/panel/sales" class="text-xs text-brand-primary font-bold hover:underline">
            Ir a Listado de Ventas
          </a>
        </div>
      }

      <!-- 4. CON DATOS -->
      @else {
        @if (sale(); as s) {
          <!-- Stepper Logístico Dumb Component -->
          <app-dispatch-stepper
            [currentStatus]="s.estado"
            [isUpdating]="isUpdatingStatus()"
            (statusUpdate)="onStatusUpdated($event)"
          ></app-dispatch-stepper>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Tabla de Ítems Vendidos (2 cols) -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] shadow-sm overflow-hidden">
                <div class="p-4 sm:px-6 border-b border-[#E1F2FA] dark:border-[#1D4960] flex items-center justify-between">
                  <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">
                    Hardware Requerido en esta Suborden
                  </h3>
                  <span class="text-xs text-[#527588] dark:text-[#98D5EE] font-semibold">
                    {{ s.items.length }} productos
                  </span>
                </div>

                <div class="b2b-table-wrapper overflow-x-auto">
                  <table class="b2b-table w-full min-w-[540px] text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                        <th class="py-3.5 px-5">Descripción del Ítem</th>
                        <th class="py-3.5 px-4 text-center">Cant.</th>
                        <th class="py-3.5 px-4 text-right">Precio Unitario</th>
                        <th class="py-3.5 px-5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
                      @for (item of s.items; track item.productoId) {
                        <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                          <td class="py-3.5 px-5">
                            <p class="font-bold text-[#04202E] dark:text-[#F2F9FC]">{{ item.nombre }}</p>
                            <p class="text-[10px] text-[#527588] dark:text-[#98D5EE] font-mono mt-0.5">SKU: {{ item.sku }}</p>
                          </td>
                          <td class="py-3.5 px-4 text-center font-bold text-[#04202E] dark:text-[#F2F9FC]">
                            {{ item.cantidad }}
                          </td>
                          <td class="py-3.5 px-4 text-right font-mono text-[#527588] dark:text-[#B8DFEF] whitespace-nowrap">
                            S/ {{ item.precioUnitario | number:'1.2-2' }}
                          </td>
                          <td class="py-3.5 px-5 text-right font-mono font-black text-[#04202E] dark:text-[#F2F9FC] whitespace-nowrap">
                            S/ {{ item.subtotal | number:'1.2-2' }}
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Tarjeta del Cliente Dumb Component (1 col) -->
            <div>
              <app-sale-client-card [sale]="s"></app-sale-client-card>
            </div>
          </div>

          <!-- Modal Previsualización Factura SUNAT -->
          @if (showFacturaModal() && sunatFactura(); as factura) {
            <div
              class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs print:static print:p-0 print:bg-white"
              role="dialog"
              aria-modal="true"
            >
              <div class="w-full max-w-4xl bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden print:border-none print:shadow-none">
                <div class="no-print px-6 py-4 bg-[#04202E] text-white flex items-center justify-between gap-4">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-sky-300">Comprobante Electrónico SUNAT</span>
                    <h2 class="text-base font-black">Previsualización de Factura {{ factura.numeroFactura }}</h2>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="printDocument()"
                      class="px-4 py-1.5 rounded-xl bg-[#1786B4] hover:bg-[#136d93] text-xs font-bold"
                    >
                      Imprimir / Descargar PDF
                    </button>
                    <button
                      type="button"
                      (click)="showFacturaModal.set(false)"
                      class="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div class="p-6 max-h-[84vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
                  <app-sunat-factura-sheet [data]="factura" />
                </div>
              </div>
            </div>
          }

          <!-- Modal Guía de Remisión Transportista SUNAT -->
          @if (showGuiaModal()) {
            <app-sunat-guia-remision-modal
              [sale]="s"
              [remitenteRazonSocial]="emisorRazonSocial()"
              [remitenteRuc]="emisorRuc()"
              [remitenteDireccion]="emisorDireccion()"
              (closeModal)="showGuiaModal.set(false)"
            />
          }
        }
      }
    </div>
  `
})
export class ProviderSaleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly providerApi = inject(ProviderApiService);
  private readonly authState = inject(AuthStateService);
  private readonly toastState = inject(ToastStateService);

  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly sale = signal<ProviderSaleItem | null>(null);
  public readonly bannerMessage = signal<string | null>(null);
  public readonly errorMessage = signal<string | null>(null);
  public readonly isUpdatingStatus = signal<boolean>(false);
  public readonly showFacturaModal = signal<boolean>(false);
  public readonly showGuiaModal = signal<boolean>(false);

  public readonly emisorRazonSocial = computed(() => this.authState.currentUser()?.razonSocial || 'DISTRIBUIDOR MAYORISTA B2B');
  public readonly emisorRuc = computed(() => this.authState.currentUser()?.ruc || '20608945612');
  public readonly emisorDireccion = computed(() => this.authState.currentUser()?.direccion || 'LIMA - PERÚ');

  public readonly sunatFactura = computed<SunatFacturaData | null>(() => {
    const s = this.sale();
    if (!s) return null;
    return {
      numeroFactura: s.numeroFacturaSimulada || `E001-${String(s.subordenId).padStart(4, '0')}`,
      fechaEmision: s.fechaCreacion,
      formaPago: 'Contado',
      moneda: 'SOLES',
      observacion: `Orden ${s.codigoOrden} · Suborden #${s.subordenId}`,
      emisorRazonSocial: this.emisorRazonSocial(),
      emisorRuc: this.emisorRuc(),
      emisorDireccion: this.emisorDireccion(),
      receptorRazonSocial: s.clienteRazonSocial,
      receptorRuc: s.clienteRuc,
      subtotal: s.subtotal,
      igv: s.igv,
      total: s.total,
      items: s.items.map(it => ({
        codigo: it.sku,
        descripcion: it.nombre,
        unidad: 'UNIDAD',
        cantidad: it.cantidad,
        valorUnitario: it.precioUnitario,
        subtotal: it.subtotal,
      })),
    };
  });

  public printDocument(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadSale(id);
      } else {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private loadSale(id: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.providerApi.getSaleDetail(id).subscribe({
      next: (res) => {
        this.sale.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  public onStatusUpdated(newStatus: SuborderStatus): void {
    const current = this.sale();
    if (!current || this.isUpdatingStatus()) return;

    this.isUpdatingStatus.set(true);
    this.errorMessage.set(null);
    this.bannerMessage.set(null);

    this.providerApi.updateSuborderStatus(current.subordenId, newStatus).subscribe({
      next: () => {
        this.isUpdatingStatus.set(false);
        this.sale.update(s => s ? { ...s, estado: newStatus } : null);
        const msg = `Estado de despacho actualizado con éxito a "${newStatus.replace(/_/g, ' ')}".`;
        this.bannerMessage.set(msg);
        this.toastState.success('Despacho actualizado', msg);
      },
      error: (err) => {
        this.isUpdatingStatus.set(false);
        const msg = err?.error?.mensaje || err?.error?.detail || 'No se pudo actualizar el estado de la suborden.';
        this.errorMessage.set(msg);
        this.toastState.error('Error al actualizar despacho', msg);
      }
    });
  }
}
