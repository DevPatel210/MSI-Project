import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  @Output() public sidenavToggle = new EventEmitter();
  logout(){
    console.log("logout function called");
    this.router.navigate(['/login']);
  }
  onToggleSidenav(){
    this.sidenavToggle.emit();
  }

}
