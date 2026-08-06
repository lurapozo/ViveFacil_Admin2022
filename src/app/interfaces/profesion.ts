import { Servicio } from './servicio';
export interface Profesion {
  id: number;
  nombre: string;
  descripcion: string;
  foto: string;
  servicio: Servicio | null;
  estado: boolean;
}

export interface BodyCrearProfesion {
  servicio: string;
  nombre: string;
  descripcion: string;
  foto?: File;
}

export interface BodyResponseCrearProfesion {
  success: boolean;
  mensaje: string;
  profesion?: Profesion;
}

export interface BodyActualizarProfesion {
  id: number,
  servicio: string;
  nombre?: string;
  descripcion?: string;
  foto?: File;
  estado?: boolean;
}
export interface BodyResponseActualizarProfesion {
  id: number,
  servicio: Servicio | null;
  nombre: string;
  descripcion: string;
  foto: File;
  estado: boolean;
}