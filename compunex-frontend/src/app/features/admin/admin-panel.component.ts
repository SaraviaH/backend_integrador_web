import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AdminApiService,
  AdminDashboardMetrics,
  AdminOrderItem,
  AdminProductItem,
  AdminProviderItem,
  AdminSubscriptionItem,
  AdminUserItem,
} from '../../core/services/admin-api.service';
import { AuthStateService } from '../../core/state/auth-state.service';
import { ToastStateService } from '../../core/state/toast-state.service';

type AdminTab = 'dashboard' | 'subscriptions' | 'products' | 'providers' | 'users' | 'orders';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F4F9FC] dark:bg-[#071824] flex flex-col lg:flex-row">
      <!-- Sidebar Administrativo -->
      <aside class="w-full lg:w-68 bg-[#04202E] text-white shrink-0 flex flex-col justify-between p-5 border-b lg:border-b-0 lg:border-r border-[#12394E]">
        <div class="space-y-6">
          <div class="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#4FB3DA]">COMPUNEX B2B</span>
              <h1 class="text-lg font-black tracking-tight font-display">Consola Admin</h1>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">ADMIN</span>
          </div>

          <nav class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 text-xs">
            @for (item of navItems; track item.id) {
              <button
                type="button"
                (click)="switchTab(item.id)"
                class="w-full px-3.5 py-2.5 rounded-xl text-left font-bold transition-all flex items-center gap-2.5"
                [ngClass]="activeTab() === item.id
                  ? 'bg-[#1786B4] text-white shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'"
              >
                <span>{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            }
          </nav>
        </div>

        <div class="pt-5 mt-6 border-t border-white/10 flex flex-col gap-2 text-xs">
          <a routerLink="/" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-center">
            ← Ir a Tienda Pública
          </a>
          <button
            type="button"
            (click)="logout()"
            class="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl font-black text-[#04202E] dark:text-[#F2F9FC] font-display">
              {{ getTabTitle() }}
            </h2>
            <p class="text-xs text-[#527588] dark:text-[#9FCBE0]">
              Supervisión integral del negocio B2B, tiempos logísticos, moderación y facturación SaaS a proveedores.
            </p>
          </div>
          <button
            type="button"
            (click)="refreshAll()"
            class="px-4 py-2 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs font-bold text-[#04202E] dark:text-[#F2F9FC] hover:bg-sky-50 self-start"
          >
            ↻ Actualizar Datos
          </button>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            @for (i of [1,2,3,4]; track i) {
              <div class="h-28 rounded-2xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960]"></div>
            }
          </div>
        } @else {

          <!-- TAB 1: DASHBOARD EJECUTIVO & KPIs -->
          @if (activeTab() === 'dashboard' && metrics(); as m) {
            <div class="space-y-6">
              <!-- KPIs Financieros y Operativos -->
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-[#0F3043] p-5 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] shadow-xs">
                  <span class="text-[11px] font-bold uppercase text-[#527588] dark:text-[#9FCBE0]">GMV Total (Ventas B2B)</span>
                  <div class="text-2xl font-black text-[#04202E] dark:text-[#F2F9FC] mt-1 font-mono">S/ {{ m.gmvTotal | number:'1.2-2' }}</div>
                  <span class="text-[11px] text-emerald-600 font-semibold">IGV recaudado: S/ {{ m.igvTotalRecaudado | number:'1.2-2' }}</span>
                </div>

                <div class="bg-white dark:bg-[#0F3043] p-5 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] shadow-xs">
                  <span class="text-[11px] font-bold uppercase text-[#527588] dark:text-[#9FCBE0]">Órdenes y Ticket Promedio</span>
                  <div class="text-2xl font-black text-[#1786B4] dark:text-[#4FB3DA] mt-1 font-mono">{{ m.totalOrdenes }} órdenes</div>
                  <span class="text-[11px] text-[#527588] dark:text-[#B8DFEF]">Ticket prom.: S/ {{ m.ticketPromedio | number:'1.2-2' }} · {{ m.totalSubordenes }} subórdenes</span>
                </div>

                <div class="bg-white dark:bg-[#0F3043] p-5 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] shadow-xs">
                  <span class="text-[11px] font-bold uppercase text-[#527588] dark:text-[#9FCBE0]">Tiempo Prom. de Despacho</span>
                  <div class="text-2xl font-black text-[#04202E] dark:text-[#F2F9FC] mt-1 font-mono">{{ m.tiempoPromedioDespachoHoras | number:'1.1-1' }} hrs</div>
                  <span class="text-[11px] text-emerald-600 font-semibold">Tasa de entrega efectiva: {{ m.tasaEntregaPorcentaje }}%</span>
                </div>

                <div class="bg-gradient-to-br from-[#04202E] to-[#1786B4] text-white p-5 rounded-2xl shadow-xs">
                  <span class="text-[11px] font-bold uppercase text-sky-200">MRR Suscripciones SaaS</span>
                  <div class="text-2xl font-black mt-1 font-mono">S/ {{ m.mrrSuscripciones | number:'1.2-2' }}/mes</div>
                  <span class="text-[11px] text-sky-100">{{ m.suscripcionesActivas }} activas · {{ m.proveedoresConFacturacion }} con Facturación SUNAT</span>
                </div>
              </div>

              <!-- Segunda Fila: Comunidad, Catálogo, Estados y Medios de Pago -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Top Proveedores -->
                <div class="lg:col-span-2 bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 space-y-4">
                  <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">Ranking de Proveedores por Facturación</h3>
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead class="border-b border-[#CFE4EE] dark:border-[#1D4960] text-[#527588] uppercase text-[10px]">
                        <tr>
                          <th class="py-2">Proveedor</th>
                          <th class="py-2">RUC</th>
                          <th class="py-2 text-center">Subórdenes</th>
                          <th class="py-2 text-right">Volumen Vendido</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                        @for (tp of m.topProveedores; track tp.proveedorId) {
                          <tr>
                            <td class="py-2.5 font-bold text-[#04202E] dark:text-[#F2F9FC]">{{ tp.razonSocial }}</td>
                            <td class="py-2.5 font-mono text-[#527588]">{{ tp.ruc }}</td>
                            <td class="py-2.5 text-center font-bold">{{ tp.ventasCount }}</td>
                            <td class="py-2.5 text-right font-mono font-black text-[#1786B4]">S/ {{ tp.montoTotal | number:'1.2-2' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Salud del Ecosistema -->
                <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] p-5 space-y-4 text-xs">
                  <h3 class="text-sm font-bold text-[#04202E] dark:text-[#F2F9FC]">Salud del Catálogo y Usuarios</h3>
                  <div class="space-y-2.5">
                    <div class="flex justify-between"><span>Usuarios totales:</span><strong>{{ m.totalUsuarios }} ({{ m.totalProveedores }} prov. / {{ m.totalClientes }} clientes)</strong></div>
                    <div class="flex justify-between"><span>Proveedores verificados:</span><strong class="text-emerald-600">{{ m.proveedoresVerificados }} / {{ m.totalProveedores }}</strong></div>
                    <div class="flex justify-between"><span>Productos activos:</span><strong class="text-emerald-600">{{ m.productosActivos }} / {{ m.totalProductos }}</strong></div>
                    <div class="flex justify-between"><span>Ocultos por Admin:</span><strong class="text-amber-600">{{ m.productosOcultosAdmin }}</strong></div>
                    <div class="flex justify-between"><span>Pausados por Proveedor:</span><strong>{{ m.productosDeshabilitados }}</strong></div>
                  </div>
                  <div class="pt-3 border-t border-[#E1F2FA] dark:border-[#1D4960] space-y-1.5">
                    <div class="font-bold text-[11px] uppercase text-[#527588]">Subórdenes por Estado</div>
                    @for (entry of objectEntries(m.subordenesPorEstado); track entry[0]) {
                      <div class="flex justify-between text-[11px]">
                        <span>{{ entry[0] }}</span>
                        <span class="font-mono font-bold">{{ entry[1] }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: SUSCRIPCIONES DE FACTURACIÓN PARA PROVEEDORES -->
          @if (activeTab() === 'subscriptions') {
            <div class="space-y-6">
              <!-- Tarjetas de Planes SaaS -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="bg-white dark:bg-[#0F3043] p-5 rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] space-y-2">
                  <div class="font-bold text-[#527588] uppercase">Plan Básico Catálogo</div>
                  <div class="text-2xl font-black text-[#04202E] dark:text-[#F2F9FC]">S/ 0.00 <span class="text-xs font-normal">/mes</span></div>
                  <p class="text-[#527588]">Publicación en catálogo B2B sin emisión automática de Factura SUNAT ni GRE.</p>
                </div>
                <div class="bg-white dark:bg-[#0F3043] p-5 rounded-2xl border-2 border-[#1786B4] space-y-2">
                  <div class="font-bold text-[#1786B4] uppercase">Plan Pro Facturación</div>
                  <div class="text-2xl font-black text-[#04202E] dark:text-[#F2F9FC]">S/ 149.00 <span class="text-xs font-normal">/mes</span></div>
                  <p class="text-[#527588]">Incluye emisión automática de Factura Electrónica SUNAT y Guía de Remisión Transportista.</p>
                </div>
                <div class="bg-[#04202E] text-white p-5 rounded-2xl space-y-2">
                  <div class="font-bold text-[#4FB3DA] uppercase">Plan Enterprise SUNAT</div>
                  <div class="text-2xl font-black">S/ 349.00 <span class="text-xs font-normal text-sky-200">/mes</span></div>
                  <p class="text-slate-300">Facturación ilimitada, GRE Transportista, prioridad destacada y analítica avanzada.</p>
                </div>
              </div>

              <!-- Tabla de Suscripciones Activas -->
              <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-[#E1F2FA] dark:bg-[#114662] text-[#04202E] dark:text-[#F2F9FC] font-bold uppercase text-[10px]">
                    <tr>
                      <th class="py-3 px-4">Proveedor</th>
                      <th class="py-3 px-4">Plan Actual</th>
                      <th class="py-3 px-4">Facturación SUNAT + GRE</th>
                      <th class="py-3 px-4">Tarifa</th>
                      <th class="py-3 px-4">Estado</th>
                      <th class="py-3 px-4">Vencimiento</th>
                      <th class="py-3 px-4">Gestionar Plan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                    @for (sub of subscriptions(); track sub.id) {
                      <tr>
                        <td class="py-3 px-4">
                          <div class="font-bold text-[#04202E] dark:text-[#F2F9FC]">{{ sub.proveedorRazonSocial }}</div>
                          <div class="font-mono text-[10px] text-[#527588]">RUC {{ sub.proveedorRuc }}</div>
                        </td>
                        <td class="py-3 px-4 font-bold text-[#1786B4]">{{ sub.plan }}</td>
                        <td class="py-3 px-4">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="sub.incluyeFacturacionSunat ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                            {{ sub.incluyeFacturacionSunat ? '✓ Habilitado' : 'No incluido' }}
                          </span>
                        </td>
                        <td class="py-3 px-4 font-mono font-bold">S/ {{ sub.precioMensual | number:'1.2-2' }}</td>
                        <td class="py-3 px-4">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="sub.estado === 'ACTIVA' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                            {{ sub.estado }}
                          </span>
                        </td>
                        <td class="py-3 px-4 font-mono">{{ sub.fechaVencimiento | date:'dd/MM/yyyy' }}</td>
                        <td class="py-3 px-4">
                          <div class="flex items-center gap-1.5">
                            <select
                              [ngModel]="sub.plan"
                              (ngModelChange)="changePlan(sub.proveedorId, $event, sub.estado)"
                              class="px-2 py-1 border rounded-lg text-[11px] bg-white dark:bg-[#0A2535]"
                            >
                              <option value="BASICO_CATALOGO">BASICO_CATALOGO</option>
                              <option value="PRO_FACTURACION">PRO_FACTURACION</option>
                              <option value="ENTERPRISE_SUNAT">ENTERPRISE_SUNAT</option>
                            </select>
                            <select
                              [ngModel]="sub.estado"
                              (ngModelChange)="changePlan(sub.proveedorId, sub.plan, $event)"
                              class="px-2 py-1 border rounded-lg text-[11px] bg-white dark:bg-[#0A2535]"
                            >
                              <option value="ACTIVA">ACTIVA</option>
                              <option value="PRUEBA">PRUEBA</option>
                              <option value="VENCIDA">VENCIDA</option>
                              <option value="CANCELADA">CANCELADA</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- TAB 3: MODERACIÓN DE PRODUCTOS -->
          @if (activeTab() === 'products') {
            <div class="space-y-4">
              <div class="flex gap-2">
                <input
                  type="text"
                  [(ngModel)]="productSearch"
                  (keyup.enter)="loadProducts()"
                  placeholder="Buscar producto en todo el catálogo..."
                  class="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F3043] border border-[#CFE4EE] dark:border-[#1D4960] text-xs"
                />
                <button type="button" (click)="loadProducts()" class="px-5 py-2.5 rounded-xl bg-[#1786B4] text-white text-xs font-bold">
                  Buscar
                </button>
              </div>

              <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-[#E1F2FA] dark:bg-[#114662] font-bold uppercase text-[10px]">
                    <tr>
                      <th class="py-3 px-4">Producto</th>
                      <th class="py-3 px-4">Proveedor</th>
                      <th class="py-3 px-4">Categoría</th>
                      <th class="py-3 px-4 text-right">Precio Unit.</th>
                      <th class="py-3 px-4">Estado</th>
                      <th class="py-3 px-4 text-right">Moderación</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                    @for (p of products(); track p.id) {
                      <tr>
                        <td class="py-2.5 px-4 font-bold">{{ p.titulo }}</td>
                        <td class="py-2.5 px-4 text-[#527588]">{{ p.proveedorRazonSocial }}</td>
                        <td class="py-2.5 px-4">{{ p.categoriaNombre }}</td>
                        <td class="py-2.5 px-4 text-right font-mono">{{ p.moneda }} {{ p.precioUnitarioRef | number:'1.2-2' }}</td>
                        <td class="py-2.5 px-4">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [ngClass]="p.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'">
                            {{ p.estado }}
                          </span>
                        </td>
                        <td class="py-2.5 px-4 text-right">
                          @if (p.estado === 'ACTIVO') {
                            <button type="button" (click)="moderateProduct(p, 'OCULTO_POR_ADMIN')" class="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100">
                              Ocultar
                            </button>
                          } @else {
                            <button type="button" (click)="moderateProduct(p, 'ACTIVO')" class="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100">
                              Reactivar
                            </button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- TAB 4: PROVEEDORES -->
          @if (activeTab() === 'providers') {
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#E1F2FA] dark:bg-[#114662] font-bold uppercase text-[10px]">
                  <tr>
                    <th class="py-3 px-4">Empresa Proveedora</th>
                    <th class="py-3 px-4">RUC</th>
                    <th class="py-3 px-4">Ciudad</th>
                    <th class="py-3 px-4 text-center">Productos</th>
                    <th class="py-3 px-4">Verificado</th>
                    <th class="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                  @for (pr of providers(); track pr.proveedorId) {
                    <tr>
                      <td class="py-3 px-4 font-bold">{{ pr.razonSocial }}</td>
                      <td class="py-3 px-4 font-mono">{{ pr.ruc }}</td>
                      <td class="py-3 px-4">{{ pr.ciudad }}</td>
                      <td class="py-3 px-4 text-center font-bold">{{ pr.totalProductos }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="pr.verificado ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                          {{ pr.verificado ? '✓ Verificado' : 'Pendiente' }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <button type="button" (click)="toggleVerify(pr)" class="px-3 py-1 rounded-lg border border-[#1786B4] text-[#1786B4] font-bold hover:bg-sky-50">
                          {{ pr.verificado ? 'Quitar Verificación' : 'Verificar RUC' }}
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <!-- TAB 5: USUARIOS -->
          @if (activeTab() === 'users') {
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#E1F2FA] dark:bg-[#114662] font-bold uppercase text-[10px]">
                  <tr>
                    <th class="py-3 px-4">Usuario</th>
                    <th class="py-3 px-4">Correo</th>
                    <th class="py-3 px-4">Rol</th>
                    <th class="py-3 px-4">Estado</th>
                    <th class="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                  @for (u of users(); track u.id) {
                    <tr>
                      <td class="py-3 px-4 font-bold">{{ u.nombre }}</td>
                      <td class="py-3 px-4 font-mono">{{ u.correo }}</td>
                      <td class="py-3 px-4 font-bold text-[#1786B4]">{{ u.rol }}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [ngClass]="u.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                          {{ u.estado }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        @if (u.rol !== 'ADMIN') {
                          <button type="button" (click)="toggleUser(u)" class="px-3 py-1 rounded-lg border text-xs font-bold">
                            {{ u.estado === 'ACTIVO' ? 'Bloquear' : 'Activar' }}
                          </button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          <!-- TAB 6: ÓRDENES GLOBALES -->
          @if (activeTab() === 'orders') {
            <div class="bg-white dark:bg-[#0F3043] rounded-2xl border border-[#CFE4EE] dark:border-[#1D4960] overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-[#E1F2FA] dark:bg-[#114662] font-bold uppercase text-[10px]">
                  <tr>
                    <th class="py-3 px-4">Orden</th>
                    <th class="py-3 px-4">Comprador</th>
                    <th class="py-3 px-4">Medio de Pago</th>
                    <th class="py-3 px-4 text-center">Subórdenes</th>
                    <th class="py-3 px-4">Estado</th>
                    <th class="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E1F2FA] dark:divide-[#1D4960]">
                  @for (o of orders(); track o.ordenId) {
                    <tr>
                      <td class="py-3 px-4 font-mono font-bold">{{ o.codigoOrden }}</td>
                      <td class="py-3 px-4">
                        <div class="font-bold">{{ o.compradorNombre }}</div>
                        <div class="font-mono text-[10px] text-[#527588]">RUC {{ o.compradorRuc }}</div>
                      </td>
                      <td class="py-3 px-4">{{ o.metodoPago }}</td>
                      <td class="py-3 px-4 text-center font-bold">{{ o.cantidadSubordenes }}</td>
                      <td class="py-3 px-4 font-bold">{{ o.estado }}</td>
                      <td class="py-3 px-4 text-right font-mono font-black">S/ {{ o.montoTotal | number:'1.2-2' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        }
      </main>
    </div>
  `,
})
export class AdminPanelComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastStateService);
  private readonly router = inject(Router);

  public readonly activeTab = signal<AdminTab>('dashboard');
  public readonly isLoading = signal<boolean>(true);
  public readonly metrics = signal<AdminDashboardMetrics | null>(null);
  public readonly subscriptions = signal<AdminSubscriptionItem[]>([]);
  public readonly products = signal<AdminProductItem[]>([]);
  public readonly providers = signal<AdminProviderItem[]>([]);
  public readonly users = signal<AdminUserItem[]>([]);
  public readonly orders = signal<AdminOrderItem[]>([]);
  public productSearch = '';

  public readonly navItems: { id: AdminTab; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard y KPIs' },
    { id: 'subscriptions', icon: '💳', label: 'Suscripciones SaaS' },
    { id: 'products', icon: '📦', label: 'Moderar Productos' },
    { id: 'providers', icon: '🏢', label: 'Proveedores' },
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'orders', icon: '🧾', label: 'Órdenes Globales' },
  ];

  public ngOnInit(): void {
    this.refreshAll();
  }

  public switchTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  public getTabTitle(): string {
    return this.navItems.find(n => n.id === this.activeTab())?.label || 'Panel Administrativo';
  }

  public objectEntries(obj: Record<string, number> | undefined): [string, number][] {
    return obj ? Object.entries(obj) : [];
  }

  public refreshAll(): void {
    this.isLoading.set(true);
    this.adminApi.getDashboard().subscribe({
      next: (m) => {
        this.metrics.set(m);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
    this.adminApi.getSubscriptions().subscribe(s => this.subscriptions.set(s));
    this.adminApi.getProviders().subscribe(p => this.providers.set(p));
    this.adminApi.getUsers().subscribe(u => this.users.set(u));
    this.adminApi.getOrders().subscribe(o => this.orders.set(o));
    this.loadProducts();
  }

  public loadProducts(): void {
    this.adminApi.getProducts(this.productSearch, 0, 20).subscribe(p => this.products.set(p.contenido || []));
  }

  public changePlan(
    proveedorId: number,
    plan: AdminSubscriptionItem['plan'],
    estado: AdminSubscriptionItem['estado']
  ): void {
    this.adminApi.upsertSubscription(proveedorId, plan, estado).subscribe({
      next: () => {
        this.toast.success('Suscripción actualizada', `Plan ${plan} (${estado}) aplicado.`);
        this.refreshAll();
      },
      error: () => this.toast.error('Error', 'No se pudo actualizar la suscripción.'),
    });
  }

  public moderateProduct(p: AdminProductItem, nuevoEstado: string): void {
    const motivo = nuevoEstado === 'OCULTO_POR_ADMIN' ? 'Moderado desde Consola Admin' : 'Reactivado por Admin';
    this.adminApi.updateProductStatus(p.id, nuevoEstado, motivo).subscribe({
      next: () => {
        this.toast.success('Estado actualizado', `${p.titulo} → ${nuevoEstado}`);
        this.loadProducts();
        this.adminApi.getDashboard().subscribe(m => this.metrics.set(m));
      },
    });
  }

  public toggleVerify(pr: AdminProviderItem): void {
    this.adminApi.verifyProvider(pr.proveedorId, !pr.verificado, !pr.verificado).subscribe({
      next: () => {
        this.toast.success('Proveedor actualizado', `${pr.razonSocial}`);
        this.adminApi.getProviders().subscribe(list => this.providers.set(list));
      },
    });
  }

  public toggleUser(u: AdminUserItem): void {
    const nextState = u.estado === 'ACTIVO' ? 'BLOQUEADO' : 'ACTIVO';
    this.adminApi.updateUserStatus(u.id, nextState, 'Cambio administrativo').subscribe({
      next: () => {
        this.toast.success('Usuario actualizado', `${u.correo} → ${nextState}`);
        this.adminApi.getUsers().subscribe(list => this.users.set(list));
      },
    });
  }

  public logout(): void {
    this.authState.clearAuth();
    this.router.navigateByUrl('/auth/login');
  }
}
