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
