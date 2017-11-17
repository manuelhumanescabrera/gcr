import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OperacionesService } from '../services/operaciones.service';
import 'rxjs/add/operator/map';
import { Sms } from '../models/sms.model';
@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit {
  public titulo: string;
  public sms: Sms;
  public arraySms: Array<Sms>;
  public fichero: any;
  public tipoFichero: string;
  public cadena: string;
  public haySms: boolean;
  constructor(private _operaciones: OperacionesService, private _route: ActivatedRoute,
    private _router: Router) {
    this.titulo = 'Envio de SMS';
    this.arraySms = new Array();
    this.haySms = false;
  }

  ngOnInit() {
    this.ngDoCheck();
    let smss = localStorage.getItem('sms');
    if (smss != null) {
      this.arraySms = JSON.parse(smss);
      this.haySms = true;
    }
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
  cargaFichero(event) {
    let file = event.originalTarget.files[0];
    var reader = new FileReader();
    this.tipoFichero = file.type;
    reader.onload = () => {
      this.cadena = reader.result;
      this.leeFichero();
    };
    reader.readAsBinaryString(file);
  }

  leeFichero() {
    if (this.tipoFichero == "text/csv") {
      var linea = [];
      this.arraySms = [];
      linea = this.cadena.split("\n");
      var caracter = "\t";
      //cuento que caracter es más comun como separador
      var coma = linea[0].split(",");
      var tabulador = linea[0].split("\t");
      if (coma.length > tabulador.length) {
        caracter = ",";
      }
      for (let i = 1; i < linea.length - 1; i++) {
        let texto = linea[i].split(caracter);
        let cantidad = texto[4].replace(",", ".");
        if (texto[2] != "" && parseFloat(cantidad) > 0) {
          this.arraySms.push(new Sms(texto[0], texto[1], texto[2], texto[3], texto[4]));
        }
      }
    }
  }
  limpiaDatos() {
    this.arraySms = new Array();
    localStorage.removeItem('sms');
    this.haySms = false;
  }
  async enviaSMS() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    for (let i = 0; i < this.arraySms.length; i++) {
      await sleep(3000);
      this._operaciones.sendSms(this.arraySms[i]).subscribe(
        result => {
          // da ok si hay respuesta del servidor aunque la respuesta sea 404, por
          // eso el if else.
          if (result.code == 200) {
            this.arraySms[i].estado = "Enviado";
          } else {
            this.arraySms[i].estado = "Error";
          }
        },
        error => {
          this.arraySms[i].estado = "Error";
        }
      );
    }
  }
}
