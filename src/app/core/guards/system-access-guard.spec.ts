import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { systemAccessGuard } from './system-access-guard';

describe('systemAccessGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => systemAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
