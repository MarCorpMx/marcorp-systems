import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosLayout } from './inventarios-layout';

describe('InventariosLayout', () => {
  let component: InventariosLayout;
  let fixture: ComponentFixture<InventariosLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventariosLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventariosLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
