import { TestBed } from '@angular/core/testing';

import { CitasLayoutService } from './citas-layout.service';

describe('CitasLayoutService', () => {
  let service: CitasLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
