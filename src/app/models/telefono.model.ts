
export class Telefono{
  constructor(
    public id: number,
    public socio: number,
    public telefono: number,
    public activo: boolean,
    public fecha_alta: string,
    public fecha_baja: string
  ){}
}
