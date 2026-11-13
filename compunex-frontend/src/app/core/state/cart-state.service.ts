import { Injectable, signal, computed } from '@angular/core';
import { CartItem, ProviderCartGroup } from '../models/order.model';
import { ProductCard, ProductDetail } from '../models/catalog.model';

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

  // Subtotal base (antes de IGV)
  public readonly subtotal = computed(() => {
    const rawTotal = this._items().reduce((acc, item) => acc + item.subtotal, 0);
    // En B2B los precios se calculan: Base Imponible = Total Bruto / 1.18
    return Math.round((rawTotal / (1 + IGV_RATE)) * 100) / 100;
  });

  // IGV 18% calculado de forma transparente
  public readonly igv = computed(() => {
    const total = this.total();
    return Math.round((total - this.subtotal()) * 100) / 100;
  });

  // Total general con IGV
  public readonly total = computed(() =>
    Math.round(this._items().reduce((acc, item) => acc + item.subtotal, 0) * 100) / 100
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
          items: [],
          subtotal: 0,
          igv: 0,
          total: 0,
        };
        groupsMap.set(item.proveedorId, group);
      }
      group.items.push(item);
    }

    // Calcular montos por grupo de proveedor
    return Array.from(groupsMap.values()).map(group => {
      const groupTotal = Math.round(group.items.reduce((acc, it) => acc + it.subtotal, 0) * 100) / 100;
      const groupSubtotal = Math.round((groupTotal / (1 + IGV_RATE)) * 100) / 100;
      const groupIgv = Math.round((groupTotal - groupSubtotal) * 100) / 100;
      return {
        ...group,
        total: groupTotal,
        subtotal: groupSubtotal,
        igv: groupIgv,
      };
    });
  });

  public addItem(product: ProductCard | ProductDetail, cantidad: number = 1): void {
    const currentList = this._items();
    const existingIndex = currentList.findIndex(it => it.productoId === product.id);

    if (existingIndex > -1) {
      const updated = [...currentList];
      const existing = updated[existingIndex];
      const newQty = existing.cantidad + cantidad;
      updated[existingIndex] = {
        ...existing,
        cantidad: newQty,
        subtotal: Math.round(newQty * existing.precioUnitario * 100) / 100,
      };
      this.updateState(updated);
    } else {
      const newItem: CartItem = {
        productoId: product.id,
        nombre: product.nombre,
        sku: product.sku,
        precioUnitario: product.precioUnitario,
        cantidad,
        subtotal: Math.round(cantidad * product.precioUnitario * 100) / 100,
        proveedorId: product.proveedorId,
        proveedorRazonSocial: product.proveedorRazonSocial,
        imagenUrl: product.imagenPrincipalUrl,
        stockDisponible: product.stockDisponible,
      };
      this.updateState([...currentList, newItem]);
    }
  }

  public updateQuantity(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.removeItem(productoId);
      return;
    }
    const updated = this._items().map(item => {
      if (item.productoId === productoId) {
        return {
          ...item,
          cantidad,
          subtotal: Math.round(cantidad * item.precioUnitario * 100) / 100,
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
