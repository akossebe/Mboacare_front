import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListePharmacies } from './liste-pharmacies.component';

describe('ListePharmacies', () => {
  let component: ListePharmacies;
  let fixture: ComponentFixture<ListePharmacies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePharmacies],
    }).compileComponents();

    fixture = TestBed.createComponent(ListePharmacies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
