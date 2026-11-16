import { Injectable, signal, computed } from '@angular/core';
import { CartItem, ProviderCartGroup } from '../models/order.model';
import { ProductCard, ProductDetail } from '../models/catalog.model';

export interface AddCartItemResult {
  added: boolean;
  addedQty: number;
  reason?: 'OUT_OF_STOCK' | 'MAX_STOCK';
}

const CART_KEY = 'compunex_b2b_cart';
const IGV_RATE = 0.18;

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private readonly _items = signal<CartItem[]>(this.getStoredItems());

  public readonly items = this._items.asReadonly();

  // Total de unidades en carrito
  public readonly totalItemsCount = computed(() =>
    this._items().reduce((acc, item) => acc + item.cantidad, 0)
  );

  // Agrupación de ítems por Proveedor (Fundamento del Split Order B2B)
  public readonly itemsByProvider = computed<ProviderCartGroup[]>(() => {
    const groupsMap = new Map<number, ProviderCartGroup>();

    for (const item of this._items()) {
      let group = groupsMap.get(item.proveedorId);
      if (!group) {
        group = {
          proveedorId: item.proveedorId,
          proveedorRazonSocial: item.proveedorRazonSocial,
          moneda: item.moneda || 'PEN',
          items: [],
          subtotal: 0,
          igv: 0,
          total: 0,
        };
        groupsMap.set(item.proveedorId, group);
      }
      group.items.push(item);
    }

    // Calcular montos por grupo de proveedor: subtotal -> +18% IGV -> total
    return Array.from(groupsMap.values()).map(group => {
      const groupSubtotal = Math.round(group.items.reduce((acc, it) => acc + it.subtotal, 0) * 100) / 100;
      const groupIgv = Math.round(groupSubtotal * IGV_RATE * 100) / 100;
      const groupTotal = Math.round((groupSubtotal + groupIgv) * 100) / 100;
      return {
        ...group,
        total: groupTotal,
        subtotal: groupSubtotal,
        igv: groupIgv,
      };
    });
  });

  // Subtotal base (antes de IGV): suma de subtotales por proveedor (alineado con SplitOrderCalculator en backend)
  public readonly subtotal = computed(() =>
    Math.round(this.itemsByProvider().reduce((acc, g) => acc + g.subtotal, 0) * 100) / 100
  );

  // IGV 18% total (suma de IGV por suborden/proveedor, alineado con SplitOrderCalculator en backend)
  public readonly igv = computed(() =>
    Math.round(this.itemsByProvider().reduce((acc, g) => acc + g.igv, 0) * 100) / 100
  );

  // Total general con IGV (suma de totales por suborden/proveedor)
  public readonly total = computed(() =>
    Math.round(this.itemsByProvider().reduce((acc, g) => acc + g.total, 0) * 100) / 100
  );

  public readonly cartCurrency = computed(() => {
    const first = this._items().find(it => !!it.moneda);
    return (first?.moneda || 'PEN').toUpperCase();
  });

  public readonly hasMixedCurrencies = computed(() => {
    const currencies = new Set(
      this._items().map(it => (it.moneda || 'PEN').trim().toUpperCase())
    );
    return currencies.size > 1;
  });

  public addItem(product: ProductCard | ProductDetail, cantidad: number = 1): AddCartItemResult {
    const requested = Math.max(1, Math.floor(Number(cantidad) || 1));
    if (product.stockDisponible === 0) {
      return { added: false, addedQty: 0, reason: 'OUT_OF_STOCK' };
    }

    const currentList = this._items();
    const existingIndex = currentList.findIndex(it => it.productoId === product.id);
    const existing = existingIndex > -1 ? currentList[existingIndex] : undefined;
    const maxStock = product.stockDisponible ?? existing?.stockDisponible;

    if (existing) {
      const remaining = maxStock != null ? maxStock - existing.cantidad : requested;
      if (remaining <= 0) {
        return { added: false, addedQty: 0, reason: 'MAX_STOCK' };
      }

      const addedQty = Math.min(requested, remaining);
      const newQty = existing.cantidad + addedQty;
      const updated = [...currentList];
      updated[existingIndex] = {
        ...existing,
        cantidad: newQty,
        stockDisponible: maxStock,
        subtotal: Math.round(newQty * existing.precioUnitario * 100) / 100,
      };
      this.updateState(updated);
      return { added: true, addedQty };
    }

    const addedQty = maxStock != null ? Math.min(requested, maxStock) : requested;
    if (addedQty <= 0) {
      return { added: false, addedQty: 0, reason: 'OUT_OF_STOCK' };
    }

    const newItem: CartItem = {
      productoId: product.id,
      nombre: product.nombre,
      sku: product.sku,
      precioUnitario: product.precioUnitario,
      moneda: product.moneda || 'PEN',
      cantidad: addedQty,
      subtotal: Math.round(addedQty * product.precioUnitario * 100) / 100,
      proveedorId: product.proveedorId,
      proveedorRazonSocial: product.proveedorRazonSocial,
      imagenUrl: product.imagenPrincipalUrl,
      stockDisponible: product.stockDisponible,
    };
    this.updateState([...currentList, newItem]);
    return { added: true, addedQty };
  }

  public updateQuantity(productoId: number, cantidad: number): void {
    const parsed = Math.floor(Number(cantidad) || 0);
    if (parsed <= 0) {
      this.removeItem(productoId);
      return;
    }
    const updated = this._items().map(item => {
      if (item.productoId === productoId) {
        const clamped = item.stockDisponible != null ? Math.min(parsed, item.stockDisponible) : parsed;
        return {
          ...item,
          cantidad: clamped,
          subtotal: Math.round(clamped * item.precioUnitario * 100) / 100,
        };
      }
      return item;
    });
    this.updateState(updated);
  }

  public removeItem(productoId: number): void {
    const filtered = this._items().filter(it => it.productoId !== productoId);
    this.updateState(filtered);
  }

  public clear(): void {
    this.updateState([]);
  }

  private updateState(items: CartItem[]): void {
    this._items.set(items);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage:', e);
    }
  }

  private getStoredItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
