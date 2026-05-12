import { TestBed } from '@angular/core/testing';

import { BusinessCatalogService } from './business-catalog.service';

describe('BusinessCatalogService', () => {
  let service: BusinessCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
