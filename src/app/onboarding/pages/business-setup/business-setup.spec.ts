import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSetup } from './business-setup';

describe('BusinessSetup', () => {
  let component: BusinessSetup;
  let fixture: ComponentFixture<BusinessSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
