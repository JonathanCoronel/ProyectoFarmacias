import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { EmailSignInService } from 'src/app/login/services/email-sign-in.service';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean;

  public user!: User;

  constructor(
    private userService: UserService
  ) { }

  @Input() changeStatus: boolean;

  ngOnInit(): void {

    this.userService.currentUser.subscribe(
      currentUser => {
        if (currentUser !== null) {
          this.userService.userDocument(currentUser.email).valueChanges().subscribe(
            user => {
              this.user = user;
              this.isLoggedIn = true;
            }
          );
        } else {
          this.isLoggedIn = false;
        }
      }
    );

  }
  signOut(): void{

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });

    this.userService.signOut(['/']).then(
      async success => {
        await Toast.fire({
          icon: 'success',
          title: 'Has cerrado sesión existosamente'
        });
        this.isLoggedIn = false;
        window.location.reload();
      },
      error => {
        Toast.fire({
          icon: 'error',
          title: 'Ha ocurrido un problema'
        });
      }
    );
  }

}
