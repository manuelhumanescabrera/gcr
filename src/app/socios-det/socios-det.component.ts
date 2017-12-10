import { Component, OnInit,DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import { OperacionesService } from '../services/operaciones.service';
import { Socio } from '../models/socios.model';
import { Telefono } from '../models/telefono.model';
import {Parcela} from '../models/parcela.model';
import { GLOBAL } from '../services/global.service';
declare var $;
@Component({
  selector: 'app-socios-det',
  templateUrl: './socios-det.component.html',
  styleUrls: ['./socios-det.component.css']
})
export class SociosDetComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public num: number;
  public tipo: string;
  public socio: Socio;
  public telefono: Telefono;
  public telefonos: Telefono[];
  public bloqueo: boolean;
  public mostrarSelectLocal: boolean;
  public es: any;
  public arrayLocalidades: any[];
  public muestraTelAdd:boolean;
  public error:Error;
  public exito:string;
  public parcelas:Parcela[];
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'Socio número: ';
    this.socio = new Socio(null, '', '', '', false, '', '', null, null, '', false, '', null, '');
    this.telefonos = new Array();
    this.socio.telefonos = this.telefonos;
    this.es = GLOBAL.es;
    this.mostrarSelectLocal = false;
    this.arrayLocalidades = new Array();
    this.telefono = new Telefono(null, this.socio.numero, null, true, '', '');
    this.muestraTelAdd = false;
    this.error = new Error();
    this.exito = '';
    this.parcelas = new Array();
  }

  ngOnInit() {
    $("#error").hide();
    $("#exito").hide();
    this.ngDoCheck();
    this._route.params.forEach(params => {
      this.num = params['num'];
      this.tipo = params['edit'];
      if (this.tipo === 'editar') {
        this.bloqueo = true;
      } else if (this.tipo === 'ver') {
        this.bloqueo = false;
      } else if (this.tipo === 'nuevo') {
        this.bloqueo = true;
      }
    });
    this.getSocio();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }
  }

  getSocio() {
    if(this.tipo != 'nuevo'){
      this._operaciones.getSocio(this.num).subscribe(res => {
        if (res.code === 200) {
          let datos = JSON.parse(res.data);
          if (datos.domiciliado == '0' || datos.domiciliado == false) {
            datos.domiciliado = false;
          } else {
            datos.domiciliado = true;
          }
          if (datos.no_activo == '0' || datos.no_activo == false) {
            datos.no_activo = false;
          } else {
            datos.no_activo = true;
          }
          this.socio = new Socio(parseInt(datos.numero), datos.nombre, datos.apellido1,
            datos.apellido2, datos.domiciliado, datos.DNI, datos.direccion,
            datos.cod_postal, datos.cod_prov, datos.alta, datos.no_activo, datos.baja,
            datos.propiedad, datos.observaciones);
          this.getTelefonos();
          this.getParcelas();
          this.socio.localidad = datos.poblacion;
          this.getProvincia();
        } else {
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      }, err => {
        this.error = err;
        this.handleError(this.error);
      });
    }

  }
  /**
   * Obtiene los teléfonos del socio y los incluye en el objeto socio.
   * @method getTelefonos
   * @return {[type]}     [description]
   */
  getParcelas() {
    this._operaciones.getParcelas(this.num).subscribe(res => {
      if (res.code == 200) {
        this.parcelas = JSON.parse(res.data);
        this.socio.parcelas = this.parcelas;
      } else {
        this.parcelas = new Array();
        this.socio.parcelas = this.parcelas;
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    });
  }
  /**
   * Obtiene los teléfonos del socio y los incluye en el objeto socio.
   * @method getTelefonos
   * @return {[type]}     [description]
   */
  getTelefonos() {
    this._operaciones.getTelefonos(this.num).subscribe(res => {
      if (res.code === 200) {
        let datos = JSON.parse(res.data);
        for (let i = 0; i < datos.length; i++) {
          if (datos[i].activo === '1') {
            datos[i].activo = true;
          } else {
            datos[i].activo = false;
          }
          this.telefono = new Telefono(datos[i].id, datos[i].socio, datos[i].telefono, datos[i].activo, datos[i].fecha_alta, datos[i].fecha_baja);
          this.telefonos.push(this.telefono);
        }
        this.socio.telefonos = this.telefonos;
      } else {
        this.telefonos = new Array();
        this.socio.telefonos = this.telefonos;
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    });
  }
  getProvincia() {
    this._operaciones.getProvincia(this.socio.cProvincia).subscribe(res => {
      if (res.code === 200) {
        let datos = JSON.parse(res.data);
        this.socio.provincia = datos.provincia;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }
  getLocalidad() {
    //getLocalidad se llama solo cuando se modifica el código postal o cuando no está informado el campo localidad
    this._operaciones.getLocalidad(this.socio.cPostal).subscribe(res => {
      if (res.code === 200) {
        this.arrayLocalidades = JSON.parse(res.data);
        if (this.arrayLocalidades.length == 1) {
          this.mostrarSelectLocal = false;
          this.socio.localidad = this.arrayLocalidades[0].poblacion;
          this.socio.cProvincia = this.arrayLocalidades[0].cod_prov;
          this.getProvincia();
        } else {
          this.mostrarSelectLocal = true;
          this.socio.localidad = this.arrayLocalidades[0].poblacion;
          this.socio.cProvincia = this.arrayLocalidades[0].cod_prov;
          this.getProvincia();
        }
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }
  cambiaLocalidad(event) {
    this.socio.localidad = event.target.value;
  }
  addSocio() {
    this.socio.numero = this.num;
    this._operaciones.setSocio(this.socio).subscribe(res => {
      if (res.code == 200) {
        this.msgExito('Socio añadido correctamente');
        this.setDisabled();
        this._router.navigate(['socios-det', this.num, 'editar']);
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }
  updateSocio() {
    this._operaciones.setSocioActualiza(this.socio).subscribe(res => {
      if (res.code == 200) {
        this.msgExito('Socio actualizado correctamente');
        this.setDisabled();
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }
  setDisabled() {
    this.bloqueo = !this.bloqueo;
  }
  setTelefono() {
    this.telefono.socio = this.num;
    this._operaciones.setTelefono(this.telefono).subscribe(res=>{
      if(res.code === 200){
        this.msgExito('Teléfono añadido correctamente');
        this.socio.telefonos.splice(0, this.socio.telefonos.length);
        this.getTelefonos();
        this.limpiaTel();
        this.muestraTelAdd = false;
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    });
  }
  limpiaTel(){
    this.telefono = new Telefono(null, this.socio.numero, null, true, '', '');
  }
  verTelefonoAdd(){
    this.limpiaTel();
    this.muestraTelAdd = !this.muestraTelAdd;
  }

  deleteTelefono(evento) {
    const id = evento.target.value;
    this._operaciones.deleteTelefono(id).subscribe(res => {
      if (res.code === 200) {
        this.msgExito('Teléfono borrado correctamente');
        this.socio.telefonos.splice(0, this.socio.telefonos.length);
        this.getTelefonos();
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(this.error);
    })
  }
  exportaCsv(){
      let socios = new Array();
      socios.push(this.socio);
      socios.push(this.socio.telefonos);
      socios.push(this.socio.parcelas);
    this._ng2Csv.download(socios, this.socio.numero+'.csv', undefined, GLOBAL.csvConf);

  }
  handleError(error) {
     console.log(error.message);
     $("#error").show().delay(5000).fadeOut();
     // IMPORTANT: Rethrow the error otherwise it gets swallowed
     //throw error;
  }
  msgExito(mensaje:string){
    this.exito = mensaje;
    $("#exito").show().delay(5000).fadeOut();
  }
}
