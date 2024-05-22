import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { User, UserClaims } from '../../shared/interfaces/user';


const USERS_COLLECTION_NAME = 'users';

@Injectable({ providedIn: 'root' })
export class UserService {

  usersRef: AngularFirestoreCollection;

  constructor(
    private readonly firestore: AngularFirestore,
    private readonly afAuth: AngularFireAuth,
    private readonly router: Router,
  ) {
    this.usersRef = this.firestore.collection(USERS_COLLECTION_NAME);
  }

  public readonly currentUser = this.afAuth.user;

  public readonly username$: Observable<string | null> = this.currentUser.pipe(
    filter(user => !!user),
    map(user => user?.email?.split('@')[0] || null),
    shareReplay(1),
  );

  public readonly user$: Observable<User | null> = this.username$.pipe(
    switchMap(username => username ? this.firestore.collection('users').doc<User>(username).valueChanges() : of(null)),
    map(doc => doc ? doc as User : null),
    shareReplay(1),
  );

  public readonly uid$ = this.user$.pipe(
    map(user => user?.uid ?? null)
  );


  public claims: Observable<UserClaims | null> = this.username$.pipe(
    switchMap(username => !!username ? this.claimsDocument(username).snapshotChanges() : of(null)),
    map(snapshot => snapshot?.payload.exists ? snapshot.payload.data() : null),
    shareReplay(1),
  );

  public isAdmin: Observable<boolean> = this.claims.pipe(
    map(claims => !!claims?.isAdmin)
  );

  public currentUserData: Observable<{ [key: string]: any } | null> = this.username$.pipe(
    switchMap(username => username ? this.userDocument(username).valueChanges() : of(null)),
    map(data => data ?? null),
    shareReplay(1),
  );

  async signOut(redirect?: Array<string>) {
    await this.afAuth.signOut();
    // this.claims.next(null);

    if (redirect)
      await this.router.navigate(redirect);
  }

  get isUserSignIn() {
    return this.afAuth.user.pipe(
      map(user => !!user)
    );
  }


  public userDocument(username: string): AngularFirestoreDocument<User> {
    const userDoc = this.firestore.collection('users').doc<User>(username);
    return userDoc;
  }

  public claimsDocument(username: string): AngularFirestoreDocument<UserClaims> {
    const claims = this.firestore
      .collection('users')
      .doc(username)
      .collection('account-configuration')
      .doc<UserClaims>('claims');
    return claims;
  }

  public getAllUsers(): Observable<User[]> {
    return this.usersRef.snapshotChanges().pipe(map(item => {
      return item.map(snap => {
        const data = snap.payload.doc.data();
        return data as User;
      });
    }));
  }

}
