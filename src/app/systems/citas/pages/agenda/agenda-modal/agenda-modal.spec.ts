import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaModal } from './agenda-modal';

describe('AgendaModal', () => {
  let component: AgendaModal;
  let fixture: ComponentFixture<AgendaModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
