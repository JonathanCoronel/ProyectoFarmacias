import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  canActivate(): Observable<boolean | UrlTree> {

    const isAuthenticated = this.userService.currentUser.pipe(
      map(user => {
        if (user === null) {
          return this.router.createUrlTree(['/ingresar']);
        } else {
          return true;
        }
      })
    );


    return isAuthenticated;
  }

}
