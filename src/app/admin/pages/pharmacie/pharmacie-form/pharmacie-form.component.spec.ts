import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacieFormComponent } from './pharmacie-form.component';

describe('PharmacieFormComponent', () => {
  let component: PharmacieFormComponent;
  let fixture: ComponentFixture<PharmacieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
