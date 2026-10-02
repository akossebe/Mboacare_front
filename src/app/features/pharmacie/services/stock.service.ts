import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, StockReq } from '../models/stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = '/api/stock';

  constructor(private http: HttpClient) {}

  getAllStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/get_all`);
  }

  getStockById(idStock: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/get_by_id/${idStock}`);
  }

  createStock(stockReq: StockReq): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, stockReq, { responseType: 'text' });
  }

  updateStock(idStock: string, stockReq: StockReq): Observable<string> {
    return this.http.put(`${this.apiUrl}/update_by_id/${idStock}`, stockReq, { responseType: 'text' });
  }

  deleteStock(idStock: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete_by_id/${idStock}`, { responseType: 'text' });
  }
}
