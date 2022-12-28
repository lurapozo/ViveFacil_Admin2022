import { Datos } from './datos';

export interface Administrador {
  id: number;
  user_datos: Datos;
  estado: boolean;
}

export interface AdministradorPaginacion {
  page_size: number;
  total_objects: number;
  total_pages: number;
  current_page_number: number;
  next: string | null;
  previous: string | null;
  results: Administrador[];
}

export interface BodyActualizarAdministrador {
  id: number;
  username: string;
  email: string;
  password: string;
  tipo: string;
  nombres: string;
  apellidos: string;
  ciudad: string;
  cedula: string;
  telefono: string;
  genero: string;
  emailNuevo: string;
  foto: string | null;
}

export interface BodyCrearAdministrador {
  username: string;
  email: string;
  password: string;
  tipo: string | number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  genero: string;
  rol: string;
  foto: string | null;
}

export interface BodyResponseCrearAdministrador {
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  ciudad: string | null;
  genero: string;
  email: string;
  pass: string;
  token: string;
  sucess: boolean;
}
