import { TestBed } from '@angular/core/testing';
import { Pharmacie } from './pharmacie';

describe('Pharmacie', () => {
  let service: Pharmacie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pharmacie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
