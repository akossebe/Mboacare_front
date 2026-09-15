import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompteRenduDTO, ConsultationReqDTO, ConsultationResDTO, DiagnosticReqDTO } from '../models/consultation.model';
import { PageResponse } from '../models/rendez-vous.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private readonly apiUrl = '/api/consultations';

  constructor(private http: HttpClient) {}

  creer(dto: ConsultationReqDTO): Observable<ConsultationResDTO> {
    return this.http.post<ConsultationResDTO>(this.apiUrl, dto);
  }

  getParId(id: number): Observable<ConsultationResDTO> {
    return this.http.get<ConsultationResDTO>(`${this.apiUrl}/${id}`);
  }

  getTous(page = 0, size = 10, trier = 'dateConsultation'): Observable<PageResponse<ConsultationResDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('trier', trier);
    return this.http.get<PageResponse<ConsultationResDTO>>(this.apiUrl, { params });
  }

  enregistrerDiagnostic(id: number, dto: DiagnosticReqDTO): Observable<ConsultationResDTO> {
    return this.http.patch<ConsultationResDTO>(`${this.apiUrl}/${id}/diagnostic`, dto);
  }

  cloturer(id: number): Observable<ConsultationResDTO> {
    return this.http.patch<ConsultationResDTO>(`${this.apiUrl}/${id}/cloturer`, {});
  }

  compteRendu(id: number): Observable<CompteRenduDTO> {
    return this.http.get<CompteRenduDTO>(`${this.apiUrl}/${id}/compte-rendu`);
  }

  genererPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
