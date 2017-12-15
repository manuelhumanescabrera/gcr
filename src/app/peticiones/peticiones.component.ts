// ACABADO
import { Component, OnInit, ErrorHandler } from '@angular/core';
import { OperacionesService } from '../services/operaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Peticion } from '../models/peticion.model';
import { Nombre } from '../models/nombre.model';
import { Remesa } from '../models/remesa.model';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { GLOBAL } from '../services/global.service';
declare var $;
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public peticion: Peticion;
  public peticiones: Peticion[];
  public peticionEdit: Peticion;
  private peticionTemp: Peticion;
  public nombre: Nombre;
  public nombres: Nombre[];
  private numeroPeticion: number;
  public back: boolean;
  public selectAll: boolean;
  public remesa: Remesa;
  public inputDatosRem: boolean;
  public error: Error;
  public exito: string;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'GESTIÓN DE PETICIONES';
    this.peticion = new Peticion(null, null, "", null);
    this.peticiones = new Array();
    this.nombre = new Nombre(null, "", false);
    this.nombres = new Array();
    this.peticionEdit = new Peticion(null, null, "", null);
    this.back = true;
    this.selectAll = false;
    this.remesa = new Remesa(null, '', '');
    this.inputDatosRem = false;
    this.error = new Error();
    this.exito = '';
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
   * Acciones al iniciar el módulo
   * Comprueba si estamos logueados y esconde los mensajes de error y exito y el modal de modificaciones.
   * obtiene los nombres y las peticiones y habilita cerrar el modal desde la tecla escape.
   * @method ngOnInit
   */
  ngOnInit() {
    this.ngDoCheck();
    $('#modalEdit').hide();
    $("#error").hide();
    $("#exito").hide();
    this.getNombres();
    this.getPeticiones();
    var that = this;//defino esto para poder utilizar el objeto dentro de la función
    $(document).keypress(
      //cierra el modal pulsando la tecla esc
      function(e) {
        if (e.keyCode == 27) {
          that.cerrarModal();
        }
      });
  }
  /**
   * función que obtiene los nombres de los socios del servidor.
   * @method getNombres
   * @return {[type]}   [description]
   */
  getNombres() {
    this._operaciones.getNombres().subscribe(res => {
      if (res.code == 200) {
        this.nombres = res.data;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }

    }, err => {
      this.error = err;
      this.handleError(err);
    })
  }
  /**
   * Función que obtiene del servidor las peticiones.
   * @method getPeticiones
   * @return {[type]}      [description]
   */
  getPeticiones() {
    this._operaciones.getPeticiones().subscribe(res => {
      if (res.code == 200) {
        this.peticiones = res.data;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    });
  }
  /**
   * Función que se llama al hacer submit sobre el formulario de añadir petición.
   * Llama a addPeticion y limpia los campos del formulario.
   * @method onSubmit
   * @return {[type]} [description]
   */
  onSubmit() {
    if (this.peticion.numero != null && this.peticion.horas != null) {
      this.addPeticion();
      this.peticion.numero = null;
      this.peticion.horas = null;
    }
  }
  /**
   * Función que comprueba si se han guardado los datos antes de salir del modal
   * de modificación de la petición.
   * Si los datos no se han guardado (this.back = true) se restrablece la petición
   * sin modificaciones.
   * @method onCancel
   * @return {[type]} [description]
   */
  onCancel() {
    if (this.back) {
      this.peticiones[this.numeroPeticion] = this.peticionTemp;
    } else {
      this.back = true;
    }
  }
  /**
   * Función que setea el nombre del usuario en función de su número.
   * @method setNombre
   * @return {[type]}  [description]
   */
  setNombre() {
    var num;
    if (this.peticion.numero == undefined || this.peticion.numero - 1 > this.nombres.length - 1 || this.peticion.numero - 1 < 0) {
      this.peticion.nombre = "";
      this.peticion.numero = Number.NaN;
    } else {
      num = this.nombres[this.peticion.numero - 1];
      if (this.peticion.numero == num.numero) {
        this.peticion.nombre = num.nombre;
      } else {
        this.peticion.nombre = "";
      }
    }
  }
  /**
   * Función que añade una petición a la base de datos.
   * @method addPeticion
   * @return {[type]}    [description]
   */
  addPeticion() {
    this._operaciones.setPeticion(this.peticion).subscribe(
      res => {
        this.peticion = new Peticion(null, null, "", null);
        if (res.code == 200) {
          this.getPeticiones();
        } else {
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      },
      err => {
        this.error = err;
        this.handleError(err);
      }
    );
  }
  /**
   * Función que muestra el modal para modificar una petición.
   * Guarda la petición en la variable peticionTemp por si no se guardan los datos
   * correctamente modificados.
   * @method editar
   * @param  {number} evento [numero de petición a editar]
   * @return {[type]}        [description]
   */
  editar(evento) {
    this.numeroPeticion = evento.target.value;
    this.peticionEdit = this.peticiones[this.numeroPeticion];
    this.peticionTemp = new Peticion(this.peticionEdit.id, this.peticionEdit.numero, this.peticionEdit.nombre, this.peticionEdit.horas);
    $('#modalModificaciones').show();
  }
  /**
   * Elimina una petición por su posición en el array de peticiones.
   * @method eliminar
   * @param  {any} evento [objeto html correspondiente al botón eliminar de cada fila]
   * @param  {number} pos    [Posición del elemento a eliminar en el array]
   */
  eliminar(evento, pos) {
    var peticionEliminar = this.peticiones[evento.target.value];
    this._operaciones.deletePeticion(peticionEliminar.id).subscribe(res => {
      if (res.code == 200) {
        this.peticiones.splice(pos, 1);
        this.getPeticiones();
        this.handleExito(res.message);
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    })
  }
  /**
   * Función que oculta el modal de modificaciones de peticiones.
   * @method cerrarModal
   * @return {[type]}    [description]
   */
  cerrarModal() {
    this.onCancel();
    $('#modalModificaciones').fadeOut(500);
  }
  /**
   * Función que recoge del elemento hijo (modal modificaciones) si se ha guardado
   * la modificación de la petición o no.
   * @method backPeticion
   * @param  {boolean}     evento [true si volvemos al objeto origina, false si no]
   * @return {[type]}            [description]
   */
  backPeticion(evento) {
    this.back = evento;
  }
/**
 * Función que elimina todas las peticiones.
 * @method deleteAll
 * @return {[type]}  [description]
 */
  async deleteAll() {
    let err:boolean = false;
    for (let pet of this.peticiones){
      await this._operaciones.deletePeticion(pet.id).subscribe(res => {
        if (res.code == 200) {
          this.peticiones = new Array();
          this.getPeticiones();
        } else {
          err = true;
        }
      }, err => {
        err = true
      });
      if(err){
        this.error = new Error('Ha habido problemas eliminando peticiones');
        this.handleError(this.error);
      }else{
        this.handleExito('Todos los registros han sido eliminados correctamente');
      }
    }
    this.peticiones = new Array();
  }
  /**
   * función que muestra el panel para completar los datos de la remesa.
   * @method muestraInputDatosRem
   * @return {[type]}             [description]
   */
  muestraInputDatosRem() {
    this.inputDatosRem = true;
  }
  /**
   * Función que genera una remesa.
   * @method generaRemesa
   * @return {[type]}     [description]
   */
generaRemesa() {
  this._operaciones.generaRemesa(this.remesa).subscribe(res => {
      if (res.code == 200) {
        this.inputDatosRem = false;
        this.remesa = new Remesa(null, '', '');
        this.peticiones = new Array();
        this.handleExito(res.message);
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    });
    //this.getPeticiones();
  }
  /**
   * Función que oculta el panel para completar los datos de la remesa
   * @method salirGenRemesa
   * @return {[type]}       [description]
   */
  salirGenRemesa(){
    this.inputDatosRem = false;
    this.remesa = new Remesa(null, '', '');
  }
  /**
   * Función que exporta los datos a csv
   * @method exportaCsv
   * @return {[type]}   [description]
   */
  exportaCsv() {
    this._ng2Csv.download(this.peticiones, 'peticiones.csv', undefined, GLOBAL.csvConf);
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
   * Función que muestra un mensaje de exito durante 5000 ms.
   * @method handleExito
   * @param  {string}    mensaje [Texto que queremos mostrar]
   */
  async handleExito(mensaje:string){
    this.exito = mensaje;
    $("#exito").show();
    await this.sleep(5000);
    $("#exito").hide();
    this.exito = '';
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
