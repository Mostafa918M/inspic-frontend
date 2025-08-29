import { inject } from '@angular/core';
import { CanActivateFn, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const noAuthGuard: CanActivateFn = (route, state) => {
const router = inject(Router);
const auth = inject(Auth);

return new Promise<boolean | UrlTree>((resolve) => {
    auth.me().subscribe({
      next: () => resolve(router.createUrlTree(['/home'])),
      error: () => resolve(true),
    });
  });
};
