import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("","", "", "", "");
  }

  ngOnInit() {
  }
  onSubmit() {
    console.log(this.user);
    this._loginService.singup(this.user).subscribe(res => {
      if(res.code == 200){
        console.log(res.message);
      }else{
      console.log(res.message);
    }
    }, err => {
      console.log(err);
    });

  }

}
