import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderApiService } from '../../../core/services/order-api.service';
import { OrderSummary } from '../../../core/models/order.model';
import { PaginationBarComponent } from '../../../shared/components/pagination-bar/pagination-bar.component';
import { CurrencySymbolPipe } from '../../../shared/pipes/currency-symbol.pipe';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationBarComponent, CurrencySymbolPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <!-- Migas de Pan -->
      <nav class="flex items-center gap-2 text-xs text-slate-400" aria-label="Ruta de navegación">
        <a routerLink="/" class="hover:text-brand-primary transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/cuenta/perfil" class="hover:text-brand-primary transition-colors">Mi Cuenta</a>
        <span>/</span>
        <span class="text-brand-night font-bold">Mis Compras B2B</span>
      </nav>

      <!-- Encabezado -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-tint border border-brand-tint text-brand-primary text-xs font-semibold mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
            Historial de Compras Corporativas
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-brand-night tracking-tight font-display">
            Mis Órdenes de Compra
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitorea el estado de despacho de tus órdenes por suborden de proveedor y descarga tus comprobantes electrónicos.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/catalog"
            class="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Pedido
          </a>
        </div>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div class="relative w-full sm:w-80">
          <label for="order-search" class="sr-only">Buscar por código de orden en esta página</label>
          <input
            id="order-search"
            type="text"
            [ngModel]="searchFilter()"
            (ngModelChange)="searchFilter.set($event)"
            placeholder="Filtrar página por código (ej. ORD-2026)..."
            class="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brand-night placeholder-slate-400 focus:bg-white focus:border-brand-primary outline-none transition-all"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <p class="text-[11px] text-slate-500">
          Total histórico: <strong class="text-brand-night">{{ totalElements() }}</strong> órdenes · El estado detallado se consulta por suborden.
        </p>
      </div>

      <!-- 1. ESTADO DE CARGA -->
      @if (isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse shadow-xs">
          @for (n of [1,2,3,4]; track n) {
            <div class="flex items-center justify-between py-4 border-b border-slate-100 last:border-none">
              <div class="space-y-2 w-1/3">
                <div class="h-4 bg-slate-200 rounded w-2/3"></div>
                <div class="h-3 bg-slate-150 rounded w-1/2"></div>
              </div>
              <div class="h-6 bg-slate-200 rounded-full w-24"></div>
              <div class="h-5 bg-slate-200 rounded w-20"></div>
              <div class="h-8 bg-slate-150 rounded-xl w-32"></div>
            </div>
          }
        </div>
      }

      <!-- 2. ESTADO DE ERROR -->
      @else if (hasError()) {
        <div class="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto my-12">
          <div class="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-rose-900">Error al consultar el historial de compras</h3>
          <p class="text-xs text-rose-700 leading-relaxed">
            No se pudo obtener la información desde el servidor de órdenes. Verifica tu sesión o reintenta.
          </p>
          <button
            type="button"
            (click)="loadOrders()"
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Reintentar carga
          </button>
        </div>
      }

      <!-- 3. ESTADO VACÍO -->
      @else if (filteredOrders().length === 0) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-5 my-8 shadow-xs">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-brand-night">No se encontraron órdenes registradas</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              @if (searchFilter()) {
                No hay compras en esta página que coincidan con el código buscado.
              } @else {
                Aún no has realizado ninguna orden de compra en el marketplace. Explora nuestro catálogo de hardware para comenzar.
              }
            </p>
          </div>
          <div class="pt-2">
            @if (searchFilter()) {
              <button
                type="button"
                (click)="resetFilters()"
                class="px-5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Limpiar filtro
              </button>
            } @else {
              <a
                routerLink="/catalog"
                class="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-petrol text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-2"
              >
                Explorar Catálogo B2B
              </a>
            }
          </div>
        </div>
      }

      <!-- 4. ESTADO CON DATOS -->
      @else {
        <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
          <div class="b2b-table-wrapper overflow-x-auto">
            <table class="b2b-table w-full min-w-[680px] text-left text-xs">
              <thead class="bg-[#E1F2FA] dark:bg-[#114662] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[#0A3C55] dark:text-[#BCE6FA] font-extrabold uppercase text-[11px] tracking-wider">
                <tr>
                  <th class="py-3.5 px-6">Código de Orden</th>
                  <th class="py-3.5 px-4">Fecha de Emisión</th>
                  <th class="py-3.5 px-4 text-center">Subórdenes</th>
                  <th class="py-3.5 px-6 text-right">Importe Total</th>
                  <th class="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
                @for (order of filteredOrders(); track order.id) {
                  <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                    <td class="py-4 px-6 whitespace-nowrap">
                      <a [routerLink]="['/cuenta/mis-compras', order.id]" class="font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA] hover:underline text-xs sm:text-sm">
                        {{ order.codigoOrden }}
                      </a>
                    </td>

                    <td class="py-4 px-4 text-[#527588] dark:text-[#B8DFEF] whitespace-nowrap">
                      {{ order.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                    </td>

                    <td class="py-4 px-4 text-center whitespace-nowrap">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E1F2FA] dark:bg-[#0A2535] text-[#0F5E83] dark:text-[#98D5EE] border border-[#98D5EE]/60 dark:border-[#1D4960]">
                        {{ order.cantidadSubordenes }} {{ order.cantidadSubordenes === 1 ? 'proveedor' : 'proveedores' }}
                      </span>
                    </td>

                    <td class="py-4 px-6 text-right font-mono font-bold text-[#04202E] dark:text-[#F2F9FC] text-xs sm:text-sm whitespace-nowrap">
                      {{ order.moneda | currencySymbol }} {{ order.totalGeneral | number:'1.2-2' }}
                    </td>

                    <td class="py-4 px-6 text-right space-x-2 shrink-0 whitespace-nowrap">
                      <a
                        [routerLink]="['/pedidos', order.id, 'comprobante']"
                        class="p-2 rounded-xl text-[#527588] dark:text-[#B8DFEF] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] hover:bg-[#E1F2FA]/70 dark:hover:bg-[#1786B4]/20 transition-colors inline-flex items-center"
                        title="Ver Comprobante Electrónico"
                        aria-label="Ver Comprobante Electrónico"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>

                      <a
                        [routerLink]="['/cuenta/mis-compras', order.id]"
                        class="px-3 py-1.5 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-white dark:bg-[#0A2535] text-[#0A3C55] dark:text-[#E1F2FA] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] hover:text-[#1786B4] dark:hover:text-[#4FB3DA] font-semibold text-xs transition-colors inline-block"
                      >
                        Trazabilidad
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <app-pagination-bar
            [totalItems]="totalElements()"
            [pageSize]="pageSize"
            [currentPage]="currentPage()"
            (pageChange)="onPageChange($event)"
          />
        </div>
      }

    </div>
  `
})
export class MyOrdersComponent implements OnInit {
  private readonly orderApi = inject(OrderApiService);

  public readonly orders = signal<OrderSummary[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);

  public readonly currentPage = signal<number>(1);
  public readonly totalElements = signal<number>(0);
  public readonly pageSize = 10;
  public readonly searchFilter = signal<string>('');

  public readonly filteredOrders = computed(() => {
    const list = this.orders();
    const term = this.searchFilter().toLowerCase().trim();
    if (!term) return list;
    return list.filter(o => o.codigoOrden.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadOrders(1);
  }

  public loadOrders(page: number = this.currentPage()): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.currentPage.set(page);

    this.orderApi.getMyOrders(page - 1, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.orders.set(res.content || []);
        this.totalElements.set(res.totalElements ?? (res.content?.length || 0));
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public onPageChange(page: number): void {
    this.loadOrders(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  public resetFilters(): void {
    this.searchFilter.set('');
  }
}
