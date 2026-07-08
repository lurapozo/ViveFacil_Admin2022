export type TipoCargo = 'banco' | 'paymentez' | 'sistema';

export const TIPOS_CARGO: { value: TipoCargo; label: string }[] = [
  { value: 'banco', label: 'Banco' },
  { value: 'paymentez', label: 'Paymentez' },
  { value: 'sistema', label: 'Sistema' },
];

export interface Cargo {
  id: number;
  nombre: string;
  porcentaje: number;
  titulo: string;
  tipo: TipoCargo | null;
}

export interface BodyActualizarCargo {
  nombre?: string;
  porcentaje?: number;
  titulo?: string;
  tipo?: TipoCargo | null;
}

export interface BodyCrearCargo {
  nombre: string;
  porcentaje: number;
  titulo: string;
  tipo?: TipoCargo | null;
}
export interface BodyResponseCrearCargo {
  cargo: Cargo;
}
