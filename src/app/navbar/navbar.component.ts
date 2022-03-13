import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router,private _authService:AuthService) { }

  ngOnInit(): void {
  }
  @Output() public sidenavToggle = new EventEmitter();
  logout(){
    console.log("logout function called");
    this._authService.logout();
    this.router.navigate(['/login']);
  }
  onToggleSidenav(){
    this.sidenavToggle.emit();
  }

}
