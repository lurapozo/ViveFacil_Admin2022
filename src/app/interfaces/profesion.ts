import { Servicio } from './servicio';
export interface Profesion {
  id: number;
  nombre: string;
  descripcion: string;
  foto: string;
  servicio: Array<Servicio>;
  estado: boolean;
}
