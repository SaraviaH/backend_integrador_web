import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CheckoutStateService } from '../../core/state/checkout-state.service';
import { CartStateService } from '../../core/state/cart-state.service';
import { BillingStepComponent } from './billing-step/billing-step.component';
import { ReviewStepComponent } from './review-step/review-step.component';
import { ConfirmationStepComponent } from './confirmation-step/confirmation-step.component';

@Component({
  selector: 'app-checkout-wizard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BillingStepComponent,
    ReviewStepComponent,
    ConfirmationStepComponent
  ],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <a routerLink="/carrito" class="hover:text-[#2456C6] transition-colors">Carrito</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">Asistente de Checkout B2B</span>
      </nav>

      <!-- Indicador Visual de 3 Pasos (Stepper B2B) -->
      <div class="bg-white rounded-3xl border border-slate-200/80 p-5 md:p-6 shadow-xs">
        <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          
          <!-- Paso 1: Facturación -->
          <button
            type="button"
            (click)="goToStep(1)"
            [disabled]="checkoutState.currentStep() === 3"
            class="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-2xl transition-all"
            [class.bg-blue-50]="checkoutState.currentStep() === 1"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0"
              [class.bg-[#1E50C0]]="checkoutState.currentStep() >= 1"
              [class.text-white]="checkoutState.currentStep() >= 1"
              [class.bg-slate-100]="checkoutState.currentStep() < 1"
              [class.text-slate-400]="checkoutState.currentStep() < 1"
            >
              @if (checkoutState.currentStep() > 1) { ✓ } @else { 1 }
            </div>
            <div class="text-left hidden sm:block">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paso 1</span>
              <span class="text-xs font-bold text-[#142238]">Datos Facturación</span>
            </div>
          </button>

          <!-- Paso 2: Revisión Split Order -->
          <button
            type="button"
            (click)="goToStep(2)"
            [disabled]="checkoutState.currentStep() === 3 || !checkoutState.billingData()"
            class="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-2xl transition-all"
            [class.bg-blue-50]="checkoutState.currentStep() === 2"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0"
              [class.bg-[#1E50C0]]="checkoutState.currentStep() >= 2"
              [class.text-white]="checkoutState.currentStep() >= 2"
              [class.bg-slate-100]="checkoutState.currentStep() < 2"
              [class.text-slate-400]="checkoutState.currentStep() < 2"
            >
              @if (checkoutState.currentStep() > 2) { ✓ } @else { 2 }
            </div>
            <div class="text-left hidden sm:block">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paso 2</span>
              <span class="text-xs font-bold text-[#142238]">Revisión Pedido</span>
            </div>
          </button>

          <!-- Paso 3: Confirmación de Compra -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-2xl transition-all"
            [class.bg-emerald-50]="checkoutState.currentStep() === 3"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0"
              [class.bg-emerald-600]="checkoutState.currentStep() === 3"
              [class.text-white]="checkoutState.currentStep() === 3"
              [class.bg-slate-100]="checkoutState.currentStep() < 3"
              [class.text-slate-400]="checkoutState.currentStep() < 3"
            >
              3
            </div>
            <div class="text-left hidden sm:block">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paso 3</span>
              <span class="text-xs font-bold text-[#142238]">Confirmación</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ========================================================================= -->
      <!-- RENDERIZADO DEL PASO ACTIVO                                              -->
      <!-- ========================================================================= -->

      @switch (checkoutState.currentStep()) {
        
        <!-- PASO 1 (P-10): Facturación SUNAT -->
        @case (1) {
          <app-billing-step (nextStep)="onStep1Complete()" />
        }

        <!-- PASO 2 (P-11): Revisión y Split Order -->
        @case (2) {
          <app-review-step
            (prevStep)="goToStep(1)"
            (orderConfirmed)="onStep2Complete()"
          />
        }

        <!-- PASO 3 (P-12): Confirmación y Comprobantes -->
        @case (3) {
          <app-confirmation-step />
        }

      }

    </div>
  `
})
export class CheckoutWizardComponent implements OnInit {
  public readonly checkoutState = inject(CheckoutStateService);
  private readonly cartState = inject(CartStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    // Sincronizar paso según la URL si se ingresa directamente
    const currentUrl = this.router.url;
    if (currentUrl.includes('revision')) {
      this.checkoutState.setStep(2);
    } else if (currentUrl.includes('confirmacion')) {
      this.checkoutState.setStep(3);
    } else {
      this.checkoutState.setStep(1);
    }

    // Si el carrito está vacío y no estamos en confirmación, redirigir al carrito
    if (this.cartState.items().length === 0 && this.checkoutState.currentStep() !== 3) {
      this.router.navigate(['/carrito']);
    }
  }

  public goToStep(step: 1 | 2 | 3): void {
    this.checkoutState.setStep(step);
    if (step === 1) {
      this.router.navigate(['/checkout/datos-facturacion']);
    } else if (step === 2) {
      this.router.navigate(['/checkout/revision']);
    } else if (step === 3) {
      this.router.navigate(['/checkout/confirmacion']);
    }
  }

  public onStep1Complete(): void {
    this.goToStep(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  public onStep2Complete(): void {
    this.goToStep(3);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
