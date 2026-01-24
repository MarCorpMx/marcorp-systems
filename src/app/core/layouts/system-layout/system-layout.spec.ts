import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLayout } from './system-layout';

describe('SystemLayout', () => {
  let component: SystemLayout;
  let fixture: ComponentFixture<SystemLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
