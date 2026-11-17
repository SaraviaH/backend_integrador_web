import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService, AdminUserItem } from '../../../core/services/admin-api.service';
import { ToastStateService } from '../../../core/state/toast-state.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <nav aria-label="Ruta de navegación" class="flex items-center gap-2 text-xs text-[#527588] dark:text-[#B8DFEF]">
        <span>Administración</span>
        <span aria-hidden="true">/</span>
        <span class="font-semibold text-[#04202E] dark:text-white">Usuarios</span>
      </nav>

      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#04202E] dark:text-white tracking-tight">
            Gestión de Cuentas y Accesos
          </h1>
          <p class="text-xs sm:text-sm text-[#527588] dark:text-[#B8DFEF]">
            Supervisa usuarios compradores, proveedores y administradores registrados en COMPUNEX.
          </p>
        </div>

        <button
          type="button"
          (click)="loadUsers()"
          [disabled]="loading()"
          class="px-4 py-2.5 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs font-semibold shrink-0 transition-colors"
        >
          Refrescar
        </button>
      </div>

      <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-hidden shadow-sm">
        <div class="b2b-table-wrapper overflow-x-auto">
          <table class="b2b-table w-full min-w-[700px] text-left border-collapse text-xs">
            <thead>
              <tr class="bg-[#E1F2FA] dark:bg-[#114662] text-[#0A3C55] dark:text-[#BCE6FA] border-b-2 border-[#7CC5E6] dark:border-[#2C7DA3] text-[11px] font-extrabold uppercase tracking-wider">
                <th class="py-3 px-4">Usuario</th>
                <th class="py-3 px-4">Rol</th>
                <th class="py-3 px-4">Estado</th>
                <th class="py-3 px-4">Registro</th>
                <th class="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#D8ECF6] dark:divide-[#1D4960]">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-[#EBF6FC] dark:hover:bg-[#153F58] transition-colors">
                  <td class="py-3 px-4">
                    <p class="font-bold text-[#04202E] dark:text-white">{{ user.nombre }}</p>
                    <p class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">{{ user.correo }}</p>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded bg-[#E1F2FA] dark:bg-[#0A2535] border border-[#98D5EE] dark:border-[#1D4960] text-[10px] font-bold text-[#0A3C55] dark:text-[#4FB3DA]">
                      {{ user.rol }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span
                      [class]="user.estado === 'ACTIVO'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'"
                      class="px-2 py-0.5 rounded-full border text-[10px] font-bold"
                    >
                      {{ user.estado }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-mono text-[11px] text-[#527588] dark:text-[#B8DFEF]">
                    {{ user.fechaRegistro | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="py-3 px-4 text-right">
                    @if (user.rol !== 'ROLE_ADMIN') {
                      <button
                        type="button"
                        (click)="toggleStatus(user)"
                        [class]="user.estado === 'ACTIVO'
                          ? 'border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'"
                        class="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        {{ user.estado === 'ACTIVO' ? 'Suspender' : 'Activar' }}
                      </button>
                    } @else {
                      <span class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">Protegido</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="py-10 text-center text-xs text-[#527588] dark:text-[#B8DFEF]">
                    {{ loading() ? 'Cargando usuarios...' : 'No hay usuarios registrados.' }}
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
export class AdminUsersComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastStateService);

  public readonly users = signal<AdminUserItem[]>([]);
  public readonly loading = signal(false);

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.loading.set(true);
    this.adminApi.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message || 'No se pudieron cargar los usuarios.');
        this.loading.set(false);
      }
    });
  }

  public toggleStatus(user: AdminUserItem): void {
    const nuevoEstado = user.estado === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
    this.adminApi.updateUserStatus(user.id, nuevoEstado, 'Acción administrativa').subscribe({
      next: (updated) => {
        this.users.update(list => list.map(u => (u.id === updated.id ? updated : u)));
        this.toast.success('Cuenta actualizada', `${updated.correo} ahora está ${updated.estado}.`);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message || 'No se pudo cambiar el estado del usuario.');
      }
    });
  }
}
