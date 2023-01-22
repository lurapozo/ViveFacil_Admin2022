import { PaymentTarjeta } from './payment';
import { Solicitante } from './solicitante';
import { Solicitud } from './solicitud';

export interface Tarjeta {
  id: number;
  fecha_creacion: string;
  cvv: number;
  estado: boolean;
  titular: string;
  fecha_vencimiento: string;
  numero: number;
  brand: string;
  code: string;
  solicitante: Solicitante;
  token: string;
  tipo: string;
}

export interface PagosTarjetaUser {
  id: number;
  pago_tarjeta: PaymentTarjeta,
  pago_efectivo: string;
  solicitud: Solicitud;
  estado: boolean;
  fecha_creacion: string;
}

