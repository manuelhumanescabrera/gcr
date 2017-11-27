import {Telefono} from './telefono.model';
export class Nombre{
  public pendiente: number;
  public horas:string;
  public telefonos: Telefono[];
  constructor(
    public numero: number,
    public nombre: string,
    public domiciliado: any
  ){}
}
