import { Component, OnInit, ErrorHandler } from '@angular/core';
import { OperacionesService } from '../services/operaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Peticion } from '../models/peticion.model';
import { Nombre } from '../models/nombre.model';
import { Remesa } from '../models/remesa.model';
declare var $;
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit, ErrorHandler {
  public titulo: string;
  public peticion: Peticion;
  public peticiones: Peticion[];
  public peticionEdit: Peticion;
  private peticionTemp: Peticion;
  public nombre: Nombre;
  public nombres: Nombre[];
  private numeroPeticion: number;
  public back: boolean;
  public selectAll: boolean;
  public remesa: Remesa;
  public inputDatosRem: boolean;
  public error: Error;
  public message: string;
  constructor(
    private _operaciones: OperacionesService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.titulo = 'GESTIÓN DE PETICIONES';
    this.peticion = new Peticion(null, null, "", null);
    this.peticiones = new Array();
    this.nombre = new Nombre(null, "");
    this.nombres = new Array();
    this.peticionEdit = new Peticion(null, null, "", null);
    this.back = true;
    this.selectAll = false;
    this.remesa = new Remesa(null, '', '');
    this.inputDatosRem = false;
    this.error = new Error();
    this.message = '';
  }

  ngDoCheck() {
    let usuario = localStorage.getItem('usuario') || "no";
    if (usuario == "no") {
      this._router.navigate(['login']);
    }
  }
  ngOnInit() {
    this.ngDoCheck();
    $('#modalEdit').hide();
    $("#error").hide();
    $("#success").hide();
    this.getNombres();
    this.getPeticiones();
    var that = this;//defino esto para poder utilizar el objeto dentro de la función
    $(document).keypress(
      //cierra el modal pulsando la tecla esc
      function(e) {
        if (e.keyCode == 27) {
          that.cerrarModal();
        }
      });
  }
  getNombres() {
    this._operaciones.getNombres().subscribe(res => {
      if (res.code == 200) {
        this.nombres = res.data;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }

    }, err => {
      this.error = err;
      this.handleError(err);
    })
  }
  getPeticiones() {
    this._operaciones.getPeticiones().subscribe(res => {
      if (res.code == 200) {
        this.peticiones = res.data;
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    });
  }
  onSubmit() {
    if (this.peticion.numero != null && this.peticion.horas != null) {
      this.addPeticion();
    }
  }
  onCancel() {
    if (this.back) {
      this.peticiones[this.numeroPeticion] = this.peticionTemp;
    } else {
      this.back = true;
    }
  }
  setNombre() {
    var num;
    if (this.peticion.numero == undefined || this.peticion.numero - 1 > this.nombres.length - 1 || this.peticion.numero - 1 < 0) {
      this.peticion.nombre = "";
      this.peticion.numero = Number.NaN;
    } else {
      num = this.nombres[this.peticion.numero - 1];
      if (this.peticion.numero == num.numero) {
        this.peticion.nombre = num.nombre;
      } else {
        this.peticion.nombre = "";
      }
    }
  }
  addPeticion() {
    this._operaciones.setPeticion(this.peticion).subscribe(
      res => {
        if (res.code == 200) {
          this.getPeticiones();
          this.peticion = new Peticion(null, null, "", null);
        } else {
          this.error = new Error(res.message);
          this.handleError(this.error);
        }
      },
      err => {
        this.error = err;
        this.handleError(err);
      }
    );
  }
  editar(evento) {
    this.numeroPeticion = evento.target.value;
    this.peticionEdit = this.peticiones[this.numeroPeticion];
    this.peticionTemp = new Peticion(this.peticionEdit.id, this.peticionEdit.numero, this.peticionEdit.nombre, this.peticionEdit.horas);
    $('#modalModificaciones').show();
  }
  /**
  *Elimina una petición llamando a deletePeticion del servicio _operaciones.
  *Hay que arreglar que me muestre un mensaje por cada solicitud de eliminación
  *en grupo
  */
  eliminar(evento, pos, form) {
    var peticionEliminar;
    if (form) {
      peticionEliminar = this.peticiones[evento.target.value];
    } else {
      peticionEliminar = this.peticiones[evento.value];
    }
    this._operaciones.deletePeticion(peticionEliminar.id).subscribe(res => {
      if (res.code == 200) {
        // this.peticiones.splice(pos, 1);
        this.getPeticiones();
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    })
  }
  cerrarModal() {
    this.onCancel();
    $('#modalModificaciones').fadeOut(500);
  }
  backPeticion(evento) {
    this.back = evento;
  }
  selectAllCheck() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      $(".check-peticiones").prop('checked', true);;
    } else {
      $(".check-peticiones").prop('checked', false);;
    }
  }
  deleteAll() {
    $.each($(".check-peticiones"), (i, pet) => {
      this.eliminar(pet, i, false);
    })
  }
  muestraInputDatosRem() {
    this.inputDatosRem = true;
  }
  generaRemesa() {
    this._operaciones.generaRemesa(this.remesa).subscribe(res => {
      if (res.code == 200) {
        this.inputDatosRem = false;
        this.remesa = new Remesa(null, '', '');
        this.getPeticiones();
        this.message = res.message;
        $("#success").show().delay(5000).fadeOut();
      } else {
        this.error = new Error(res.message);
        this.handleError(this.error);
      }
    }, err => {
      this.error = err;
      this.handleError(err);
    });
  }
  salirGenRemesa(){
    this.inputDatosRem = false;
  }
  handleError(error) {
    console.log(error.message);
    $("#error").show().delay(5000).fadeOut();
  }
}
