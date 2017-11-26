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

  ngOnInit() {
    $('#pleaseWaitDialog').hide();
    $('#error').hide();
    this.ngDoCheck();
    this.getRemesas();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
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
  exportaRemesaCsv() {
    let exportData = [
      // {remesa: this.remesa.concepto},
      { data: JSON.stringify(this.nombres) }
    ];
    this._ng2Csv.download(this.nombres, 'remesa.csv', undefined, GLOBAL.csvConf);
  }
  generaSepa() {
    let num = 'ES9330230034361234567891';
    console.log(num);
  }

  async preparaSms() {
    $('#pleaseWaitDialog').show();
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
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
    await sleep(2500);
    $('#pleaseWaitDialog').hide();
  }
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
  handleError(error) {
    console.log(error.message);
    $("#error").show().delay(5000).fadeOut();
  }
}
