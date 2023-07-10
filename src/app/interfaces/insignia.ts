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

export interface Medalla {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: File;
  tiempo: string;
  valor: string;
  estado: boolean;
  cantidad: string;
  fecha_creacion: string;
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

export interface BodyActualizarMedalla {
  nombre?: string;
  descripcion?: string;
  imagen?: File;
  tiempo?: string;
  valor?: string;
  estado: boolean;
  cantidad?: string;
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

export interface BodyCrearMedalla {
  nombre: string;
  descripcion: string;
  imagen?: File ;
  tiempo: string;
  valor: string;
  cantidad: string;
}

export interface BodyResponseCrearInsignia {
  insignia: Insignia;
}
