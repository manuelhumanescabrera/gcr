import { Component, OnInit, DoCheck, Input, Output, EventEmitter, ErrorHandler } from '@angular/core';
import { OperacionesService } from '../services/operaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Peticion } from '../models/peticion.model';
import { Nombre } from '../models/nombre.model';
declare var $;
@Component({
  selector: 'app-peticiones-edit',
  templateUrl: './peticiones-edit.component.html',
  styleUrls: ['./peticiones-edit.component.css']
})
export class PeticionesEditComponent implements OnInit, ErrorHandler {

  public titulo: string;
  @Input() nombres: Nombre[];
  @Input() nombre: Nombre;
  @Input() peticion: Peticion;
  @Output() backEvent = new EventEmitter();
  public back: boolean;
  public error: Error;
public exito: string;

  constructor(private _operacionesService: OperacionesService, private _route: ActivatedRoute,
    private _router: Router) {
    this.titulo = 'EDITAR PETICIÓN';
    this.peticion = new Peticion(null, null, '', null);
    this.back = true;
    this.error = new Error();
    this.exito = '';
  }
  /**
   * Acciones al iniciar el módulo
   * Comprueba si estamos logueados y esconde los mensajes de error y exito.
   * @method ngOnInit
   */
  ngOnInit() {
    this.ngDoCheck();
    $("#error2").hide();
    $("#exito2").hide();
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
   * Setea el nombre del socio en el formulario de modificación.
   * @method setNombre
   * @return {[type]}  [description]
   */
  setNombre() {
    this.nombre = this.nombres[this.peticion.numero - 1];
    this.peticion.nombre = this.nombre.nombre;
  }
  /**
   * Función que actualiza una petición.
   * Si todo ha ido bien pone la variable back a false de modo que el padre
   * (peticiones) sepa que la operación ha culminado con exito.
   * @method onSubmit
   * @return {[type]} [description]
   */
  onSubmit() {
    if (this.peticion.id == null) {
      this.error = new Error('No existe la petición');
      this.handleError(this.error);
    } else{
      this._operacionesService.setActualizaPeticion(this.peticion.id, this.peticion).subscribe(res => {
        if (res.code == 200) {
          this.back = false;
          this.backEvent.emit(this.back);
          this.handleExito(res.message);
        } else {
          this.back = true;
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      }, err => {
        this.back = true;
        this.error = err;
        this.handleError(this.error);
      });
    }
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
    $("#exito2").show();
    await this.sleep(5000);
    $("#exito2").hide();
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
    $("#error2").show();
    await this.sleep(5000);
    $("#error2").hide();
    this.error = new Error();
  }
}
