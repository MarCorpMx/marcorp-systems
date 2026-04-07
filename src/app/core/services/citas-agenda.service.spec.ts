import { TestBed } from '@angular/core/testing';

import { CitasAgendaService } from './citas-agenda.service';

describe('CitasAgendaService', () => {
  let service: CitasAgendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasAgendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
