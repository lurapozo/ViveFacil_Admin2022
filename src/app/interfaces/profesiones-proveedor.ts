import { Profesion } from "./profesion"
import { Proveedor } from "./proveedor"

export interface ProfesionesProveedor {
    id: number,
    profesion: Profesion,
    proveedor: Proveedor,
    ano_experiencia: number,
    estado: boolean
}

export interface BodyResponseCrearProfesionesProveedor{
    profesion_proveedor : ProfesionesProveedor;
  }
