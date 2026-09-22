import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}

  register(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  }

  login(email: string, role: string) {
    const user = { email, role };
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  logout() {
    localStorage.removeItem('user');
  }
}
