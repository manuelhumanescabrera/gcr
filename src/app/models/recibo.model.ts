export class Recibo {
  constructor(
    public id: number,
    public numero: number,
    public nombre: string,
    public euros: number,
    public concepto: string,
    public pagado: boolean,
    public fecha_pago: string,
    public observaciones: string
  ) { }
}
