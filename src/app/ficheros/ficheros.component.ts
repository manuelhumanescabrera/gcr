import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Cargo } from '../models/cargo.model';
import { Recibo } from '../models/recibo.model';
import { User } from '../models/user.model';
import { OperacionesService } from '../services/operaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $;
@Component({
  selector: 'app-ficheros',
  templateUrl: './ficheros.component.html',
  styleUrls: ['./ficheros.component.css']
})
export class FicherosComponent implements OnInit, ErrorHandler, DoCheck {
  public titulo: string;
  public cargo: Cargo;
  public cargos: Cargo[];
  public tipoFichero: string;
  public cadena: string;
  public usuario:User;
  public error: Error;
  public exito:string;
  constructor(
    private _operaciones:OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router
  ) {
    this.titulo = 'GESTIÓN DE FICHEROS';
    this.cargos = new Array();
    this.usuario = new User("", "", "", "", "", "");
    this.error = new Error();
    this.exito = '';
  }

  ngOnInit() {
    this.ngDoCheck();
    $("#error").hide();
    $("#exito").hide();
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
    this.cargos = [];
    if (this.tipoFichero == "text/xml") {
      var parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(this.cadena, "text/xml");
      var uri = xmlDoc.childNodes[0].namespaceURI;
      if (uri == "urn:iso:std:iso:20022:tech:xsd:pain.002.001.03") {
        var recibos = [];
        recibos = xmlDoc.getElementsByTagName('OrgnlTxRef');
        for (let i = 0; i < recibos.length; i++) {
          this.cargo = new Cargo(parseInt(recibos[i].children[4].children[0].innerHTML), recibos[i].children[6].children[0].innerHTML, recibos[i].children[5].children[0].innerHTML, recibos[i].children[0].children[0].innerHTML, recibos[i].children[1].innerHTML);
          this.cargos.push(this.cargo);
        }
      } else if (uri == "urn:iso:std:iso:20022:tech:xsd:pain.008.001.02") {
        var recibos = [];
        recibos = xmlDoc.getElementsByTagName('DrctDbtTxInf');
        for (let i = 0; i < recibos.length; i++) {
          this.cargo = new Cargo(parseInt(recibos[i].children[2].children[0].children[0].innerHTML), recibos[i].children[4].children[0].innerHTML, recibos[i].children[6].children[0].innerHTML, recibos[i].children[1].innerHTML, null);
          this.cargos.push(this.cargo);
        }
      }
    } else if (this.tipoFichero == "text/csv") {
      var linea = [];
      this.cargos = [];
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
        this.cargos.push(new Cargo(parseInt(texto[0]), texto[1], texto[3], texto[2], null));
      }
    }else{
      this.error = new Error('Fichero de datos no soportado.');
      this.handleError(this.error);
    }
  }
  procesarDevoluciones(){
    for(let i = 0; i<this.cargos.length;i++){
      let cr = this.cargos[i];
      let recibo = new Recibo(null,cr.numero,cr.nombre,parseFloat(cr.cantidad.replace(",",".")),cr.concepto,false,null,'');
      this._operaciones.setInsertaRecibo(recibo).subscribe(res=>{
        if(res.code == 200){
          this.handleExito(res.message);
        }else{
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      },err => {
        this.error = err;
        this.handleError(this.error);
      })
    }
  }
  limpiaDatos() {
    this.cargos = new Array();
  }
  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async handleExito(mensaje){
    this.exito = mensaje;
    $("#exito").show();
    this.sleep(5000);
    $("#exito").hide();
    this.exito = '';
  }
  async handleError(error) {
     console.log(error.message);
     $("#error").show();
     await this.sleep(5000);
     $("#error").hide();
     this.error = new Error();
  }
}
