import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendaMedecin } from './agenda-medecin';

describe('AgendaMedecin', () => {
  let component: AgendaMedecin;
  let fixture: ComponentFixture<AgendaMedecin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaMedecin],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaMedecin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
