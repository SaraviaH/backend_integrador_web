import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderApiService } from '../../../core/services/order-api.service';
import { OrderSummary, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/cuenta/perfil" class="hover:text-[#2456C6] transition-colors">Mi Cuenta</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Mis Compras B2B</span>
      </nav>

      <!-- Encabezado de la Pantalla P-14 -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1E50C0] text-xs font-semibold mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#1E50C0]"></span>
            Historial de Compras Corporativas
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
            Mis Órdenes de Compra
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Monitorea el estado de despacho de tus órdenes, consulta los números de guía de remisión y descarga tus facturas electrónicas.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/catalog"
            class="px-5 py-2.5 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Pedido
          </a>
        </div>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        
        <!-- Buscador por Código de Orden -->
        <div class="relative w-full sm:w-80">
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Buscar por código (ej. ORD-2026)..."
            class="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#142238] placeholder-slate-400 focus:bg-white focus:border-[#2456C6] outline-none transition-all"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Filtro por Estado -->
        <div class="flex items-center gap-2">
          <label for="statusFilter" class="text-xs text-slate-500 font-medium shrink-0">Filtrar estado:</label>
          <select
            id="statusFilter"
            [(ngModel)]="selectedStatus"
            class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#142238] focus:bg-white focus:border-[#2456C6] outline-none"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="EN_PREPARACION">En Preparación</option>
            <option value="DESPACHADA">Despachadas</option>
            <option value="ENTREGADA">Entregadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>

      </div>

      <!-- ========================================================================= -->
      <!-- 4 ESTADOS DE PANTALLA (P-14)                                             -->
      <!-- ========================================================================= -->

      <!-- 1. ESTADO DE CARGA (Skeleton Loader) -->
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
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            Reintentar carga
          </button>
        </div>
      }

      <!-- 3. ESTADO VACÍO -->
      @else if (filteredOrders().length === 0) {
        <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-5 my-8 shadow-xs">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-[#142238]">No se encontraron órdenes registradas</h3>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              @if (searchFilter || selectedStatus !== 'TODOS') {
                No hay compras que coincidan con los filtros aplicados. Intenta restablecer los términos de búsqueda.
              } @else {
                Aún no has realizado ninguna orden de compra en el marketplace. Explora nuestro catálogo de hardware para comenzar.
              }
            </p>
          </div>
          <div class="pt-2">
            @if (searchFilter || selectedStatus !== 'TODOS') {
              <button
                type="button"
                (click)="resetFilters()"
                class="px-5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Limpiar filtros
              </button>
            } @else {
              <a
                routerLink="/catalog"
                class="px-6 py-2.5 rounded-full bg-[#1E50C0] hover:bg-[#1842A0] text-white text-xs font-bold transition-colors shadow-xs inline-flex items-center gap-2"
              >
                Explorar Catálogo B2B
              </a>
            }
          </div>
        </div>
      }

      <!-- 4. ESTADO CON DATOS: TABLA DE ÓRDENES B2B -->
      @else {
        <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="py-3.5 px-6">Código de Orden</th>
                  <th class="py-3.5 px-4">Fecha de Emisión</th>
                  <th class="py-3.5 px-4 text-center">Subórdenes</th>
                  <th class="py-3.5 px-4">Estado del Pedido</th>
                  <th class="py-3.5 px-6 text-right">Importe Total</th>
                  <th class="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (order of filteredOrders(); track order.id) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    
                    <!-- Código de Orden -->
                    <td class="py-4 px-6">
                      <a [routerLink]="['/cuenta/mis-compras', order.id]" class="font-mono font-bold text-[#1E50C0] hover:underline text-xs sm:text-sm">
                        {{ order.codigoOrden }}
                      </a>
                    </td>

                    <!-- Fecha -->
                    <td class="py-4 px-4 text-slate-600">
                      {{ order.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                    </td>

                    <!-- Conteo de Subórdenes Split Order -->
                    <td class="py-4 px-4 text-center">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E50C0] border border-blue-100">
                        {{ order.cantidadSubordenes }} {{ order.cantidadSubordenes === 1 ? 'proveedor' : 'proveedores' }}
                      </span>
                    </td>

                    <!-- Badge de Estado Semántico -->
                    <td class="py-4 px-4">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border"
                        [ngClass]="getStatusClasses(order.estadoGeneral)"
                      >
                        <span class="w-1.5 h-1.5 rounded-full" [ngClass]="getStatusDotClass(order.estadoGeneral)"></span>
                        {{ order.estadoGeneral }}
                      </span>
                    </td>

                    <!-- Importe Total -->
                    <td class="py-4 px-6 text-right font-mono font-bold text-[#142238] text-xs sm:text-sm">
                      S/ {{ order.totalGeneral | number:'1.2-2' }}
                    </td>

                    <!-- Acciones -->
                    <td class="py-4 px-6 text-right space-x-2 shrink-0">
                      <a
                        [routerLink]="['/pedidos', order.id, 'comprobante']"
                        class="p-2 rounded-xl text-slate-400 hover:text-[#1E50C0] hover:bg-blue-50 transition-colors inline-flex items-center"
                        title="Ver Comprobante Electrónico (P-13)"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                      
                      <a
                        [routerLink]="['/cuenta/mis-compras', order.id]"
                        class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-[#1E50C0] hover:text-[#1E50C0] font-semibold text-xs transition-colors inline-block"
                      >
                        Trazabilidad
                      </a>
                    </td>

                  </tr>
                }
              </tbody>
            </table>
          </div>
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

  public searchFilter = '';
  public selectedStatus = 'TODOS';

  public readonly filteredOrders = computed(() => {
    let list = this.orders();
    if (this.searchFilter.trim()) {
      const term = this.searchFilter.toLowerCase().trim();
      list = list.filter(o => o.codigoOrden.toLowerCase().includes(term));
    }
    if (this.selectedStatus !== 'TODOS') {
      list = list.filter(o => o.estadoGeneral === this.selectedStatus);
    }
    return list;
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  public loadOrders(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.orderApi.getMyOrders().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.orders.set(res.content || []);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  public resetFilters(): void {
    this.searchFilter = '';
    this.selectedStatus = 'TODOS';
  }

  public getStatusClasses(status: OrderStatus): string {
    switch (status) {
      case 'ENTREGADA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DESPACHADA':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'EN_PREPARACION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMADA':
        return 'bg-blue-50 text-[#1E50C0] border-blue-200';
      case 'CANCELADA':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  }

  public getStatusDotClass(status: OrderStatus): string {
    switch (status) {
      case 'ENTREGADA':
        return 'bg-emerald-500';
      case 'DESPACHADA':
        return 'bg-purple-500';
      case 'EN_PREPARACION':
        return 'bg-amber-500';
      case 'CONFIRMADA':
        return 'bg-[#1E50C0]';
      case 'CANCELADA':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  }
}
