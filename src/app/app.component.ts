import { Component, DoCheck, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from './services/login.service';
declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'app';
  constructor(
    private _login: LoginService
  ){}
  ngOnInit(){
    $(document).ready(function() {
      $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});
  }
  ngDoCheck(){}
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
