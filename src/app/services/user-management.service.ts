import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private addSingleUserURL = "http://localhost:3000/addUser/single";

  constructor(private http: HttpClient) { }

  addSingleUser(user:{}){
    return this.http.post<any>(this.addSingleUserURL,user);
  }
}
