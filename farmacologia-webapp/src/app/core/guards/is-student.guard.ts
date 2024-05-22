import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

/**
 * Validate the current user has the students claims
 */
@Injectable({ providedIn: 'root' })
export class IsStudentGuard implements CanActivate {

  constructor(
    private readonly auth: UserService,
    private readonly router: Router
  ) { }

  canActivate(_: ActivatedRouteSnapshot, { url }: RouterStateSnapshot) {
    return this.auth.claims.pipe(
      map(claims => {
        // User hasn't sign in
        if (!claims) {
          return this.router.createUrlTree(['/ingresar'], { queryParams: { redirect: url } });
        }

        // yep, user is an student
        if (claims.isStudent) {
          return true;
        }

        return false;
      })
    );
  }

}
