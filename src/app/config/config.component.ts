import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConfigService } from '../services/config.service';
import {Config} from '../models/config.model';
declare var $;
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, DoCheck, ErrorHandler {
  public titulo:String;
  public config:Config;
  public error: Error;
  public exito: String;
  constructor(
    private _config: ConfigService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.titulo = "Configuraciones";
    this.config = new Config();
    this.error = new Error();
    this.exito = '';
  }

  /**
   * Acciones al iniciar el módulo
   * Comprueba si estamos logueados y esconde los mensajes de error y exito
   * y obtiene la configuración desde el servidor.
   * @method ngOnInit
   */
  ngOnInit() {
    this.ngDoCheck();
    $("#error").hide();
    $("#exito").hide();
    this.getConfig();
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
   * Método que obtiene la configuración desde el servidor.
   * En caso de exito muestra un mensaje.
   * En caso de error muestra un mensaje de error.
   * @method getConfig
   * @return {[type]}  [description]
   */
  getConfig(){
    this._config.getConf().subscribe(res=>{
      if(res.code == 200){
        this.handleExito('Configuración cargada correctamente');
        this.config = JSON.parse(res.data);
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
   * Función que guarda en el servidor los datos de configuración.
   * En caso de exito muestra un mensaje.
   * En caso de error muestra un mensaje.
   * @method setConfig
   * @return {[type]}  [description]
   */
  setConfig(){
    this._config.setConf(this.config).subscribe(res=>{
      if(res.code == 200){
        this.handleExito(res.message);
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
   * Función que limpia los campos del formulario.
   * @method limpiar
   * @return {[type]} [description]
   */
  limpiar(){
    this.config = new Config();
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
