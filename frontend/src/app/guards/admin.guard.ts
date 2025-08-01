import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  // Redirect to orders page if logged in but not admin
  if (authService.isLoggedIn()) {
    return router.parseUrl('/orders');
  }
  
  // Redirect to login page if not logged in
  return router.parseUrl('/login');
};
