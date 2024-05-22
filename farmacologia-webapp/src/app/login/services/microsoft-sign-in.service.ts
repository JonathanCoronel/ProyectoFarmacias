import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftSignInService {

  constructor( public afAuth: AngularFireAuth ) { }

  singIn() {
    const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
    microsoftProvider.setCustomParameters({
      tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d'
    });
    microsoftProvider.addScope('user.read');
    microsoftProvider.addScope('openid');
    microsoftProvider.addScope('profile');
    microsoftProvider.addScope('mail.send');
    return this.afAuth.signInWithPopup(microsoftProvider);
  }
}
