import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { ProviderSaleItem } from '../../../../core/models/provider.model';
import { SuborderStatus } from '../../../../core/models/order.model';
import { DispatchStepperComponent } from './components/dispatch-stepper/dispatch-stepper.component';
import { SaleClientCardComponent } from './components/sale-client-card/sale-client-card.component';

@Component({
  selector: 'app-provider-sale-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DispatchStepperComponent, SaleClientCardComponent],
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

        <a
          routerLink="/panel/sales"
          class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors self-start md:self-auto"
        >
          Volver a Ventas
        </a>
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
            (statusUpdate)="onStatusUpdated($event)"
          ></app-dispatch-stepper>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Tabla de Ítems Vendidos (2 cols) -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 class="text-sm font-bold text-slate-900">
                    Hardware Requerido en esta Suborden
                  </h3>
                  <span class="text-xs text-slate-400 font-semibold">
                    {{ s.items.length }} productos
                  </span>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th class="py-3 px-4">Descripción del Ítem</th>
                        <th class="py-3 px-4 text-center">Cant.</th>
                        <th class="py-3 px-4 text-right">Precio Unitario</th>
                        <th class="py-3 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      @for (item of s.items; track item.productoId) {
                        <tr class="hover:bg-slate-50/60">
                          <td class="py-3.5 px-4">
                            <p class="font-bold text-slate-800">{{ item.nombre }}</p>
                            <p class="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {{ item.sku }}</p>
                          </td>
                          <td class="py-3.5 px-4 text-center font-bold text-slate-800">
                            {{ item.cantidad }}
                          </td>
                          <td class="py-3.5 px-4 text-right text-slate-700">
                            S/ {{ item.precioUnitario | number:'1.2-2' }}
                          </td>
                          <td class="py-3.5 px-4 text-right font-black text-slate-900">
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
        }
      }
    </div>
  `
})
export class ProviderSaleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly providerApi = inject(ProviderApiService);

  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly sale = signal<ProviderSaleItem | null>(null);
  public readonly bannerMessage = signal<string | null>(null);

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
    if (!current) return;

    this.providerApi.updateSuborderStatus(current.subordenId, newStatus).subscribe({
      next: () => {
        this.sale.update(s => s ? { ...s, estado: newStatus } : null);
        this.bannerMessage.set(`Estado de despacho actualizado con éxito a "${newStatus}".`);
      }
    });
  }
}
