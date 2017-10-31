import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("", "", "", "", "", "", "");
  }

  ngOnInit() {
  }
  onSubmit() {
    this._loginService.login(this.user, null).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });

  }
}
