import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitySetup } from './availability-setup';

describe('AvailabilitySetup', () => {
  let component: AvailabilitySetup;
  let fixture: ComponentFixture<AvailabilitySetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilitySetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilitySetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
