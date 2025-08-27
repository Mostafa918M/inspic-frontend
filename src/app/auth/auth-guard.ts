import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser
    ? (sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken'))
    : null;

  return token ? true : router.createUrlTree(['/sign-in']);
};
