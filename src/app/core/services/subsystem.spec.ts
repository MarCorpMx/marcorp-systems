import { TestBed } from '@angular/core/testing';

import { Subsystem } from './subsystem';

describe('Subsystem', () => {
  let service: Subsystem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Subsystem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
