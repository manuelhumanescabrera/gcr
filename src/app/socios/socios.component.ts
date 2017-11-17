import { Component, OnInit, DoCheck } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Socio } from '../models/socios.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
declare var $;

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
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
    this.titulo = 'USUARIOS DE LA COMUNIDAD';
    this.nombres = new Array();
    this.nombresBack = new Array();
    this.nombre = new Nombre(null, '');
    this.socio = new Socio(null, '','', '', false, '', '', null, null, '', false, '', null, '');
  }

  ngOnInit() {
    this.ngDoCheck();
    // this.socios = this.getSocios();
    this.getNombres();
    this.nombresBack = this.nombres;
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }
  }
  getNombres() {
    this._operaciones.getNombres().subscribe(res => {
      let datos = res.data;
      this.nombres = new Array();
      $.each(datos, (i, nombre) => {
        let nom = new Nombre(nombre.numero, nombre.nombre);
        this.nombres.push(nom);
      });
      this.nombresBack = this.nombres.slice(0);
    }, err => {
      console.log(<any>err);
    })
  }

  consultarSocio(evento) {
    let numero = evento.target.value;
    this._router.navigate(['socios-det', numero, 'ver']);
  }
  editarSocio(evento){
    let numero = evento.target.value;
    this._router.navigate(['socios-det', numero, 'editar']);
  }
  addSocio(){
    this._operaciones.getSocioSig().subscribe(res=>{
      let numero = JSON.parse(res.data);
      this._router.navigate(['socios-det', numero['siguiente'], 'nuevo']);
    }, err =>{
      console.log(<any>err);
    })

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
