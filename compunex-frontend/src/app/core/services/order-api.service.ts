import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CheckoutRequest,
  CheckoutResponse,
  OrderDetail,
  OrderSummary,
} from '../models/order.model';
import { PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  public checkout(orderData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.baseUrl}/orders/checkout`, orderData);
  }

  public getMyOrders(page: number = 0, size: number = 10): Observable<PaginatedResponse<OrderSummary>> {
    return this.http.get<PaginatedResponse<OrderSummary>>(
      `${this.baseUrl}/orders/me?page=${page}&size=${size}`
    );
  }

  public getOrderDetail(ordenId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.baseUrl}/orders/me/${ordenId}`);
  }
}
