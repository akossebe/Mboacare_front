import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pharmacie, PharmacieReq } from '../models/pharmacie.model';

@Injectable({ providedIn: 'root' })
export class PharmacieService {
  private apiUrl = '/api/pharmacies';

  constructor(private http: HttpClient) {}

  getAllPharmacies(): Observable<Pharmacie[]> {
    return this.http.get<Pharmacie[]>(this.apiUrl);
  }

  getPharmacieById(id: string): Observable<Pharmacie> {
    return this.http.get<Pharmacie>(`${this.apiUrl}/${id}`);
  }

  createPharmacie(req: PharmacieReq): Observable<string> {
    return this.http.post(this.apiUrl, req, { responseType: 'text' });
  }

  updatePharmacie(id: string, req: PharmacieReq): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, req, { responseType: 'text' });
  }

  deletePharmacie(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
