export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  foto: string;
  foto2: string;
  estado: boolean;
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
  foto: File;
}

export interface BodyResponseCrearCategoria {
  categoria?: Categoria;
  error?: string;
}
