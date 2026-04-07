import { TestBed } from '@angular/core/testing';

import { CitasTeamService } from './citas-team.service';

describe('CitasTeamService', () => {
  let service: CitasTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
