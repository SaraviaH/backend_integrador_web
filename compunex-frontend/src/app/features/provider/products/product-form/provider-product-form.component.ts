import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProviderApiService } from '../../../../core/services/provider-api.service';
import { CatalogApiService } from '../../../../core/services/catalog-api.service';
import { Category, CreateProductRequest, UpdateProductRequest } from '../../../../core/models/catalog.model';
import { ProductImageUploaderComponent } from './components/product-image-uploader/product-image-uploader.component';
import { ProductPricingCalcComponent } from './components/product-pricing-calc/product-pricing-calc.component';

@Component({
  selector: 'app-provider-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ProductImageUploaderComponent,
    ProductPricingCalcComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Encabezado de Navegación y Título -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <a routerLink="/panel/dashboard" class="hover:text-brand-primary transition-colors">Panel</a>
            <span>/</span>
            <a routerLink="/panel/products" class="hover:text-brand-primary transition-colors">Catálogo</a>
            <span>/</span>
            <span class="text-slate-800 font-medium">
              {{ isEditMode() ? 'Editar Producto (P-23)' : 'Nuevo Producto (P-21)' }}
            </span>
          </nav>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">
            {{ isEditMode() ? 'Editar Especificaciones del Ítem' : 'Publicar Nuevo Ítem en el Catálogo B2B' }}
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Completa la información técnica, stock disponible y precios mayoristas para la red de clientes corporativos.
          </p>
        </div>

        <a
          routerLink="/panel/products"
          class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors self-start md:self-auto"
        >
          Cancelar y Volver
        </a>
      </div>

      <!-- 4 ESTADOS DE UI -->

      <!-- 1. ESTADO DE CARGA INICIAL (EN MODO EDICIÓN) -->
      @if (isLoadingInitialData()) {
        <div class="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs animate-pulse">
          <div class="w-10 h-10 bg-slate-200 rounded-full mx-auto mb-3"></div>
          <p class="text-xs text-slate-500 font-semibold">Cargando datos del producto...</p>
        </div>
      }

      <!-- 2. ESTADO DE ERROR DE CARGA -->
      @else if (hasInitialError()) {
        <div class="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <h2 class="text-sm font-bold text-rose-700">No se pudo cargar la información del producto</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">El producto solicitado no existe o no tienes permisos de edición.</p>
          <a routerLink="/panel/products" class="text-xs text-brand-primary font-bold hover:underline">
            Volver a Mis Productos
          </a>
        </div>
      }

      <!-- 3 & 4. FORMULARIO CON DATOS / LISTO PARA EDICIÓN O CREACIÓN -->
      @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Mensaje de Error en Envío -->
          @if (submitError()) {
            <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
              <span>{{ submitError() }}</span>
              <button type="button" (click)="submitError.set(null)" class="text-rose-600 hover:text-rose-800 cursor-pointer">✕</button>
            </div>
          }

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Columna Izquierda: Información Principal y Precios (2 cols) -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Bloque 1: Datos Básicos -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-md bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-bold">1</span>
                  Identificación del Producto
                </h2>

                <div class="space-y-4">
                  <!-- Denominación del Producto -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">
                      Nombre o Denominación Comercial <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="nombre"
                      placeholder="Ej: Servidor Dell PowerEdge R450 Xeon Silver 4310 32GB"
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                    @if (form.get('nombre')?.touched && form.get('nombre')?.invalid) {
                      <p class="text-[11px] text-rose-500 mt-1">El nombre del producto es requerido (mínimo 4 caracteres).</p>
                    }
                  </div>

                  <!-- SKU y Categoría -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">
                        Código SKU Mayorista <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="sku"
                        placeholder="SRV-DELL-R450-01"
                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      />
                      @if (form.get('sku')?.touched && form.get('sku')?.invalid) {
                        <p class="text-[11px] text-rose-500 mt-1">El código SKU es obligatorio.</p>
                      }
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">
                        Categoría de Hardware <span class="text-rose-500">*</span>
                      </label>
                      <select
                        formControlName="categoriaId"
                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      >
                        <option [ngValue]="null" disabled>Selecciona una categoría</option>
                        @for (cat of categories(); track cat.id) {
                          <option [value]="cat.id">{{ cat.nombre }}</option>
                        }
                      </select>
                      @if (form.get('categoriaId')?.touched && form.get('categoriaId')?.invalid) {
                        <p class="text-[11px] text-rose-500 mt-1">Debes seleccionar una categoría.</p>
                      }
                    </div>
                  </div>

                  <!-- Marca y Modelo -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">
                        Marca <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="marca"
                        placeholder="Dell, HP, Lenovo, ASUS..."
                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-slate-700 mb-1">
                        Modelo del Fabricante <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="modelo"
                        placeholder="PowerEdge R450"
                        class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  <!-- Descripción -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">
                      Descripción Comercial y Resumen Técnico <span class="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows="3"
                      formControlName="descripcion"
                      placeholder="Indica las principales características comerciales, conectividad, tipo de factor de forma y aplicaciones recomendadas..."
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    ></textarea>
                    @if (form.get('descripcion')?.touched && form.get('descripcion')?.invalid) {
                      <p class="text-[11px] text-rose-500 mt-1">La descripción debe tener al menos 10 caracteres.</p>
                    }
                  </div>
                </div>
              </div>

              <!-- Bloque 2: Precios, Escalas y SUNAT -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-md bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-bold">2</span>
                  Estructura de Precios B2B
                </h2>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <!-- Precio Unitario -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">
                      Precio Lista (S/ con IGV) <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-xs font-bold text-slate-400">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        formControlName="precioUnitario"
                        placeholder="2399.00"
                        class="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  <!-- Precio Mayorista -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">
                      Precio Escalar Mayorista (S/)
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-xs font-bold text-slate-400">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        formControlName="precioMayorista"
                        placeholder="2199.00"
                        class="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  <!-- Cantidad Mínima -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">
                      Mínimo Mayorista (unid)
                    </label>
                    <input
                      type="number"
                      min="2"
                      formControlName="cantidadMinimaMayorista"
                      placeholder="5"
                      class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <!-- Simulador de precios Dumb Component -->
                <app-product-pricing-calc
                  [precioUnitario]="form.get('precioUnitario')?.value || 0"
                  [precioMayorista]="form.get('precioMayorista')?.value"
                  [cantidadMinima]="form.get('cantidadMinimaMayorista')?.value"
                ></app-product-pricing-calc>
              </div>
            </div>

            <!-- Columna Derecha: Imagen, Inventario y Garantía (1 col) -->
            <div class="space-y-6">
              <!-- Subida de Imagen Principal Dumb Component -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <app-product-image-uploader
                  [currentUrl]="form.get('urlImagen')?.value"
                  (imageUrlChange)="onImageUrlChanged($event)"
                ></app-product-image-uploader>
                @if (form.get('urlImagen')?.touched && form.get('urlImagen')?.invalid) {
                  <p class="text-[11px] text-rose-500 mt-2">La imagen principal es requerida.</p>
                }
              </div>

              <!-- Inventario y Logística -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-md bg-brand-primary/10 text-brand-primary text-xs flex items-center justify-center font-bold">3</span>
                  Inventario & Garantía
                </h2>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    Stock Disponible en Almacén <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    formControlName="stockDisponible"
                    placeholder="25"
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  />
                  @if (form.get('stockDisponible')?.touched && form.get('stockDisponible')?.invalid) {
                    <p class="text-[11px] text-rose-500 mt-1">El stock debe ser un valor igual o mayor a 0.</p>
                  }
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">
                    Meses de Garantía Corporativa <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    formControlName="garantiaMeses"
                    placeholder="36"
                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                  />
                </div>
              </div>

              <!-- Botones de Acción / Guardar -->
              <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <button
                  type="submit"
                  [disabled]="isSubmitting() || form.invalid"
                  class="w-full py-3 px-4 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-xs hover:bg-brand-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  @if (isSubmitting()) {
                    <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Guardando producto...</span>
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ isEditMode() ? 'Actualizar Producto' : 'Publicar Producto' }}</span>
                  }
                </button>

                <a
                  routerLink="/panel/products"
                  class="w-full py-2.5 px-4 text-center block text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Descartar Cambios
                </a>
              </div>
            </div>
          </div>
        </form>
      }
    </div>
  `
})
export class ProviderProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly providerApi = inject(ProviderApiService);
  private readonly catalogApi = inject(CatalogApiService);

  public readonly isEditMode = signal<boolean>(false);
  public readonly productId = signal<number | null>(null);
  public readonly categories = signal<Category[]>([]);
  public readonly isLoadingInitialData = signal<boolean>(false);
  public readonly hasInitialError = signal<boolean>(false);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly submitError = signal<string | null>(null);

  public readonly form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(4)]],
    sku: ['', [Validators.required]],
    categoriaId: [null, [Validators.required]],
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    precioUnitario: [null, [Validators.required, Validators.min(1)]],
    precioMayorista: [null],
    cantidadMinimaMayorista: [5],
    stockDisponible: [0, [Validators.required, Validators.min(0)]],
    garantiaMeses: [12, [Validators.required, Validators.min(1)]],
    urlImagen: ['', [Validators.required]]
  });

  public ngOnInit(): void {
    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.productId.set(Number(id));
        this.loadProductData(Number(id));
      }
    });
  }

  private loadCategories(): void {
    this.catalogApi.getCategories().subscribe({
      next: (cats) => this.categories.set(cats || []),
      error: () => this.categories.set([
        { id: 1, nombre: 'Laptops & Workstations' },
        { id: 2, nombre: 'Servidores & Almacenamiento' },
        { id: 3, nombre: 'Componentes & GPUs' },
        { id: 4, nombre: 'Monitores & Pantallas' },
        { id: 5, nombre: 'Networking & Conectividad' }
      ])
    });
  }

  private loadProductData(id: number): void {
    this.isLoadingInitialData.set(true);
    this.providerApi.getMyProductById(id).subscribe({
      next: (res) => {
        const p = res.data;
        this.form.patchValue({
          nombre: p.nombre,
          sku: p.sku,
          categoriaId: 1,
          marca: p.marca,
          modelo: p.modelo,
          descripcion: p.descripcion,
          precioUnitario: p.precioUnitario,
          precioMayorista: p.precioMayorista,
          cantidadMinimaMayorista: p.cantidadMinimaMayorista || 5,
          stockDisponible: p.stockDisponible,
          garantiaMeses: p.garantiaMeses || 12,
          urlImagen: p.imagenPrincipalUrl
        });
        this.isLoadingInitialData.set(false);
      },
      error: () => {
        this.hasInitialError.set(true);
        this.isLoadingInitialData.set(false);
      }
    });
  }

  public onImageUrlChanged(url: string): void {
    this.form.patchValue({ urlImagen: url });
    this.form.get('urlImagen')?.markAsDirty();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const val = this.form.value;

    if (this.isEditMode() && this.productId()) {
      const updateData: UpdateProductRequest = {
        id: this.productId()!,
        nombre: val.nombre,
        sku: val.sku,
        categoriaId: Number(val.categoriaId),
        precioUnitario: Number(val.precioUnitario),
        precioMayorista: val.precioMayorista ? Number(val.precioMayorista) : undefined,
        cantidadMinimaMayorista: val.cantidadMinimaMayorista ? Number(val.cantidadMinimaMayorista) : undefined,
        stockDisponible: Number(val.stockDisponible),
        descripcion: val.descripcion,
        marca: val.marca,
        modelo: val.modelo,
        urlImagen: val.urlImagen,
        garantiaMeses: Number(val.garantiaMeses)
      };

      this.providerApi.updateProduct(this.productId()!, updateData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/panel/products']);
        },
        error: () => {
          this.submitError.set('Ocurrió un error al actualizar el producto.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      const createData: CreateProductRequest = {
        nombre: val.nombre,
        sku: val.sku,
        categoriaId: Number(val.categoriaId) || 1,
        precioUnitario: Number(val.precioUnitario),
        precioMayorista: val.precioMayorista ? Number(val.precioMayorista) : undefined,
        cantidadMinimaMayorista: val.cantidadMinimaMayorista ? Number(val.cantidadMinimaMayorista) : undefined,
        stockDisponible: Number(val.stockDisponible),
        descripcion: val.descripcion,
        marca: val.marca,
        modelo: val.modelo,
        urlImagen: val.urlImagen,
        garantiaMeses: Number(val.garantiaMeses) || 12
      };

      this.providerApi.createProduct(createData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/panel/products']);
        },
        error: () => {
          this.submitError.set('Ocurrió un error al registrar el nuevo producto.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
