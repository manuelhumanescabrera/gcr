import {Telefono} from './telefono.model';
export class Socio{
  public provincia: string;
  public localidad: string;
  public telefonos: Telefono[];
  constructor(
    public numero:number,
    public nombre:string,
    public apellido1: string,
    public apellido2: string,
    public domiciliado:boolean,
    public dni:string,
    public direccion:string,
    public cPostal:string,
    public cProvincia:string,
    public fAlta:string,
    public noActivo:boolean,
    public fBaja:string,
    public propiedad:number,
    public observaciones:string
  ){}
}
