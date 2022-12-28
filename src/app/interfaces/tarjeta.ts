import { Solicitante } from './solicitante';

export interface Tarjeta {
  id: number;
  fecha_creacion: string;
  cvv: number;
  estado: boolean;
  titular: string;
  fecha_vencimiento: string;
  numero: number;
  brand: string;
  code: string;
  solicitante: Solicitante;
  token: string;
  tipo: string;
}
