import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Socio} from '../models/socios.model';
import { Peticion } from '../models/peticion.model';
import {Telefono} from '../models/telefono.model';
import {Sms} from '../models/sms.model';
import {Remesa} from '../models/remesa.model';
import {Recibo} from '../models/recibo.model';
import { GLOBAL } from './global.service';

@Injectable()
export class OperacionesService {
  public url: string;
  constructor(private _http: Http) {
    // ruta de desarrollo
    this.url = GLOBAL.urlBackend;
  }
  /*
  Obtiene todos los nombres de la base de datos
  */
  getBases() {
    return this._http.get(this.url + '/db').map(res => res.json());
  }
  /**
  Obtiene todas las peticiones presentes en la base de datos
  */
  getPeticiones() {
    return this._http.get(this.url + '/horas').map(res => res.json());
  }
  /**
  agraga una nueva petición a la base de datos
  */
  setPeticion(peticion: Peticion) {
    let json = JSON.stringify(peticion);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/hora', params, { headers: headers }).map(res => res.json());
  }
  /*
Actualiza una peticion
   */
  setActualizaPeticion(id: number, peticion: Peticion) {
    let json = JSON.stringify(peticion);
    // console.log(json);
    let params = 'json=' + json;
    // console.log(params);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/actualiza-hora/' + id, params, { headers: headers }).map(res => res.json());
  }
  /*
generaRemesa
   */
  generaRemesa(remesa:Remesa){
    let json = JSON.stringify(remesa);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/genera-remesa', params, {headers: headers}).map(res=>res.json());
  }
  /*Obtiene datos de las remesas*/
  getRemesas(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url+'/remesas', {headers: headers}).map(res=>res.json());
  }
  /*
generaRemesa
   */
  getRemesa(remesa:Remesa){
    let json = JSON.stringify(remesa);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/remesa', params, {headers: headers}).map(res=>res.json());
  }
  /*
  Obtiene el nombre de un usuario de la base de datos.
  */
  getNombre(id: number) {
    return this._http.get(this.url + '/socio_nombre/' + id).map(res => res.json());
  }
  /*
  Obtiene todos los nombres de la base de datos
  */
  getNombres() {
    return this._http.get(this.url + '/nombres').map(res => res.json());
  }
  /*
  Obtiene todos los nombres de la base de datos
  */
  getSocios() {
    return this._http.get(this.url + '/socios').map(res => res.json());
  }
  /*
  Obtiene los datos de un usuario de la base de datos.
  */
  getSocio(id: number) {
    return this._http.get(this.url + '/socio/' + id).map(res => res.json());
  }
  /*
  Obtiene el siguiente numero de socio.
  */
  getSocioSig() {
    return this._http.get(this.url + '/socio-sig').map(res => res.json());
  }
  /*
    inserta socio
   */
   setSocio(socio: Socio) {
     let json = JSON.stringify(socio);
     console.log(json);
     let params = 'json=' + json;
     let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
     return this._http.post(this.url + '/socio-inserta', params, { headers: headers }).map(res => res.json());
   }
  /*
    actualiza un socio
   */
   setSocioActualiza(socio: Socio) {
     let json = JSON.stringify(socio);
     let params = 'json=' + json;
     let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
     return this._http.post(this.url + '/socio-actualiza', params, { headers: headers }).map(res => res.json());
   }
  /*
  Obtiene los datos de un usuario de la base de datos.
  */
  getCantidad(id: number) {
    return this._http.get(this.url + '/cantidad-pendiente/' + id).map(res => res.json());
  }
  /*
  Obtiene un array con las parcelas de teléfono de un socio.
   */
  getParcelas(id: number) {
    return this._http.get(this.url + '/socio_parcelas/' + id).map(res => res.json());
  }
  /*
  Obtiene un array con los números de teléfono de un socio.
   */
  getTelefonos(id: number) {
    return this._http.get(this.url + '/socio_telefonos/' + id).map(res => res.json());
  }
  /*
  Obtiene un array con los números de teléfono de un socio.
   */
  getTelefonosSocios(numeros) {
    let json = JSON.stringify(numeros);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/socios_telefonos', params, { headers: headers }).map(res => res.json());
  }
  /*Obtiene la provincia desde un codigo de provincia*/
  getProvincia(id:string) {
    return this._http.get(this.url+'/provincia/'+id).map(res => res.json());
  }
  /*Obtiene la localidad desde un codigo postal*/
  getLocalidad(id:string) {
    return this._http.get(this.url+'/localidad/'+id).map(res => res.json());
  }
  /**
  agraga una nueva petición a la base de datos
  */
  setTelefono(telefono: Telefono) {
    let json = JSON.stringify(telefono);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/telefono', params, { headers: headers }).map(res => res.json());
  }
  /**
   * [deleteTelefono description]
   * @method deleteTelefono
   * @param  {number}       id [description]
   * @return {[type]}          [description]
   */
  deleteTelefono(id:number){
    let json = JSON.stringify(id);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/telefono-borra/' + id, params, { headers: headers }).map(res => res.json());
  }
  /*
    Elimina una peticion
   */
  deletePeticion(id: number) {
    let json = JSON.stringify(id);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/borra-hora/' + id, params, { headers: headers }).map(res => res.json());
  }

  ////////////////////////////////////
  /*
  Obtiene todos los nombres de la base de datos
  */
  getNombresPendientes() {
    return this._http.get(this.url + '/socios-pendientes').map(res => res.json());
  }
  getRecibosPendientes(id: number) {
    let json = JSON.stringify(id);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/socios-pendientes/' + id, params, { headers: headers }).map(res => res.json());
  }
  /*recibe un recibo pendiente*/
  getRecibo(id: number) {
    let json = JSON.stringify({"id": id});
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/recibo', params, { headers: headers }).map(res => res.json());
  }
  /*
Inserta un recibo
   */
  setInsertaRecibo(recibo:Recibo) {
    let json = JSON.stringify(recibo);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/inserta-recibo', params, { headers: headers }).map(res => res.json());
  }
  /*
Actualiza un recibo
   */
  setActualizaRecibo(recibo:Recibo) {
    let json = JSON.stringify(recibo);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/actualiza-recibo', params, { headers: headers }).map(res => res.json());
  }
  /*
  envía un sms
  */
  sendSms(sms: Sms) {
    //let dir = 'http://192.168.1.150:9090/sendsms?phone='+numero+'&text='+texto;
    let json = JSON.stringify(sms);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/sms', params, { headers: headers }).map(res => res.json());
  }

}
