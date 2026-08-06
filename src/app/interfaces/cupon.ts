/** canjeados = veces que alguien tomó el cupón; usados = veces que se aplicó a
 *  un pago; pendientes = canjeados sin usar; restantes = stock por canjear. */
export interface UsosCupon {
  canjeados: number;
  usados: number;
  pendientes: number;
  restantes: number;
}

/** Si el cupón sirve HOY por sus fechas y sus cupos. Es independiente de
 *  `estado`, que es el interruptor manual del admin: un cupón puede estar
 *  habilitado y aun así estar expirado o agotado. */
export type VigenciaCupon =
  | 'vigente'
  | 'programado'
  | 'expirado'
  | 'agotado';

export interface Cupon {
  id:string;
  codigo: string;
  titulo: string;
  descripcion: string;
  porcentaje: number;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  participantes: string;
  puntos: number;
  foto?: File
  /** FK a Categoria; null = "Todas" (sin restricción). */
  categoria: number | null;
  categoria_nombre?: string | null;
  cantidad: number;
  /** Interruptor manual del admin. */
  estado:boolean;
  vigencia?: VigenciaCupon;
  usos?: UsosCupon;
}

/** Una fila de "quién usó este cupón". */
export interface UsoCupon {
  id: number;
  user: string;
  usuario: {
    nombres: string;
    apellidos: string;
    correo: string;
    telefono: string;
    foto: string | null;
  } | null;
  estado: boolean;
  usado: boolean;
  fecha_canje: string | null;
  fecha_uso: string | null;
}

export interface CuponCrear {
  codigo: string;
  titulo: string;
  descripcion: string;
  porcentaje: number;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  participantes: string;
  estado: boolean;
  puntos: number;
  foto?:File
  categoria: number | null;
  cantidad: number;
}
export interface BodyCuponActualizar {
  codigo: string;
  titulo: string;
  descripcion: string;
  fecha_iniciacion: string | null;
  fecha_expiracion: string;
  porcentaje: number;
  cantidad: number;
  puntos: number;
  foto?: File ;
  categoria: number | null;
  participantes?: string;
}

export interface BodyResponseCuponActualizar {
  success: boolean;
  code: number;
  error?: boolean;
  msg?: string;
  cupon?: Cupon;
}
