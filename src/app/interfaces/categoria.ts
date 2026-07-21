export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  foto?: File;
  foto2?: File;
  estado: boolean;
  total_subcategorias?: number;
}

export interface BodyActualizarCategoria {
  nombre?: string;
  descripcion?: string;
  estado: boolean;
  foto?: File;
  foto2?: File;
}

export interface BodyCrearCategoria {
  nombre: string;
  descripcion: string;
  foto?: File;
  foto2?: File;
}

export interface BodyResponseCrearCategoria {
  categoria?: Categoria;
  error?: string;
}
