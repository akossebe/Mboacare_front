import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse, RendezVousReqDTO, RendezVousResDTO, ReporterRendezVousDTO } from '../models/rendez-vous.model';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private readonly apiUrl = '/api/rendez-vous';

  constructor(private http: HttpClient) {}

  creer(dto: RendezVousReqDTO): Observable<RendezVousResDTO> {
    return this.http.post<RendezVousResDTO>(this.apiUrl, dto);
  }

  getParId(id: number): Observable<RendezVousResDTO> {
    return this.http.get<RendezVousResDTO>(`${this.apiUrl}/${id}`);
  }

  getTous(page = 0, size = 10, trier = 'dateSouhaitee'): Observable<PageResponse<RendezVousResDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('trier', trier);
    return this.http.get<PageResponse<RendezVousResDTO>>(this.apiUrl, { params });
  }

  confirmer(id: number): Observable<RendezVousResDTO> {
    return this.http.patch<RendezVousResDTO>(`${this.apiUrl}/${id}/confirmer`, {});
  }

  reporter(id: number, dto: ReporterRendezVousDTO): Observable<RendezVousResDTO> {
    return this.http.patch<RendezVousResDTO>(`${this.apiUrl}/${id}/reporter`, dto);
  }

  annuler(id: number): Observable<RendezVousResDTO> {
    return this.http.patch<RendezVousResDTO>(`${this.apiUrl}/${id}/annuler`, {});
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
