import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { ProductDetail } from '../../../../core/models/catalog.model';
import { ProductMetricBadgesComponent } from './components/product-metric-badges/product-metric-badges.component';

@Component({
  selector: 'app-provider-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductMetricBadgesComponent],
  template: `
    <div class="space-y-6">
      <!-- Encabezado y Navegación -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/panel/dashboard" class="hover:text-brand-primary transition-colors">Panel</a>
            <span>/</span>
            <a routerLink="/panel/products" class="hover:text-brand-primary transition-colors">Catálogo</a>
            <span>/</span>
            <span class="text-slate-800 font-medium truncate max-w-xs">Detalle de Producto</span>
          </nav>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">
              Ficha Técnica del Producto (P-22)
            </h1>
            @if (product(); as prod) {
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                SKU: {{ prod.sku }}
              </span>
            }
          </div>
        </div>

        @if (product(); as prod) {
          <div class="flex items-center gap-2.5">
            <a
              [routerLink]="['/panel/products', prod.id, 'edit']"
              class="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover shadow-xs transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Producto
            </a>
            <a
              routerLink="/panel/products"
              class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Volver al Listado
            </a>
          </div>
        }
      </div>

      <!-- 4 ESTADOS DE UI -->

      <!-- 1. CARGA -->
      @if (isLoading()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs animate-pulse space-y-6">
          <div class="grid grid-cols-4 gap-4">
            <div class="h-20 bg-slate-100 rounded-xl"></div>
            <div class="h-20 bg-slate-100 rounded-xl"></div>
            <div class="h-20 bg-slate-100 rounded-xl"></div>
            <div class="h-20 bg-slate-100 rounded-xl"></div>
          </div>
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
          <h2 class="text-base font-bold text-slate-900">Error al cargar la información del producto</h2>
          <p class="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            No se pudo encontrar el ítem de hardware solicitado en el catálogo de tu empresa.
          </p>
          <a
            routerLink="/panel/products"
            class="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primary-hover transition-colors inline-block"
          >
            Regresar al Catálogo
          </a>
        </div>
      }

      <!-- 3. VACÍO / NO ENCONTRADO -->
      @else if (!product()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <h2 class="text-base font-bold text-slate-900">Producto no disponible</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">El producto especificado no existe o fue descontinuado.</p>
          <a routerLink="/panel/products" class="text-xs text-brand-primary font-bold hover:underline">
            Ir a Mis Productos
          </a>
        </div>
      }

      <!-- 4. CON DATOS -->
      @else {
        @if (product(); as prod) {
          <!-- Badges de Métricas Dumb Component -->
          <app-product-metric-badges [product]="prod"></app-product-metric-badges>

          <!-- Tarjeta Principal con Imagen y Especificaciones -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Imagen Principal y Marca -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col items-center text-center">
              <div class="w-full aspect-square max-w-xs bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-4 overflow-hidden mb-4">
                <img
                  [src]="prod.imagenPrincipalUrl"
                  [alt]="prod.nombre"
                  class="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div class="w-full text-left space-y-2 border-t border-slate-100 pt-4">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-medium">Marca</span>
                  <span class="font-bold text-slate-800">{{ prod.marca || 'N/A' }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-medium">Modelo</span>
                  <span class="font-bold text-slate-800">{{ prod.modelo || 'N/A' }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-400 font-medium">Categoría</span>
                  <span class="font-bold text-brand-primary">{{ prod.categoriaNombre }}</span>
                </div>
              </div>
            </div>

            <!-- Información General y Especificaciones -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Descripción -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 class="text-sm font-bold text-slate-900 mb-2">Denominación del Ítem</h3>
                <p class="text-base font-extrabold text-slate-800 mb-4">{{ prod.nombre }}</p>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Descripción Comercial</h4>
                <p class="text-xs text-slate-600 leading-relaxed">{{ prod.descripcion }}</p>
              </div>

              <!-- Tabla de Especificaciones Técnicas -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Especificaciones Técnicas B2B
                </h3>

                @if (prod.especificaciones && prod.especificaciones.length > 0) {
                  <div class="border border-slate-200/70 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    @for (spec of prod.especificaciones; track spec.clave) {
                      <div class="flex flex-col sm:flex-row py-2.5 px-4 bg-slate-50/50 even:bg-white">
                        <span class="font-semibold text-slate-500 sm:w-1/3">{{ spec.clave }}</span>
                        <span class="text-slate-800 font-medium sm:w-2/3">{{ spec.valor }}</span>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-xs text-slate-400 italic">No hay especificaciones adicionales registradas.</p>
                }
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class ProviderProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly providerApi = inject(ProviderApiService);

  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);
  public readonly product = signal<ProductDetail | null>(null);

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProduct(id);
      } else {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  private loadProduct(id: number): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.providerApi.getMyProductById(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
