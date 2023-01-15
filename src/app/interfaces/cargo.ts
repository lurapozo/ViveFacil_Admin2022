export interface Cargo {
  id: number;
  nombre: string;
  porcentaje: number;
  titulo: string;
}

export interface BodyActualizarCargo {
  nombre?: string;
  porcentaje?: number;
  titulo?: string;
}

export interface BodyCrearCargo {
  nombre: string;
  porcentaje: number;
  titulo: string;
}
export interface BodyResponseCrearCargo {
  cargo: Cargo;
}