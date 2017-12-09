import { Component, OnInit, ErrorHandler, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';
declare var $;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, ErrorHandler, DoCheck {
  public user: User;
  public error:Error;
  public exito:string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("","", "" ,"", "", "");
    this.error = new Error();
    this.exito = '';
  }
  ngOnInit() {
    this.ngDoCheck();
    $("#error").hide();
    $("#exito").hide();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
  onSubmit() {
    this._loginService.singup(this.user).subscribe(res => {
      if(res.code == 200){
        this.handleExito('Usuario creado con exito.');
        this._router.navigate(["/login"]);
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
    }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    });
  }
  signout(){
    this._loginService.signout().subscribe(res=>{
      if(res.code == 200){
        this.handleExito('Te has deslogueado correctamente');
        localStorage.clear();
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    });
  }
  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async handleExito(mensaje){
    this.exito = mensaje;
    $("#exito").show();
    this.sleep(5000);
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
