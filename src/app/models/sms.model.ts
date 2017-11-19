export class Sms{
  public id:string;
  public nombre:string;
  public telefono:string;
  public recibo:string;
  public cantidad:string;
  public texto:string;
  public estado:string;
  constructor(id:string, nombre:string, telefono:string, factura:string, importe:string){
    this.id = id;
    this.nombre = nombre;
    this.telefono = telefono;
    this.recibo = factura;
    this.cantidad = importe;
    this.estado = "Pendiente";
    this.texto = encodeURI(this.nombre + ' EL RECIBO ' + this.recibo + ' POR ' + this.cantidad + ' € PASARÁ AL COBRO EN LOS PRÓXIMOS DÍAS');
  }
}
