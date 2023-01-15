import { InterpolationConfig } from '@angular/compiler';

//Plan y PlanesEstado
export interface Plan {
  id?: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
  duracion: number;
  fecha_creacion?: string;
  estado?: boolean;
}

export interface BodyCrearPlan {
  nombre: string;
  descripcion: string;
  imagen?: File;
  precio: number;
  duracion: number;
}

export interface BodyResponseCrearPlan {
  objecto: Plan;
}
export interface PlanProveedor {
  id?: number;
  planProveedor: number;
  plan: Plan,
  proveedor: number;
  fecha_inicio: string;
  fecha_expiracion: string;
  estado: string;
}

export interface BodyCrearPlanProveedor {
  planProveedor: number;
  proveedor: number;
  fecha_inicio: string;
  fecha_expiracion: string;
  estado?: string;
}

export interface BodyActualizarPlanProveedor {
  id: number;
  planProveedor: number;
  fecha_inicio: string;
  fecha_expiracion: string;

}