import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockService {
  private baseUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stock/get_all`);
  }
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stock/get_by_id/${id}`);
  }
  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/stock/create`, data, { responseType: 'text' });
  }
  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/stock/update_by_id/${id}`, data, { responseType: 'text' });
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/stock/delete_by_id/${id}`, { responseType: 'text' });
  }
}
