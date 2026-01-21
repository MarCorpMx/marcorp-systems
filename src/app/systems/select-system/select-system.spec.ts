import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSystem } from './select-system';

describe('SelectSystem', () => {
  let component: SelectSystem;
  let fixture: ComponentFixture<SelectSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
