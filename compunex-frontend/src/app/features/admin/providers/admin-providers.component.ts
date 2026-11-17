import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService, AdminProviderItem } from '../../../core/services/admin-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-admin-providers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Proveedores</span>
      </nav>

      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Directorio de Proveedores B2B
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Verifica identidad fiscal (RUC) y destaca mayoristas en el catálogo COMPUNEX.
          </p>
        </div>

        <button
          type="button"
          (click)="loadProviders()"
          [disabled]="loading()"
          class="px-4 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-semibold shrink-0 transition-colors"
        >
          Refrescar
        </button>
      </div>

      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
        <div class="b2b-table-wrapper overflow-x-auto">
          <table class="b2b-table w-full min-w-[740px] text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                <th class="py-3 px-4">Razón Social</th>
                <th class="py-3 px-4">RUC</th>
                <th class="py-3 px-4">Ciudad</th>
                <th class="py-3 px-4 text-right">Productos</th>
                <th class="py-3 px-4">Verificación</th>
                <th class="py-3 px-4">Destacado</th>
                <th class="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
              @for (prov of providers(); track prov.proveedorId) {
                <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                  <td class="py-3 px-4">
                    <p class="font-bold text-[#04202E] dark:text-white">{{ prov.razonSocial }}</p>
                    <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">{{ prov.nombreComercial }}</p>
                  </td>
                  <td class="py-3 px-4 font-mono text-[#0A3C55] dark:text-[#E1F2FA]">{{ prov.ruc }}</td>
                  <td class="py-3 px-4 text-[#527588] dark:text-[#B8DFEF]">{{ prov.ciudad || 'Lima' }}</td>
                  <td class="py-3 px-4 text-right font-mono font-semibold text-[#04202E] dark:text-white">
                    {{ prov.totalProductos }}
                  </td>
                  <td class="py-3 px-4">
                    <span
                      [class]="prov.verificado
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'"
                      class="px-2 py-0.5 rounded-full border text-[10px] font-bold"
                    >
                      {{ prov.verificado ? 'VERIFICADO' : 'PENDIENTE' }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span
                      [class]="prov.destacado
                        ? 'bg-[#E1F2FA] dark:bg-[#0A2535] text-[#1786B4] dark:text-[#4FB3DA] border-[#98D5EE] dark:border-[#1D4960]'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-700'"
                      class="px-2 py-0.5 rounded-full border text-[10px] font-bold"
                    >
                      {{ prov.destacado ? 'DESTACADO' : 'ESTÁNDAR' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        (click)="toggleVerify(prov)"
                        class="px-2.5 py-1 rounded-lg bg-[#1786B4] hover:bg-[#0F5E83] text-white text-[11px] font-semibold"
                      >
                        {{ prov.verificado ? 'Revocar' : 'Verificar' }}
                      </button>
                      <button
                        type="button"
                        (click)="toggleFeatured(prov)"
                        class="px-2.5 py-1 rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] text-[11px] font-semibold text-[#0A3C55] dark:text-[#E1F2FA]"
                      >
                        {{ prov.destacado ? 'Quitar Dest.' : 'Destacar' }}
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-10 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
                    {{ loading() ? 'Cargando proveedores...' : 'No hay proveedores registrados.' }}
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
export class AdminProvidersComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastStateService);

  public readonly providers = signal<AdminProviderItem[]>([]);
  public readonly loading = signal(false);

  ngOnInit(): void {
    this.loadProviders();
  }

  public loadProviders(): void {
    this.loading.set(true);
    this.adminApi.getProviders().subscribe({
      next: (data) => {
        this.providers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message || 'No se pudieron cargar los proveedores.');
        this.loading.set(false);
      }
    });
  }

  public toggleVerify(prov: AdminProviderItem): void {
    this.updateProvider(prov.proveedorId, !prov.verificado, prov.destacado);
  }

  public toggleFeatured(prov: AdminProviderItem): void {
    this.updateProvider(prov.proveedorId, prov.verificado, !prov.destacado);
  }

  private updateProvider(id: number, verificado: boolean, destacado: boolean): void {
    this.adminApi.verifyProvider(id, verificado, destacado).subscribe({
      next: (updated) => {
        this.providers.update(list => list.map(p => (p.proveedorId === updated.proveedorId ? updated : p)));
        this.toast.success('Proveedor actualizado', `${updated.razonSocial} actualizado correctamente.`);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message || 'No se pudo actualizar el proveedor.');
      }
    });
  }
}
