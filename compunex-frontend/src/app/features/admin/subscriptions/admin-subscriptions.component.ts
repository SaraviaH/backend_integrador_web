import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminSubscriptionItem } from '../../../core/services/admin-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6">
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Suscripciones SaaS</span>
      </nav>

      <!-- Header -->
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE] dark:border-[#1D4960] text-[11px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">
            Modelo SaaS Facturación Electrónica
          </span>
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Planes de Facturación SUNAT y GRE
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Asigna niveles de suscripción mensual a proveedores para habilitar emisión automatizada ante SUNAT y Guías de Remisión.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <div class="rounded-xl bg-[#F4F9FC] dark:bg-[#0A2535] border border-[#CFE4EE] dark:border-[#1D4960] px-4 py-2 text-right">
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">MRR Estimado</p>
            <p class="text-lg font-extrabold font-mono text-[#1786B4] dark:text-[#4FB3DA]">S/ {{ mrrTotal() | number:'1.2-2' }}</p>
          </div>
          <button
            type="button"
            (click)="loadSubscriptions()"
            [disabled]="loading()"
            class="px-4 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-semibold transition-colors"
          >
            Refrescar
          </button>
        </div>
      </div>

      <!-- Catálogo de Planes SaaS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#527588] dark:text-[#B8DFEF]">Básico Catálogo</span>
              <span class="px-2 py-0.5 rounded-full bg-[#F4F9FC] dark:bg-[#0A2535] text-[10px] font-bold text-[#0A3C55] dark:text-[#B8DFEF]">BASICO_CATALOGO</span>
            </div>
            <p class="mt-2 text-2xl font-extrabold font-mono text-[#04202E] dark:text-white">S/ 0.00 <span class="text-xs font-normal text-[#527588]">/mes</span></p>
            <p class="mt-1 text-xs text-[#527588] dark:text-[#B8DFEF]">Publicación en vitrina B2B y gestión estándar de pedidos sin emisión XML SUNAT.</p>
          </div>
        </article>

        <article class="bg-white dark:bg-[#0F3043] rounded-2xl border-2 border-[#1786B4] dark:border-[#4FB3DA] p-5 shadow-md flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#1786B4] dark:text-[#4FB3DA]">Pro Facturación</span>
              <span class="px-2 py-0.5 rounded-full bg-[#E1F2FA] dark:bg-[#0A2535] text-[10px] font-bold text-[#1786B4] dark:text-[#4FB3DA]">PRO_FACTURACION</span>
            </div>
            <p class="mt-2 text-2xl font-extrabold font-mono text-[#04202E] dark:text-white">S/ 149.00 <span class="text-xs font-normal text-[#527588]">/mes</span></p>
            <p class="mt-1 text-xs text-[#527588] dark:text-[#B8DFEF]">Emisión automática de Boletas/Facturas electrónicas PDF y XML validados ante SUNAT.</p>
          </div>
        </article>

        <article class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 shadow-sm flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[#04202E] dark:text-white">Enterprise SUNAT</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">ENTERPRISE_SUNAT</span>
            </div>
            <p class="mt-2 text-2xl font-extrabold font-mono text-[#04202E] dark:text-white">S/ 349.00 <span class="text-xs font-normal text-[#527588]">/mes</span></p>
            <p class="mt-1 text-xs text-[#527588] dark:text-[#B8DFEF]">Facturación CPE ilimitada + Guías de Remisión Transportista (GRE) e integración ERP.</p>
          </div>
        </article>
      </div>

      <!-- Tabla de Suscripciones por Proveedor -->
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
        <div class="px-5 py-4 border-b border-[#CFE4EE] dark:border-[#1D4960] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-sm sm:text-base font-bold text-[#04202E] dark:text-white">
              Proveedores Suscritos ({{ items().length }})
            </h2>
            <p class="text-xs text-[#527588] dark:text-[#B8DFEF]">
              Modifica el plan o estado y presiona Guardar para actualizar inmediatamente los permisos del proveedor.
            </p>
          </div>
        </div>

        <div class="b2b-table-wrapper overflow-x-auto">
          <table class="b2b-table w-full min-w-[820px] text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                <th class="py-3 px-4">Proveedor / RUC</th>
                <th class="py-3 px-4">Plan Asignado</th>
                <th class="py-3 px-4">Estado</th>
                <th class="py-3 px-4">Tarifa</th>
                <th class="py-3 px-4">Capacidades</th>
                <th class="py-3 px-4">Vencimiento</th>
                <th class="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
              @for (sub of items(); track sub.proveedorId) {
                <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                  <td class="py-3 px-4">
                    <p class="font-bold text-[#04202E] dark:text-white">{{ sub.proveedorRazonSocial }}</p>
                    <p class="font-mono text-[11px] text-[#527588] dark:text-[#B8DFEF]">RUC {{ sub.proveedorRuc }}</p>
                  </td>
                  <td class="py-3 px-4">
                    <select
                      [(ngModel)]="sub.plan"
                      class="w-full min-w-[180px] rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC] dark:bg-[#0A2535] px-2.5 py-1.5 text-xs font-semibold text-[#04202E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1786B4]"
                    >
                      <option value="BASICO_CATALOGO">Básico · S/ 0</option>
                      <option value="PRO_FACTURACION">Pro Facturación · S/ 149</option>
                      <option value="ENTERPRISE_SUNAT">Enterprise SUNAT · S/ 349</option>
                    </select>
                  </td>
                  <td class="py-3 px-4">
                    <select
                      [(ngModel)]="sub.estado"
                      class="rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC] dark:bg-[#0A2535] px-2.5 py-1.5 text-xs font-semibold text-[#04202E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1786B4]"
                    >
                      <option value="ACTIVA">ACTIVA</option>
                      <option value="PRUEBA">PRUEBA</option>
                      <option value="VENCIDA">VENCIDA</option>
                      <option value="CANCELADA">CANCELADA</option>
                    </select>
                  </td>
                  <td class="py-3 px-4 font-mono font-bold text-[#04202E] dark:text-white whitespace-nowrap">
                    S/ {{ sub.precioMensual | number:'1.2-2' }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex flex-wrap gap-1">
                      <span
                        [class]="sub.incluyeFacturacionSunat
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700'"
                        class="px-2 py-0.5 rounded border text-[10px] font-bold"
                      >
                        SUNAT {{ sub.incluyeFacturacionSunat ? 'ON' : 'OFF' }}
                      </span>
                      <span
                        [class]="sub.incluyeGuiaRemision
                          ? 'bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] border-[#98D5EE] dark:border-[#1D4960]'
                          : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700'"
                        class="px-2 py-0.5 rounded border text-[10px] font-bold"
                      >
                        GRE {{ sub.incluyeGuiaRemision ? 'ON' : 'OFF' }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-mono text-[11px] text-[#527588] dark:text-[#B8DFEF]">
                    {{ sub.fechaVencimiento ? (sub.fechaVencimiento | date:'dd/MM/yyyy') : '—' }}
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button
                      type="button"
                      (click)="saveSubscription(sub)"
                      [disabled]="savingId() === sub.proveedorId"
                      class="px-3 py-1.5 rounded-lg bg-[#1786B4] hover:bg-[#0F5E83] disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                    >
                      {{ savingId() === sub.proveedorId ? 'Guardando...' : 'Guardar' }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-10 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
                    {{ loading() ? 'Cargando suscripciones...' : 'No hay suscripciones registradas.' }}
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
export class AdminSubscriptionsComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastStateService);

  public readonly items = signal<AdminSubscriptionItem[]>([]);
  public readonly loading = signal(false);
  public readonly savingId = signal<number | null>(null);

  public readonly mrrTotal = computed(() =>
    this.items()
      .filter(s => s.estado === 'ACTIVA')
      .reduce((acc, s) => acc + (s.precioMensual ?? 0), 0)
  );

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  public loadSubscriptions(): void {
    this.loading.set(true);
    this.adminApi.getSubscriptions().subscribe({
      next: (data) => {
        this.items.set(data.map(item => ({ ...item })));
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Error al cargar', err?.error?.message || 'No se pudieron obtener las suscripciones.');
        this.loading.set(false);
      }
    });
  }

  public saveSubscription(sub: AdminSubscriptionItem): void {
    this.savingId.set(sub.proveedorId);
    this.adminApi.upsertSubscription(sub.proveedorId, sub.plan, sub.estado).subscribe({
      next: (updated) => {
        this.items.update(list => list.map(i => (i.proveedorId === updated.proveedorId ? updated : i)));
        this.savingId.set(null);
        this.toast.success('Suscripción actualizada', `${updated.proveedorRazonSocial} ahora tiene plan ${updated.plan} (${updated.estado}).`);
      },
      error: (err) => {
        this.savingId.set(null);
        this.toast.error('No se pudo guardar', err?.error?.message || 'Error al actualizar la suscripción.');
      }
    });
  }
}
