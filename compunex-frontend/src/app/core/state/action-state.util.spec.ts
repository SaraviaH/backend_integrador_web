import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActionTracker } from './action-state.util';
import { ToastStateService } from './toast-state.service';
import { CartStateService } from './cart-state.service';
import { ProductCard } from '../models/catalog.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

const SAMPLE_PRODUCT: ProductCard = {
  id: 901,
  sku: 'RAM-TEST-01',
  nombre: 'Memoria RAM Test 16GB',
  categoriaNombre: 'Memorias RAM',
  proveedorId: 1,
  proveedorRazonSocial: 'Tech B2B SAC',
  precioUnitario: 50,
  imagenPrincipalUrl: '/uploads/products/ram-corsair-vengeance-32gb-ddr5.jpg',
  stockDisponible: 2,
  destacado: false
};

describe('ActionTracker, ToastStateService & CartStateService protections', () => {
  beforeEach(async () => {
    localStorage.removeItem('compunex_b2b_cart');
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem('compunex_b2b_cart');
  });

  it('prevents duplicate concurrent operations per key while allowing independent keys and error retries', () => {
    const tracker = new ActionTracker<string>();

    expect(tracker.status('add-1')).toBe('idle');
    expect(tracker.start('add-1')).toBeTrue();
    expect(tracker.isLoading('add-1')).toBeTrue();

    // Segundo clic rápido sobre la misma acción debe bloquearse
    expect(tracker.start('add-1')).toBeFalse();

    // Acción independiente no se bloquea
    expect(tracker.start('upload-logo')).toBeTrue();
    expect(tracker.isLoading('upload-logo')).toBeTrue();

    // Tras un fallo, el botón vuelve a quedar disponible para reintentar
    tracker.fail('add-1');
    expect(tracker.isLoading('add-1')).toBeFalse();
    expect(tracker.status('add-1')).toBe('idle');
    expect(tracker.start('add-1')).toBeTrue();

    tracker.succeed('add-1', 0);
    expect(tracker.status('add-1')).toBe('idle');
    tracker.clearAll();
  });

  it('prevents rapid double-click on ProductCardComponent from emitting twice', () => {
    const fixture = TestBed.createComponent(ProductCardComponent);
    const component = fixture.componentInstance;
    component.product = SAMPLE_PRODUCT;
    let emitCount = 0;
    component.addToCart.subscribe(() => {
      emitCount++;
    });
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    button.click();
    fixture.detectChanges();

    expect(emitCount).toBe(1);
    expect(component.action.isSuccess('add')).toBeTrue();
    component.action.clearAll();
  });

  it('deduplicates active notifications with the same key and supports loading type', () => {
    const toast = TestBed.inject(ToastStateService);
    toast.clearAll();

    const loadingId = toast.loading('Subiendo imagen', 'Procesando archivo...', 'img-upload');
    expect(toast.toasts().length).toBe(1);
    expect(toast.toasts()[0].tipo).toBe('loading');

    // Actualizar por la misma clave reemplaza en lugar de apilar duplicados
    const successId = toast.success('Archivo cargado correctamente', 'Imagen lista.', 'img-upload');
    expect(successId).toBe(loadingId);
    expect(toast.toasts().length).toBe(1);
    expect(toast.toasts()[0].tipo).toBe('success');

    toast.clearAll();
  });

  it('enforces available stock limits on CartStateService.addItem without lying on max stock', () => {
    const cart = TestBed.inject(CartStateService);
    cart.clear();

    const r1 = cart.addItem(SAMPLE_PRODUCT, 1);
    expect(r1).toEqual({ added: true, addedQty: 1 });

    const r2 = cart.addItem(SAMPLE_PRODUCT, 2);
    expect(r2).toEqual({ added: true, addedQty: 1 });

    // Ya alcanzó stock máximo (2): no debe confirmar agregado falso
    const r3 = cart.addItem(SAMPLE_PRODUCT, 1);
    expect(r3).toEqual({ added: false, addedQty: 0, reason: 'MAX_STOCK' });
    expect(cart.totalItemsCount()).toBe(2);

    cart.clear();
  });
});
