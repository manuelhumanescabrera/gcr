import { Component, OnInit, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoginService } from '../services/login.service';
import { User } from '../models/user.model';
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, ErrorHandler {
  public user: User;
  public error: Error;
  public exito: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService
  ) {
    this.user = new User("", "", "", "", "", "");
    this.error = new Error();
    this.exito = '';
  }
  /**
   * Acciones al iniciar el módulo
   * Esconde los mensajes de error y exito.
   * @method ngOnInit
   */
  ngOnInit() {
    $("#error").hide();
    $("#exito").hide();
  }
  /**
   * Método que se ejecuta al hacer login.
   * Si todo ha ido bien, se muestra un mensaje de usuario autentificado correctamente
   * durante 1 segundo, se almacena la información del usuario en el localStorage
   * y se redirige hacia el inicio de la aplicación.
   * En caso contrario se muestra un mensaje de error.
   * @method onSubmit
   * @return {[type]} [description]
   */
  async onSubmit() {
    this.user.email = this.user.username;
    this._loginService.login(this.user).subscribe(res => {
      if (res.code == 200) {
        this.handleExito('Usuario autentificado correctamente');
        setTimeout(() => {
          let obj = res.data;
          localStorage.setItem("usuario", obj);
          this._router.navigate(['/']);
        }, 1000);
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
