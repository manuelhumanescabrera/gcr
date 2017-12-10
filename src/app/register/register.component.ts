import { Component, OnInit, ErrorHandler, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';
declare var $;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, ErrorHandler, DoCheck {
  public user: User;
  public error:Error;
  public exito:string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("","", "" ,"", "", "");
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
    $("#error").hide();
    $("#exito").hide();
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
   * Metodo que se ejecuta al hacer submit sobre el botón registrarse.
   * Si todo ha ido bien, mostrará un mensaje de exito tras un segundo
   * deslogueará al usuario y nos redirigirá hacia la pantalla de login.
   * En caso de error mostrará un error.
   * @method onSubmit
   * @return {[type]} [description]
   */
  onSubmit() {
    this._loginService.singup(this.user).subscribe(res => {
      if(res.code == 200){
        this.handleExito('Usuario creado con exito.');
        setTimeout(() => {
          localStorage.clear();
          this._router.navigate(["/login"]);
        }, 1000);
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
    }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    });
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
