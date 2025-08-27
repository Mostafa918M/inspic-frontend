import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
const router = inject(Router);

  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser
    ? (sessionStorage.getItem('accessToken'))
    : null;

  if (token) {
    return router.navigate(['/home']); 
  }

  return true;
};
