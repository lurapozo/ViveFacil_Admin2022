import { Proveedor } from './proveedor';
import { TipoPago } from './tipo-pago';
import { Servicio } from './servicio';
import { Ubicacion } from './ubicacion';
import { Solicitante } from './solicitante';
export interface Solicitud {
  id: number;
  descripcion: string;
  foto_descripcion: File;
  fecha_creacion: string;
  fecha_expiracion: string;
  solicitante: Solicitante;
  ubicacion: Ubicacion;
  servicio: Servicio;
  tipo_pago: TipoPago;
  proveedor: Proveedor;
  adjudicar: boolean;
  pagada: boolean;
  estado: boolean;
  termino: string;
  rating: number;
  descripcion_rating: string;
}
