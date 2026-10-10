import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicament, MedicamentReq } from '../models/medicament.model';

@Injectable({ providedIn: 'root' })
export class MedicamentService {
  private apiUrl = '/api/medicament';

  constructor(private http: HttpClient) {}

  getAllMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/get_all`);
  }

  getMedicamentById(id: string): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}/get_by_id/${id}`);
  }

  createMedicament(req: MedicamentReq): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, req, { responseType: 'text' });
  }

  updateMedicament(id: string, req: MedicamentReq): Observable<string> {
    return this.http.put(`${this.apiUrl}/update_by_id/${id}`, req, { responseType: 'text' });
  }

  deleteMedicament(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete_by_id/${id}`, { responseType: 'text' });
  }
}
