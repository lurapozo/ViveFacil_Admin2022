import { Servicio } from './servicio';
export interface Profesion {
  id: number;
  nombre: string;
  descripcion: string;
  foto: string;
  servicio: Array<Servicio>;
  estado: boolean;
}

export interface BodyCrearProfesion {
  servicio: string;
  nombre: string;
  descripcion: string;
  foto: File;
}

export interface BodyResponseCrearProfesion {
  success: boolean;
  mensaje: string;
  profesion?: Profesion;
}
