import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Cargo } from '../models/cargo.model';
import { Recibo } from '../models/recibo.model';
import { User } from '../models/user.model';
import { OperacionesService } from '../services/operaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { GLOBAL } from '../services/global.service';
declare var $;
@Component({
  selector: 'app-ficheros',
  templateUrl: './ficheros.component.html',
  styleUrls: ['./ficheros.component.css']
})
export class FicherosComponent implements OnInit, ErrorHandler, DoCheck {
  public titulo: string;
  public cargo: Cargo;
  public cargos: Cargo[];
  public tipoFichero: string;
  public cadena: string;
  public usuario:User;
  public error: Error;
  public exito:string;
  public noDevoluciones:boolean;
  constructor(
    private _operaciones:OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'GESTIÓN DE FICHEROS';
    this.cargos = new Array();
    this.usuario = new User("", "", "", "", "", "");
    this.error = new Error();
    this.exito = '';
    this.noDevoluciones = true;
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
   * Función que lee el fichero y carga los datos en el array recibos.
   * Discrimina el tipo de fichero por extensión y solo trata XML de la norma
   * ISO 20022 de pagos y devoluciones así como CSV con un formato predefinido
   * de exportación desde el software GESTAGUA-CAP.
   * Además permite habilitar o no el botón para procesar las devoluciones cargadas
   * en el fichero correspondiente.
   * @method leeFichero
   * @return {[type]}   [description]
   */
  leeFichero() {
    this.cargos = [];
    if (this.tipoFichero == "text/xml") {
      var parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(this.cadena, "text/xml");
      var uri = xmlDoc.childNodes[0].namespaceURI;
      // si el fichero es de recibos lo puedo leer pero no procesar
      if (uri == "urn:iso:std:iso:20022:tech:xsd:pain.002.001.03") {

        var recibos = [];
        recibos = xmlDoc.getElementsByTagName('OrgnlTxRef');
        for (let i = 0; i < recibos.length; i++) {
          this.cargo = new Cargo(parseInt(recibos[i].children[4].children[0].innerHTML), recibos[i].children[6].children[0].innerHTML, recibos[i].children[5].children[0].innerHTML, recibos[i].children[0].children[0].innerHTML, recibos[i].children[1].innerHTML);
          this.cargos.push(this.cargo);
        }
        if(this.cargos.length>0){
          this.noDevoluciones = false;
        }
      } else if (uri == "urn:iso:std:iso:20022:tech:xsd:pain.008.001.02") {
        //si el fichero es de devoluciones permito leerlo y procesarlo
        this.noDevoluciones = true;
        var recibos = [];
        recibos = xmlDoc.getElementsByTagName('DrctDbtTxInf');
        for (let i = 0; i < recibos.length; i++) {
          this.cargo = new Cargo(parseInt(recibos[i].children[2].children[0].children[0].innerHTML), recibos[i].children[4].children[0].innerHTML, recibos[i].children[6].children[0].innerHTML, recibos[i].children[1].innerHTML, null);
          this.cargos.push(this.cargo);
        }
      }
    } else if (this.tipoFichero == "text/csv") {
      var linea = [];
      this.cargos = [];
      linea = this.cadena.split("\n");
      var caracter = "\t";
      //cuento que caracter es más comun como separador
      var coma = linea[0].split(",");
      var tabulador = linea[0].split("\t");
      if (coma.length > tabulador.length) {
        caracter = ",";
      }
      let cabecera = linea[0].split(caracter);
      //compruebo si los 4 primeros campos de la primera fila contienen los textos
      //que tiene que tener el fichero de devoluciones. En ese caso permito la lectura
      //y el procesado.
      if(cabecera[0].includes('usuario') && cabecera[1].includes('Nombre') &&
        cabecera[2].includes('Importe') && cabecera[3].includes('Concepto')){
          for (let i = 1; i < linea.length - 1; i++) {
            let texto = linea[i].split(caracter);
            this.cargos.push(new Cargo(parseInt(texto[0]), texto[1], texto[3], texto[2], null));
          }
          if(this.cargos.length>0){
            this.noDevoluciones = false;
          }
        }else{
          this.noDevoluciones = true;
          this.error = new Error('Fichero CSV no soportado.');
          this.handleError(this.error);
        }
    }else{
      this.noDevoluciones = true;
      this.error = new Error('Fichero de datos no soportado.');
      this.handleError(this.error);
    }
  }
  /**
   * Función que almacena los recibos devueltos en la base de datos.
   * para ello llama a la función setInsertaRecibo del servicio Operaciones.
   * En caso de error muestra un mensaje.
   * @method procesarDevoluciones
   * @return {[type]}             [description]
   */
  async procesarDevoluciones(){
    let contador = 0;
    for(let i = 0; i<this.cargos.length;i++){
      let cr = this.cargos[i];
      let recibo = new Recibo(null,cr.numero,cr.nombre,parseFloat(cr.cantidad.replace(",",".")),cr.concepto,false,null,'');
      this._operaciones.setInsertaRecibo(recibo).subscribe(res=>{
        if(res.code == 200){
          contador++;
        }else{
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      },err => {
        this.error = err;
        this.handleError(this.error);
      })
    }
    await this.sleep(1000);
    if(contador == this.cargos.length){
      this.handleExito('Todos los recibos han sido cargados correctamente');
      this.limpiaDatos();
    }else{
      this.error = new Error('Algunos recibos no han podido cargarse correctamente');
      this.handleError(this.error);
    }
  }
  /**
   * Función que limpia el array de cargos e inhabilita el boton procesar.
   * @method limpiaDatos
   * @return {[type]}    [description]
   */
  limpiaDatos() {
    this.cargos = new Array();
    this.noDevoluciones = true;
  }
  /**
   * Función que exporta los datos a csv
   * @method exportaCsv
   * @return {[type]}   [description]
   */
  exportaCsv() {
    this._ng2Csv.download(this.cargos, 'salida.csv', undefined, GLOBAL.csvConf);
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
