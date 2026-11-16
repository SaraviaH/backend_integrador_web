import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PanelLayoutComponent } from './layout/panel-layout/panel-layout.component';
import { roleGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Zona Pública / Tienda B2B
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home-view.component').then(m => m.HomeViewComponent),
        title: 'COMPUNEX B2B · Mayorista Tecnológico'
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
        title: 'Categorías de Hardware · COMPUNEX B2B'
      },
      {
        path: 'categorias',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
        title: 'Catálogo de Hardware B2B · COMPUNEX'
      },
      {
        path: 'catalog/:id',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        title: 'Detalle de Producto · COMPUNEX B2B'
      },
      {
        path: 'productos/:id',
        loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        title: 'Detalle de Producto · COMPUNEX B2B'
      },
      {
        path: 'catalogo',
        redirectTo: 'catalog',
        pathMatch: 'full'
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
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
        loadComponent: () => import('./features/checkout/checkout-wizard.component').then(m => m.CheckoutWizardComponent),
        canActivate: [authGuard],
        title: 'Datos de Facturación · COMPUNEX B2B'
      },
      {
        path: 'checkout/revision',
        loadComponent: () => import('./features/checkout/checkout-wizard.component').then(m => m.CheckoutWizardComponent),
        canActivate: [authGuard],
        title: 'Revisión del Pedido · COMPUNEX B2B'
      },
      {
        path: 'checkout/confirmacion',
        loadComponent: () => import('./features/checkout/checkout-wizard.component').then(m => m.CheckoutWizardComponent),
        canActivate: [authGuard],
        title: 'Confirmación de Compra · COMPUNEX B2B'
      },
      {
        path: 'pedidos/:id/comprobante',
        loadComponent: () => import('./features/invoices/invoice-viewer.component').then(m => m.InvoiceViewerComponent),
        canActivate: [authGuard],
        title: 'Factura Electrónica · COMPUNEX B2B'
      },
      {
        path: 'comprobantes/:id',
        redirectTo: 'pedidos/:id/comprobante',
        pathMatch: 'full'
      },
      {
        path: 'cuenta/mis-compras',
        loadComponent: () => import('./features/orders/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
        canActivate: [authGuard],
        title: 'Mis Compras B2B · COMPUNEX'
      },
      {
        path: 'cuenta/mis-compras/:id',
        loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
        canActivate: [authGuard],
        title: 'Detalle de Orden y Trazabilidad · COMPUNEX B2B'
      },
      {
        path: 'cuenta',
        redirectTo: 'cuenta/perfil',
        pathMatch: 'full'
      },
      {
        path: 'cuenta/perfil',
        loadComponent: () => import('./features/account/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard],
        title: 'Mi Cuenta y Perfil Corporativo · COMPUNEX B2B'
      },
      {
        path: 'cuenta/seguridad',
        loadComponent: () => import('./features/account/security/change-password.component').then(m => m.ChangePasswordComponent),
        canActivate: [authGuard],
        title: 'Seguridad y Contraseña · COMPUNEX B2B'
      },
      {
        path: 'cuenta/activar-proveedor',
        loadComponent: () => import('./features/account/activate-provider/activate-provider.component').then(m => m.ActivateProviderComponent),
        canActivate: [authGuard],
        title: 'Activar Perfil Proveedor · COMPUNEX B2B'
      },
      {
        path: 'auth/login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Iniciar Sesión · COMPUNEX B2B'
      },
      {
        path: 'auth/registro-empresa',
        loadComponent: () => import('./features/auth/register-company/register-company.component').then(m => m.RegisterCompanyComponent),
        title: 'Registrar Empresa · COMPUNEX B2B'
      },
      {
        path: 'forbidden',
        loadComponent: () => import('./features/forbidden/forbidden-view.component').then(m => m.ForbiddenViewComponent),
        title: 'Acceso Denegado · COMPUNEX B2B'
      },
      {
        path: '403',
        redirectTo: 'forbidden',
        pathMatch: 'full'
      },
      {
        path: 'terminos',
        loadComponent: () => import('./features/legal/legal-view.component').then(m => m.LegalViewComponent),
        data: { legal: 'terms' },
        title: 'Términos y Condiciones · COMPUNEX B2B'
      },
      {
        path: 'privacidad',
        loadComponent: () => import('./features/legal/legal-view.component').then(m => m.LegalViewComponent),
        data: { legal: 'privacy' },
        title: 'Política de Privacidad · COMPUNEX B2B'
      },
      {
        path: '404',
        loadComponent: () => import('./features/not-found/not-found-view.component').then(m => m.NotFoundViewComponent),
        title: '404 No Encontrado · COMPUNEX B2B'
      }
    ]
  },

  // Zona Privada / Panel Proveedor (Protegida estrictamente para ROLE_PROVEEDOR)
  {
    path: 'panel',
    component: PanelLayoutComponent,
    canActivate: [roleGuard(['ROLE_PROVEEDOR'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/provider/dashboard/provider-dashboard.component').then(m => m.ProviderDashboardComponent),
        title: 'Dashboard Métricas Proveedor · COMPUNEX B2B'
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/provider/company-profile/provider-company-profile.component').then(m => m.ProviderCompanyProfileComponent),
        title: 'Perfil Comercial y Branding · COMPUNEX B2B'
      },
      {
        path: 'perfil-comercial',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/provider/products/products-list/provider-products-list.component').then(m => m.ProviderProductsListComponent),
        title: 'Mis Productos B2B · COMPUNEX B2B'
      },
      {
        path: 'productos',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products/new',
        loadComponent: () => import('./features/provider/products/product-form/provider-product-form.component').then(m => m.ProviderProductFormComponent),
        title: 'Publicar Nuevo Producto · COMPUNEX B2B'
      },
      {
        path: 'productos/nuevo',
        redirectTo: 'products/new',
        pathMatch: 'full'
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./features/provider/products/product-detail/provider-product-detail.component').then(m => m.ProviderProductDetailComponent),
        title: 'Ficha de Producto · COMPUNEX B2B'
      },
      {
        path: 'productos/:id',
        redirectTo: 'products/:id',
        pathMatch: 'full'
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./features/provider/products/product-form/provider-product-form.component').then(m => m.ProviderProductFormComponent),
        title: 'Editar Producto · COMPUNEX B2B'
      },
      {
        path: 'productos/:id/editar',
        redirectTo: 'products/:id/edit',
        pathMatch: 'full'
      },
      {
        path: 'sales',
        loadComponent: () => import('./features/provider/sales/sales-list/provider-sales-list.component').then(m => m.ProviderSalesListComponent),
        title: 'Ventas Recibidas B2B · COMPUNEX B2B'
      },
      {
        path: 'ventas',
        redirectTo: 'sales',
        pathMatch: 'full'
      },
      {
        path: 'sales/:id',
        loadComponent: () => import('./features/provider/sales/sale-detail/provider-sale-detail.component').then(m => m.ProviderSaleDetailComponent),
        title: 'Atención de Despacho · COMPUNEX B2B'
      },
      {
        path: 'ventas/:id',
        redirectTo: 'sales/:id',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'proveedor',
    redirectTo: 'panel',
    pathMatch: 'prefix'
  },

  // Fallback 404
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found-view.component').then(m => m.NotFoundViewComponent),
    title: '404 No Encontrado · COMPUNEX B2B'
  }
];
