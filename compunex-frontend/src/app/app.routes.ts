import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PanelLayoutComponent } from './layout/panel-layout/panel-layout.component';
import { HomeViewComponent } from './features/home/home-view.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutWizardComponent } from './features/checkout/checkout-wizard.component';
import { InvoiceViewerComponent } from './features/invoices/invoice-viewer.component';
import { MyOrdersComponent } from './features/orders/my-orders/my-orders.component';
import { OrderDetailComponent } from './features/orders/order-detail/order-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterCompanyComponent } from './features/auth/register-company/register-company.component';
import { ForbiddenViewComponent } from './features/forbidden/forbidden-view.component';
import { NotFoundViewComponent } from './features/not-found/not-found-view.component';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Zona Pública / Tienda B2B
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeViewComponent,
        title: 'COMPUNEX B2B · Mayorista Tecnológico'
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        title: 'Categorías de Hardware · COMPUNEX B2B'
      },
      {
        path: 'categorias',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'catalog',
        component: CatalogComponent,
        title: 'Catálogo de Hardware B2B · COMPUNEX'
      },
      {
        path: 'catalog/:id',
        component: ProductDetailComponent,
        title: 'Detalle de Producto · COMPUNEX B2B'
      },
      {
        path: 'productos/:id',
        component: ProductDetailComponent,
        title: 'Detalle de Producto · COMPUNEX B2B'
      },
      {
        path: 'catalogo',
        redirectTo: 'catalog',
        pathMatch: 'full'
      },
      {
        path: 'carrito',
        component: CartComponent,
        title: 'Carrito de Compras B2B · COMPUNEX'
      },
      {
        path: 'cart',
        redirectTo: 'carrito',
        pathMatch: 'full'
      },
      {
        path: 'checkout',
        redirectTo: 'checkout/datos-facturacion',
        pathMatch: 'full'
      },
      {
        path: 'checkout/datos-facturacion',
        component: CheckoutWizardComponent,
        title: 'Datos de Facturación · COMPUNEX B2B'
      },
      {
        path: 'checkout/revision',
        component: CheckoutWizardComponent,
        title: 'Revisión del Pedido · COMPUNEX B2B'
      },
      {
        path: 'checkout/confirmacion',
        component: CheckoutWizardComponent,
        title: 'Confirmación de Compra · COMPUNEX B2B'
      },
      {
        path: 'pedidos/:id/comprobante',
        component: InvoiceViewerComponent,
        title: 'Factura Electrónica SUNAT · COMPUNEX B2B'
      },
      {
        path: 'comprobantes/:id',
        redirectTo: 'pedidos/:id/comprobante',
        pathMatch: 'full'
      },
      {
        path: 'cuenta/mis-compras',
        component: MyOrdersComponent,
        title: 'Mis Compras B2B · COMPUNEX'
      },
      {
        path: 'cuenta/mis-compras/:id',
        component: OrderDetailComponent,
        title: 'Detalle de Orden y Trazabilidad · COMPUNEX B2B'
      },
      {
        path: 'auth/login',
        component: LoginComponent,
        title: 'Iniciar Sesión · COMPUNEX B2B'
      },
      {
        path: 'auth/registro-empresa',
        component: RegisterCompanyComponent,
        title: 'Registrar Empresa · COMPUNEX B2B'
      },
      {
        path: 'forbidden',
        component: ForbiddenViewComponent,
        title: 'Acceso Denegado · COMPUNEX B2B'
      }
    ]
  },

  // Zona Privada / Panel Proveedor y Administrador (Protegida por Roles)
  {
    path: 'panel',
    component: PanelLayoutComponent,
    canActivate: [roleGuard(['ROLE_PROVEEDOR', 'ROLE_ADMIN'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: HomeViewComponent, // temporalmente reutilizado hasta Sprint-F11
        title: 'Panel Proveedor · COMPUNEX B2B'
      }
    ]
  },

  // Fallback 404
  {
    path: '**',
    component: NotFoundViewComponent,
    title: '404 No Encontrado · COMPUNEX B2B'
  }
];
