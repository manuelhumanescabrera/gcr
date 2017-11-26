import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Socio } from '../models/socios.model';
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
export class SociosComponent implements OnInit {
  public titulo: string;
  public nombres: Nombre[];
  public nombresPaginados: Nombre[];
  public nombresBack: Nombre[];
  public nombre: Nombre;
  public socio: Socio;
  public tamPagina: number;
  public paginas: number;
  public arrPaginas: any;
  public pagina: number;
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
    this.nombre = new Nombre(null, '');
    this.socio = new Socio(null, '', '', '', false, '', '', null, null, '', false, '', null, '');
    this.tamPagina = 10;
    this.paginas = null;
    this.arrPaginas = new Array();
    this.pagina = 1;
  }

  ngOnInit() {
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
      let datos = res.data;
      this.nombres = new Array();
      $.each(datos, (i, nombre) => {
        let nom = new Nombre(nombre.numero, nombre.nombre);
        this.nombres.push(nom);
      });
      this.nombresBack = this.nombres.slice(0);
      this.paginacion();
    }, err => {
      console.log(<any>err);
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
      let numero = JSON.parse(res.data);
      this._router.navigate(['socios-det', numero['siguiente'], 'nuevo']);
    }, err => {
      console.log(<any>err);
    })

  }
  /**
   * [buscarNumero description]
   * @method buscarNumero
   * @param  {[type]}     evento [description]
   * @return {[type]}            [description]
   */
  buscarNumero(evento) {
    let obj = {target:{value: "-1"}};
    this.setPaginacion(obj);
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
    this.paginacion();
  }

  buscarNombre(evento) {
    let obj = {target:{value: "-1"}};
    this.setPaginacion(obj);
    // this.selectPag.target.value = "-1";
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
    this.paginacion();
  }
  paginacion() {
    this.paginas = Math.ceil(this.nombres.length / this.tamPagina);
    this.arrPaginas = Array(this.paginas).fill(0).map((x, i) => i);
    this.nombresPaginados = this.nombres.slice(((this.pagina - 1) * this.tamPagina), (this.pagina * this.tamPagina));
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
      // {remesa: this.remesa.concepto},
      { data: JSON.stringify(this.nombresPaginados) }
    ];
    this._ng2Csv.download(this.nombresPaginados, 'socios.csv', undefined, GLOBAL.csvConf);

  }
}
