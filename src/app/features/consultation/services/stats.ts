import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedecinStatsDTO } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private readonly apiUrl = '/api/stats';

  constructor(private http: HttpClient) {}

  getStatsMedecin(idMedecin: number): Observable<MedecinStatsDTO> {
    return this.http.get<MedecinStatsDTO>(`${this.apiUrl}/medecin/${idMedecin}`);
  }
}
