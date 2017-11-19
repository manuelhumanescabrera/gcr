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
    this.user = new User("","", "" ,"", "", "");
  }

  ngOnInit() {
  }
  onSubmit() {
    this.user.email = this.user.username;
    this._loginService.login(this.user).subscribe(res => {
      if(res.code == 200){
        let obj = res.data;
        // console.log(obj);
        localStorage.setItem("usuario", obj)
        // localStorage.setItem("usuario",obj.name);
        // localStorage.setItem("email", obj.email);
        this._router.navigate(["/"]);
      }else{
      console.log(res.message);
    }
    }, err => {
      console.log(err);
    });

  }
}
