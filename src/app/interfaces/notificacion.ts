export interface NotificacionAnuncio {
  id: number;
  nombre:string;
  titulo: string;
  descripcion: string;
  tipo_proveedores: string;
  frecuencia: string;
  ruta: string;
  imagen?: File ;
  fecha_creacion: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  hora: string;
  estado: boolean;
}

export interface BodyCrearNotificacionAnuncio {
  nombre:string;
  titulo: string;
  descripcion: string;
  tipo_proveedores: string;
  frecuencia: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  hora: string;
  ruta: string;
  imagen?: File ;
}

export interface BodyActualizarNotificacionAnuncio {
  id: number;
  nombre:string;
  titulo: string;
  descripcion: string;
  tipo_proveedores: string;
  frecuencia: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  hora: string;
  estado: boolean;
  ruta: string;
  imagen?: File ;
}

export interface NotificacionAutomatica {
  id: any;
  nombre:string;
  titulo: string;
  descripcion: string;
  tipo_proveedores: string;
  frecuencia: string;
  ruta: string;
  imagen?: File ;
  fecha_creacion: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  hora: string;
  estado: boolean;
}

export interface BodyCrearNotificacionAutomatica{
  nombre:string;
  titulo: string;
  descripcion: string;
  tipo_proveedores: string;
  frecuencia: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  hora: string;
  ruta: string;
  imagen?: File ;
}

export interface BodyActualizarNotificacionAutomatica{
  id: number;
  nombre:string;
  titulo: string;
  descripcion: string;
  tipo_proveedores: string;
  frecuencia: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  hora: string;
  estado: boolean;
  ruta: string;
  imagen?: File ;
}