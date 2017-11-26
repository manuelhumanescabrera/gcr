import { Component, OnInit, DoCheck, Input, Output, EventEmitter, ErrorHandler } from '@angular/core';
import { OperacionesService } from '../services/operaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Peticion } from '../models/peticion.model';
import { Nombre } from '../models/nombre.model';
declare var $;
@Component({
  selector: 'app-peticiones-edit',
  templateUrl: './peticiones-edit.component.html',
  styleUrls: ['./peticiones-edit.component.css']
})
export class PeticionesEditComponent implements OnInit, ErrorHandler {

  public titulo: string;
  @Input() nombres: Nombre[];
  @Input() nombre: Nombre;
  @Input() peticion: Peticion;
  @Output() backEvent = new EventEmitter();
  public back: boolean;
  public error: Error;


  constructor(private _operacionesService: OperacionesService, private _route: ActivatedRoute,
    private _router: Router) {
    this.titulo = 'EDITAR PETICIÓN';
    this.peticion = new Peticion(null, null, '', null);
    this.back = true;
    this.error = new Error();
  }

  ngOnInit() {
    $("#error").hide()
    this.ngDoCheck();
  }
  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
  setNombre() {
    this.nombre = this.nombres[this.peticion.numero - 1];
    this.peticion.nombre = this.nombre.nombre;
  }
  onSubmit() {
    if (this.peticion.id == null) {
      this.error = new Error('No existe la petición');
      this.handleError(this.error);
    } else{
      this._operacionesService.setActualizaPeticion(this.peticion.id, this.peticion).subscribe(res => {
        if (res.code == 200) {
          this.back = false;
          this.backEvent.emit(this.back);
        } else {
          this.back = true;
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      }, err => {
        this.back = true;
        this.error = err;
        this.handleError(this.error);
      });
    }
  }

handleError(error){
  console.log(error.message);
  $("#error").show().delay(5000).fadeOut();
}
}
