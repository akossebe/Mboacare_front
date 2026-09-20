import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarteLocalisation } from './carte-localisation.component';

describe('CarteLocalisation', () => {
  let component: CarteLocalisation;
  let fixture: ComponentFixture<CarteLocalisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteLocalisation],
    }).compileComponents();

    fixture = TestBed.createComponent(CarteLocalisation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
