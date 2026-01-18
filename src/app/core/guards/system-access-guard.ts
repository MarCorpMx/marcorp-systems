import { CanMatchFn } from '@angular/router';

export const systemAccessGuard: CanMatchFn = (route, segments) => {
  return true;
};
