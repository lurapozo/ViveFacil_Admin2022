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
