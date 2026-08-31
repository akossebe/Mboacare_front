import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmacienLayout } from './pharmacien-layout';

describe('PharmacienLayout', () => {
  let component: PharmacienLayout;
  let fixture: ComponentFixture<PharmacienLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacienLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacienLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
