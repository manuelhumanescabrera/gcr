import { Component, DoCheck, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from './services/login.service';
import {GLOBAL} from './services/global.service';
import {User} from './models/user.model';
declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  public nombre:string;
  public login: boolean;
  public usuario: User;
  // public email: string;
  constructor(
    private _login: LoginService
  ){
    this.nombre = GLOBAL.nombre;
    this.login = false;
    this.usuario = new User("", "", "", "", "", "");
    // this.email = '';
  }
  ngOnInit(){
    this.ngDoCheck();
    $(document).ready(function() {
      $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});
  }
  ngDoCheck(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    // this.email = localStorage.getItem('email') || "no";
    if(this.usuario == null){
      this.login = false;
    }else{
      this.login = true;
    }
  }
  status(){
    this._login.status().subscribe(res=>{
      console.log(res);
    }, err=>{
      console.log(err);
    });
  }
  signout(){
    this._login.signout().subscribe(res=>{
      console.log(res);
      localStorage.clear();
    }, err=>{
      console.log(err);
    });
  }
}
