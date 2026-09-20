import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedecinLayout } from './medecin-layout.component';

describe('MedecinLayout', () => {
  let component: MedecinLayout;
  let fixture: ComponentFixture<MedecinLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedecinLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(MedecinLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
