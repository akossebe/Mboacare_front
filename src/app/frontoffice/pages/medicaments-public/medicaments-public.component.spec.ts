import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentsPublicComponent } from './medicaments-public.component';

describe('MedicamentsPublicComponent', () => {
  let component: MedicamentsPublicComponent;
  let fixture: ComponentFixture<MedicamentsPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentsPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentsPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
