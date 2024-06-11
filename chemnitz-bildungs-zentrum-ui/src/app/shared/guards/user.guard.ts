import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  Router, RouterStateSnapshot
} from '@angular/router';
import { plainToClass } from 'class-transformer';
import { of } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate{

  constructor(
    private router: Router
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let cUser = localStorage.getItem('currentUser');
    if (cUser){
        const currentUser = plainToClass(User,JSON.parse(cUser));
        if (currentUser){
          return of(true);
        }
    }
    localStorage.clear();
    this.router.navigate(['/auth/sign-in']);
    return of(false);
  }
}
