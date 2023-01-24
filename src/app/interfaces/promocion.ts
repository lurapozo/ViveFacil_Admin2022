export interface Promocion {
  id: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  porcentaje: number;
  fecha_creacion: string;
  fecha_iniciacion: string | null;
  fecha_expiracion: string;
  participantes: string;
  estado: boolean;
  foto: string;
  tipo_categoria: string;
  cantidad: number;
}
export interface PromocionCrear {
 
  codigo: string;
  titulo: string;
  descripcion: string;
  porcentaje: number;
  fecha_iniciacion: string | null;
  fecha_expiracion: string;
  participantes: string;
  estado: boolean;
  foto: string;
  tipo_categoria: string;
  cantidad: number;
}
export interface BodyPromocionActualizar {
  codigo: string;
  titulo: string;
  descripcion: string;
  fecha_iniciacion: string | null;
  fecha_expiracion: string;
  porcentaje: number;
  cantidad: number;
  participantes: string;
  foto: File | null;
  tipo_categoria: string;
}

export interface BodyResponsePromocionActualizar {
  success: boolean;
  code: number;
  msg?: string;
  error?: string;
  promocion?: Promocion;
}
