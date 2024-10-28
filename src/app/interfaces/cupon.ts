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
  tipo_categoria: string;
  cantidad: number;
  estado:boolean
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
  tipo_categoria: string;
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
  tipo_categoria: string;
}

export interface BodyResponseCuponActualizar {
  success: boolean;
  code: number;
  error?: boolean;
  msg?: string;
  cupon?: Cupon;
}
