import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,private _authService:AuthService) { }

  ngOnInit(): void {
  }
   logout(){
    console.log("logout function called");
    this._authService.logout();
    this.router.navigate(['/login']);
  }
}
