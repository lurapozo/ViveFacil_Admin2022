export interface Insignia {
  id: string;
  nombre: string;
  imagen: File;
  servicio: string;
  tipo_usuario: string;
  estado: boolean;
  pedidos: string;
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
  pedidos?: string;
  descripcion?: string;
  tipo?: string;
}

export interface BodyCrearInsignia {
  nombre: string;
  imagen?: File ;
  servicio: string;
  tipoUsuario: string;
  pedidos: string;
  descripcion: string;
  tipo: string;
}

export interface BodyResponseCrearInsignia {
  insignia: Insignia;
}
