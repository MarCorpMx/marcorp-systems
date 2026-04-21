import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCreate } from './service-create';

describe('ServiceCreate', () => {
  let component: ServiceCreate;
  let fixture: ComponentFixture<ServiceCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
