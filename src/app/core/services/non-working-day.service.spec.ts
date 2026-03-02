import { TestBed } from '@angular/core/testing';

import { NonWorkingDayService } from './non-working-day.service';

describe('NonWorkingDayService', () => {
  let service: NonWorkingDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonWorkingDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
