import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isLoggedIn();
  const isAuthPage = state.url.includes('/auth/login');

  if (isLoggedIn && isAuthPage) {
    return router.parseUrl('/dashboard');
  }
  if (!isLoggedIn && !isAuthPage) {
    return router.parseUrl('/auth/login');
  }
  return true;
};
