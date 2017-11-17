import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';


@Injectable()
export class LoginService {
  url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.urlLogin;

  }
  login(usuario) {
    let json = JSON.stringify(usuario);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/login', params, { headers: headers }).map(
      res => {
        return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }
  singup(usuario) {
    let json = JSON.stringify(usuario);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/signup', params, { headers: headers }).map(
      res => {
        return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }
  status() {
    let obj = {comprobar: true};
    let json = JSON.stringify(obj);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/status', params, { headers: headers }).map(
      res => {
        return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }
  signout() {
    let obj = {comprobar: true};
    let json = JSON.stringify(obj);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/signout', params, { headers: headers }).map(
      res => {
        return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }

}
