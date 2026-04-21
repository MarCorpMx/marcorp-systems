import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoadingService);

  const useGlobalLoader = req.headers.get('x-loader') === 'global';
  
  if (useGlobalLoader) {
    loader.showGlobal();
  }

  return next(req).pipe(
    finalize(() => {
      if (useGlobalLoader) {
        loader.hide();
      }
    })
  );
};