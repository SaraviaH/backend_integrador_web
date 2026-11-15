import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-legal-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <a routerLink="/" class="hover:text-[#2456C6] transition-colors">Inicio</a>
        <span>/</span>
        <span class="text-[#142238] font-bold">{{ title() }}</span>
      </nav>

      <header class="space-y-2 border-b border-slate-200 pb-6">
        <h1 class="text-2xl sm:text-3xl font-black text-[#142238] tracking-tight font-display">
          {{ title() }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500">
          Información aplicable al uso de la plataforma COMPUNEX B2B.
        </p>
      </header>

      @if (mode() === 'terms') {
        <section class="space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">1. Uso de la plataforma</h2>
            <p>COMPUNEX B2B conecta empresas compradoras con proveedores de tecnología. El acceso requiere una cuenta corporativa y el uso de la plataforma debe realizarse con fines comerciales lícitos.</p>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">2. Precios y disponibilidad</h2>
            <p>Los precios unitarios, totales de caja y condiciones de pedido mínimo son informados por cada proveedor. La disponibilidad de stock puede variar hasta la confirmación de la orden.</p>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">3. Órdenes y comprobantes</h2>
            <p>Cada compra se divide en subórdenes por proveedor. Los comprobantes electrónicos mostrados en la plataforma son simulados para fines académicos y de demostración.</p>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">4. Cuenta y seguridad</h2>
            <p>El usuario es responsable de mantener la confidencialidad de sus credenciales y de la información registrada en su cuenta corporativa.</p>
          </div>
        </section>
      } @else {
        <section class="space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">1. Datos recopilados</h2>
            <p>La plataforma utiliza los datos de registro de la empresa, información de contacto y datos de facturación necesarios para procesar órdenes de compra.</p>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">2. Finalidad</h2>
            <p>Los datos se utilizan para autenticar usuarios, generar órdenes, emitir comprobantes simulados y mostrar el historial de compras de la empresa.</p>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">3. Almacenamiento</h2>
            <p>La sesión y el carrito se almacenan localmente en el navegador. La información transaccional se procesa en el backend de la aplicación.</p>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#142238] mb-2">4. Contacto</h2>
            <p>Para consultas sobre el tratamiento de datos, contacta al equipo de COMPUNEX B2B a través de los canales de soporte de la plataforma.</p>
          </div>
        </section>
      }
    </div>
  `
})
export class LegalViewComponent {
  private readonly route = inject(ActivatedRoute);
  public readonly mode = signal<'terms' | 'privacy'>(
    this.route.snapshot.data['legal'] === 'privacy' ? 'privacy' : 'terms'
  );
  public readonly title = signal(
    this.mode() === 'privacy' ? 'Política de Privacidad' : 'Términos y Condiciones'
  );
}
