import { Injectable, signal, inject } from '@angular/core';
import { CheckoutResponse } from '../models/order.model';
import { AuthStateService } from './auth-state.service';

export interface CheckoutBillingData {
  ruc: string;
  razonSocial: string;
  direccionFiscal: string;
  departamento: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoCorreo: string;
  metodoPagoSimulado: 'TRANSFERENCIA_BANCARIA' | 'LINEA_CREDITO_B2B' | 'TARJETA_EMPRESARIAL';
  notasPedido?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutStateService {
  private readonly authState = inject(AuthStateService);

  public readonly currentStep = signal<1 | 2 | 3>(1);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly billingData = signal<CheckoutBillingData | null>(this.getDefaultBilling());
  public readonly confirmedOrder = signal<CheckoutResponse | null>(null);

  constructor() {
    // Si el usuario se loguea o cambia su sesión, actualizar datos fiscales
    const user = this.authState.currentUser();
    if (user && user.ruc) {
      this.billingData.set({
        ruc: user.ruc,
        razonSocial: user.razonSocial || user.nombreCompleto || 'EMPRESA B2B SAC',
        direccionFiscal: user.direccion || 'Av. República de Panamá 3500, San Isidro, Lima',
        departamento: 'Lima',
        contactoNombre: user.nombreCompleto || user.nombre || '',
        contactoTelefono: user.telefono || '999888777',
        contactoCorreo: user.correo || '',
        metodoPagoSimulado: 'TRANSFERENCIA_BANCARIA',
        notasPedido: ''
      });
    }
  }

  public setBillingData(data: CheckoutBillingData): void {
    this.billingData.set(data);
  }

  public setStep(step: 1 | 2 | 3): void {
    this.currentStep.set(step);
  }

  public setConfirmedOrder(order: CheckoutResponse): void {
    this.confirmedOrder.set(order);
  }

  public reset(): void {
    this.currentStep.set(1);
    this.isSubmitting.set(false);
    this.confirmedOrder.set(null);
  }

  private getDefaultBilling(): CheckoutBillingData {
    return {
      ruc: '20601234567',
      razonSocial: 'CORPORACION TECNOLOGICA DEL PERU SAC',
      direccionFiscal: 'Av. Las Begonias 441, Oficina 802, San Isidro, Lima',
      departamento: 'Lima',
      contactoNombre: 'Ing. Carlos Mendoza',
      contactoTelefono: '993456789',
      contactoCorreo: 'compras@ciatecperu.pe',
      metodoPagoSimulado: 'TRANSFERENCIA_BANCARIA',
      notasPedido: 'Horario de recepción mayorista: Lunes a Viernes de 8:30 a 17:00.'
    };
  }
}
