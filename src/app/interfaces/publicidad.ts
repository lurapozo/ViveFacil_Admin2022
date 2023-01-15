export interface Publicidad {
    id: number,
    titulo: string,
    descripcion: string,
    fecha_creacion: string,
    fecha_inicio: string,
    fecha_expiracion: string,
    imagen: File,
    url: string
}
export interface BodyCrearPublicidad {
    titulo: string,
    descripcion: string,
    fecha_inicio: string,
    fecha_expiracion: string,
    imagen?: File,
    url: string
  }
  
  export interface BodyResponseCrearPublicidad {
    objeto : Publicidad;
  }
