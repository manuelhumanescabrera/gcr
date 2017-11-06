export class Cargo{
  public numero:number;
  public nombre: string;
  public concepto: string;
  public cantidad: string;
  public fecha: string;
  constructor(numero:number, nombre:string, concepto:string, cantidad:string, fecha:string){
    this.numero = numero;
    this.nombre = this.getNombre(nombre);
    this.concepto = concepto;
    this.cantidad = cantidad;
    this.fecha = fecha;
  }
  /**
  * Esta función recorta y ordena el nombre si está en formato apellidos, nombre
  */
  getNombre(nombre:string){
    let salida: string = nombre;
    let arrayNombre = nombre.split(",");
    if(arrayNombre.length == 2){
      salida = ""+arrayNombre[1]+" "+arrayNombre[0];
    }
    return salida;
  }
}
