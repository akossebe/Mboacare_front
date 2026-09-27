import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentDetailComponent } from './medicament-detail.component';

describe('MedicamentDetailComponent', () => {
  let component: MedicamentDetailComponent;
  let fixture: ComponentFixture<MedicamentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
