/* eslint-disable @typescript-eslint/naming-convention */
import { Datos } from './datos';
export interface Solicitante {
  id: number;
  user_datos: Datos;
  bool_registro_completo: boolean;
  estado: boolean;
}

export interface SolicitantePaginacion {
  page_size: number;
  total_objects: number;
  total_pages: number;
  current_page_number: number;
  next: string|null;
  previous: string|null;
  results: Solicitante[];
}
