import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Allow access if user is logged in but not an admin
  if (authService.isLoggedIn() && !authService.isAdmin()) {
    return true;
  }

  // Redirect admin to orders page
  if (authService.isAdmin()) {
    return router.parseUrl('/orders');
  }
  
  // Redirect to login page if not logged in
  return router.parseUrl('/login');
};
