import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { Remesa } from '../models/remesa.model';
import { Nombre } from '../models/nombre.model';
import { Sms } from '../models/sms.model';
import { OperacionesService } from '../services/operaciones.service';
import { GLOBAL } from '../services/global.service';
declare var SEPA: any;
@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.component.html',
  styleUrls: ['./remesas.component.css']
})
export class RemesasComponent implements OnInit {
  public titulo: string;
  public remesas: Remesa[];
  public remesa: Remesa;
  public nombres: Nombre[];
  public pHora: number;
  public totalHoras: number;
  public totalEuros: number;
  public csvConf: CsvConfiguration;
  public arraySms: Sms[];

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
    this.csvConf = new CsvConfiguration();
    this.csvConf.delimiter = '\t';
    this.csvConf.includeHeaderLine = true;
    this.arraySms = new Array();
  }

  ngOnInit() {
    this.ngDoCheck();
    this.getRemesas();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }
  }
  getRemesas() {
    this._operaciones.getRemesas().subscribe(res => {
      if (res.code == 200) {
        this.remesas = res.data;
      } else {
        console.log(res.message);
      }

    }, err => {
      console.log(<any>err);
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
        console.log(res.message);
      }
    }, err => {
      console.log(<any>err);
    })
  }
  exportaRemesaCsv() {
    let exportData = [
      // {remesa: this.remesa.concepto},
      { data: JSON.stringify(this.nombres) }
    ];
    this._ng2Csv.download(this.nombres, 'remesa.csv', undefined, this.csvConf);
  }
  generaSepa() {
    let num = 'ES9330230034361234567891';
    console.log(num);
  }
  async preparaSms() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    for (let i = 0; i < this.nombres.length; i++) {
      await sleep(250);
      console.log(i);
      this._operaciones.getTelefonos(this.nombres[i].numero).subscribe(res => {
        if (res.code == 200) {
          this.nombres[i].telefonos = JSON.parse(res.data);
          this.nombres[i].totalTelefonos = this.nombres[i].telefonos.length;
          for (let j = 0; j < this.nombres[i].totalTelefonos; j++) {
            let cantidad = (parseFloat(this.nombres[i].horas.replace(',', '.')) * this.pHora).toString();
            this.arraySms.push(new Sms(this.nombres[i].numero.toString(), this.nombres[i].nombre, this.nombres[i].telefonos[j].telefono.toString(), this.remesa.concepto, cantidad));
          }
        } else {
          this.nombres[i].totalTelefonos = 0;
        }
      });
    }
  }
  almacenaSms() {
    this.preparaSms().then(() => {
      if(this.arraySms.length > 0){
        localStorage.setItem('sms', JSON.stringify(this.arraySms));
        this._router.navigate(['/sms']);
      }else{
        console.log('No hay sms');
      }

    })
  }
}
