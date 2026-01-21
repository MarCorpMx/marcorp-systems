import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscolarLayout } from './escolar-layout';

describe('EscolarLayout', () => {
  let component: EscolarLayout;
  let fixture: ComponentFixture<EscolarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscolarLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscolarLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
