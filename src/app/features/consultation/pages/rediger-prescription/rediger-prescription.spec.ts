import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RedigerPrescription } from './rediger-prescription';

describe('RedigerPrescription', () => {
  let component: RedigerPrescription;
  let fixture: ComponentFixture<RedigerPrescription>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedigerPrescription],
    }).compileComponents();

    fixture = TestBed.createComponent(RedigerPrescription);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
