import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { Remesa } from '../models/remesa.model';
import { Nombre } from '../models/nombre.model';
import { Telefono } from '../models/telefono.model';
import { Sms } from '../models/sms.model';
import { OperacionesService } from '../services/operaciones.service';
import { GLOBAL } from '../services/global.service';
declare var SEPA: any;
declare var $;
@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.component.html',
  styleUrls: ['./remesas.component.css']
})
export class RemesasComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public remesas: Remesa[];
  public remesa: Remesa;
  public nombres: Nombre[];
  public pHora: number;
  public totalHoras: number;
  public totalEuros: number;
  public arraySms: Sms[];
  public error: Error;
  public telefonos: Telefono[];

  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'CONSULTA DE REMESAS';
    this.pHora = GLOBAL.pHora;
    this.remesas = new Array();
    this.remesa = new Remesa(null, '', '');
    this.nombres = new Array();
    this.totalEuros = 0;
    this.totalHoras = 0;
    this.arraySms = new Array();
    this.error = new Error();
    this.telefonos = new Array();
  }

  /**
   * Acciones al iniciar el módulo
   * Comprueba si estamos logueados y esconde los mensajes de error y exito.
   * @method ngOnInit
   */
  ngOnInit() {
    this.ngDoCheck();
    $('#pleaseWaitDialog').hide();
    $('#error').hide();
    this.getRemesas();
  }
  /**
   * Comprueba si estamos logueados.
   * En caso contrario nos redirige al login.
   * @method ngDoCheck
   */
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
  /**
   * Función que obtiene las remesas desde el servidor.
   * Muestra un mensaje de error en caso de no obtener datos.
   * @method getRemesas
   * @return {[type]}   [description]
   */
  getRemesas() {
    this._operaciones.getRemesas().subscribe(res => {
      if (res.code == 200) {
        this.remesas = res.data;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }
  /**
   * Función que se encarga de mostrar datos de la remesa al realizar un cambio
   * en el select.
   * @method muestraRemesa
   * @param  {any}      event [Objeto html select]
   * @return {[type]}            [description]
   */
  muestraRemesa(event) {
    if (event.target.value != '-1') {
      this.remesa.remesa = event.target.value;
      this.remesa.concepto = event.target.selectedOptions[0].firstChild.data;
      this.totalHoras = 0;
      this.totalEuros = 0;
      this.getRemesa();
    } else {
      this.remesa = new Remesa(null, '', '');
      this.totalHoras = 0;
      this.totalEuros = 0;
      this.nombres = new Array();
    }

  }
  /**
   * Función que obtiene los datos de una remesa desde el servidor.
   * Muestra un mensaje de error en caso de error.
   * @method getRemesa
   * @return {[type]}  [description]
   */
  getRemesa() {
    this._operaciones.getRemesa(this.remesa).subscribe(res => {
      if (res.code == 200) {
        this.nombres = res.data;
        for (let i = 0; i < this.nombres.length; i++) {
          let hora = this.nombres[i].horas.replace(',', '.');
          this.totalHoras += parseFloat(hora);
        }
        this.totalEuros = this.totalHoras * this.pHora;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }

/**
 * Función encargada de preparar el array de sms a enviar.
 * Para ello obtiene todos los télefonos de los socios que aparecen en la remesa
 * y posteriormente asigna los teléfonos a cada socio y conforma un array de SMS.
 * En caso de error muestra un mensaje
 * @method preparaSms
 * @return {[type]}   [description]
 */
  async preparaSms() {
    $('#pleaseWaitDialog').show();
    let tels = new Array();
    for (let i = 0; i < this.nombres.length; i++) {
      tels.push(this.nombres[i].numero);
    }
    this._operaciones.getTelefonosSocios(tels).subscribe(res => {
      if (res.code == 200) {
        this.telefonos = JSON.parse(res.data);
        for (let i = 0; i < this.nombres.length; i++) {
          this.nombres[i].telefonos = this.telefonos.filter(telefono => telefono.socio == this.nombres[i].numero);
          for (let j = 0; j < this.nombres[i].telefonos.length; j++) {
            let cantidad = (parseFloat(this.nombres[i].horas.replace(',', '.')) * this.pHora).toString();
            this.arraySms.push(new Sms(this.nombres[i].numero.toString(), this.nombres[i].nombre, this.nombres[i].telefonos[j].telefono.toString(), this.remesa.concepto, cantidad));
          }
        }
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    });
    await this.sleep(2500);
    $('#pleaseWaitDialog').hide();
  }
  /**
   * Función que guarda en el localStorage el array de sms y nos redirige al
   * módulo SMS
   * @method almacenaSms
   * @return {[type]}    [description]
   */
  almacenaSms() {
    this.preparaSms().then(() => {
      if (this.arraySms.length > 0) {
        localStorage.setItem('sms', JSON.stringify(this.arraySms));
        this._router.navigate(['/sms']);
      } else {
        this.error = new Error('No hay sms');
        this.handleError(this.error);
      }
    })
  }
  /**
   * Función que exporta los datos a csv
   * @method exportaremesaCsv
   * @return {[type]}   [description]
   */
   exportaRemesaCsv() {
     this._ng2Csv.download(this.nombres, 'remesa.csv', undefined, GLOBAL.csvConf);
   }
  /**
   * Función que pausa la ejecución del código
   * @method sleep
   * @param  {number} ms [milisegundos de espera]
   */
  sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * Función de manejo de errores.
   * Muestra un mensaje al usuario durante 5000 ms.
   * @method handleError
   * @param  {Error}     error [Error que queremos mostrar]
   */
  async handleError(error:Error) {
    console.log(error.message);
    $("#error").show();
    await this.sleep(5000);
    $("#error").hide();
    this.error = new Error();
  }
}
