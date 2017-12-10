import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Recibo} from '../models/recibo.model';
import { Socio } from '../models/socios.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import {GLOBAL} from '../services/global.service';
declare var $;

@Component({
  selector: 'app-recibos-det',
  templateUrl: './recibos-det.component.html',
  styleUrls: ['./recibos-det.component.css']
})
export class RecibosDetComponent implements OnInit, ErrorHandler {
  public titulo:string;
  public num:number;
  public recibo: Recibo;
  public recibos:Recibo[];
  public nombre:Nombre;
  public cantidad: number;
  public editar: boolean;
  public es:any;
  public error:Error;
  public exito:string;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'RECIBOS PENDIENTES: ';
    this.recibos = new Array();
    this.nombre = new Nombre(null, '', false);
    this.cantidad = null;
    this.editar = true;
    this.recibo = new Recibo(null, null, '', null, '' ,false,'', '' );
    this.es = GLOBAL.es;
    this.error = new Error();
    this.exito = '';
   }
   /**
    * Acciones al iniciar el módulo
    * Comprueba si estamos logueados y esconde los mensajes de error y exito.
    * Guarda el parámetro pasado por la url en number
    * obtiene el nombre del usuario, los recibos del mismo y la cantidad pendiente de pago.
    * @method ngOnInit
    */
  ngOnInit() {
    this.ngDoCheck();
    $("#error").hide();
    $("#exito").hide();
    this._route.params.forEach(params => {
      this.num = params['num'];
    });
    this.getSocioNombre();
    this.getRecibos();
    this.getCantidad();
  }
  /**
   * Comprueba si estamos logueados.
   * En caso contrario nos redirige al login.
   * @method ngDoCheck
   */
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }
  }
  /**
   * Obtiene el nombre del usuario.
   * @method getSocioNombre
   * @return {[type]}       [description]
   */
  getSocioNombre(){
    this._operaciones.getNombre(this.num).subscribe(res=>{
      if(res.code === 200){
      let nom = JSON.parse(res.data);
        this.nombre = new Nombre (this.num, nom.nombre, false);
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  /**
   * Obtiene los recibos del usuario.
   * @method getRecibos
   * @return {[type]}   [description]
   */
  getRecibos(){
    this._operaciones.getRecibosPendientes(this.num).subscribe(res=>{
      if(res.code === 200){
        this.recibos = res.data;
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  /**
   * obtiene la cantidad pendiente de un usuario
   * @method getCantidad
   * @return {[type]}    [description]
   */
  getCantidad(){
    this._operaciones.getCantidad(this.num).subscribe(res=>{
      if(res.code === 200){
        let cant = JSON.parse(res.data)
        this.cantidad = cant.pendiente;
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  /**
   * Función que se encarga obtener el recibo seleccionado y setearlo en el formulario
   * de editar los recibos.
   * @method editarRecibo
   * @param  {[type]}     event [description]
   * @return {[type]}           [description]
   */
  editarRecibo(event){
    var num_fila = event.target.value;
    this._operaciones.getRecibo(num_fila).subscribe(res=>{
      if( res.code === 200){
        let rec = res.data;
        if(rec.pagado == 1){
          rec.pagado = true;
        }else if (rec.pagado == 0){
          rec.pagado = false;
        }
        this.recibo = new Recibo(rec.id, rec.numero, rec.nombre, rec.euros, rec.concepto ,rec.pagado, rec.fecha_pago, rec.observaciones );
        this.editar = !this.editar;
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err =>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  /**
   * función encargada de guardar los cambios en la base de datos.
   * @method guardarRecibo
   * @return {[type]}      [description]
   */
  guardarRecibo(){
   this._operaciones.setActualizaRecibo(this.recibo).subscribe(res=>{
     if(res.code == 200){
       this.handleExito(res.message);
       this.getRecibos();
       this.getCantidad();
     }else{
       this.error = new Error(res.message);
       this.handleError(this.error);
     }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    });
    this.editar = !this.editar;
  }
  /**
   * Función que nos devuelve al component recibos.
   * @method volver
   * @return {[type]} [description]
   */
  volver(){
    this._router.navigate(['/recibos']);
  }
  /**
   * Función que cierra el panel de editar un recibo.
   * @method salirEditar
   * @return {[type]}    [description]
   */
  salirEditar(){
    this.editar = !this.editar;
    this.recibo = new Recibo(null, null, '', null, '' ,false,'', '' );
  }

  /**
   * Función que exporta los datos a csv
   * @method exportaCsv
   * @return {[type]}   [description]
   */
  exportaCsv() {
    this._ng2Csv.download(this.recibos, 'recibos_'+this.nombre.numero+'.csv', undefined, GLOBAL.csvConf);
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
