import { Promocion } from './promocion';
import { Tarjeta } from './tarjeta';
import { User } from './user';

export interface PaymentTarjeta {
  id: number;
  user: User | null;
  tarjeta: Tarjeta | null;
  promocion: Promocion | null;
  valor: number;
  descripcion: string;
  impuesto: number;
  referencia: string;
  fecha_creacion: string;
  carrier_id: string;
  concepto: string;
  carrier_code: string;
  estado: boolean;
  pago_proveedor: boolean;
  cargo_paymentez: number;
  cargo_banco: number;
  cargo_sistema: number;
  proveedor: string;
  prov_correo: string;
  prov_telefono: string;
  servicio: string;
  usuario: string;
}

export interface PaymentEfectivo {
  id: number;
  user: User | null;
  concepto: string;
  promocion: Promocion | null;
  valor: number;
  descripcion: string;
  referencia: string;
  fecha_creacion: string;
  estado: boolean;
  proveedor: string;
  servicio: string;
  usuario: string;
  prov_correo: string;
  prov_telefono: string;
  user_telefono: string;
}

export interface PaymentPaginacion {
  page_size: number;
  total_objects: number;
  total_pages: number;
  current_page_number: number;
  next: string | null;
  previous: string | null;
  results: PaymentEfectivo[] | PaymentTarjeta[];
}
