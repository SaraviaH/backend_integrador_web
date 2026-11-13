import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../state/auth-state.service';
import { ToastStateService } from '../state/toast-state.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);
  const toast = inject(ToastStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error?.mensaje) {
        errorMessage = error.error.mensaje;
      } else if (error.error?.detail) {
        errorMessage = error.error.detail;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error && typeof error.error === 'object') {
        const values = Object.values(error.error).filter((v): v is string => typeof v === 'string');
        if (values.length > 0) {
          errorMessage = values.join('. ');
        }
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }

      switch (error.status) {
        case 401:
          if (!req.url.includes('/auth/login')) {
            toast.warning('Sesión Expirada', 'Por favor vuelve a iniciar sesión.');
            authState.clearAuth();
            router.navigate(['/auth/login']);
          }
          break;

        case 403:
          toast.error('Acceso Denegado', 'No cuentas con los permisos suficientes para esta acción.');
          router.navigate(['/forbidden']);
          break;

        case 404:
          // Manejo contextual
          break;

        case 409:
          toast.warning('Conflicto de Negocio', errorMessage);
          break;

        case 500:
        case 502:
        case 503:
          toast.error('Error de Servidor', 'El servidor experimenta problemas. Intenta más tarde.');
          break;

        default:
          toast.error('Error', errorMessage);
          break;
      }

      return throwError(() => error);
    })
  );
};
