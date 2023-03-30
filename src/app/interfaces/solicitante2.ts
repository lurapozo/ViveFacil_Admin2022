/* eslint-disable @typescript-eslint/naming-convention */
import { Datos } from './datos';
export interface Solicitante2 {
  id: number;
  user_datos: Datos;
  bool_registro_completo: boolean;
  estado: boolean;
}

export interface BodyActualizarSolicitante {
  nombres: string;
  ciudad: string;
  cedula: string;
  apellidos: string;
  genero: string;
  telefono: string;
  foto: File | null;
  codigo_invitacion: string;
  puntos: string;
}
