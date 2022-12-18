/* eslint-disable @typescript-eslint/naming-convention */

import { User } from 'src/app/interfaces/User';
import { Group } from './group';
export interface User_datos {
  id: number,
  user: User,
  tipo: 3,
  nombres: string,
  apellidos: string,
  ciudad: string,
  cedula: number,
  codigo_invitacion: number,
  telefono: number,
  genero: string,
  foto: string,
  estado: boolean,
  fecha_creacion: string,
  puntos: number

}
