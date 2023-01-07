export interface Documento {
  id: number;
  descripcion: string;
  documento: string;
  estado: boolean;
}

export interface DocumentoPendiente {
  id: number;
  document: string | null;
}
