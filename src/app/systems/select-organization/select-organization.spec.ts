import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrganization } from './select-organization';

describe('SelectOrganization', () => {
  let component: SelectOrganization;
  let fixture: ComponentFixture<SelectOrganization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOrganization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectOrganization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
