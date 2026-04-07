import { TestBed } from '@angular/core/testing';

import { AgendaSettingsService } from './citas-agenda-settings.service';

describe('AgendaService', () => {
  let service: AgendaSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
