/* eslint-disable @typescript-eslint/naming-convention */
import { Proveedor } from './proveedor';
import { Servicio } from './servicio';
import { Solicitante } from './solicitante';
import { Ubicacion } from './ubicacion';

export interface TipoPago {
  id: number;
  nombre: string;
  estado: boolean;
}

export type EstadoProceso = 'ABIERTA' | 'POR PAGAR' | 'POR FINALIZAR' | 'FINALIZADO' | 'CANCELADO' | 'EXPIRADA' | 'OTRO';

export interface CandidatoSolicitud {
  id: number;
  proveedor: Proveedor;
  interesado: boolean;
  oferta: number | null;
  fecha_creacion: string;
  /** El proveedor descartó la solicitud (no se borra la fila, se marca). */
  rechazada: boolean;
  fecha_rechazo: string | null;
  motivo_rechazo: string | null;
}

export interface TransaccionPaymentez {
  id: string;
  estado: string;
  estado_display: string;
  estado_paymentez: string | null;
  status_detail: number | null;
  monto: string | number;
  tipo_tarjeta: string | null;
  bin: string | null;
  codigo_autorizacion: string | null;
  referencia: string | null;
  fecha_creacion: string;
}

export interface SolicitudAdmin {
  id: number;
  descripcion: string;
  foto_descripcion: string | null;
  fecha_creacion: string;
  fecha_expiracion: string;
  solicitante: Solicitante;
  ubicacion: Ubicacion;
  servicio: Servicio;
  tipo_pago: TipoPago;
  proveedor: Proveedor | null;
  adjudicar: boolean;
  pagada: boolean;
  estado: boolean;
  termino: string | null;
  rating: number;
  descripcion_rating: string;
  descuento: number;
  estado_proceso: EstadoProceso;
  valor: number | null;
  candidatos: CandidatoSolicitud[];
  transacciones_paymentez: TransaccionPaymentez[];
}

export interface SolicitudAdminPaginacion {
  page_size: number;
  total_objects: number;
  total_pages: number;
  current_page_number: number;
  next: string | null;
  previous: string | null;
  results: SolicitudAdmin[];
}

export interface SolicitudAdminFiltros {
  estado?: EstadoProceso;
  tipoPago?: string;
  servicio?: number;
  texto?: string;
  fechaInicio?: string;
  fechaFin?: string;
}
