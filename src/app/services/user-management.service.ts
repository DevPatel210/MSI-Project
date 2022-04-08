import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private addSingleUserURL = 'http://localhost:3000/user/add-single';
  private getUserURL = 'http://localhost:3000/user/get';
  private updateUserURL = 'http://localhost:3000/user/update';

  constructor(private http: HttpClient) {}

  addSingleUser(user: {}) {
    return this.http.post<any>(this.addSingleUserURL, user);
  }
  getUsers() {
    return this.http.get<any>(this.getUserURL);
  }
  updateUser(userData: {}) {
    console.log(userData);
    return this.http.put<any>(this.updateUserURL, userData);
  }
}
