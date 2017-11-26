import { Component, OnInit, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,  ErrorHandler {
  public user: User;
  public error:Error;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("","", "" ,"", "", "");
    this.error = new Error();
  }

  ngOnInit() {
    $("#error").hide();
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
      // console.log(res.message);
      this.error = new Error(res.message);
      this.handleError(this.error);
    }
    }, err => {
      this.error = err;
      this.handleError(err);
    });

  }
  handleError(error) {
     console.log(error.message);
     $("#error").show().delay(5000).fadeOut();
     // IMPORTANT: Rethrow the error otherwise it gets swallowed
     //throw error;
  }
}
