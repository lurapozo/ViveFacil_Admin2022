import { Banco } from './banco';
import { Proveedor } from './proveedor';

// export interface CuentaBancaria {}

export interface TipoCuenta {
  id: number;
  nombre: string;
}

export interface CuentaBancariaProveedor {
  id: number;
  numero_cuenta: string;
  proveedor: Proveedor;
  banco: Banco;
  tipo_cuenta: TipoCuenta;
  estado: boolean;
}
