import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTip } from './section-tip';

describe('SectionTip', () => {
  let component: SectionTip;
  let fixture: ComponentFixture<SectionTip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
