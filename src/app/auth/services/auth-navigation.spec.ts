import { TestBed } from '@angular/core/testing';

import { AuthNavigation } from './auth-navigation';

describe('AuthNavigation', () => {
  let service: AuthNavigation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthNavigation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
