import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Recibo} from '../models/recibo.model';
import { Socio } from '../models/socios.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
import {GLOBAL} from '../services/global.service';
declare var $;

@Component({
  selector: 'app-recibos-det',
  templateUrl: './recibos-det.component.html',
  styleUrls: ['./recibos-det.component.css']
})
export class RecibosDetComponent implements OnInit {
  public titulo:string;
  public num:number;
  public recibo: Recibo;
  public recibos:Recibo[];
  public nombre:Nombre;
  public cantidad: number;
  public editar: boolean;
  public es:any;
  /**/

  /**/
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router
  ) {
    this.titulo = 'RECIBOS PENDIENTES: ';
    this.recibos = new Array();
    this.nombre = new Nombre(null, '', false);
    this.cantidad = null;
    this.editar = true;
    this.recibo = new Recibo(null, null, '', null, '' ,false,'', '' );
    this.es = GLOBAL.es;
   }

  ngOnInit() {
    this.ngDoCheck();
    this._route.params.forEach(params => {
      this.num = params['num'];
    });
    this.getSocioNombre();
    this.getRecibos();
    this.getCantidad();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if(usuario == "no"){
      this._router.navigate(['login']);
    }
  }
  getSocioNombre(){
    this._operaciones.getNombre(this.num).subscribe(res=>{
      if(res.code === 200){
      let nom = JSON.parse(res.data);
        this.nombre = new Nombre (this.num, nom.nombre, false);
      }//dirigir a error
    }, err=>{
      console.log(<any>err);
    })
  }
  getRecibos(){
    this._operaciones.getRecibosPendientes(this.num).subscribe(res=>{
      if(res.code === 200){
        this.recibos = res.data;
      }
      //redireccionar a error
    }, err=>{
      console.log(<any>err);
    })
  }
  getCantidad(){
    this._operaciones.getCantidad(this.num).subscribe(res=>{
      if(res.code === 200){
        let cant = JSON.parse(res.data)
        this.cantidad = cant.pendiente;
      }
    }, err=>{
      console.log(<any>err);
    })
  }
  consultarRecibo(event){
    console.log(event.target.value);
  }
  editarRecibo(event){
    var num_fila = event.target.value;
    this._operaciones.getRecibo(num_fila).subscribe(res=>{
      if( res.code === 200){
        let rec = res.data;
        if(rec.pagado == 1){
          rec.pagado = true;
        }else if (rec.pagado == 0){
          rec.pagado = false;
        }
        this.recibo = new Recibo(rec.id, rec.numero, rec.nombre, rec.euros, rec.concepto ,rec.pagado, rec.fecha_pago, rec.observaciones );
        this.editar = !this.editar;
      }else{
        //meter error
      }
    }, err =>{
      console.log(<any>err);
    })
  }
  guardarRecibo(){
   this._operaciones.setActualizaRecibo(this.recibo).subscribe(res=>{
     if(res.code == 200){
       this.getRecibos();
       this.getCantidad();
     }
    }, err=>{
      console.log(<any>err);
    });
    this.editar = !this.editar;
  }
  volver(){
    this._router.navigate(['/recibos']);
  }
  salirEditar(){
    this.editar = !this.editar;
    this.recibo = new Recibo(null, null, '', null, '' ,false,'', '' );
  }
}
