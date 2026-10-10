import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MedicamentService } from './medicament.service';

describe('MedicamentService', () => {
  let service: MedicamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(MedicamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
