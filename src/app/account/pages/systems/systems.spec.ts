import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Systems } from './systems';

describe('Systems', () => {
  let component: Systems;
  let fixture: ComponentFixture<Systems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Systems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Systems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
