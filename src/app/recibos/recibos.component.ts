import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { Socio } from '../models/socios.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
import { GLOBAL } from '../services/global.service';
declare var $;

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public nombres: Nombre[];
  public nombresBack: Nombre[];
  public nombre: Nombre;
  public socio:Socio;
  public error:Error;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'GESTIÓN DE RECIBOS';
    this.nombres = new Array();
    this.nombresBack = new Array();
    this.nombre = new Nombre(null, '', false);
    this.socio = new Socio(null, '','', '', false, '', '', null, null, '', false, '', null, '');
    this.error = new Error();
  }

  ngOnInit() {
    $("#error").hide();
    this.ngDoCheck();
    // this.socios = this.getSocios();
    this.getNombres();
    this.nombresBack = this.nombres;
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }
  }
  getNombres() {
    this._operaciones.getNombresPendientes().subscribe(res => {
      if(res.code == 200){
        let datos = res.data;
        this.nombres = new Array();
        $.each(datos, (i, nombre) => {
          let nom = new Nombre(nombre.numero, nombre.nombre, nombre.domiciliado);
          nom.pendiente = nombre.pendiente;
          this.nombres.push(nom);
        });
        this.nombresBack = this.nombres.slice(0);
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }

  consultarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['recibos-det', numero]);
  }
  editarSocio(evento){
    let numero = evento.target.value;
    this._router.navigate(['recibos-det', numero]);
  }
  /**
  * [buscarNumero description]
  * @method buscarNumero
  * @param  {[type]}     evento [description]
  * @return {[type]}            [description]
  */
  buscarNumero(evento) {
    this.nombre.nombre = null;
    let stringNumero = evento.target.value;
    if (stringNumero != "") {
      this.nombres = this.nombresBack.slice(0);
      var encontrados = this.nombres.filter(nombre =>
        nombre.numero.toString().toLowerCase().includes(stringNumero.toLowerCase())
      );
      this.nombres = encontrados;
    } else {
      this.nombres = this.nombresBack.slice(0);
    }
  }

  buscarNombre(evento) {
    this.nombre.numero = null;
    let stringNombre = evento.target.value;
    if (stringNombre != "") {
      this.nombres = this.nombresBack.slice(0);
      var encontrados = this.nombres.filter(nombre =>
        nombre.nombre.toLowerCase().includes(stringNombre.toLowerCase())
      );
      this.nombres = encontrados;
    } else {
      this.nombres = this.nombresBack.slice(0);
    }
  }
  exportaCsv(){
    this._ng2Csv.download(this.nombres, 'socios_pendientes.csv', undefined, GLOBAL.csvConf);
  }
  handleError(error){
    console.log(error.message);
    $("#error").show().delay(5000).fadeOut();
  }
}
