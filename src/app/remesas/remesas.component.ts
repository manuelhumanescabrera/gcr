import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import {Remesa} from '../models/remesa.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
import { GLOBAL } from '../services/global.service';
@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.component.html',
  styleUrls: ['./remesas.component.css']
})
export class RemesasComponent implements OnInit {
  public titulo: string;
  public remesas: Remesa[];
  public remesa: Remesa;
  public nombres:Nombre[];
  public pHora: number;
  public totalHoras:number;
  public totalEuros:number;
  public csvConf: CsvConfiguration;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router,
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
   }

  ngOnInit() {
    this.getRemesas();
  }
  getRemesas(){
    this._operaciones.getRemesas().subscribe(res=>{
      if(res.code == 200){
        this.remesas = res.data;
      } else{
        console.log(res.message);
      }

    }, err=>{
      console.log(<any>err);
    })
  }
  muestraRemesa(event){
    this.remesa.remesa = event.target.value;
    this.remesa.concepto = event.target.selectedOptions[0].firstChild.data;
    this.totalHoras = 0;
    this.totalEuros = 0;
    this.getRemesa();
  }
  getRemesa(){
    this._operaciones.getRemesa(this.remesa).subscribe(res=>{
      if(res.code == 200){
        this.nombres = res.data;
        for(let i = 0 ; i<this.nombres.length;i++){
          let hora = this.nombres[i].horas.replace(',', '.');
          this.totalHoras += parseFloat(hora);
        }
        this.totalEuros = this.totalHoras*this.pHora;
      } else{
        console.log(res.message);
      }
    }, err=>{
      console.log(<any>err);
    })
  }
  exportaRemesa(){
    let exportData = [
      // {remesa: this.remesa.concepto},
      {data: JSON.stringify(this.nombres)}
    ];
    this._ng2Csv.download(this.nombres, 'remesa.csv', undefined, this.csvConf);
  }
}
