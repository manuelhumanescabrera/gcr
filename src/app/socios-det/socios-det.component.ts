import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OperacionesService } from '../services/operaciones.service';
import { Socio } from '../models/socios.model';
import { Telefono } from '../models/telefono.model';
import { GLOBAL } from '../services/global.service';
declare var $;
@Component({
  selector: 'app-socios-det',
  templateUrl: './socios-det.component.html',
  styleUrls: ['./socios-det.component.css']
})
export class SociosDetComponent implements OnInit {
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
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router,

  ) {
    this.titulo = 'Editar socio número: ';
    this.socio = new Socio(null, '', '', '', false, '', '', null, null, '', false, '', null, '');
    this.telefonos = new Array();
    this.socio.telefonos = this.telefonos;
    this.es = GLOBAL.es;
    this.mostrarSelectLocal = false;
    this.arrayLocalidades = new Array();
  }

  ngOnInit() {
    this._route.params.forEach(params => {
      this.num = params['num'];
      this.tipo = params['edit'];
      if (this.tipo === 'editar') {
        this.bloqueo = false;
      } else if (this.tipo === 'ver') {
        this.bloqueo = true;
      } else if (this.tipo === 'nuevo') {
        this.bloqueo = false;
      }
    });
    this.getSocio();
    setTimeout(() => { this.setDisabled() }, 500);//meto algo de retardo para bloquear todos los inputs
  }

  getSocio() {
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
        this.socio.localidad = datos.poblacion;
        this.getProvincia();
        // if(this.socio.localidad == null || this.socio.localidad == "" || this.socio.localidad == undefined){
        //   this.getLocalidad();
        // }
      } else {
        //gestionar error
      }
    }, err => {
      console.log(<any>err);
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
      }
    }, err => {
      console.log(<any>err);
    });
  }
  getProvincia() {
    this._operaciones.getProvincia(this.socio.cProvincia).subscribe(res => {
      if (res.code === 200) {
        let datos = JSON.parse(res.data);
        this.socio.provincia = datos.provincia;
      } else {
        //gestionar error
      }
    }, err => {
      console.log(<any>err);
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
        //gestionar error
      }
    }, err => {
      console.log(<any>err);
    })
  }
  cambiaLocalidad(event) {
    this.socio.localidad = event.target.value;
  }
  onSubmit() {

  }
  addSocio() {
    this.socio.numero = this.num;
    this._operaciones.setSocio(this.socio).subscribe(res => {
      if (res.code == 200) {
        console.log(res.message);
        this.setDisabled();
        this._router.navigate(['socios-det', this.num, 'editar']);
      } else {
        console.log(res.message);
      }
    }, err => {
      console.log(<any>err);
    })
  }
  updateSocio() {
    this._operaciones.setSocioActualiza(this.socio).subscribe(res => {
      if (res.code == 200) {
        console.log(res.message);
        this.setDisabled();
      } else {
        console.log(res.message);
      }
    }, err => {
      console.log(<any>err);
    })
  }
  setDisabled() {
    /*$("input").prop('disabled', this.bloqueo);
    $("textarea").prop('disabled', this.bloqueo);*/
    this.bloqueo = !this.bloqueo;
  }
  setTelefono() {
    let tel = new Telefono(null, this.socio.numero, null, true, '', '');
    this.socio.telefonos.push(tel);
    /*
    let tel = new Telefono(null, this.socio.numero, 666666666, true, '', '');
    this._operaciones.setTelefono(tel).subscribe(res=>{
      if(res.code === 200){
        this.socio.telefonos.splice(0, this.socio.telefonos.length);
        this.getTelefonos();
      }else{
        //gestionar error
      }
    }, err => {
      console.log(<any>err);
    });
*/
  }

  deleteTelefono(evento) {
    const id = evento.target.value;
    this._operaciones.deleteTelefono(id).subscribe(res => {
      if (res.code === 200) {
        this.socio.telefonos.splice(0, this.socio.telefonos.length);
        this.getTelefonos();
      }

    }, err => {
      console.log(<any>err);
    })
  }

}
