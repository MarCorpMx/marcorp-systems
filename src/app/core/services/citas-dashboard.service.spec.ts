import { TestBed } from '@angular/core/testing';

import { CitasDashboardService } from './citas-dashboard.service';

describe('CitasDashboardService', () => {
  let service: CitasDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
