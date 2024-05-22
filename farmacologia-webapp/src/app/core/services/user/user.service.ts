import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ɵAngularFireSchedulers } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/shared/interfaces/user';

/*
 * Usuario que esta autenticado
 */
/**
 * Don't use this service. DEPRECATED
 *  @deprecated
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: Subject<User | null> = new BehaviorSubject(null);

  constructor(
    private authFire: AngularFireAuth,
    private httpService: HttpClient
  ) {}

  // user$: Observable<User | null> = this.authFire.user.pipe(
  //   map((fireUser) =>
  //     !!fireUser
  //       ? {
  //           id: fireUser.uid,
  //           name: fireUser.displayName,
  //           email: fireUser.email,
  //           provider: fireUser.providerId,
  //           photo: fireUser.photoURL,
  //         }
  //       : null
  //   )
  // );
  user$: Observable<User | null> = this.authFire.user.pipe(
    switchMap((fireUser) =>
     !!fireUser
        ? this.httpService.get(
           'https://pharmacology-utpl-api.herokuapp.com/api/user/auth/' +
             fireUser.uid
          )

        : of(null)

   ),

     map((fireUser) => (!!fireUser? fireUser.data : null))
  );

  /** autenticar un usuario */
  setUser(usuarioNuevo: User): void {
    this.userSubject.next(usuarioNuevo);
  }
}
