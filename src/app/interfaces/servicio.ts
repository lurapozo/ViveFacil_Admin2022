export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: number;
  estado: boolean;
}

export interface BodyActualizarServicio {
  descripcion?: string;
  estado?: boolean;
}
