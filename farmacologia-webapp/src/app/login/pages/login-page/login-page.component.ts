import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
// import { UserService } from 'src/app/core/services/user/user.service';
import { UserService } from 'src/app/core/services/user.service';
import { SignInUserForm } from 'src/app/shared/interfaces/sign-in-user-form';
import { EmailSignInService } from '../../services/email-sign-in.service';
import { GoogleSignInService } from '../../services/google-sign-in.service';
import { MicrosoftSignInService } from '../../services/microsoft-sign-in.service';
import {User, UserClaims} from 'src/app/shared/interfaces/user';
import  firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import Swal from "sweetalert2";


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly google: GoogleSignInService,
    private readonly microsoft: MicrosoftSignInService,
    // private readonly emailSignInService: EmailSignInService,
    public AuthUser: EmailSignInService,
  ) {}

  // public currentUser$ = this.userService.user$;
  public user:User;
  // loginForm = this.formBuilder.group({
  //   username: ['', [Validators.required, Validators.email]],
  //   // password: ['', [Validators.required, Validators.minLength(3)]],
  // });

  /**
   * Variable para cerrar sesión
   */
  // private subscription: Subscription;

  ngOnInit(): void {}

  /**
   * Getter para acceder fácilmente a los campos del formulario de inicio de sesión
   */
  // get form(): { [key: string]: AbstractControl } {
  //   return this.loginForm.controls;
  // }

  /**
   * enviar login
   */
  // public async onSubmit(): Promise<void> {
  //   const user: SignInUserForm = {
  //     email: this.form.username.value,
  //     password: this.form.password.value,
  //   };
  //
  //   this.emailSignInService
  //     .singIn(user.email, user.password)
  //     .subscribe((ingreso) => {
  //       if (!ingreso) {
  //         alert('Ocurrió un error al iniciar sesión');
  //       } else {
  //         this.router.navigate(['/course']);
  //       }
  //     });
  // }

  googleSignIn(): void {
    this.google.singIn().then(async result => {

      if (result.additionalUserInfo.isNewUser) {
        const email: string = result.user.email;
        const username: string = email.split('@')[0];

        const newUser: User = {
          id: email,
          username,
          displayName: result.user.displayName,
          email,
          photoURL: result.user.photoURL,
          provider: result.additionalUserInfo.providerId,
          uid: result.user.uid,
          points: 0,
        };

        await this.userService.userDocument(email).set(newUser);

        const isAdmin = false;
        const isStudent = false;

        const userClaims: UserClaims = {
          isStudent,
          isAdmin,
        };
        await this.userService.claimsDocument(email).set(userClaims);
      }

      await this.router.navigate(['/course']).then(
        success => {
          this.Toast.fire({
            icon: 'success',
            title: 'Has iniciado sesión existosamente'
          });
        },
        error => {
          this.Toast.fire({
            icon: 'error',
            title: 'Ha ocurrido un problema'
          });
        }
      );
    });
  }

  microsoftSignIn(): void {
    this.microsoft.singIn().then( async result => {

      if (result.additionalUserInfo.isNewUser) {
        const email: string = result.user.email;
        const username: string = email.split('@')[0];

        const newUser: User = {
          id: username,
          username,
          displayName: result.additionalUserInfo.profile['displayName'],
          email,
          photoURL: 'https://ui-avatars.com/api/?background=random&name=' +
            result.additionalUserInfo.profile['givenName'] +
            '+' +
            result.additionalUserInfo.profile['surname'],
          provider: result.additionalUserInfo.providerId,
          uid: result.additionalUserInfo.profile['id'],
          points: 0,
        };

        await this.userService.userDocument(email).set(newUser);

        const isAdmin = false;
        const isStudent = false;

        const userClaims: UserClaims = {
          isStudent,
          isAdmin,
        };
        await this.userService.claimsDocument(email).set(userClaims);
      }

      await this.router.navigate(['/course']).then(
        success => {
          this.Toast.fire({
            icon: 'success',
            title: 'Has iniciado sesión existosamente'
          });
        },
        error => {
          this.Toast.fire({
            icon: 'error',
            title: 'Ha ocurrido un problema'
          });
        }
      );
    });
  }

  // signOut(): void{
  //
  //   firebase.auth().signOut().then(() => {
  //     // Sign-out successful.
  //   }).catch((error) => {
  //     // An error happened.
  //   });
  // }
  //
  // logout() {
  //   localStorage.removeItem(this.AuthUser.nameUserLS);
  //   this.AuthUser.currentUser.next(null);
  // }
}

