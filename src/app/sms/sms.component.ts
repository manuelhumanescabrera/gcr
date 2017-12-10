import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OperacionesService } from '../services/operaciones.service';
import 'rxjs/add/operator/map';
import { Sms } from '../models/sms.model';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { GLOBAL } from '../services/global.service';
declare var $;
@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.css']
})
export class SmsComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public sms: Sms;
  public arraySms: Array<Sms>;
  public fichero: any;
  public tipoFichero: string;
  public cadena: string;
  public haySms: boolean;
  public error: Error;
  public porcEnvio: string;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _ng2Csv: Ng2CsvService) {
    this.titulo = 'ENVÍO DE SMS';
    this.arraySms = new Array();
    this.haySms = false;
    this.error = new Error();
    this.porcEnvio = "";
  }
  /**
   * Acciones al iniciar el módulo
   * Comprueba si estamos logueados y esconde los mensajes de error y exito y el diálogo de progreso.
   * Comprueba si hay sms guardados en el localStorage
   * @method ngOnInit
   */
  ngOnInit() {
    this.ngDoCheck();
    $('#pleaseWaitDialog').hide();
    $("#error").hide();
    let smss = localStorage.getItem('sms');
    if (smss != null) {
      this.arraySms = JSON.parse(smss);
      this.haySms = true;
    }
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
   * Función que carga un fichero desde el botón cargar.
   * Una vez cargado lo lele como una cadena binaria.
   * @method cargaFichero
   * @param  {any}     event [Objeto HTML que representa el botón subir fichero]
   */
  cargaFichero(event) {
    let file = event.originalTarget.files[0];
    var reader = new FileReader();
    this.tipoFichero = file.type;
    reader.onload = () => {
      this.cadena = reader.result;
      this.leeFichero();
    };
    reader.readAsBinaryString(file);
  }
  /**
   * Función que lee un fichero CSV con unos campos predefinidos y los guarda en
   * un array de sms.
   * @method leeFichero
   * @return {[type]}   [description]
   */
  leeFichero() {
    if (this.tipoFichero == "text/csv") {
      var linea = [];
      this.arraySms = [];
      linea = this.cadena.split("\n");
      var caracter = "\t";
      //cuento que caracter es más comun como separador
      var coma = linea[0].split(",");
      var tabulador = linea[0].split("\t");
      if (coma.length > tabulador.length) {
        caracter = ",";
      }
      let cabecera = linea[0].split(caracter);
      //compruebo si los 45primeros campos de la primera fila contienen los textos
      //que tiene que tener el fichero de sms. En ese caso permito la lectura
      //y el procesado.
      if (cabecera[0].includes('usuario') && cabecera[1].includes('Nombre') &&
        cabecera[2].includes('movil') && cabecera[3].includes('factura') &&
        cabecera[4].includes('Importe')) {
        for (let i = 1; i < linea.length - 1; i++) {
          let texto = linea[i].split(caracter);
          let cantidad = texto[4].replace(",", ".");
          if (texto[2] != "" && parseFloat(cantidad) > 0) {
            this.arraySms.push(new Sms(texto[0], texto[1], texto[2], texto[3], texto[4]));
          }
        }
      }else{
        this.error = new Error('Fichero CSV no soportado.');
        this.handleError(this.error);
      }
    } else {
      this.error = new Error('Archivo no soportado.');
      this.handleError(this.error);
    }
  }
  /**
   * Función que limpia el array de sms y el localStorage por si se han almacenado
   * desde Remesas.
   * @method limpiaDatos
   * @return {[type]}    [description]
   */
  limpiaDatos() {
    this.arraySms = new Array();
    localStorage.removeItem('sms');
    this.haySms = false;
  }
  /**
   * Función que se encarga de enviar los sms.
   * Entre sms y sms hay que mantener un tiempo de espera de 3 segundos para evitar
   * colapsar el servidor de envío.
   * Si un mensaje ha sido correctamente enviado pasa el estado a Enviado, y si falla
   * a Error.
   * Por último esconde el diálogo de progreso y pone el porcentaje de envío a 0
   * @method enviaSMS
   * @return {[type]} [description]
   */
  async enviaSMS() {
    $('#pleaseWaitDialog').show();
    for (let i = 0; i < this.arraySms.length; i++) {
      await this.sleep(3000);
      this.calculaPorcentaje(i + 1);
      this._operaciones.sendSms(this.arraySms[i]).subscribe(
        result => {
          if (result.code == 200) {
            this.arraySms[i].estado = "Enviado";
          } else {
            this.arraySms[i].estado = "Error";
          }
        },
        error => {
          this.arraySms[i].estado = "Error";
        }
      );
    }
    await this.sleep(1000);
    $('#pleaseWaitDialog').hide();
    this.porcEnvio = "" + 0 + "%";
  }
  /**
   * función que calcula el porcentaje de mensajes enviados (no discrimina si correcta
   * o incorrectamente).
   * @method calculaPorcentaje
   * @param  {number}          enviados [description]
   * @return {[type]}                   [description]
   */
  calculaPorcentaje(enviados: number) {
    this.porcEnvio = "" + (enviados * 100) / this.arraySms.length + "%";
  }
  /**
   * Función que exporta los datos a csv
   * @method exportaCsv
   * @return {[type]}   [description]
   */
  exportaCsv() {
    this._ng2Csv.download(this.arraySms, 'sms.csv', undefined, GLOBAL.csvConf);
  }
  /**
   * Función que pausa la ejecución del código
   * @method sleep
   * @param  {number} ms [milisegundos de espera]
   */
  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * Función de manejo de errores.
   * Muestra un mensaje al usuario durante 5000 ms.
   * @method handleError
   * @param  {Error}     error [Error que queremos mostrar]
   */
  async handleError(error: Error) {
    console.log(error.message);
    $("#error").show();
    await this.sleep(5000);
    $("#error").hide();
    this.error = new Error();
  }

}
