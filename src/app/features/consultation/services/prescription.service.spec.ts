import { TestBed } from '@angular/core/testing';
import { Prescription } from './prescription.service';

describe('Prescription', () => {
  let service: Prescription;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prescription);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
