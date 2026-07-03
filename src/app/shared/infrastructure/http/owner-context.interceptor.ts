import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export const ownerContextInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const ownerEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('userEmail') : null;

  if (!isApiRequest || !ownerEmail) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      'X-Owner-Email': ownerEmail
    }
  }));
};
