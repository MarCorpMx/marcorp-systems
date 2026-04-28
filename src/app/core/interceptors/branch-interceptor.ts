import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const branchInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const branch = auth.currentBranchSignal();
  const subsystemId = auth.getCurrentSubsystemId();
  const organizationId = auth.getOrganizationId();

  if (!branch?.branch_id) {
    console.warn(' No branch set in request');
  }


  let headers: any = {};

  if (organizationId) {
    headers['X-Organization-Id'] = organizationId.toString();
  }

  if (branch?.branch_id) {
    headers['X-Branch-Id'] = branch.branch_id.toString();
  }

  if (subsystemId) {
    headers['X-Subsystem-Id'] = subsystemId.toString();
  }

  const cloned = req.clone({ setHeaders: headers });

  /*const cloned = req.clone({
    setHeaders: {
      'X-Branch-Id': branch.branch_id.toString()
    }
  });*/

  return next(cloned);
};
