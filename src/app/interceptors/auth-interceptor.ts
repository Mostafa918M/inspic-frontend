import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const isBrowser = typeof window !== 'undefined';

  const token = isBrowser
    ? (sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken') || '')
    : '';

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` }, withCredentials: true })
    : req.clone({ withCredentials: true });

  return next(cloned);
};
