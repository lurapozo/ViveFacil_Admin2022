import { Obj } from "@popperjs/core";

export interface Group {
  id: number;
  name: string;
  permissions: {
    name: string;
  };
}

export interface BodyCrearGroup {
  nombre: string;
  permisos: string;
}

export interface Permission {
  name: string
}

export interface BodyActualizarGroup {
  id: number
  nombre: string;
  permisos: string;
}
