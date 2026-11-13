export interface Category {
  id: string | number;
  nombre: string;
  descripcion?: string;
  icono?: string;
  slug?: string;
  totalProductos?: number;
  subcategorias?: Subcategory[];
}

export interface Subcategory {
  id: string | number;
  categoriaId?: string | number;
  nombre: string;
  slug?: string;
  descripcion?: string;
}

export interface ProductSpecification {
  clave: string;
  valor: string;
}

export interface ProductCard {
  id: number;
  nombre: string;
  sku: string;
  categoriaNombre: string;
  precioUnitario: number;
  precioMayorista?: number;
  cantidadMinimaMayorista?: number;
  stockDisponible: number;
  proveedorId: number;
  proveedorRazonSocial: string;
  imagenPrincipalUrl: string;
  destacado?: boolean;
}

export interface ProductDetail extends ProductCard {
  descripcion: string;
  marca: string;
  modelo: string;
  especificaciones: ProductSpecification[];
  imagenesSecundarias: string[];
  garantiaMeses: number;
  condicion: 'NUEVO' | 'REACONDICIONADO_CERTIFICADO';
  proveedorRuc: string;
  proveedorCalificacion?: number;
}

export interface CatalogFilterParams {
  busqueda?: string;
  categoriaId?: number;
  precioMin?: number;
  precioMax?: number;
  proveedorId?: number;
  soloConStock?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreateProductRequest {
  nombre: string;
  sku: string;
  categoriaId: number;
  precioUnitario: number;
  precioMayorista?: number;
  cantidadMinimaMayorista?: number;
  stockDisponible: number;
  descripcion: string;
  marca: string;
  modelo: string;
  urlImagen: string; // URL obtenida previamente de /api/v1/media/upload (folder 'products')
  garantiaMeses?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

