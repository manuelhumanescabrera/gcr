import { Component, OnInit } from '@angular/core';
import { OperacionesService } from '../services/operaciones.service';
import { Peticion } from '../models/peticion.model';
import { Nombre } from '../models/nombre.model';
import { Remesa } from '../models/remesa.model';
declare var $;
@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrls: ['./peticiones.component.css']
})
export class PeticionesComponent implements OnInit {
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
  constructor(
    private _operaciones: OperacionesService
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
  }

  ngOnInit() {
    $('#modalEdit').hide();
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
      if (res.data != null) {
        this.nombres = res.data;
      } else {
        //gestionar error
      }

    }, err => {
      console.log(<any>err);
    })
  }
  getPeticiones() {
    this._operaciones.getPeticiones().subscribe(res => {
      if (res.data != null) {
        this.peticiones = res.data;
      } else {
        //gestionar error
      }
    }, err => {
      console.log(<any>err);
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
    if (this.peticion.numero == undefined || this.peticion.numero - 1 > this.nombres.length -1 || this.peticion.numero - 1 < 0 ) {
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
        if (res.code == "200") {
          this.getPeticiones();
          this.peticion = new Peticion(null, null, "", null);
        } else {
          //gestionar error
        }
      },
      err => {
        //gestionar error
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
      if (res.code == "200") {
        // this.peticiones.splice(pos, 1);
        this.getPeticiones();
      } else {
        //gestionar error
      }
    }, err => {
      console.log(<any>err);
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
  generaRemesa() {
    this.remesa.concepto = 'remesa demo';
    this.remesa.fecha_fin = '2017-10-11';
    this._operaciones.generaRemesa(this.remesa).subscribe(res => {
      console.log(res.message);
      this.getPeticiones();
    }, err => {
      console.log(<any>err);
    });
  }
}
