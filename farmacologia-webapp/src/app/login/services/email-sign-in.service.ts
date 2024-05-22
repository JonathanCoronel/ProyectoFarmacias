import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user/user.service';
import { EmailSignInResponse } from 'src/app/shared/interfaces/email-sign-in-response';
import { User } from 'src/app/shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
/**
 * @deprecated
 */
export class EmailSignInService {

  public currentUser: BehaviorSubject<User>;
  public nameUserLS = 'currentUser';

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
  ) {
    this.currentUser = new BehaviorSubject(
      JSON.parse(localStorage.getItem(this.nameUserLS))
    );
  }

  get getUser(): User {
    return this.currentUser.value;
  }

  singIn(email: string, pass: string): Observable<Object> {
    const body = {
      email,
      password: pass
    };

    const request = this.http.post<EmailSignInResponse>('https://pharmacology-utpl-api.herokuapp.com/api/login', body).pipe(
      map(res => {
        // en este metodo el token de acceso se pasa dentro de la respuesta y no dentro del usuario, como en el inicio de google
        // por eso se agrega el token de la respuesta como propiedad del usuario
        res.data.accesstoken = res.token;
        this.userService.setUser(res.data);
        this.setUserToLocalStorage(res.data);
        this.currentUser.next(res.data);
        console.log(res.data);
        return true;

      }),
      catchError(err => {
        console.error('Ocurrió un error al autenticar con usuario y contraseña', err);
        return of(false);
      })
    );

    return request;
  }

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(this.nameUserLS, JSON.stringify(user));
  }
}
