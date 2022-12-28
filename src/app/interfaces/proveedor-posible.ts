/* eslint-disable @typescript-eslint/naming-convention */
import { Ciudad } from "./ciudad";
export interface Proveedor {
  id: number;
  username:string
  nombres:string,
  apellidos:string,
  ciudad:Ciudad,
  telefono: number;
  genero: string;
  foto:string,
  oferta:number,
  rating: number;
  servicios: number;
  descripcion: string;

}
