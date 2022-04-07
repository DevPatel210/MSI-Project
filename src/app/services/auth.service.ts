import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginURL = 'http://localhost:3000/login';
  constructor(private http: HttpClient) {}

  loginUser(user: {}) {
    return this.http.post<any>(this.loginURL, user);
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  }

  isLoggedIn() {
    return !!sessionStorage.getItem('token');
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }
  getToken() {
    return sessionStorage.getItem('token');
  }

  setRole(token: string) {
    sessionStorage.setItem('role', token);
  }
  getRole() {
    return sessionStorage.getItem('role');
  }
}
