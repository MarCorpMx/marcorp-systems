import { TestBed } from '@angular/core/testing';

import { CitasNotificationService } from './citas-notification.service';

describe('CitasNotificationService', () => {
  let service: CitasNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitasNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
