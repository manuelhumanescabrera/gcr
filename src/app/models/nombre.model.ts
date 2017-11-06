import {Telefono} from './telefono.model';
export class Nombre{
  public pendiente: number;
  public horas:string;
  public telefonos: Telefono[];
  public totalTelefonos: number;
  constructor(
    public numero: number,
    public nombre: string
  ){}
}
