/* eslint-disable @typescript-eslint/naming-convention */
import { User } from './user';
export interface Datos {
  id: number;
  user: User;
  tipo: number;
  nombres: string;
  apellidos: string;
  ciudad: string;
  cedula: string;
  codigo_invitacion: string;
  telefono: string;
  genero: string;
  foto: string | null;
  estado: boolean;
  fecha_creacion: string;
  puntos: number;
}
