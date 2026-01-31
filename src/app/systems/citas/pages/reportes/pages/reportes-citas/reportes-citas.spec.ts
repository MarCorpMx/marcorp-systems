import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesCitas } from './reportes-citas';

describe('ReportesCitas', () => {
  let component: ReportesCitas;
  let fixture: ComponentFixture<ReportesCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesCitas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesCitas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
