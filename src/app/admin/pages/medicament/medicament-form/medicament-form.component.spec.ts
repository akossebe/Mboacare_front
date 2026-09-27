import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentFormComponent } from './medicament-form.component';

describe('MedicamentFormComponent', () => {
  let component: MedicamentFormComponent;
  let fixture: ComponentFixture<MedicamentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
