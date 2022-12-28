export interface Cupon {
  id: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  porcentaje: number;
  fecha_creacion: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
  estado: boolean;
  puntos: number;
  foto: string;
  tipo_categoria: string;
  cantidad: number;
}
