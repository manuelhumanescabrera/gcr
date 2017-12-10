import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';
import {User} from '../models/user.model';


@Injectable()
export class LoginService {
  url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.urlLogin;
  }
  /**
   * Función que realiza el login de un usuario
   * @method login
   * @param  {User}   usuario [usuario a loguear]
   * @return {[type]}         [description]
   */
  login(usuario:User) {
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
  /**
   * función que da de alta a un nuevo usuario
   * @method singup
   * @param  {User}   usuario [usuario a dar de alta]
   * @return {[type]}         [description]
   */
  singup(usuario:User) {
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
  /**
   * Función que comprueba si estamos logueados
   * @method status
   * @return {[type]} [description]
   */
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
  /**
   * Función que desloguea a un usuario.
   * @method signout
   * @return {[type]} [description]
   */
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
  /**
   * función que actualiza los datos de un usuario.
   * @method updateUser
   * @param  {User}     usuario [usuario a actualizar]
   * @return {[type]}           [description]
   */
  updateUser(usuario:User) {
    let json = JSON.stringify(usuario);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/update', params, { headers: headers }).map(
      res => {
        return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }

}
