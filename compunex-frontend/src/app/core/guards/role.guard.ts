import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../state/auth-state.service';
import { UserRole, normalizeUserRole } from '../models/auth.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authState = inject(AuthStateService);
    const router = inject(Router);

    if (!authState.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }

    const currentRole = authState.userRole();
    const normalizedAllowed = allowedRoles.map(r => normalizeUserRole(r));
    if (currentRole && normalizedAllowed.includes(normalizeUserRole(currentRole))) {
      return true;
    }

    return router.createUrlTree(['/forbidden']);
  };
};
