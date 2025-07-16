/* eslint-disable @typescript-eslint/naming-convention */
import { Datos } from './datos';
import { Documento, DocumentoPendiente } from './documento';
import { Profesion } from './profesion';
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
  document: Documento[];
  plan_proveedor: [];
  estado: boolean;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
}

export interface ProveedorPendiente {
  id: number;
  nombres: string;
  apellidos: string;
  ciudad: string;
  direccion: string;
  genero: string;
  fecha_registro: string;
  licencia: string;
  copiaLicencia: string | null;
  email: string;
  telefono: string;
  cedula: string;
  copiaCedula: string;
  descripcion: string;
  estado: boolean;
  profesion: string;
  ano_experiencia: number;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  documentsPendientes: DocumentoPendiente[];
}

export interface ProveedorPaginacion {
  page_size: number;
  total_objects: number;
  total_pages: number;
  current_page_number: number;
  next: string | null;
  previous: string | null;
  results: Proveedor[] | ProveedorPendiente[];
}

export interface BodyActualizarProveedorPendiente {
  nombres: string;
  apellidos: string;
  ciudad: string;
  direccion: string;
  genero: string;
  licencia: string;
  copiaLicencia: File | null;
  copiaCedula: File| null; //Required, quitar Null
  filesDocuments: (File | null)[]; //Required
  cedula: string;
  telefono: string;
  descripcion: string;
  email: string;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  ano_experiencia: number;
  profesion: string;
  foto: File | null;
}

export interface BodyActualizarProveedor {
  user_datos : Datos,
  direccion: string;
  licencia: string;
  descripcion: string;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  copiaCedula: File | null;
  copiaLicencia: File | null;
  filesDocuments: (File | null)[]; 
  ano_profesion: string;
  profesion: string;
  foto: File | null;
  email: string;
}

export interface BodyCrearProveedor {
  email: string;
  nombres: string;
  apellidos: string;
  ciudad: string;
  cedula: string;
  telefono: string;
  genero: string;
  foto: File | null;
  direccion: string;
  licencia: string;
  copiaLicencia: File | null;
  profesion: string;
  anio_experiencia: number;
  tipo_cuenta: string;
  descripcion: string;
  banco: string;
  numero_cuenta: string;
  documentos: File | null;
  id: number; //Informacion de Proveedor Pendiente
  descripcionDoc: string; //Informacion de Proveedor Pendiente
}

export interface BodyCrearProveedorPendiente {
  nombres: string;
  apellidos: string;
  genero: string;
  telefono: string;
  cedula: string;
  copiaCedula: File | null; //file
  ciudad: string;
  direccion: string;
  email: string;
  descripcion: string;
  licencia: string;
  copiaLicencia: File | null; //file
  profesion: string;
  ano_experiencia: string;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  foto: File | null;
  planilla_servicios: File[] | null; //file[]
}

export interface BodyResponseCrearProveedorPendiente {
  data: string[];
  success: boolean;
  serializer: SerializerCrearProveedorPendiente;
}

export interface SerializerCrearProveedorPendiente {
  id: number;
  nombres: string;
  apellidos: string;
  ciudad: string;
  direccion: string;
  genero: string;
  fecha_registro: string;
  licencia: string;
  copiaLicencia: string | null;
  email: string;
  telefono: string;
  cedula: string;
  copiaCedula: string | null;
  descripcion: string;
  estado: boolean;
  profesion: string;
  ano_experiencia: number;
  banco: string;
  numero_cuenta: string;
  tipo_cuenta: string;
  documentsPendientes: DocumentoPendiente[];
}

export interface BodyResponseCrearProveedor {
  nombre: string;
  apellido: string;
  telefono: string;
  ciudad: string;
  cedula: string;
  genero: string;
  foto: string | null;
  email: string;
  pass: string;
}

export interface ProveedorProfesion {
  id: number;
  profesion: Profesion;
  proveedor: Proveedor;
  ano_experiencia: number;
  estado: boolean;
}
export interface BodyCrearProfesionProveedor {
  profesion: string;
  ano_experiencia: number;
}

export interface BodyResponseCrearProfesionProveedor {
  success: boolean;
  message: string;
  profesion_proveedor?: ProveedorProfesion;
}

