import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailExpired } from './email-expired';

describe('EmailExpired', () => {
  let component: EmailExpired;
  let fixture: ComponentFixture<EmailExpired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailExpired]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailExpired);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
