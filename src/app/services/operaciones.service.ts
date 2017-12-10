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
    this.url = GLOBAL.urlBackend;
  }
/**
 * Función que devuelve todas las bases de datos del servidor.
 * @method getBases
 * @return {[type]} [description]
 */
  getBases() {
    return this._http.get(this.url + '/db').map(res => res.json());
  }
  /**
   * Función que devuelve todas las peticiones.
   * @method getPeticiones
   * @return {[type]}      [description]
   */
  getPeticiones() {
    return this._http.get(this.url + '/horas').map(res => res.json());
  }
  /**
   * Función que agrega una nueva petición a la base de datos.
   * @method setPeticion
   * @param  {Peticion}  peticion [petición a añadir]
   * @return {[type]}             [description]
   */
  setPeticion(peticion: Peticion) {
    let json = JSON.stringify(peticion);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/hora', params, { headers: headers }).map(res => res.json());
  }
  /**
   * Función que actualiza una petición en función de su id
   * @method setActualizaPeticion
   * @param  {number}             id       [id de la petición]
   * @param  {Peticion}           peticion [nueva petición]
   * @return {[type]}                      [description]
   */
  setActualizaPeticion(id: number, peticion: Peticion) {
    let json = JSON.stringify(peticion);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/actualiza-hora/' + id, params, { headers: headers }).map(res => res.json());
  }
  /**
   * Función que genera una nueva remesa
   * @method generaRemesa
   * @param  {Remesa}     remesa [remesa a guardar]
   * @return {[type]}            [description]
   */
  generaRemesa(remesa:Remesa){
    let json = JSON.stringify(remesa);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/genera-remesa', params, {headers: headers}).map(res=>res.json());
  }
  /**
   * Función que obtiene todas las remesas de la base de datos.
   * @method getRemesas
   * @return {[type]}   [description]
   */
  getRemesas(){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url+'/remesas', {headers: headers}).map(res=>res.json());
  }
  /**
   * Gunción que 0btiene todos los datos de una remesa
   * @method getRemesa
   * @param  {Remesa}  remesa [remesa a obtener]
   * @return {[type]}         [description]
   */
  getRemesa(remesa:Remesa){
    let json = JSON.stringify(remesa);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/remesa', params, {headers: headers}).map(res=>res.json());
  }
  /**
   * obtiene un nombre de un socio por su id
   * @method getNombre
   * @param  {number}  id [numero de socio]
   * @return {[type]}     [description]
   */
  getNombre(id: number) {
    return this._http.get(this.url + '/socio_nombre/' + id).map(res => res.json());
  }
  /**
   * función que obtiene todos los nombres de la base de datos.
   * @method getNombres
   * @return {[type]}   [description]
   */
  getNombres() {
    return this._http.get(this.url + '/nombres').map(res => res.json());
  }
  /**
   * función que obtiene todos los datos de todos los socios de la base de datos
   * @method getSocios
   * @return {[type]}  [description]
   */
  getSocios() {
    return this._http.get(this.url + '/socios').map(res => res.json());
  }
  /**
   * Obtiene los datos de un usuario de la base de datos.
   * @method getSocio
   * @param  {number} id [numero de socio]
   * @return {[type]}    [description]
   */
  getSocio(id: number) {
    return this._http.get(this.url + '/socio/' + id).map(res => res.json());
  }
  /**
   * función que obtiene el numero de socio siguiente al último.
   * @method getSocioSig
   * @return {[type]}    [description]
   */
  getSocioSig() {
    return this._http.get(this.url + '/socio-sig').map(res => res.json());
  }
  /**
   * función que inserta un nuevo socio
   * @method setSocio
   * @param  {Socio}  socio [socio a insertar]
   * @return {[type]}       [description]
   */
   setSocio(socio: Socio) {
     let json = JSON.stringify(socio);
     console.log(json);
     let params = 'json=' + json;
     let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
     return this._http.post(this.url + '/socio-inserta', params, { headers: headers }).map(res => res.json());
   }
  /**
   * función que actualiza un socio
   * @method setSocioActualiza
   * @param  {Socio}           socio [socio a actualizar]
   * @return {[type]}                [description]
   */
   setSocioActualiza(socio: Socio) {
     let json = JSON.stringify(socio);
     let params = 'json=' + json;
     let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
     return this._http.post(this.url + '/socio-actualiza', params, { headers: headers }).map(res => res.json());
   }
  /**
   * función que obtiene la cantidad pendiente de pago de un socio
   * @method getCantidad
   * @param  {number}    id [numero de socio]
   * @return {[type]}       [description]
   */
  getCantidad(id: number) {
    return this._http.get(this.url + '/cantidad-pendiente/' + id).map(res => res.json());
  }
  /**
   * función que obtiene las parcelas de un socio
   * @method getParcelas
   * @param  {number}    id [numero de socio]
   * @return {[type]}       [description]
   */
  getParcelas(id: number) {
    return this._http.get(this.url + '/socio_parcelas/' + id).map(res => res.json());
  }
  /**
   * función que obtiene los teléfonos de un socio.
   * @method getTelefonos
   * @param  {number}     id [numero de socio]
   * @return {[type]}        [description]
   */
  getTelefonos(id: number) {
    return this._http.get(this.url + '/socio_telefonos/' + id).map(res => res.json());
  }
  /**
   * función que obtiene los telefonos de un número indeterminado de socios
   * @method getTelefonosSocios
   * @param  {[type]}           numeros [array con numeros de socios]
   * @return {[type]}                   [description]
   */
  getTelefonosSocios(numeros) {
    let json = JSON.stringify(numeros);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/socios_telefonos', params, { headers: headers }).map(res => res.json());
  }
  /**
   * función que obtiene una provincia por su id
   * @method getProvincia
   * @param  {string}     id [id de provincia]
   * @return {[type]}        [description]
   */
  getProvincia(id:string) {
    return this._http.get(this.url+'/provincia/'+id).map(res => res.json());
  }
  /**
   * función que obtiene localidades por código postal
   * @method getLocalidad
   * @param  {string}     id [codigo postal]
   * @return {[type]}        [description]
   */
  getLocalidad(id:string) {
    return this._http.get(this.url+'/localidad/'+id).map(res => res.json());
  }
  /**
   * Función que agrega un nuevo teléfono
   * @method setTelefono
   * @param  {Telefono}  telefono [description]
   * @return {[type]}             [description]
   */
  setTelefono(telefono: Telefono) {
    let json = JSON.stringify(telefono);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/telefono', params, { headers: headers }).map(res => res.json());
  }
  /**
   * Función que elimina un teléfono
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
  /**
   * función que elimina una petición.
   * @method deletePeticion
   * @param  {number}       id [description]
   * @return {[type]}          [description]
   */
  deletePeticion(id: number) {
    let json = JSON.stringify(id);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/borra-hora/' + id, params, { headers: headers }).map(res => res.json());
  }

  /**
   * función que obtiene los nombres de socios con recibos pendientes de pago
   * @method getNombresPendientes
   * @return {[type]}             [description]
   */
  getNombresPendientes() {
    return this._http.get(this.url + '/socios-pendientes').map(res => res.json());
  }
  /**
   * Función que devuelve los recibos de un socio por su numero de socio
   * @method getRecibosPendientes
   * @param  {number}             id [numero de socio]
   * @return {[type]}                [description]
   */
  getRecibosPendientes(id: number) {
    let json = JSON.stringify(id);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/socios-pendientes/' + id, params, { headers: headers }).map(res => res.json());
  }
  /**
   * función que recupera los datos de un recibo
   * @method getRecibo
   * @param  {number}  id [id del recibo]
   * @return {[type]}     [description]
   */
  getRecibo(id: number) {
    let json = JSON.stringify({"id": id});
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/recibo', params, { headers: headers }).map(res => res.json());
  }
  /**
   * Función que inserta un recibo
   * @method setInsertaRecibo
   * @param  {Recibo}         recibo [recibo a insertar]
   * @return {[type]}                [description]
   */
  setInsertaRecibo(recibo:Recibo) {
    let json = JSON.stringify(recibo);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/inserta-recibo', params, { headers: headers }).map(res => res.json());
  }
  /**
   * función que actualiza un recibo
   * @method setActualizaRecibo
   * @param  {Recibo}           recibo [recibo a actualizar]
   * @return {[type]}                  [description]
   */
  setActualizaRecibo(recibo:Recibo) {
    let json = JSON.stringify(recibo);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/actualiza-recibo', params, { headers: headers }).map(res => res.json());
  }
  /**
   * función que envía un sms
   * @method sendSms
   * @param  {Sms}    sms [sms a enviar]
   * @return {[type]}     [description]
   */
  sendSms(sms: Sms) {
    let json = JSON.stringify(sms);
    let params = 'json=' + json;
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this._http.post(this.url + '/sms', params, { headers: headers }).map(res => res.json());
  }

}
