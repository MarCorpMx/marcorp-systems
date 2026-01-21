import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasLayout } from './citas-layout';

describe('CitasLayout', () => {
  let component: CitasLayout;
  let fixture: ComponentFixture<CitasLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
