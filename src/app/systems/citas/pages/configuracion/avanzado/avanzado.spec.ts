import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avanzado } from './avanzado';

describe('Avanzado', () => {
  let component: Avanzado;
  let fixture: ComponentFixture<Avanzado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avanzado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avanzado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
