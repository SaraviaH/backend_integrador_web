import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService, AdminOrderItem } from '../../../core/services/admin-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Órdenes Globales</span>
      </nav>

      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Auditoría de Órdenes B2B
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Seguimiento consolidado de compras corporativas, pasarela de pago y subórdenes por proveedor.
          </p>
        </div>

        <button
          type="button"
          (click)="loadOrders()"
          [disabled]="loading()"
          class="px-4 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-semibold shrink-0 transition-colors"
        >
          Refrescar
        </button>
      </div>

      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
        <div class="b2b-table-wrapper overflow-x-auto">
          <table class="b2b-table w-full min-w-[780px] text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                <th class="py-3 px-4">Código</th>
                <th class="py-3 px-4">Comprador / RUC</th>
                <th class="py-3 px-4">Pago / Autorización</th>
                <th class="py-3 px-4 text-right">Subórdenes</th>
                <th class="py-3 px-4 text-right">Total (S/)</th>
                <th class="py-3 px-4">Estado</th>
                <th class="py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
              @for (order of orders(); track order.ordenId) {
                <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                  <td class="py-3 px-4 font-mono font-bold text-[#1786B4] dark:text-[#4FB3DA]">
                    {{ order.codigoOrden }}
                  </td>
                  <td class="py-3 px-4">
                    <p class="font-bold text-[#04202E] dark:text-white">{{ order.compradorNombre }}</p>
                    <p class="font-mono text-[11px] text-[#527588] dark:text-[#B8DFEF]">
                      {{ order.compradorRuc ? ('RUC ' + order.compradorRuc) : 'Sin RUC' }}
                    </p>
                  </td>
                  <td class="py-3 px-4">
                    <p class="font-semibold text-[#04202E] dark:text-white">{{ order.metodoPago }}</p>
                    <p class="font-mono text-[11px] text-[#527588] dark:text-[#B8DFEF]">
                      {{ order.codigoAutorizacionPago || 'Pendiente' }}
                    </p>
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-semibold text-[#04202E] dark:text-white">
                    {{ order.cantidadSubordenes }}
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-[#04202E] dark:text-white">
                    S/ {{ order.montoTotal | number:'1.2-2' }}
                  </td>
                  <td class="py-3 px-4">
                    <span
                      [class]="order.estado === 'PAGADO' || order.estado === 'ENTREGADO'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : order.estado === 'CANCELADO'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                          : 'bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] border-[#98D5EE] dark:border-[#1D4960]'"
                      class="px-2 py-0.5 rounded-full border text-[10px] font-bold"
                    >
                      {{ order.estado }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-mono text-[11px] text-[#527588] dark:text-[#B8DFEF]">
                    {{ order.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-10 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
                    {{ loading() ? 'Cargando órdenes...' : 'No hay órdenes registradas.' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class AdminOrdersComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastStateService);

  public readonly orders = signal<AdminOrderItem[]>([]);
  public readonly loading = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  public loadOrders(): void {
    this.loading.set(true);
    this.adminApi.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message || 'No se pudieron cargar las órdenes.');
        this.loading.set(false);
      }
    });
  }
}
