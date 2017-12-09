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
export class LoginComponent implements OnInit, ErrorHandler {
  public user: User;
  public error: Error;
  public exito: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("", "", "", "", "", "");
    this.error = new Error();
    this.exito = '';
  }

  ngOnInit() {
    $("#error").hide();
    $("#exito").hide();
  }
  async onSubmit() {
    this.user.email = this.user.username;
    this._loginService.login(this.user).subscribe(res => {
      if (res.code == 200) {
        this.handleExito('Usuario autentificado correctamente');
        setTimeout(() => {
          let obj = res.data;
          localStorage.setItem("usuario", obj);
          this._router.navigate(['/']);
        }, 1000);
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    });

  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async handleExito(mensaje) {
    this.exito = mensaje;
    $("#exito").show();
    await this.sleep(5000);
    $("#exito").hide();
    this.exito = '';
  }
  async handleError(error) {
    console.log(error.message);
    $("#error").show();
    await this.sleep(5000);
    $("#error").hide();
    this.error = new Error();
  }
}
