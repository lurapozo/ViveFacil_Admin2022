/* eslint-disable @typescript-eslint/naming-convention */
import { Proveedor } from './proveedor';
import { Profesion } from './profesion';
export interface ProveedorByProfesion {
  id: number;
  profesion: Profesion;
  proveedor: Proveedor;
  ano_experiencia: number;
  estado: boolean;
}
