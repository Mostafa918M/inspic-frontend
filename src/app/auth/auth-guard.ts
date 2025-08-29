import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
   const auth = inject(Auth);
 return new Promise<boolean | UrlTree>((resolve) => {
auth.me()
      .subscribe({
        next: () => resolve(true),
        error: () => {
          auth.getNewAccessToken().subscribe({
            next: () => {
              auth.me().subscribe({
                next: () => resolve(true),
                error: () => resolve(router.createUrlTree(['/sign-in'])),
              });
            },
            error: () => resolve(router.createUrlTree(['/sign-in'])),
          });
        },
      });
  });
};
