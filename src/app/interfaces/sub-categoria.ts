export interface SubCategoria {
    id: number,
    nombre: string,
    descripcion: string,
    categoria: number,
    estado: boolean
}

export interface BodyCrearSubCategoria {
    nombre: string,
    descripcion: string,
    categoria: number,
  }

  export interface BodyResponseCrearSubCategoria {
    servicio: SubCategoria
  }