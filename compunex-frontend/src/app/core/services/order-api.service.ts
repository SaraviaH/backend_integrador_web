import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CheckoutRequest,
  CheckoutResponse,
  OrderDetail,
  OrderSummary,
  SuborderInvoice,
} from '../models/order.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public checkout(orderData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.baseUrl}/orders/checkout`, orderData).pipe(
      catchError(() => of(this.simulateCheckoutResponse(orderData)))
    );
  }

  private simulateCheckoutResponse(orderData: CheckoutRequest): CheckoutResponse {
    const ordenId = Math.floor(10000 + Math.random() * 90000);
    const subtotal = 4250.00;
    const igv = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + igv) * 100) / 100;

    const subordenes: SuborderInvoice[] = [
      {
        subordenId: ordenId + 1,
        proveedorId: 1,
        proveedorRazonSocial: 'AndesTech Mayorista',
        proveedorRuc: '20601234567',
        numeroFacturaSimulada: `F001-000${Math.floor(1000 + Math.random() * 9000)}`,
        estado: 'PENDIENTE_DESPACHO',
        subtotal: 2399.00,
        igv: 431.82,
        total: 2830.82,
        items: [
          {
            productoId: 101,
            nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM',
            cantidad: 1,
            precioUnitario: 2399.00,
            subtotal: 2399.00
          }
        ]
      },
      {
        subordenId: ordenId + 2,
        proveedorId: 2,
        proveedorRazonSocial: 'PC Global Perú',
        proveedorRuc: '20509876543',
        numeroFacturaSimulada: `F002-000${Math.floor(1000 + Math.random() * 9000)}`,
        estado: 'PENDIENTE_DESPACHO',
        subtotal: 1851.00,
        igv: 333.18,
        total: 2184.18,
        items: [
          {
            productoId: 102,
            nombre: 'Tarjeta de video 8 GB GDDR6 Dual Fan',
            cantidad: 1,
            precioUnitario: 1199.00,
            subtotal: 1199.00
          }
        ]
      }
    ];

    return {
      ordenId,
      codigoOrden: `ORD-2026-${ordenId}`,
      fechaEmision: new Date().toISOString(),
      totalGeneral: total,
      subtotalGeneral: subtotal,
      igvGeneral: igv,
      subordenes
    };
  }

  public getMyOrders(page: number = 0, size: number = 10): Observable<PaginatedResponse<OrderSummary>> {
    return this.http.get<PaginatedResponse<OrderSummary>>(
      `${this.baseUrl}/orders/me?page=${page}&size=${size}`
    );
  }

  public getOrderDetail(ordenId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.baseUrl}/orders/me/${ordenId}`).pipe(
      catchError(() => of(this.simulateOrderDetail(ordenId)))
    );
  }

  private simulateOrderDetail(ordenId: number): OrderDetail {
    const subtotal = 4250.00;
    const igv = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + igv) * 100) / 100;

    return {
      ordenId,
      codigoOrden: `ORD-2026-${ordenId}`,
      fechaEmision: new Date().toISOString(),
      rucFacturacion: '20601234567',
      razonSocialFacturacion: 'CORPORACION TECNOLOGICA DEL PERU SAC',
      direccionFiscal: 'Av. Las Begonias 441, Oficina 802, San Isidro, Lima',
      metodoPago: 'Transferencia Bancaria Directa B2B',
      estado: 'CONFIRMADA',
      subtotalGeneral: subtotal,
      igvGeneral: igv,
      totalGeneral: total,
      subordenes: [
        {
          subordenId: ordenId * 10 + 1,
          proveedorId: 1,
          proveedorRazonSocial: 'AndesTech Mayorista SAC',
          proveedorRuc: '20601234567',
          numeroFacturaSimulada: `F001-0000${Math.floor(1000 + Math.random() * 9000)}`,
          estado: 'PENDIENTE_DESPACHO',
          subtotal: 2399.00,
          igv: 431.82,
          total: 2830.82,
          items: [
            {
              productoId: 101,
              nombre: 'Laptop 15.6" Intel Core i5 16 GB RAM / 512 GB SSD (Dell Latitude 5520)',
              cantidad: 1,
              precioUnitario: 2399.00,
              subtotal: 2399.00
            }
          ]
        },
        {
          subordenId: ordenId * 10 + 2,
          proveedorId: 2,
          proveedorRazonSocial: 'PC Global Perú EIRL',
          proveedorRuc: '20509876543',
          numeroFacturaSimulada: `F002-0000${Math.floor(1000 + Math.random() * 9000)}`,
          estado: 'PENDIENTE_DESPACHO',
          subtotal: 1851.00,
          igv: 333.18,
          total: 2184.18,
          items: [
            {
              productoId: 102,
              nombre: 'Tarjeta de video 8 GB GDDR6 Dual Fan (RTX 3060 Ventus OC)',
              cantidad: 1,
              precioUnitario: 1199.00,
              subtotal: 1199.00
            },
            {
              productoId: 103,
              nombre: 'Unidad SSD NVMe 1 TB PCIe Gen4 x4 M.2 2280',
              cantidad: 2,
              precioUnitario: 326.00,
              subtotal: 652.00
            }
          ]
        }
      ]
    };
  }
}
