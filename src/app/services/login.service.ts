import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';


@Injectable()
export class LoginService {
  url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.urlBackend;

  }
  login(userToLogin, gettoken = null) {
    let token = "aksdfklajsdflk";
    if (gettoken != null) {
      userToLogin.gettoken = gettoken;
    }
    let json = JSON.stringify(userToLogin);
    console.log(json);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + 'login/'+token, params, { headers: headers }).map(
      res => {
        // res.json();//pasar a json cuando tenga la respuesta en index.php en json
        return res;
      },
      err => {
        console.log(<any>err);
      });
  }

}
