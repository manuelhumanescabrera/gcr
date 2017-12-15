import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { GLOBAL } from '../services/global.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public titulo: string;
  public usuario:User;
  public plantillaSms:any[];
  public plantillaDevol:any[];
  constructor(
    private _route: ActivatedRoute,
    private _router:Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'Bienvenido :';
    this.usuario = new User('','','','','','');
    this.plantillaDevol = [{'Código usuario':'1',	'Nombre-Apellidos':'Nombre y apellidos',	'Importe':'111,11',	'Concepto':'Concepto'}];
    this.plantillaSms = [{'Código usuario':'1',	'Nombre-Apellidos':'Nombre y apellidos',	'Teléfono movil':'6xxxxxxxx',	'Nº factura completo':'Puede omitirse',	'Importe':'111,11'}];
   }

  ngOnInit() {
    this.ngDoCheck();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }else{
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }
  }
  /**
   * Función que exporta los datos a csv
   * @method exportaCsv
   * @return {[type]}   [description]
   */
  exportaCsv(numero) {
    if(numero == 1){
      this._ng2Csv.download(this.plantillaSms, 'plantilla_sms.csv', undefined, GLOBAL.csvConf);
    }else if(numero == 2){
      this._ng2Csv.download(this.plantillaDevol, 'plantilla_devoluciones.csv', undefined, GLOBAL.csvConf);
    }

  }

}
