import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  
  // BehaviorSubject pour notifier la Navbar des changements
  public currentUser$ = new BehaviorSubject<any>(this.getUserFromStorage());

  constructor(private http: HttpClient) {}

  private getUserFromStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res && res.utilisateur) {
          localStorage.setItem('user', JSON.stringify(res.utilisateur));
          this.currentUser$.next(res.utilisateur);
        }
      })
    );
  }

  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, motDePasse }).pipe(
      tap((res: any) => {
        if (res && res.utilisateur) {
          localStorage.setItem('user', JSON.stringify(res.utilisateur));
          this.currentUser$.next(res.utilisateur);
        }
      })
    );
  }

  updateProfil(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profil/${id}`, data).pipe(
      tap((res: any) => {
        if (res && res.utilisateur) {
          localStorage.setItem('user', JSON.stringify(res.utilisateur));
          this.currentUser$.next(res.utilisateur); // Met à jour la Navbar instantanément !
        }
      })
    );
  }

  getMedecins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medecins`);
  }

  getUser() {
    return this.currentUser$.getValue();
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUser$.next(null);
  }
}
