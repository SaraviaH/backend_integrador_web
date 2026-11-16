import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductPurchasePanelComponent } from './product-purchase-panel.component';
import { ProductDetail } from '../../../core/models/catalog.model';

describe('ProductPurchasePanelComponent', () => {
  let fixture: ComponentFixture<ProductPurchasePanelComponent>;
  let component: ProductPurchasePanelComponent;

  const mockProduct: ProductDetail = {
    id: 42,
    nombre: 'Corsair Vengeance DDR5 32GB 6000MHz',
    sku: 'COR-DDR5-32G',
    categoriaNombre: 'Memorias RAM',
    precioUnitario: 195,
    precioTotalCaja: 1950,
    unidadesPorPaqueteTexto: '10 unidades',
    pedidoMinimoTexto: '1 bandeja (10 unid.)',
    stockDisponible: 50,
    proveedorId: 1,
    proveedorRazonSocial: 'TechNova Mayorista S.A.C.',
    imagenPrincipalUrl: '/uploads/products/ram-corsair-vengeance-32gb.webp',
    descripcion: 'Memoria RAM DDR5 de alto rendimiento.',
    marca: 'Corsair',
    modelo: 'CMK32GX5M2B6000C36',
    especificaciones: [],
    imagenesSecundarias: [],
    garantiaMeses: 24,
    condicion: 'NUEVO',
    proveedorRuc: '20608945612'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPurchasePanelComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductPurchasePanelComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    component.quantity = 2;
    component.unitPrice = 195;
    component.subtotal = 390;
    component.igv = 70.2;
    component.totalWithIgv = 460.2;
    fixture.detectChanges();
  });

  it('debe renderizar dos paneles diferenciados (Configuración y Resumen Económico)', () => {
    const el: HTMLElement = fixture.nativeElement;
    const configPanel = el.querySelector('[data-testid="purchase-panel-config"]');
    const summaryPanel = el.querySelector('[data-testid="purchase-panel-summary"]');

    expect(configPanel).toBeTruthy();
    expect(summaryPanel).toBeTruthy();
    expect(configPanel?.textContent).toContain('195.00');
    expect(configPanel?.textContent).toContain('1,950.00');
    expect(configPanel?.textContent).toContain('1 bandeja (10 unid.)');
    expect(summaryPanel?.textContent).toContain('390.00');
    expect(summaryPanel?.textContent).toContain('70.20');
    expect(summaryPanel?.textContent).toContain('460.20');
  });

  it('debe emitir quantityChange al incrementar y decrementar sin bajar de 1', () => {
    const emitted: number[] = [];
    component.quantityChange.subscribe((val) => emitted.push(val));

    const el: HTMLElement = fixture.nativeElement;
    const increaseBtn = el.querySelector<HTMLButtonElement>('button[aria-label="Aumentar cantidad"]');
    const decreaseBtn = el.querySelector<HTMLButtonElement>('button[aria-label="Disminuir cantidad"]');

    increaseBtn?.click();
    decreaseBtn?.click();

    expect(emitted).toEqual([3, 1]);
  });

  it('debe emitir addToCart al pulsar el botón principal cuando hay stock', () => {
    let clicked = false;
    component.addToCart.subscribe(() => {
      clicked = true;
    });

    const btn = fixture.nativeElement.querySelector('[data-testid="add-to-order-btn"]') as HTMLButtonElement;
    btn.click();

    expect(clicked).toBeTrue();
    expect(btn.textContent).toContain('Agregar 2 un. a la Orden');
  });
});
