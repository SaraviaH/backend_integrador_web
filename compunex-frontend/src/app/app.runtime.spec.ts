import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthStateService } from './core/state/auth-state.service';

describe('App routing & runtime render', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
        provideLocationMocks(),
      ],
    }).compileComponents();
  });

  it('should render public routes without runtime errors', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    for (const url of ['/', '/catalog', '/categories', '/carrito', '/auth/login', '/terminos', '/privacidad']) {
      await router.navigateByUrl(url);
      fixture.detectChanges();
      const text = (fixture.nativeElement as HTMLElement).textContent || '';
      expect(text.trim().length).withContext(`Route ${url} rendered empty`).toBeGreaterThan(20);
    }

    fixture.destroy();
  });

  it('should redirect protected alias routes to login when unauthenticated', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/comprobantes/1');
    fixture.detectChanges();
    expect(router.url).toContain('/auth/login');

    await router.navigateByUrl('/cuenta');
    fixture.detectChanges();
    expect(router.url).toContain('/auth/login');

    fixture.destroy();
  });

  it('should render provider panel routes when authenticated as ROLE_PROVEEDOR', async () => {
    const authState = TestBed.inject(AuthStateService);
    authState.setAuth({
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwcm92QGNvbXB1bmV4LnBlIiwicm9sIjoiUk9MRV9QUk9WRUVET1IifQ.sig',
      usuario: {
        nombre: 'Proveedor Demo',
        nombreCompleto: 'Proveedor Demo',
        correo: 'prov@compunex.pe',
        rol: 'ROLE_PROVEEDOR',
        tienePerfilProveedor: true,
        razonSocial: 'Tech SAC',
        ruc: '20601234567'
      }
    });

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    for (const url of ['/panel/dashboard', '/panel/products', '/panel/sales']) {
      await router.navigateByUrl(url);
      fixture.detectChanges();
      const text = (fixture.nativeElement as HTMLElement).textContent || '';
      expect(text.trim().length).withContext(`Route ${url} rendered empty`).toBeGreaterThan(20);
    }

    fixture.destroy();
  });
});
