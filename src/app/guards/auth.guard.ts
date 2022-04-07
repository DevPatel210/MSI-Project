import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // console.log(route.data);
    if (!this._authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
      // return true;
    } else {
      if (route.data['role'].includes(this._authService.getRole())) return true;
      else {
        return this.router.createUrlTree(['/dashboard/projects']);
      }
    }
  }
}
