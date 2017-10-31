import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Socio } from '../models/socios.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
declare var $;

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit {
  public titulo: string;
  public nombres: Nombre[];
  public nombresBack: Nombre[];
  public nombre: Nombre;
  public socio:Socio;

  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router
  ) {
    this.titulo = 'GESTIÓN DE RECIBOS';
    this.nombres = new Array();
    this.nombresBack = new Array();
    this.nombre = new Nombre(null, '');
    this.socio = new Socio(null, '','', '', false, '', '', null, null, '', false, '', null, '');
  }

  ngOnInit() {
    // this.socios = this.getSocios();
    this.getNombres();
    this.nombresBack = this.nombres;
  }
  getNombres() {
    this._operaciones.getNombresPendientes().subscribe(res => {
      let datos = res.data;
      this.nombres = new Array();
      $.each(datos, (i, nombre) => {
        let nom = new Nombre(nombre.numero, nombre.nombre);
        nom.pendiente = nombre.pendiente;
        this.nombres.push(nom);
      });
      this.nombresBack = this.nombres.slice(0);
    }, err => {
      console.log(<any>err);
    })
  }

  consultarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['recibos-det', numero]);
  }
  editarSocio(evento){
    let numero = evento.target.value;
    this._router.navigate(['recibos-det', numero]);
  }
  /**
  * [buscarNumero description]
  * @method buscarNumero
  * @param  {[type]}     evento [description]
  * @return {[type]}            [description]
  */
  buscarNumero(evento) {
    this.nombre.nombre = null;
    let stringNumero = evento.target.value;
    if (stringNumero != "") {
      this.nombres = this.nombresBack.slice(0);
      var encontrados = this.nombres.filter(nombre =>
        nombre.numero.toString().toLowerCase().includes(stringNumero.toLowerCase())
      );
      this.nombres = encontrados;
    } else {
      this.nombres = this.nombresBack.slice(0);
    }
  }

  buscarNombre(evento) {
    this.nombre.numero = null;
    let stringNombre = evento.target.value;
    if (stringNombre != "") {
      this.nombres = this.nombresBack.slice(0);
      var encontrados = this.nombres.filter(nombre =>
        nombre.nombre.toLowerCase().includes(stringNombre.toLowerCase())
      );
      this.nombres = encontrados;
    } else {
      this.nombres = this.nombresBack.slice(0);
    }
  }

}
