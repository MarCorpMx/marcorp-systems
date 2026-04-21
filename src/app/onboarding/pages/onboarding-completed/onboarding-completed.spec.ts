import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingCompleted } from './onboarding-completed';

describe('OnboardingCompleted', () => {
  let component: OnboardingCompleted;
  let fixture: ComponentFixture<OnboardingCompleted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingCompleted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingCompleted);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
