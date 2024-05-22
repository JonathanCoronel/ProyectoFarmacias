import { Component, Input } from '@angular/core';
import { User } from "../../interfaces/user";

@Component({
  selector: 'app-signed-user',
  templateUrl: './signed-user.component.html',
  styleUrls: ['./signed-user.component.css']
})
export class SignedUserComponent {

  constructor() { }

  user!: User;

  @Input('user')
  set setUser(user: User) {
    this.user = user;
  }

}
