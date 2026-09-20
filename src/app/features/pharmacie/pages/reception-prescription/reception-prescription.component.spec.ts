import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceptionPrescription } from './reception-prescription.component';

describe('ReceptionPrescription', () => {
  let component: ReceptionPrescription;
  let fixture: ComponentFixture<ReceptionPrescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionPrescription],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceptionPrescription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
