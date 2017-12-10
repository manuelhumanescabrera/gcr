import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';
import {Config} from '../models/config.model';


@Injectable()
export class ConfigService {
  public url: string;
  constructor(private _http: Http) {
    this.url = GLOBAL.urlBackend;
  }
  /**
   * Función que obtiene los datos del fichero de configuración del servidor
   * @method getConf
   * @return {[type]} [description]
   */
  getConf(){
    let obj = {comprobar: true};
    let json = JSON.stringify(obj);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/getConfig', params, { headers: headers }).map(
      res => {
      return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }
  /**
   * Función que guarda los datos de configuración en el servidor.
   * @method setConf
   * @param  {Config} config [description]
   * @return {[type]}        [description]
   */
  setConf(config:Config){
    let json = JSON.stringify(config);
    let params =  'json='+json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/config', params, { headers: headers }).map(
      res => {
        return res.json();
      },
      err => {
        console.log(<any>err);
      });
  }
}
