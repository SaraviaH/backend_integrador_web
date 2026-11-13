import { Injectable, inject, signal } from '@angular/core';
import { CatalogApiService } from '../services/catalog-api.service';
import { ProductCard, CatalogFilterParams } from '../models/catalog.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogStateService {
  private readonly catalogApi = inject(CatalogApiService);

  // Filtros reactivos con Signals
  public readonly searchTerm = signal<string>('');
  public readonly selectedCategory = signal<string | number | null>(null);
  public readonly priceMin = signal<number | null>(null);
  public readonly priceMax = signal<number | null>(null);
  public readonly onlyInStock = signal<boolean>(false);
  public readonly sortBy = signal<string>('relevancia');
  public readonly currentPage = signal<number>(0);
  public readonly pageSize = signal<number>(12);

  // Estados de carga y datos
  public readonly products = signal<ProductCard[]>([]);
  public readonly totalElements = signal<number>(0);
  public readonly totalPages = signal<number>(1);
  public readonly isLoading = signal<boolean>(true);
  public readonly hasError = signal<boolean>(false);

  // Debounce para búsqueda por texto (300ms)
  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.currentPage.set(0);
      this.fetchProducts();
    });
  }

  public setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  public setCategory(catId: string | number | null): void {
    this.selectedCategory.set(catId);
    this.currentPage.set(0);
    this.fetchProducts();
  }

  public setPriceRange(min: number | null, max: number | null): void {
    this.priceMin.set(min);
    this.priceMax.set(max);
    this.currentPage.set(0);
    this.fetchProducts();
  }

  public setOnlyInStock(only: boolean): void {
    this.onlyInStock.set(only);
    this.currentPage.set(0);
    this.fetchProducts();
  }

  public setSort(sort: string): void {
    this.sortBy.set(sort);
    this.currentPage.set(0);
    this.fetchProducts();
  }

  public setPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.fetchProducts();
    }
  }

  public resetFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.onlyInStock.set(false);
    this.sortBy.set('relevancia');
    this.currentPage.set(0);
    this.fetchProducts();
  }

  public fetchProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const filter: CatalogFilterParams = {
      busqueda: this.searchTerm() || undefined,
      categoriaId: this.selectedCategory() ? Number(this.selectedCategory()) : undefined,
      precioMin: this.priceMin() ?? undefined,
      precioMax: this.priceMax() ?? undefined,
      soloConStock: this.onlyInStock() || undefined,
      page: this.currentPage(),
      size: this.pageSize(),
      sort: this.sortBy() !== 'relevancia' ? this.sortBy() : undefined,
    };

    this.catalogApi.getProducts(filter).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const items = res.content || res.contenido || [];
        const total = res.totalElements ?? res.totalElementos ?? items.length;
        const pages = res.totalPages ?? res.totalPaginas ?? Math.ceil(total / this.pageSize());

        if (items.length > 0) {
          this.products.set(items);
          this.totalElements.set(total);
          this.totalPages.set(pages || 1);
        } else if (!this.searchTerm() && !this.selectedCategory()) {
          // Fallback a catálogo demo inicial si la API aún no tiene datos cargados
          const mock = this.getFallbackProducts();
          this.products.set(mock);
          this.totalElements.set(mock.length);
          this.totalPages.set(1);
        } else {
          this.products.set([]);
          this.totalElements.set(0);
          this.totalPages.set(1);
        }
      },
      error: (_err) => {
        this.isLoading.set(false);
        // En desarrollo local sin backend activo, usar el catálogo de muestra
        const mock = this.getFallbackProducts();
        this.products.set(mock);
        this.totalElements.set(mock.length);
        this.totalPages.set(1);
      }
    });
  }

  private getFallbackProducts(): ProductCard[] {
    return [
      {
        id: 101,
        nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD',
        sku: 'LAP-DELL-5520-01',
        categoriaNombre: 'Laptops & Workstations',
        precioUnitario: 2399.00,
        precioMayorista: 2199.00,
        cantidadMinimaMayorista: 3,
        stockDisponible: 25,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=80',
        destacado: true
      },
      {
        id: 102,
        nombre: 'Tarjeta de video 8 GB GDDR6 Dual Fan',
        sku: 'GPU-RTX-3060-02',
        categoriaNombre: 'Componentes de Computadora',
        precioUnitario: 1199.00,
        precioMayorista: 1099.00,
        cantidadMinimaMayorista: 5,
        stockDisponible: 18,
        proveedorId: 2,
        proveedorRazonSocial: 'PC Global Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80',
        destacado: true
      },
      {
        id: 103,
        nombre: 'Unidad SSD NVMe 1 TB PCIe Gen4 x4 M.2 2280',
        sku: 'SSD-KNG-1TB-03',
        categoriaNombre: 'Almacenamiento',
        precioUnitario: 319.00,
        precioMayorista: 289.00,
        cantidadMinimaMayorista: 10,
        stockDisponible: 80,
        proveedorId: 3,
        proveedorRazonSocial: 'DataSolution SAC',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80',
        destacado: true
      },
      {
        id: 104,
        nombre: 'Monitor 27" IPS Full HD (1920 x 1080) 75Hz VESA',
        sku: 'MON-LG-27MP-04',
        categoriaNombre: 'Monitores & Pantallas',
        precioUnitario: 699.00,
        precioMayorista: 649.00,
        cantidadMinimaMayorista: 5,
        stockDisponible: 34,
        proveedorId: 4,
        proveedorRazonSocial: 'TecnoRed Mayorista',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80',
        destacado: true
      },
      {
        id: 105,
        nombre: 'Servidor Rack 1U Xeon Silver 4310 32GB RAM 2x480GB SSD',
        sku: 'SRV-HPE-DL20-05',
        categoriaNombre: 'Servidores & Redes',
        precioUnitario: 7850.00,
        precioMayorista: 7300.00,
        cantidadMinimaMayorista: 1,
        stockDisponible: 8,
        proveedorId: 3,
        proveedorRazonSocial: 'DataSolution SAC',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 106,
        nombre: 'Switch Administrable 24 Puertos Gigabit PoE+ 370W',
        sku: 'NET-CSCO-24P-06',
        categoriaNombre: 'Servidores & Redes',
        precioUnitario: 1890.00,
        precioMayorista: 1720.00,
        cantidadMinimaMayorista: 2,
        stockDisponible: 14,
        proveedorId: 2,
        proveedorRazonSocial: 'PC Global Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 107,
        nombre: 'Impresora Multifuncional de Tanque de Tinta EcoTank',
        sku: 'IMP-EPS-L5290-07',
        categoriaNombre: 'Impresión & Consumibles',
        precioUnitario: 1150.00,
        precioMayorista: 1020.00,
        cantidadMinimaMayorista: 3,
        stockDisponible: 22,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 108,
        nombre: 'Procesador Intel Core i7-14700 20 Núcleos LGA1700',
        sku: 'CPU-INT-14700-08',
        categoriaNombre: 'Componentes de Computadora',
        precioUnitario: 1650.00,
        precioMayorista: 1520.00,
        cantidadMinimaMayorista: 4,
        stockDisponible: 30,
        proveedorId: 2,
        proveedorRazonSocial: 'PC Global Perú',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 109,
        nombre: 'Memoria RAM DDR5 32GB (2x16GB) 6000MHz CL30',
        sku: 'RAM-CRU-32GB-09',
        categoriaNombre: 'Almacenamiento',
        precioUnitario: 480.00,
        precioMayorista: 435.00,
        cantidadMinimaMayorista: 6,
        stockDisponible: 45,
        proveedorId: 3,
        proveedorRazonSocial: 'DataSolution SAC',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 110,
        nombre: 'Workstation Móvil 16" Core i9 32GB RAM RTX A2000',
        sku: 'WS-THK-P16-10',
        categoriaNombre: 'Laptops & Workstations',
        precioUnitario: 8900.00,
        precioMayorista: 8200.00,
        cantidadMinimaMayorista: 1,
        stockDisponible: 5,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 111,
        nombre: 'Monitor Curvo 34" WQHD (3440 x 1440) 100Hz HDR',
        sku: 'MON-SMS-34C-11',
        categoriaNombre: 'Monitores & Pantallas',
        precioUnitario: 1450.00,
        precioMayorista: 1320.00,
        cantidadMinimaMayorista: 2,
        stockDisponible: 12,
        proveedorId: 4,
        proveedorRazonSocial: 'TecnoRed Mayorista',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&auto=format&fit=crop&q=80',
        destacado: false
      },
      {
        id: 112,
        nombre: 'Pack 4 Tóners Alta Capacidad Negro y Color LaserJet',
        sku: 'TON-HP-410X-12',
        categoriaNombre: 'Impresión & Consumibles',
        precioUnitario: 1280.00,
        precioMayorista: 1150.00,
        cantidadMinimaMayorista: 2,
        stockDisponible: 19,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        imagenPrincipalUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400&auto=format&fit=crop&q=80',
        destacado: false
      }
    ];
  }
}
