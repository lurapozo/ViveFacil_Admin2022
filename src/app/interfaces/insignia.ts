export interface Insignia {
  id: number;
  nombre: string;
  imagen: string;
  servicio: string;
  tipo_usuario: string;
  estado: boolean;
  pedidos: number;
  fecha_creacion: string;
  descripcion: string;
  tipo: string;
}

export interface BodyActualizarInsignia {
  nombre?: string;
  imagen?: File;
  servicio?: string;
  tipo_usuario?: string;
  estado: boolean;
  pedidos?: number;
  descripcion?: string;
  tipo?: string;
}
