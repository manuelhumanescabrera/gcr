import { Component, OnInit, DoCheck, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Recibo} from '../models/recibo.model';
import { Socio } from '../models/socios.model';
import { Nombre } from '../models/nombre.model';
import { OperacionesService } from '../services/operaciones.service';
import { Ng2CsvService } from 'ng2csv/Ng2Csv.service';
import { CsvConfiguration } from 'ng2csv/CsvConfiguration';
import {GLOBAL} from '../services/global.service';
declare var $;

@Component({
  selector: 'app-recibos-det',
  templateUrl: './recibos-det.component.html',
  styleUrls: ['./recibos-det.component.css']
})
export class RecibosDetComponent implements OnInit, ErrorHandler {
  public titulo:string;
  public num:number;
  public recibo: Recibo;
  public recibos:Recibo[];
  public nombre:Nombre;
  public cantidad: number;
  public editar: boolean;
  public es:any;
  public error:Error;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _ng2Csv: Ng2CsvService
  ) {
    this.titulo = 'RECIBOS PENDIENTES: ';
    this.recibos = new Array();
    this.nombre = new Nombre(null, '', false);
    this.cantidad = null;
    this.editar = true;
    this.recibo = new Recibo(null, null, '', null, '' ,false,'', '' );
    this.es = GLOBAL.es;
    this.error = new Error();
   }

  ngOnInit() {
    $("#error").hide();
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
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  getRecibos(){
    this._operaciones.getRecibosPendientes(this.num).subscribe(res=>{
      if(res.code === 200){
        this.recibos = res.data;
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  getCantidad(){
    this._operaciones.getCantidad(this.num).subscribe(res=>{
      if(res.code === 200){
        let cant = JSON.parse(res.data)
        this.cantidad = cant.pendiente;
      }else{
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
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
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err =>{
      this.error = err;
      this.handleError(this.error);
    })
  }
  guardarRecibo(){
   this._operaciones.setActualizaRecibo(this.recibo).subscribe(res=>{
     if(res.code == 200){
       this.getRecibos();
       this.getCantidad();
     }else{
       this.error = new Error(res.message);
       this.handleError(this.error);
     }
    }, err=>{
      this.error = err;
      this.handleError(this.error);
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
  exportaCsv(){
    this._ng2Csv.download(this.recibos, 'recibos_'+this.nombre.numero+'.csv', undefined, GLOBAL.csvConf);
  }
  handleError(error){
    console.log(error.message);
    $("#error").show().delay(5000).fadeOut();
  }
}
