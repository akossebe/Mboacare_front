import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacieListComponent } from './pharmacie-list.component';

describe('PharmacieListComponent', () => {
  let component: PharmacieListComponent;
  let fixture: ComponentFixture<PharmacieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacieListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
