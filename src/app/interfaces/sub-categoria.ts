export interface SubCategoria {
    id: number,
    nombre: string,
    descripcion: string,
    categoria: number,
    estado: boolean
    foto: any;
    total_proveedores?: number;
}

export interface BodyCrearSubCategoria {
    foto: any;
    nombre: string,
    descripcion: string,
    categoria: string,
  }

  export interface BodyResponseCrearSubCategoria {
    servicio: SubCategoria
  }