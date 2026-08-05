/** A qué app va dirigida. El filtro por profesión solo aplica a 'proveedor'. */
export type DirigidaA = 'solicitante' | 'proveedor' | 'ambas';

/** Solo para las programadas: las masivas se envían una única vez. */
export type Frecuencia = 'unica' | 'diaria' | 'semanal';

/** Campos que comparten los dos tipos de notificación. */
interface NotificacionBase {
  nombre: string;
  titulo: string;
  descripcion: string;
  ruta: string;
  dirigida_a: DirigidaA;
  /** Ids de Profesion. Vacío = sin filtro por profesión. */
  profesiones: number[];
  imagen?: File;
}

// ---------------------------------------------------------------- MASIVAS
// Un solo envío. Además del push aparecen en la lista de notificaciones de las
// apps de proveedor y solicitante.

export interface NotificacionAnuncio extends NotificacionBase {
  id: number;
  fecha_creacion: string;
  /** Nombres resueltos por el backend, para pintar la tabla sin otra llamada. */
  profesiones_nombres?: string[];
  /** Null = se envió al crearse. Con valor, la recoge el job en ese momento. */
  programada_para?: string | null;
  /** Null = todavía no ha salido. */
  enviada_en?: string | null;
  estado: boolean;
}

export interface BodyCrearNotificacionAnuncio extends NotificacionBase {
  programada_para?: string;
}

export interface BodyActualizarNotificacionAnuncio extends NotificacionBase {
  id: number;
  programada_para?: string;
  estado: boolean;
}

// ------------------------------------------------------------ PROGRAMADAS
// Solo push, nunca aparecen en la lista in-app. Pueden repetirse.

interface ProgramadaBase extends NotificacionBase {
  frecuencia: Frecuencia;
  /** CSV de weekday(): '0'=Lunes … '6'=Domingo. Solo si frecuencia='semanal'. */
  dias_semana: string;
  hora: string;
  fecha_iniciacion: string;
  fecha_expiracion: string;
}

export interface NotificacionProgramada extends ProgramadaBase {
  id: number;
  fecha_creacion: string;
  profesiones_nombres?: string[];
  veces_enviada?: number;
  ultimo_envio?: string | null;
  estado: boolean;
}

export type BodyCrearNotificacionProgramada = ProgramadaBase;

export interface BodyActualizarNotificacionProgramada extends ProgramadaBase {
  id: number;
  estado: boolean;
}
