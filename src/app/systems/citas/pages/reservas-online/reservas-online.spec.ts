import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasOnline } from './reservas-online';

describe('ReservasOnline', () => {
  let component: ReservasOnline;
  let fixture: ComponentFixture<ReservasOnline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasOnline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasOnline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
