import { TestBed } from '@angular/core/testing';

import { CitasServicesService } from './citas-services.service';

describe('CitasServicesService', () => {
  let service: CitasServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
