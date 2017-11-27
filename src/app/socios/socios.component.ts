import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { GLOBAL } from '../services/global.service';
declare var $;

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public nombres: Nombre[];
  public nombresPaginados: Nombre[];
  public nombresBack: Nombre[];
  public nombre: Nombre;
  public tamPagina: number;
  public paginas: number;
  public arrPaginas: any;
  public pagina: number;
  public domiciliados:boolean;
  public paginacionOff:boolean;
  public error:Error;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'USUARIOS DE LA COMUNIDAD';
    this.nombres = new Array();
    this.nombresPaginados = new Array();
    this.nombresBack = new Array();
    this.nombre = new Nombre(null, '', false);
    this.tamPagina = 10;
    this.paginas = null;
    this.arrPaginas = new Array();
    this.pagina = 1;
    this.domiciliados = false;
    this.paginacionOff = false;
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
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
  getNombres() {
    this._operaciones.getNombres().subscribe(res => {
      if(res.code == 200){
        let datos = res.data;
        this.nombres = new Array();
        $.each(datos, (i, nombre) => {
          let nom = new Nombre(nombre.numero, nombre.nombre, nombre.domiciliado);
          this.nombres.push(nom);
        });
        this.nombresBack = this.nombres.slice(0);
        this.paginacion();
      }else{
        this.error = new Error('No se encuentran nombres');
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }

  consultarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['socios-det', numero, 'ver']);
  }
  editarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['socios-det', numero, 'editar']);
  }
  addSocio() {
    this._operaciones.getSocioSig().subscribe(res => {
      if(res.code == 200){
        let numero = JSON.parse(res.data);
        this._router.navigate(['socios-det', numero['siguiente'], 'nuevo']);
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })

  }
  /**
   * [buscarNumero description]
   * @method buscarNumero
   * @param  {[type]}     evento [description]
   * @return {[type]}            [description]
   */
  buscarNumero(evento) {
    this.paginacionOff = true;
    this.nombre.nombre = null;
    let stringNumero = evento.target.value;
    if (stringNumero != "") {
      this.nombres = this.nombresBack.filter(nombre =>
        nombre.numero.toString().toLowerCase().includes(stringNumero.toLowerCase())
      );
    } else {
      this.paginacionOff = false;
      this.nombres = this.nombresBack.slice(0);
      this.domiciliados = false;
    }
    this.paginacion();
  }

  buscarNombre(evento) {
    this.paginacionOff = true;
    this.nombre.numero = null;
    let stringNombre = evento.target.value;
    if (stringNombre != "") {
      this.nombres = this.nombresBack.filter(nombre =>
      nombre.nombre.toLowerCase().includes(stringNombre.toLowerCase()));

    } else {
      this.paginacionOff = false;
      this.nombres = this.nombresBack.slice(0);
      this.domiciliados = false;
    }
    this.paginacion();
  }
  paginacion() {
    this.paginas = Math.ceil(this.nombres.length / this.tamPagina);
    this.arrPaginas = Array(this.paginas).fill(0).map((x, i) => i);
    if(this.paginacionOff){
      this.nombresPaginados = this.nombres;
      if(this.domiciliados){
        this.filtraDomiciliados();
      }
    }else{
      this.nombresPaginados = this.nombres.slice(((this.pagina - 1) * this.tamPagina), (this.pagina * this.tamPagina));
    }
  }
  paginaNext() {
    if (this.pagina < this.paginas) {
      this.pagina += 1;
      this.paginacion();
    }
  }
  paginaPrev() {
    if (this.pagina > 1) {
      this.pagina -= 1;
      this.paginacion();
    }
  }
  irPagina(event) {
    this.pagina = parseInt(event.target.innerHTML);
    this.paginacion();
  }
  setPaginacion(event) {
    if (event.target.value != '-1') {
      this.tamPagina = parseInt(event.target.value);
    } else {
      this.tamPagina = this.nombres.length;
    }
    this.pagina = 1;
    this.paginacion();
  }
  exportaCsv(){
    let exportData = [
      { data: JSON.stringify(this.nombresPaginados) }
    ];
    this._ng2Csv.download(this.nombresPaginados, 'socios.csv', undefined, GLOBAL.csvConf);

  }
  filtraDomiciliados(){
    if(this.domiciliados){
      this.nombresPaginados = this.nombres.filter(nombre=> nombre.domiciliado == 1);
    }else{
      this.paginacion();
    }
  }
  handleError(error){
    console.log(error.message);
    $("#error").show().delay(5000).fadeOut();
  }
}
