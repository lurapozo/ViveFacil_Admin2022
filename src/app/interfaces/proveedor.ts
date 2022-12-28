/* eslint-disable @typescript-eslint/naming-convention */
import { Datos } from './datos';
export interface Proveedor {
  id: number;
  user_datos: Datos;
  direccion: string;
  copiaCedula: string;
  licencia: string;
  copiaLicencia: string;
  rating: number;
  servicios: number;
  descripcion: string;
  profesion: string;
  ano_profesion: number;
  document: [];
  plan_proveedor: [];
  estado: boolean;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
}
