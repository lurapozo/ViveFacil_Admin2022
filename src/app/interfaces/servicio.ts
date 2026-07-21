export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: number;
  estado: boolean;
  total_proveedores?: number;
}

export interface BodyActualizarServicio {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  estado?: boolean;
  foto?: any;
}
