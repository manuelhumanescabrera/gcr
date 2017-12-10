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
export class SociosComponent implements OnInit, ErrorHandler, DoCheck {
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
  /**
   * Acciones al iniciar el módulo
   * Comprueba si estamos logueados y esconde los mensajes de error.
   * Obtiene los nombres y crea una copia de los mismos.
   * @method ngOnInit
   */
  ngOnInit() {
    this.ngDoCheck();
    $("#error").hide();
    this.getNombres();
    this.nombresBack = this.nombres;
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
   * Función que obtiene los nombres de la base de datos.
   * @method getNombres
   * @return {[type]}   [description]
   */
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
  /**
   * Función que nos lleva al component socios-det para consultar la información
   * @method consultarSocio
   * @param  {any}       evento [boton consultar de la tabla de usuarios]
   * @return {[type]}              [description]
   */
  consultarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['socios-det', numero, 'ver']);
  }
  /**
   *  Función que nos lleva al component socios-det para editar la información
   * @method editarSocio
   * @param  {any}       evento [boton editar de la tabla de usuarios]
   * @return {[type]}           [description]
   */
  editarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['socios-det', numero, 'editar']);
  }
  /**
   * Función que nos lleva al component socios-det para crear un socio nuevo.
   * Para ello consulta el último numero de socio en la base de datos.
   * @method addSocio
   * @return {[type]} [description]
   */
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
   * Función que filtra los socios por numero.
   * Para ello filtra el array por numero que incluya el número tecleado
   * en el input número.
   * Si el campo input numero está vacio reactiva la paginación y el array completo
   * de nombres.
   * @method buscarNumero
   * @param  {any}     evento [input de numero del formulario]
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
  /**
   * Función que filtra los socios por nombre.
   * Para ello filtra el array por nombre que incluya el texto tecleado
   * en el input nombre.
   * Si el campo input nombre está vacio reactiva la paginación y el array completo
   * de nombres.
   * @method buscarNombre
   * @param  {any}     evento [input de nombre del formulario]
   * @return {[type]}            [description]
   */
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
  /**
   * función que se encarga de paginar la página principal de socios.
   * Calcula el número de páginas en función del tamaño de paginación y la longitud
   * del array, luego genera y rellena un array de páginas.
   * Si la paginación está desactivada, iguala el array de nombres paginados con el
   * array de nombres filtrados, en caso contrario muestra una seccion del array de nombres.
   * @method paginacion
   * @return {[type]}   [description]
   */
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
  /**
   * Función que nos mueve a la siguiente página de la paginación.
   * @method paginaNext
   * @return {[type]}   [description]
   */
  paginaNext() {
    if (this.pagina < this.paginas) {
      this.pagina += 1;
      this.paginacion();
    }
  }
  /**
   * función que nos mueve a la página previa de la paginación
   * @method paginaPrev
   * @return {[type]}   [description]
   */
  paginaPrev() {
    if (this.pagina > 1) {
      this.pagina -= 1;
      this.paginacion();
    }
  }
  /**
   * Función que nos lleva a una página concreta de la paginación.
   * @method irPagina
   * @param  {any} event [botón del número de página]
   * @return {[type]}       [description]
   */
  irPagina(event) {
    this.pagina = parseInt(event.target.innerHTML);
    this.paginacion();
  }
  /**
   * Función que cambia el tamaño de la paginación desde el select
   * @method setPaginacion
   * @param  {any}      event [campo select de paginación]
   * @return {[type]}            [description]
   */
  setPaginacion(event) {
    if (event.target.value != '-1') {
      this.tamPagina = parseInt(event.target.value);
    } else {
      this.tamPagina = this.nombres.length;
    }
    this.pagina = 1;
    this.paginacion();
  }
/**
 * Función que filtra los nombres de los socios que tienen los recibos domiciliados
 * @method filtraDomiciliados
 * @return {[type]}           [description]
 */
  filtraDomiciliados(){
    if(this.domiciliados){
      this.nombresPaginados = this.nombres.filter(nombre=> nombre.domiciliado == 1);
    }else{
      this.paginacion();
    }
  }
  /**
   * Función que exporta los datos a csv
   * @method exportaCsv
   * @return {[type]}   [description]
   */
  exportaCsv() {
    this._ng2Csv.download(this.nombresPaginados, 'socios.csv', undefined, GLOBAL.csvConf);
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
