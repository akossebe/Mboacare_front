import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaciesPublicComponent } from './pharmacies-public.component';

describe('PharmaciesPublicComponent', () => {
  let component: PharmaciesPublicComponent;
  let fixture: ComponentFixture<PharmaciesPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmaciesPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmaciesPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
