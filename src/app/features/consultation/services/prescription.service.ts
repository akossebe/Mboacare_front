import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvoyerPharmacieDTO, PrescriptionReqDTO, PrescriptionResDTO } from '../models/prescription.model';
import { PageResponse } from '../models/rendez-vous.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private readonly apiUrl = '/api/prescriptions';

  constructor(private http: HttpClient) {}

  rediger(dto: PrescriptionReqDTO): Observable<PrescriptionResDTO> {
    return this.http.post<PrescriptionResDTO>(this.apiUrl, dto);
  }

  consulter(id: number): Observable<PrescriptionResDTO> {
    return this.http.get<PrescriptionResDTO>(`${this.apiUrl}/${id}`);
  }

  getTous(page = 0, size = 10, trier = 'dateEmission', filtres?: { idPatient?: number; idMedecin?: number }): Observable<PageResponse<PrescriptionResDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('trier', trier);
    if (filtres?.idPatient != null) {
      params = params.set('idPatient', filtres.idPatient.toString());
    }
    if (filtres?.idMedecin != null) {
      params = params.set('idMedecin', filtres.idMedecin.toString());
    }
    return this.http.get<PageResponse<PrescriptionResDTO>>(this.apiUrl, { params });
  }

  /** Prescription associée à une consultation (404 si aucune). */
  getParConsultation(idConsultation: number): Observable<PrescriptionResDTO> {
    return this.http.get<PrescriptionResDTO>(`${this.apiUrl}/consultation/${idConsultation}`);
  }

  valider(id: number): Observable<PrescriptionResDTO> {
    return this.http.patch<PrescriptionResDTO>(`${this.apiUrl}/${id}/valider`, {});
  }

  envoyerAPharmacie(id: number, dto: EnvoyerPharmacieDTO): Observable<PrescriptionResDTO> {
    return this.http.patch<PrescriptionResDTO>(`${this.apiUrl}/${id}/envoyer-pharmacie`, dto);
  }

  marquerDelivree(id: number): Observable<PrescriptionResDTO> {
    return this.http.patch<PrescriptionResDTO>(`${this.apiUrl}/${id}/delivrer`, {});
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
