import { TestBed } from '@angular/core/testing';

import { CitasBranchService } from './citas-branch.service';

describe('CitasBranchService', () => {
  let service: CitasBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasBranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
