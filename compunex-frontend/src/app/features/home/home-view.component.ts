import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartStateService } from '../../core/state/cart-state.service';
import { HomeSearchService } from '../../core/state/home-search.service';

interface Slide {
  id: number;
  tituloPre: string;
  tituloDestacado: string;
  descripcion: string;
  botonTexto: string;
  botonRuta: string;
  imagenUrl: string;
}

interface CategoryCard {
  id: number;
  nombre: string;
  subtitulo?: string;
  imagenUrl: string;
  slug: string;
}

interface ProviderCard {
  id: number;
  nombre: string;
  especialidad: string;
  iniciales: string;
  colorBg: string;
}

interface CommunityPost {
  id: number;
  titulo: string;
  resumen: string;
  autor: string;
  tiempo: string;
  imagenUrl: string;
}

interface FeaturedProduct {
  id: number;
  nombre: string;
  proveedor: string;
  precio: number;
  pedidoMinimo: number;
  imagenUrl: string;
}

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-page">
      <section class="home-hero wrap" aria-label="Presentación de COMPUNEX">
        <div class="hero-copy">
          <span class="eyebrow"><span></span> COMUNIDAD MAYORISTA DE TECNOLOGÍA</span>
          <h1>{{ currentSlide().tituloPre }} <em>{{ currentSlide().tituloDestacado }}</em></h1>
          <p>{{ currentSlide().descripcion }}</p>
          <a href="#categorias" class="button-primary">Explorar categorías <span aria-hidden="true">↗</span></a>
          <div class="hero-controls" aria-label="Controles del carrusel">
            <button type="button" (click)="prevSlide()" aria-label="Diapositiva anterior">←</button>
            @for (slide of slides; track slide.id; let i = $index) {
              <button type="button" class="slide-dot" (click)="goToSlide(i)" [class.active]="activeSlideIndex() === i" [attr.aria-label]="'Ir a diapositiva ' + (i + 1)" [attr.aria-current]="activeSlideIndex() === i ? 'true' : null"><span></span></button>
            }
            <button type="button" (click)="nextSlide()" aria-label="Siguiente diapositiva">→</button>
            <button type="button" class="pause-button" (click)="togglePause()" [attr.aria-label]="isPaused() ? 'Reanudar carrusel' : 'Pausar carrusel'">{{ isPaused() ? 'Reproducir' : 'Pausar' }}</button>
          </div>
        </div>
        <div class="hero-visual">@for (slide of slides; track slide.id; let i = $index) { <img [src]="slide.imagenUrl" [alt]="activeSlideIndex() === i ? slide.tituloPre + ' ' + slide.tituloDestacado : ''" [class.is-active]="activeSlideIndex() === i" [attr.aria-hidden]="activeSlideIndex() !== i" /> }<div class="hero-visual-caption"><span>TECNOLOGÍA PARA TU NEGOCIO</span><strong>Conecta. Explora. Crece.</strong></div></div>
      </section>

      <section class="wrap home-section" id="categorias">
        <div class="section-heading"><div><span class="section-kicker">ENCUENTRA LO QUE NECESITAS</span><h2>Explora por categorías</h2><p>Todo para llevar tus proyectos al siguiente nivel.</p></div><span class="section-note">Catálogo próximamente <span aria-hidden="true">↗</span></span></div>
        <div class="category-grid">
          @for (cat of categories; track cat.id) {
            <article class="category-card"><div class="category-image"><img [src]="cat.imagenUrl" [alt]="cat.nombre" loading="lazy" /></div><div class="category-label"><h3>{{ cat.nombre }}</h3><span aria-hidden="true">↗</span></div></article>
          }
        </div>
      </section>

      <section class="community-section" id="comunidad">
        <div class="wrap community-grid"><div class="community-intro"><span class="section-kicker">CONEXIONES QUE SUMAN</span><h2>Una comunidad <em>para crecer</em></h2><p>Un espacio para descubrir productos, conocer proveedores y encontrar nuevas oportunidades para tu empresa.</p><span class="example-label">Contenido de muestra</span></div>
          <div class="community-card"><div class="card-heading"><h3>Conoce proveedores</h3><span>EMPRESAS</span></div>
            @for (prov of providers; track prov.id) { <div class="provider-row"><div class="provider-avatar" [ngClass]="prov.colorBg">{{ prov.iniciales }}</div><div><strong>{{ prov.nombre }}</strong><p>{{ prov.especialidad }}</p></div></div> }
          </div>
          <div class="community-card"><div class="card-heading"><h3>En la comunidad</h3><span>NOVEDADES</span></div>
            @for (post of communityPosts; track post.id) { <article class="post-row"><img [src]="post.imagenUrl" [alt]="post.titulo" loading="lazy" /><div><strong>{{ post.titulo }}</strong><p>{{ post.resumen }}</p><small>{{ post.autor }} · {{ post.tiempo }}</small></div></article> }
          </div>
        </div>
      </section>

      <section class="wrap home-section how-section" id="como-funciona"><div class="how-intro"><span class="section-kicker">ASÍ DE SIMPLE</span><h2>Conectar es el primer paso</h2><p>Una forma más cercana de descubrir el mundo mayorista de tecnología.</p></div><div class="steps"><article><span>01</span><h3>Explora</h3><p>Encuentra productos y categorías para tu empresa.</p></article><article><span>02</span><h3>Conecta</h3><p>Conoce a los proveedores de la comunidad.</p></article><article><span>03</span><h3>Compra</h3><p>Prepara tus pedidos en un solo lugar.</p></article></div></section>

      <section class="wrap home-section" id="productos"><div class="section-heading"><div><span class="section-kicker">HECHO PARA EMPRESAS</span><h2>Productos destacados</h2><p>{{ search.query().trim() ? 'Resultados de productos de ejemplo para “' + search.query() + '”.' : 'Una muestra de lo que podrás encontrar en COMPUNEX.' }}</p></div><span class="example-label">Productos de ejemplo</span></div><div class="product-grid">
        @for (prod of filteredProducts(); track prod.id) { <article class="product-card"><div class="product-image"><img [src]="prod.imagenUrl" [alt]="prod.nombre" loading="lazy" /></div><div class="product-info"><span class="product-supplier">{{ prod.proveedor }}</span><h3>{{ prod.nombre }}</h3><strong>S/ {{ prod.precio | number:'1.2-2' }} <small>/ unidad</small></strong><p>Pedido mínimo: {{ prod.pedidoMinimo }} unidades</p><span class="product-pending">Ficha próximamente</span></div></article> }
      </div>@if (filteredProducts().length === 0) { <p class="search-empty" role="status">No encontramos productos de ejemplo para esta búsqueda. Prueba con otro término.</p> }</section>
      <section class="wrap home-section"><div class="sell-banner"><div><span class="sell-kicker">CRECE CON COMPUNEX</span><h2>¿Quieres vender?<br /><em>Publica tus productos.</em></h2></div><div><p>Conecta con empresas del sector y lleva tu catálogo a nuevos compradores.</p><span class="sell-pending">Registro de proveedores próximamente →</span></div></div></section>
    </div>
  `
})
export class HomeViewComponent implements OnInit, OnDestroy {
  public readonly cartState = inject(CartStateService);
  public readonly search = inject(HomeSearchService);

  public filteredProducts(): FeaturedProduct[] {
    const query = this.search.query().trim().toLocaleLowerCase();
    return query ? this.featuredProducts.filter(product => `${product.nombre} ${product.proveedor}`.toLocaleLowerCase().includes(query)) : this.featuredProducts;
  }

  // Estado del Carrusel
  public activeSlideIndex = signal<number>(0);
  public isPaused = signal<boolean>(false);
  private autoSlideTimer: any;

  // Diapositivas con Hardware Realista
  public slides: Slide[] = [
    {
      id: 1,
      tituloPre: 'Conecta con el',
      tituloDestacado: 'mundo del hardware',
      descripcion: 'El marketplace mayorista del Perú para empresas de tecnología. Encuentra productos, proveedores y una comunidad especializada para impulsar tu negocio.',
      botonTexto: 'Explorar catálogo',
      botonRuta: '/catalog',
      // Laptop moderna con workstation y accesorios
      imagenUrl: '/images/compunex-hero.png'
    },
    {
      id: 2,
      tituloPre: 'Aprovisionamiento en',
      tituloDestacado: 'servidores y redes',
      descripcion: 'Infraestructura empresarial para centros de datos, racks de alta densidad y componentes certificados para proyectos corporativos.',
      botonTexto: 'Ver servidores',
      botonRuta: '/categories',
      // Servidores en rack
      imagenUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      tituloPre: 'Componentes y',
      tituloDestacado: 'almacenamiento masivo',
      descripcion: 'Tarjetas gráficas para estaciones de trabajo, memorias de alta frecuencia y unidades SSD NVMe de última generación con disponibilidad mayorista.',
      botonTexto: 'Ver componentes',
      botonRuta: '/catalog',
      // Componentes de PC / Hardware
      imagenUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // 6 Categorías Oficiales
  public categories: CategoryCard[] = [
    {
      id: 1,
      nombre: 'Laptops & Workstations',
      slug: 'laptops-workstations',
      imagenUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      nombre: 'Servidores & Redes',
      slug: 'servidores-redes',
      imagenUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      nombre: 'Monitores & Pantallas',
      slug: 'monitores-pantallas',
      imagenUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 4,
      nombre: 'Componentes',
      subtitulo: '(PC y Accesorios)',
      slug: 'componentes',
      imagenUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 5,
      nombre: 'Almacenamiento',
      subtitulo: '(SSD, HDD, Memorias)',
      slug: 'almacenamiento',
      imagenUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 6,
      nombre: 'Impresión & Consumibles',
      slug: 'impresion-consumibles',
      imagenUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&auto=format&fit=crop&q=80'
    }
  ];

  // Proveedores de Ejemplo (Ficticios)
  public providers: ProviderCard[] = [
    {
      id: 1,
      nombre: 'AndesTech Mayorista',
      especialidad: 'Laptops, componentes y accesorios',
      iniciales: 'AT',
      colorBg: 'bg-blue-600'
    },
    {
      id: 2,
      nombre: 'PC Global Perú',
      especialidad: 'Hardware y soluciones de redes',
      iniciales: 'PC',
      colorBg: 'bg-rose-600'
    },
    {
      id: 3,
      nombre: 'DataSolution SAC',
      especialidad: 'Almacenamiento y servidores',
      iniciales: 'DS',
      colorBg: 'bg-cyan-600'
    }
  ];

  // Publicaciones de la Comunidad (Sin likes ni comentarios)
  public communityPosts: CommunityPost[] = [
    {
      id: 1,
      titulo: '¿Qué GPUs recomiendan para estaciones de trabajo?',
      resumen: 'Buscamos opciones con buen rendimiento y disponibilidad para proyectos de diseño...',
      autor: 'Distribuidor TI',
      tiempo: 'Hace 2 días',
      imagenUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      titulo: 'Tendencias en almacenamiento SSD para este año',
      resumen: 'Compartimos un análisis de las opciones más demandadas en el mercado mayorista...',
      autor: 'TechMayorista',
      tiempo: 'Hace 4 días',
      imagenUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200&auto=format&fit=crop&q=80'
    }
  ];

  // 4 Productos Destacados
  public featuredProducts: FeaturedProduct[] = [
    {
      id: 101,
      nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD',
      proveedor: 'AndesTech Mayorista',
      precio: 2399.00,
      pedidoMinimo: 3,
      imagenUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 102,
      nombre: 'Tarjeta de video 8 GB GDDR6',
      proveedor: 'PC Global Perú',
      precio: 1199.00,
      pedidoMinimo: 5,
      imagenUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 103,
      nombre: 'Unidad SSD NVMe 1 TB PCIe Gen4',
      proveedor: 'DataSolution SAC',
      precio: 319.00,
      pedidoMinimo: 10,
      imagenUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 104,
      nombre: 'Monitor 27" IPS Full HD (1920 x 1080)',
      proveedor: 'TecnoRed Mayorista',
      precio: 699.00,
      pedidoMinimo: 5,
      imagenUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80'
    }
  ];

  public currentSlide(): Slide {
    return this.slides[this.activeSlideIndex()];
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.isPaused.set(true);
      return;
    }
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  public nextSlide(): void {
    const next = (this.activeSlideIndex() + 1) % this.slides.length;
    this.activeSlideIndex.set(next);
  }

  public prevSlide(): void {
    const prev = (this.activeSlideIndex() - 1 + this.slides.length) % this.slides.length;
    this.activeSlideIndex.set(prev);
  }

  public goToSlide(index: number): void {
    this.activeSlideIndex.set(index);
  }

  public togglePause(): void {
    this.isPaused.update(val => !val);
    if (this.isPaused()) {
      this.stopAutoSlide();

    } else {
      this.startAutoSlide();

    }
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      if (!this.isPaused()) {
        this.nextSlide();
      }
    }, 6000);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
    }
  }
}
