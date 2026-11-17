import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminProductItem } from '../../../core/services/admin-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="space-y-6">
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Moderar Productos</span>
      </nav>

      <!-- Header -->
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Moderación del Catálogo B2B
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Controla visibilidad comercial, precios de referencia y cumplimiento de publicaciones ({{ totalElementos() }} en catálogo).
          </p>
        </div>

        <form (ngSubmit)="onSearch()" class="flex items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            name="search"
            placeholder="Buscar SKU, título o proveedor..."
            class="w-full sm:w-72 rounded-xl border border-[#CFE4EE] dark:border-[#1D4960] bg-[#F4F9FC] dark:bg-[#0A2535] px-3.5 py-2 text-xs text-[#04202E] dark:text-white placeholder:text-[#527588] focus:outline-none focus:ring-2 focus:ring-[#1786B4]"
          />
          <button
            type="submit"
            class="px-4 py-2 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      <!-- Tabla -->
      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
        <div class="b2b-table-wrapper overflow-x-auto">
          <table class="b2b-table w-full min-w-[780px] text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                <th class="py-3 px-4">Producto</th>
                <th class="py-3 px-4">Proveedor</th>
                <th class="py-3 px-4">Categoría</th>
                <th class="py-3 px-4 text-right">Precio Ref.</th>
                <th class="py-3 px-4 text-right">Stock</th>
                <th class="py-3 px-4">Estado</th>
                <th class="py-3 px-4 text-right">Moderación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
              @for (prod of products(); track prod.id) {
                <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                  <td class="py-3 px-4 max-w-[260px]">
                    <p class="font-bold text-[#04202E] dark:text-white truncate">{{ prod.titulo }}</p>
                    <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">{{ prod.modeloComercial }}</p>
                  </td>
                  <td class="py-3 px-4 font-medium text-[#0A3C55] dark:text-[#E1F2FA]">
                    {{ prod.proveedorRazonSocial }}
                  </td>
                  <td class="py-3 px-4 text-[#527588] dark:text-[#B8DFEF]">
                    {{ prod.categoriaNombre }}
                  </td>
                  <td class="py-3 px-4 text-right font-mono font-bold text-[#04202E] dark:text-white">
                    {{ prod.moneda || 'PEN' }} {{ prod.precioUnitarioRef | number:'1.2-2' }}
                  </td>
                  <td class="py-3 px-4 text-right font-mono text-[#04202E] dark:text-white">
                    {{ prod.stockDisponible }}
                  </td>
                  <td class="py-3 px-4">
                    <span
                      [class]="badgeClass(prod.estado)"
                      class="inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold"
                    >
                      {{ prod.estado }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="inline-flex items-center gap-1.5">
                      @if (prod.estado !== 'ACTIVO') {
                        <button
                          type="button"
                          (click)="changeStatus(prod, 'ACTIVO')"
                          class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                        >
                          Activar
                        </button>
                      }
                      @if (prod.estado !== 'OCULTO_ADMIN') {
                        <button
                          type="button"
                          (click)="changeStatus(prod, 'OCULTO_ADMIN')"
                          class="px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-[11px] font-semibold"
                        >
                          Ocultar
                        </button>
                      }
                      @if (prod.estado !== 'DESHABILITADO') {
                        <button
                          type="button"
                          (click)="changeStatus(prod, 'DESHABILITADO')"
                          class="px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-[11px] font-semibold"
                        >
                          Deshabilitar
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-10 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
                    {{ loading() ? 'Cargando productos...' : 'No se encontraron productos.' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        @if (totalPaginas() > 1) {
          <div class="px-5 py-3 border-t border-[#CFE4EE] dark:border-[#1D4960] flex items-center justify-between text-xs">
            <span class="text-[#527588] dark:text-[#B8DFEF]">
              Página {{ page() + 1 }} de {{ totalPaginas() }}
            </span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="goToPage(page() - 1)"
                [disabled]="page() === 0"
                class="px-3 py-1.5 rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] disabled:opacity-40 hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] font-semibold"
              >
                Anterior
              </button>
              <button
                type="button"
                (click)="goToPage(page() + 1)"
                [disabled]="page() + 1 >= totalPaginas()"
                class="px-3 py-1.5 rounded-lg border border-[#CFE4EE] dark:border-[#1D4960] disabled:opacity-40 hover:bg-[#E1F2FA] dark:hover:bg-[#153F58] font-semibold"
              >
                Siguiente
              </button>
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class AdminProductsComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastStateService);

  public searchTerm = '';
  public readonly products = signal<AdminProductItem[]>([]);
  public readonly loading = signal(false);
  public readonly page = signal(0);
  public readonly totalPaginas = signal(0);
  public readonly totalElementos = signal(0);

  ngOnInit(): void {
    this.loadProducts();
  }

  public onSearch(): void {
    this.page.set(0);
    this.loadProducts();
  }

  public goToPage(nextPage: number): void {
    if (nextPage < 0 || nextPage >= this.totalPaginas()) return;
    this.page.set(nextPage);
    this.loadProducts();
  }

  public loadProducts(): void {
    this.loading.set(true);
    this.adminApi.getProducts(this.searchTerm, this.page(), 12).subscribe({
      next: (res) => {
        this.products.set(res.contenido);
        this.totalPaginas.set(res.totalPaginas);
        this.totalElementos.set(res.totalElementos);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message || 'No se pudo cargar el catálogo.');
        this.loading.set(false);
      }
    });
  }

  public changeStatus(prod: AdminProductItem, nuevoEstado: string): void {
    this.adminApi.updateProductStatus(prod.id, nuevoEstado, 'Moderado desde consola administrativa').subscribe({
      next: () => {
        this.products.update(list => list.map(p => (p.id === prod.id ? { ...p, estado: nuevoEstado } : p)));
        this.toast.success('Estado actualizado', `"${prod.titulo}" pasó a ${nuevoEstado}.`);
      },
      error: (err) => {
        this.toast.error('Error al moderar', err?.error?.message || 'No se pudo cambiar el estado.');
      }
    });
  }

  public badgeClass(estado: string): string {
    if (estado === 'ACTIVO') {
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    }
    if (estado === 'OCULTO_ADMIN') {
      return 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    }
    return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
  }
}
