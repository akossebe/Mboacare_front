import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueMedical } from './historique-medical.component';

describe('HistoriqueMedical', () => {
  let component: HistoriqueMedical;
  let fixture: ComponentFixture<HistoriqueMedical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueMedical],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriqueMedical);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
