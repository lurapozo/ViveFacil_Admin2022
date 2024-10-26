export interface NotificacionAnuncio {
  id: number;
  titulo: string;
  mensaje: string;
  descripcion: string;
  ruta: string;
  imagen: string;
  fecha_creacion: string;
}

export interface BodyCrearNotificacionAnuncio {
  titulo: string;
  mensaje: string;
  descripcion: string;
  ruta: string;
  imagen?: File;
}
