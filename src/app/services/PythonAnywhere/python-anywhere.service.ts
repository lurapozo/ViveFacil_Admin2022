import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, pipe } from 'rxjs';
import { AdminUserPass } from 'src/app/interfaces/admin-user-pass';
import { Administrador, AdministradorPaginacion, BodyActualizarAdministrador, BodyCrearAdministrador, BodyResponseCrearAdministrador, } from 'src/app/interfaces/administrador';
import { BodyActualizarCargo, BodyCrearCargo, BodyResponseCrearCargo, Cargo } from 'src/app/interfaces/cargo';
import { BodyActualizarCategoria, BodyCrearCategoria, BodyResponseCrearCategoria, Categoria } from 'src/app/interfaces/categoria';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { CuentaBancariaProveedor } from 'src/app/interfaces/cuenta-bancaria';
import { BodyCuponActualizar, BodyResponseCuponActualizar, Cupon, CuponCrear } from 'src/app/interfaces/cupon';
import { Documento, DocumentoPendiente } from 'src/app/interfaces/documento';
import { BodyEmail, BodyResponseEmail } from 'src/app/interfaces/email';
import { BodyActualizarGroup, BodyCrearGroup, Group, Permission } from 'src/app/interfaces/group';
import { BodyActualizarInsignia, BodyActualizarMedalla, BodyCrearInsignia, BodyCrearMedalla, BodyResponseCrearInsignia, Insignia, Medalla } from 'src/app/interfaces/insignia';
import { BodyLogin, BodyLoginResponse } from 'src/app/interfaces/login';
import { BodyActualizarNotificacionAnuncio, BodyActualizarNotificacionProgramada, BodyCrearNotificacionAnuncio, BodyCrearNotificacionProgramada, NotificacionAnuncio, NotificacionProgramada } from 'src/app/interfaces/notificacion';
import { PaymentEfectivo, PaymentPaginacion, PaymentTarjeta } from 'src/app/interfaces/payment';
import { BodyActualizarPlan, BodyActualizarPlanProveedor, BodyCrearPlan, BodyCrearPlanProveedor, BodyResponseCrearPlan, Plan, PlanProveedor } from 'src/app/interfaces/plan';
import { BodyActualizarProfesion, BodyCrearProfesion, BodyResponseActualizarProfesion, BodyResponseCrearProfesion, Profesion } from 'src/app/interfaces/profesion';
import { BodyActualizarProveedor, BodyActualizarProveedorPendiente, BodyCrearProfesionProveedor, BodyCrearProveedor, BodyCrearProveedorPendiente, BodyResponseCrearProfesionProveedor, BodyResponseCrearProveedorPendiente, Proveedor, ProveedorPaginacion, ProveedorPendiente, ProveedorProfesion } from 'src/app/interfaces/proveedor';
import { BodyActualizarPublicidad, BodyCrearPublicidad, BodyResponseCrearPublicidad, Publicidad } from 'src/app/interfaces/publicidad';
import { BodyActualizarServicio, Servicio } from 'src/app/interfaces/servicio';
import {
  Solicitante,
  SolicitantePaginacion,
} from 'src/app/interfaces/solicitante';
import { SolicitudProfesion, SolicitudProfesionPaginacion } from 'src/app/interfaces/solicitud';
import { BodyCrearSubCategoria, BodyResponseCrearSubCategoria } from 'src/app/interfaces/sub-categoria';
import { SolicitudAdmin, SolicitudAdminFiltros, SolicitudAdminPaginacion } from 'src/app/interfaces/solicitud-admin';
import { Sugerencia } from 'src/app/interfaces/sugerencia';
import { PagosTarjetaUser } from 'src/app/interfaces/tarjeta';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PythonAnywhereService {
  API_URL = environment.apiUrl;
  administradores = environment.apiAdministradores;
  //API_URL = `http://127.0.0.1:8000`;
  //administradores = 'http://127.0.0.1:8000/administradores';

  private _refresh$ = new Subject<void>();
  constructor(private http: HttpClient) { }

  get refresh$() {
    return this._refresh$
  }

  obtener_politicas() {
    return this.http.get(`${this.API_URL}/administrador/content/politicas/`)
  }

  put_politicas(identifier: string, terminos: string): Observable<any> {
    const body = {
      identifier: identifier,
      terminos: terminos
    };
    return this.http.put(`${this.API_URL}/administrador/content/politicas/${identifier}/`, body);
  }
  //------------------------------------------------ SECCIÓN SOLICITANTES -------------------------------------------------
  /**
   * Obtiene todos los solicitantes, y los entrega en un formato con paginación.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number con el número de la página a buscar info. Por defecto 1.
   * @returns Devuelve un Observable con un objeto SolicitantePaginacion.
   */
  obtener_solicitantes(page = 1): Observable<SolicitantePaginacion> {
    return this.http.get(
      `${this.API_URL}/administrador/accounts/solicitantes/?page=${page}`
    ) as Observable<SolicitantePaginacion>;
  }
  /**
   * Obtiene todos los solicitantes por estado, y los entrega en un formato con paginación.
   *
   * @param page (Opcional) Recibe un number con el número de la página a buscar info. Por defecto 1.
   * @param filtro (Opcional) Recibe un string con el estado del solicitante a buscar info. Por defecto "todos".  
   * @returns Devuelve un Observable con un objeto SolicitantePaginacion.
   */
  obtener_solicitantes_filtro(page = 1, filtro = "todos"): Observable<SolicitantePaginacion> {
    return this.http.get(
      `${this.API_URL}/administrador/accounts/solicitantes/?page=${page}&filtro=${filtro}`
    ) as Observable<SolicitantePaginacion>;
  }

  /**
   * Obtene el solicitante desde la base de datos.
   *
   * @author Kevin Chévez
   * @param user Recibe un string que pertenece al correo del solicitante a buscar en la base de datos.
   * @returns Devuelve un Observable con un objeto Arreglo de Solicitante
   */
  obtener_solicitante(user: string): Observable<Solicitante[]> {
    return this.http.get(`${this.API_URL}/solicitante/${user}`) as Observable<
      Solicitante[]
    >;
  }

  /**
   * Obtiene los solicitantes que se encuentran registrados en un rango de fecha pasado por parámetro en un formato de paginación.
   *
   * @author Kevin Chévez
   * @param fechaInicio Recibe un string de la fecha inicio con el formato AAAA-MM-DD para aplicar al filtro.
   * @param fechaFin Recibe un string de la fecha fin con el formato AAAA-MM-DD para aplicar al filtro.
   * @param page (Opcional) Recibe un number con el número de la página a obtener la infomación. Por defecto 1.
   * @returns Devuelve un Observable con un objeto SolicitantePaginación.
   */
  filtrar_solicitante(fechaInicio: string, fechaFin: string, page = 1): Observable<SolicitantePaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/solicitantes/fechas/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`) as Observable<SolicitantePaginacion>;
  }

  /**
   * Función que busca un solicitante en la base de datos segun el string pasado como parametro.
   *
   * @author Kevin Chévez
   * @param usuario Recibe un string con el que se realizará el filtro del usuario con respecto a su correo.
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Observable con un objeto SolicitantePaginación.
   */
  buscar_solicitante(usuario: string, page = 1): Observable<SolicitantePaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/solicitantes/buscar/${usuario}/?page=${page}`) as Observable<SolicitantePaginacion>;
  }

  /**
   * Función que cambia el estado del solicitante que se encuentra registrado en la base de datos.
   *
   * @author Kevin Chévez
   * @param estado Recibe un boolean indicando el estado del solicitante. (true - false).
   * @param id Recibe un string indicando el ID del Solicitante (ID más externo de la tabla de solicitante).
   * @returns Devuelve un Observable con el objeto Solicitante el cuál fue modificado.
   */
  cambio_solicitante_estado(estado: boolean, id: string): Observable<Solicitante> {
    return this.http.put(`${this.API_URL}/administrador/accounts/solicitantes/${id}/estado/`, {
      estado: estado,
    }) as Observable<Solicitante>;
  }

  /**
   * Función que elimina a un solicitante registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Solicitante (ID más externo de la tabla de solicitante) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(205) or Error(500).
   */
  eliminar_solicitante(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/accounts/solicitantes/${id}/`);
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //-------------------------------------------------- SECCIÓN INSIGNIAS --------------------------------------------------
  /**
   * Función que trae de la base de datos todas las insignias.
   *
   * @author Kevin Chévez
   * @returns Devuelve un observable con un arreglo de objeto Insignias
   */
  obtener_insignias(): Observable<Insignia[]> {
    return this.http.get(this.API_URL + '/administrador/content/insignias/') as Observable<Insignia[]>;
  }

  obtener_medallas(): Observable<Medalla[]> {
    return this.http.get(this.API_URL + '/administrador/content/medallas/') as Observable<Medalla[]>;
  }

  /**
   * Función que obtiene la insignia seleccionada por parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID de la insignia a traer de la base de datos.
   * @returns Devuelve un Observable con la insignia requerida.
   */
  obtener_insignia(id: string): Observable<Insignia> {
    return this.http.get(
      `${this.API_URL}/administrador/content/insignias/detalle/${id}/`
    ) as Observable<Insignia>;
  }

  /**
   * Función que cambia el estado de la insignia que se encuentra registrada en la base de datos.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID de la insignia.
   * @param estado Recibe un boolean indicando el estado de la insignia. (true - false).
   * @returns Devuelve un Observable con la respuesta OK(200) o Error(500).
   */
  cambio_insignia_estado(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/content/insignias/estado/?id=${id}`, {
      estado: estado,
    }) as Observable<any>;
  }
  cambio_medalla_estado(id: string): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/content/medallas/estado/?id=${id}`, {
    }) as Observable<any>;
  }

  /**
   * Función que actualiza el contenido de una Insignia registrada en la base de datos, segun los parametros pasados o por estado de insignia.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyActualizarInsignia con los parametros indicador para actualizar la insignia.
   * @param id Recibe un string perteneciente al ID de la insignia la cual sera modificada.
   * @returns Devuelve un Observable de un Objeto Insignia el cual fue modificado.
   */
  actualizar_insignia(bodyActualizar: BodyActualizarInsignia, id: any): Observable<Insignia> {
    const dataUpdate = new FormData();
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.imagen ? dataUpdate.append('imagen', bodyActualizar.imagen) : null;
    bodyActualizar.servicio ? dataUpdate.append('servicio', bodyActualizar.servicio) : null;
    bodyActualizar.tipo_usuario ? dataUpdate.append('tipo_usuario', bodyActualizar.tipo_usuario) : null;
    dataUpdate.append('estado', bodyActualizar.estado.toString());
    bodyActualizar.pedidos ? dataUpdate.append('pedidos', bodyActualizar.pedidos.toString()) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.tipo ? dataUpdate.append('tipo', bodyActualizar.tipo) : null;

    return this.http.put(`${this.API_URL}/administrador/content/insignias/${id}/`, dataUpdate) as Observable<Insignia>;
  }

  actualizar_medalla(bodyActualizar: BodyActualizarMedalla, id: any): Observable<Insignia> {
    const dataUpdate = new FormData();
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.imagen ? dataUpdate.append('imagen', bodyActualizar.imagen) : null;
    bodyActualizar.cantidad ? dataUpdate.append('cantidad', bodyActualizar.cantidad.toString()) : null;
    bodyActualizar.valor ? dataUpdate.append('valor', bodyActualizar.valor.toString()) : null;
    bodyActualizar.estado ? dataUpdate.append('estado', bodyActualizar.estado.toString()) : null;
    bodyActualizar.tiempo ? dataUpdate.append('tiempo', bodyActualizar.tiempo.toString()) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;

    return this.http.put(`${this.API_URL}/administrador/content/medallas/${id}/`, dataUpdate) as Observable<Insignia>;
  }

  /**
   * Función que elimina una insignia registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Insignia la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_insignia(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/content/insignias/${id}/`) as Observable<any>;
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //---------------------------------------------------- SECCIÓN CARGOS ---------------------------------------------------
  /**
   * Función que trae de la base de datos los cargos que la empresa ha guardado.
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un arreglo de objeto Cargo
   */
  obtener_cargos(): Observable<Cargo[]> {
    return this.http.get(this.API_URL + '/administrador/content/cargos/') as Observable<Cargo[]>;
  }

  /**
   * Funcion que trae de la base de datos el cargo solicitado por parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe como parámetro el ID del cargo a traer de la base de datos.
   * @returns Devuelve un Observable del Objeto Cargo solicitado.
   */
  obtener_cargo(id: string): Observable<Cargo> {
    return this.http.get(`${this.API_URL}/administrador/content/cargos/detalle/${id}/`) as Observable<Cargo>

  }

  /**
   * Función que actualiza el contenido de un Cargo registrado en la base de datos, segun los parametros pasados.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyActualizarCargo con los parametros necesarios para actualizar el cargo.
   * @param id Recibe un string perteneciente al ID del cargo el cual sera modificado.
   * @returns Devuelve un Observable con un objeto Cargo actualizado.
   */
  actualizar_cargo(bodyActualizar: BodyActualizarCargo, id: any): Observable<Cargo> {
    return this.http.put(`${this.API_URL}/administrador/content/cargos/${id}/`, bodyActualizar) as Observable<Cargo>;
  }

  /**
   * Función que elimina un cargo registrado en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID del Cargo el cual sera eliminado.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_cargo(id: any): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/content/cargos/${id}/`) as Observable<any>;
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //-----------------------------------------------------------------------------------------------------------------------

  //------------------------------------------------------ SECCIÓN CUPON --------------------------------------------------
  /**
   * Funcion que obtiene un cupon segun el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID del cupo a traer de la base de datos.
   * @returns Devuelve un Observable con el objeto Cupon esperado.
   */
  obtener_cupon(id: string): Observable<CuponCrear> {
    return this.http.get(`${this.API_URL}/web/promotions/cupones/${id}/`) as Observable<Cupon>;
  }

  /**
   * Función que cambia el estado del cupon que se encuentra registrada en la base de datos.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del cupon.
   * @param estado Recibe un boolean indicando el estado del cupon. (true - false).
   * @returns Devuelve un Observable con la respuesta OK(200) o Error(500).
   */
  cambio_cupon_estado(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/promotions/cupones/estado/?id=${id}`, { estado: estado });
  }

  /**
   * Función que actualiza el contenido de un Cupon registrado en la base de datos, segun los parametros pasados.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyCuponActualizar con los parametros necesarios para actualizar el cupon.
   * @param id Recibe un string perteneciente al ID del cupon la cual sera modificada.
   * @returns Devuelve un Observable con un objeto BodyResponseCuponActualizar.
   */

  actualizar_cupon(bodyActualizar: BodyCuponActualizar, id: any): Observable<BodyResponseCuponActualizar> {
    const dataUpdate = new FormData();
    dataUpdate.append("codigo", bodyActualizar.codigo);
    dataUpdate.append("titulo", bodyActualizar.titulo);
    dataUpdate.append("descripcion", bodyActualizar.descripcion);
    bodyActualizar.fecha_iniciacion ? dataUpdate.append("fecha_iniciacion", bodyActualizar.fecha_iniciacion) : null;
    dataUpdate.append("fecha_expiracion", bodyActualizar.fecha_expiracion);
    dataUpdate.append("porcentaje", bodyActualizar.porcentaje.toString());
    // Iba `bodyActualizar.porcentaje` por un copy-paste: cada edición pisaba
    // `participantes` con el porcentaje.
    dataUpdate.append("participantes", bodyActualizar.participantes ?? "");
    dataUpdate.append("cantidad", bodyActualizar.cantidad.toString());
    dataUpdate.append("puntos", bodyActualizar.puntos.toString());
    bodyActualizar.foto ? dataUpdate.append("foto", bodyActualizar.foto) : null;
    dataUpdate.append("categoria", bodyActualizar.categoria ? bodyActualizar.categoria.toString() : '');

    return this.http.put(`${this.API_URL}/administrador/promotions/cupones/${id}/`, dataUpdate) as Observable<BodyResponseCuponActualizar>;
  }

  /**
   * Función que elimina un cupon registrado en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID del Cupon el cual sera eliminado.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_cupon(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/promotions/cupones/${id}/`) as Observable<any>;
  }

  /**
   * Cupón con su estado efectivo y el resumen de usos, para la pantalla de
   * detalle. A diferencia de `obtener_cupon`, que pega al endpoint web
   * compartido con la app del solicitante, este es el del admin.
   */
  obtener_cupon_detalle(id: string): Observable<Cupon> {
    return this.http.get(`${this.API_URL}/administrador/promotions/cupones/${id}/detalle/`) as Observable<Cupon>;
  }

  /** Lista paginada de quién canjeó el cupón y si ya lo usó en un pago. */
  obtener_usos_cupon(id: string, page = 1): Observable<any> {
    return this.http.get(`${this.API_URL}/administrador/promotions/cupones/${id}/usos/?page=${page}`) as Observable<any>;
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //------------------------------------------------------ SECCIÓN ADMIN --------------------------------------------------
  /**
   * Función que obtiene los administradores registrados en la base de datos.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto AdministradorPaginacion
   */
  obtener_administradores(page = 1): Observable<AdministradorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/administradores/?page=${page}`) as Observable<AdministradorPaginacion>;
  }

  /**
   * Función que obtiene un administrador desde la base de datos según si ID pasado como parámetro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID del administrador a traer de la base de datos.
   * @returns Devuelve un Observable del objeto Administrador
   */
  obtener_administrador(id: string): Observable<Administrador> {
    return this.http.get(`${this.API_URL}/administrador/accounts/administrador/${id}/`) as Observable<Administrador>;
  }

  /**
   * Función que actualiza un administrador que se encuentra en la base de datos.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID del administrador a actualizar.
   * @param usuario Recibe un objeto BodyActualizarAdministrador con los campos necesario a actualizar.
   * @returns Devuelve un Observable para verificar si las respuesta es 200 (OK).
   */
  actualizar_administrador(id: number, body: BodyActualizarAdministrador): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/accounts/administrador/${id}/`, body);
  }

  /**
   * Función que crea un administrador y lo registra en la base de datos.
   *
   * @author Kevin Chévez
   * @param user Recibe como parametro un objeto BodyCrearAdministrador con los parametros del registro.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearAdministrador.
   */
  crear_administrador(user: BodyCrearAdministrador): Observable<BodyResponseCrearAdministrador> {
    return this.http.post(`${this.API_URL}/administrador/accounts/administradores/`, user) as Observable<BodyResponseCrearAdministrador>;
  }

  /**
   * Función que busca a los administradoroes que coincidan en sus nombres o apellidos con el parametro enviado.
   *
   * @author Kevin Chévez
   * @param usuario Recibe un string con con el contenido a buscar en los nombres y apellidos del administrador.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto AdministradorPaginacion.
   */
  buscar_administrador(usuario: string, page = 1): Observable<AdministradorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/administradores/buscar/${usuario}/?page=${page}`) as Observable<AdministradorPaginacion>;
  }

  /**
   * Función que filtra a los administradores en un rango de fecha.
   *
   * @author Kevin Chévez
   * @param fechaInicio Recibe un string de la fecha inicio con el formato AAAA-MM-DD para aplicar al filtro.
   * @param fechaFin Recibe un string de la fecha fin con el formato AAAA-MM-DD para aplicar al filtro.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto AdministradorPaginacion.
   */
  filtrar_administrador(fechaInicio: string, fechaFin: string, page = 1): Observable<AdministradorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/administradores/fechas/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`) as Observable<AdministradorPaginacion>;
  }

  /**
   * Función que elimina a un administrador registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Administrador (ID más externo de la tabla de administrador) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_administrador(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/accounts/administradores/${id}/`);
  }

  cambio_administrador_estado(id: any, estado: any) {
    return this.http.put(`${this.API_URL}/administrador/accounts/administradores/?id=${id}`, { estado: estado, });
  }

  /**
   * Función que elimina a un administrador registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Administrador (ID más externo de la tabla de administrador) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_admin(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/accounts/administrador/${id}/`);
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //----------------------------------------------------- SECCIÓN PAYMENT -------------------------------------------------
  /**
   * Función que filtra las compras realizadas con efectivo en un rango de fechas.
   *
   * @author Kevin Chévez
   * @param fechaInicio Recibe un string de la fecha inicio con el formato AAAA-MM-DD para aplicar al filtro.
   * @param fechaFin Recibe un string de la fecha fin con el formato AAAA-MM-DD para aplicar al filtro.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto PaymentPaginacion de todas las respuestas filtradas.
   */
  filtrar_efectivo(fechaInicio: string, fechaFin: string, page = 1): Observable<PaymentPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/payments/pagos-efectivo/fechas/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`) as Observable<PaymentPaginacion>;
  }

  /**
   * Función que filtra las compras realizadas con tarjeta en un rango de fechas.
   *
   * @author Kevin Chévez
   * @param fechaInicio Recibe un string de la fecha inicio con el formato AAAA-MM-DD para aplicar al filtro.
   * @param fechaFin Recibe un string de la fecha fin con el formato AAAA-MM-DD para aplicar al filtro.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto PaymentPaginacion de todas las respuestas filtradas.
   */
  filtrar_tarjeta(fechaInicio: string, fechaFin: string, page = 1) {
    return this.http.get(`${this.API_URL}/administrador/payments/pagos-tarjeta/fechas/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  /**
   * Función que cambia el estado del cupon que se encuentra registrada en la base de datos.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del cupon.
   * @param estado Recibe un boolean indicando el estado del cupon. (true - false).
   * @returns Devuelve un Observable con la respuesta OK(200) o Error(500).
   */
  cambio_pago_proveedor_estado(id: any, estado: boolean) {
    return this.http.put(`${this.API_URL}/administrador/payments/pagos-tarjeta/?id=${id}`, { estado: estado, });
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //---------------------------------------------------- SECCIÓN PROVEEDOR ------------------------------------------------
  /**
   * Función que cambia el estado del proveedor que se encuentra registrado en la base de datos.
   *
   * @author Kevin Chévez
   * @param estado Recibe un boolean indicando el estado del proveedor. (true - false).
   * @param id Recibe un string indicando el ID del Proveedor (ID más externo de la tabla de Proveedor).
   * @returns Devuelve un Observable con el objeto Proveedor el cual fue modificado.
   */
  cambio_proveedor_estado(estado: boolean, id: string): Observable<Proveedor> {
    return this.http.put(`${this.API_URL}/administrador/accounts/proveedores/${id}/`, { estado: estado, }) as Observable<Proveedor>;
  }

  /**
   * Función que obtiene los proveedores registrados en la base de datos con un formato de paginacion.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto ProveedorPaginacion
   */
  obtener_proveedores(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
   * Función que obtiene todos los proveedores pendientes que se encuentran en la base de datos.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto ProveedorPaginacion
   */
  obtener_proveedores_pendientes(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores-pendientes/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  obtener_proveedores_rechazados(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores-rechazados/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  obtener_movimientos_puntos(page = 1, user = ''): Observable<any> {
    const q = user ? `&user=${encodeURIComponent(user)}` : '';
    return this.http.get(`${this.API_URL}/administrador/accounts/movimientos-puntos/?page=${page}${q}`);
  }

  otorgar_puntos_manual(email: string, monto: number, referencia: string): Observable<any> {
    return this.http.post(`${this.API_URL}/administrador/accounts/movimientos-puntos/`, { email, monto, referencia });
  }

  obtener_proveedores_proveedores(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores-proveedores/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
   * Función que obtiene al proveedor pendiente que se encuentra en la base de datos segun el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del proveedor pendiente objetivo a buscar en la Base de datos.
   * @returns Devuelve un observable con objeto ProveedorPendiente
   */
  obtener_proveedor_pendiente(id: string): Observable<ProveedorPendiente> {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores-pendientes/${id}/`) as Observable<ProveedorPendiente>;
  }

  /**
   * Función que elimina a un proveedor pendiente registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del ProveedorPendientea ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
  */
  eliminar_proveedor_pendiente(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/accounts/proveedores-pendientes/${id}/`);
  }

  /**
   * Función que busca proveedores pendientes en la base de datos segun el string pasado como parametro.
   *
   * @author Kevin Chévez
   * @param user Recibe un string con el que se realizará el filtro del usuario con respecto a su nombre y apellido.
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Observable con un objeto ProveedorPaginacion.
   */
  buscar_proveedores_pendientes(user: string, page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores-pendientes/buscar/${user}/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
   * Función que filtra los proveedores pendientes en un rango de fechas.
   *
   * @author Kevin Chévez
   * @param fechaInicio Recibe un string de la fecha inicio con el formato AAAA-MM-DD para aplicar al filtro.
   * @param fechaFin Recibe un string de la fecha fin con el formato AAAA-MM-DD para aplicar al filtro.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto ProveedorPaginacion de todas las respuestas filtradas.
   */
  filtrar_fecha_proveedores_pendientes(fechaInicio: string, fechaFin: string, page = 1) {
    return this.http.get(`${this.API_URL}/administrador/accounts/proveedores-pendientes/fechas/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  /**
   * Función que crea un objeto ProveedorPendiente y lo registra en la base de datos.
   *
   * @author Kevin Chévez
   * @param data Recibe un objeto BodyCrearProveedorPendiente con los parametros necesarios para crear el ProveedorPendiente
   * @returns Devuelve Observable con un objeto BodyResponseCrearProveedorPendiente
   */
  crear_proveedor_pendiente(data: BodyCrearProveedorPendiente): Observable<BodyResponseCrearProveedorPendiente> {
    return this.http.post(`${this.API_URL}/administrador/accounts/proveedores-pendientes/crear/`, data) as Observable<BodyResponseCrearProveedorPendiente>;
  }

  crear_proveedor_proveedor(data: BodyCrearProveedorPendiente): Observable<BodyResponseCrearProveedorPendiente> {
    return this.http.post(`${this.API_URL}/administrador/accounts/proveedor-proveedor/`, data) as Observable<BodyResponseCrearProveedorPendiente>;
  }

  getSolicitantePythonAny(user: string): Observable<Array<Solicitante>> {
    return this.http.get(`${this.API_URL}/administrador/accounts/solicitante-por-usuario/${user}`) as Observable<Array<Solicitante>>;
  }

  postRegistro(body: any) {
    return this.http.post(`${this.API_URL}/administrador/accounts/registro/`, body);
  }
  /**
   * Función que edita la información de un objeto ProveedorPendiente
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del proveedor pendiente objetivo a editar.
   * @param data Recibe un objeto BodyActualizarProveedorPendiente con los campos a actualizar/editar.
   * @returns Devuelve un Observable con un objeto ProveedorPendiente el cual fue modificado.
   */
  editar_proveedor_pendiente(id: string, data: BodyActualizarProveedorPendiente): Observable<ProveedorPendiente> {
    const pendiente = new FormData();
    pendiente.append('nombres', data.nombres)
    pendiente.append('apellidos', data.apellidos)
    pendiente.append('genero', data.genero)
    pendiente.append('telefono', data.telefono)
    pendiente.append('cedula', data.cedula)
    if (data.copiaCedula != null) {
      pendiente.append('copiaCedula', data.copiaCedula as any)
    }
    pendiente.append('ciudad', data.ciudad)
    pendiente.append('direccion', data.direccion)
    pendiente.append('email', data.email)
    pendiente.append('descripcion', data.descripcion)
    pendiente.append('licencia', data.licencia)
    if (data.copiaLicencia != null) {
      pendiente.append('copiaLicencia', data.copiaLicencia)
    }
    pendiente.append('profesion', data.profesion)
    //ARREGLAR
    if (data.ano_experiencia != null) {
      pendiente.append('ano_experiencia', data.ano_experiencia as any)
    }
    pendiente.append('banco', data.banco)
    pendiente.append('numero_cuenta', data.numero_cuenta)
    pendiente.append('tipo_cuenta', data.tipo_cuenta)
    if (data.foto != null) {
      pendiente.append('foto', data.foto)
    }
    //ARREGLAR
    if (data.filesDocuments != null) {
      pendiente.append('filesDocuments', data.filesDocuments[0] as any)
    }
    //planilla_servicios: data.planilla_servicios
    console.log("LA COSAS ESAS LASMASD")
    console.log(pendiente)
    console.log(pendiente.get("foto"))
    return this.http.put(`${this.API_URL}/administrador/accounts/proveedores-pendientes/${id}/`, pendiente) as Observable<ProveedorPendiente>;
  }

  editar_proveedor_proveedor(id: string, data: BodyActualizarProveedor): Observable<Proveedor> {
    const pendiente = new FormData();
    const userDatos = {
      id: data.user_datos.id,
      user: data.user_datos.user,
      tipo: data.user_datos.tipo,
      nombres: data.user_datos.nombres,
      apellidos: data.user_datos.apellidos,
      cedula: data.user_datos.cedula,
      ciudad: data.user_datos.ciudad,
      codigo_invitacion: data.user_datos.codigo_invitacion,
      telefono: data.user_datos.telefono,
      genero: data.user_datos.genero,
      foto: data.user_datos.foto,
      estado: data.user_datos.estado,
      fecha_creacion: data.user_datos.fecha_creacion,
      puntos: data.user_datos.puntos
    };
    pendiente.append("user_datos", JSON.stringify(userDatos));
    pendiente.append("apellidos", data.user_datos.apellidos);
    pendiente.append("email", data.email);
    pendiente.append("ciudad", data.user_datos.ciudad);
    pendiente.append("cedula", data.user_datos.cedula);
    pendiente.append("telefono", data.user_datos.telefono);
    pendiente.append("genero", data.user_datos.genero);

    pendiente.append("direccion", data.direccion);
    pendiente.append("descripcion", data.descripcion);
    pendiente.append("licencia", data.licencia);

    if (data.copiaCedula) {
      pendiente.append("copiaCedula", data.copiaCedula) as any;
    }

    if (data.copiaLicencia) {
      pendiente.append("copiaLicencia", data.copiaLicencia);
    }

    pendiente.append("profesion", data.profesion);
    pendiente.append("ano_profesion", data.ano_profesion);
    pendiente.append("banco", data.banco);
    pendiente.append("numero_cuenta", data.numero_cuenta);
    pendiente.append("tipo_cuenta", data.tipo_cuenta);

    // Agregar imagen de perfil si es nueva
    if (data.user_datos.foto != null) {
      pendiente.append("foto", data.user_datos.foto);
    }
    //ARREGLAR
    if (data.filesDocuments != null) {
      pendiente.append('filesDocuments', data.filesDocuments[0] as any)
    }
    //planilla_servicios: data.planilla_servicios
    console.log(pendiente)
    console.log(pendiente.get("foto"))
    return this.http.put(`${this.API_URL}/administrador/accounts/proveedores-proveedores/${id}/`, pendiente) as Observable<Proveedor>;
  }

  /**
   * Función que edita la información de un objeto Proveedor registrado en la base de datos.
   *
   * @author Kevin Chévez
   * @param data Recibe un objeto BodyActualizarProveedor con los campos a actualizar/editar.
   * @returns Devuelve un Observable con un objeto {"sucess": "Exito"} en caso de exito.
   */
  editar_proveedor(data: BodyActualizarProveedor): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/accounts/edicion-proveedor/`, data);
  }

  /**
   * Función que elimina a un proveedor registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Proveedor (ID más externo de la tabla de proveedor) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
  */
  eliminar_proveedor(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/accounts/proveedores/${id}/`);
  }

  eliminar_proveedor1(id: number) {
    return this.http.delete(`${this.API_URL}/administrador/accounts/proveedores-proveedores/${id}/eliminar/`);
  }

  cambiarPasswordUsuario(userId: number, password: string): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/accounts/usuarios/${userId}/password/`, { password });
  }

  //-----------------------------------------------------------------------------------------------------------------------



  //--------------------------------------------------- SECCIÓN DOCUMENTOS ------------------------------------------------
  /**
   * Funcion que obtiene y presenta todos los documentos pendientes que se encuentra en la base de datos en la ruta /pendientes-documents.
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un arreglo de objetos DocumentoPendiente
   */
  obtener_documentos_pendientes(): Observable<DocumentoPendiente[]> {
    return this.http.get(`${this.API_URL}/administrador/accounts/documentos-pendientes/`) as Observable<DocumentoPendiente[]>;
  }

  /**
   * Función que elimina el documento pendiente en la ruta /pendientes-documents que se encuentra registrado en la base de datos segun el ID.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del documento pendiente objetivo a eliminar de la base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
  */
  eliminar_documento_pendiente(id: string) {
    return this.http.delete(`${this.API_URL}/administrador/accounts/documentos-pendientes/?id=${id}`);
  }

  /**
   * Funcion que obtiene y presenta todos los documentos que se encuentra en la base de datos en la ruta /documents.
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un arreglo de objetos Documento
   */
  obtener_documentos(): Observable<Documento[]> {
    return this.http.get(`${this.API_URL}/administrador/accounts/documentos-proveedores/`) as Observable<Documento[]>;
  }

  /**
   * Función que elimina el documento en la ruta /documents que se encuentra registrado en la base de datos segun el ID.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del documento objetivo a eliminar de la base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_documento(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/accounts/documentos-proveedores/?id=${id}`);
  }
  //-----------------------------------------------------------------------------------------------------------------------



  //----------------------------------------------------- SECCIÓN EMAIL ---------------------------------------------------
  /**
   * Función que envia un email de bienvenida a los usuarios Administradores o Proveedores.
   *
   * @author Kevin Chévez
   * @param data Recibe como parametro un Objeto BodyEmail con el contenido necesario para enviar el correo.
   * @returns Devuelve un Observable con un objeto BodyResponseEmail
   */
  enviar_email(data: BodyEmail): Observable<BodyResponseEmail> {
    return this.http.post(this.API_URL + '/administrador/notifications/email-bienvenida/', data) as Observable<BodyResponseEmail>;
  }
  //-----------------------------------------------------------------------------------------------------------------------



  //--------------------------------------------------- SECCIÓN CATEGORIAS ------------------------------------------------
  /**
   * Función que obtiene de la base de datos todas las categorias registradas.
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un Arreglo de un Objeto Categoria
   */
  obtener_categorias(): Observable<Categoria[]> {
    return this.http.get(this.API_URL + '/administrador/catalog/categorias/') as Observable<Categoria[]>;
  }

  /**
   * Función que actualiza una categoria registrada en la base de datos, segun los parametros pasados o por estado de categoria.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyActualizarCategoria con los parametros indicador para actualizar la insignia.
   * @param id Recibe un string del ID de la categoria a actualizar el estado.
   * @returns Devuelve un Observable de un Objeto Categoria el cual fue modificado.
   */
  actualizar_categoria(bodyActualizar: BodyActualizarCategoria, id: number): Observable<Categoria> {
    const dataUpdate = new FormData();
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.foto ? dataUpdate.append('foto', bodyActualizar.foto) : null;
    bodyActualizar.foto2 ? dataUpdate.append('foto2', bodyActualizar.foto2) : null;

    return this.http.put(`${this.API_URL}/administrador/catalog/categorias/${id}/`, dataUpdate) as Observable<Categoria>;
  }

  actualizar_categoria_estado(bodyActualizar: BodyActualizarCategoria, id: number): Observable<Categoria> {
    const dataUpdate = new FormData();

    dataUpdate.append('estado', bodyActualizar.estado.toString())


    return this.http.put(`${this.API_URL}/administrador/catalog/categorias/${id}/`, dataUpdate) as Observable<Categoria>;
  }

  /**
   * Función que elimina una categoria registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Categorias la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_categoria(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/catalog/categorias/${id}/`) as Observable<any>;
  }
  eliminar_subcategoria(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/catalog/servicios/${id}/`) as Observable<any>;
  }

  /**
   * Función que agrega en la base de datos una Categoria segun los datos pasados por parametros.
   *
   * @author Kevin Chévez
   * @param bodyCrear Recibe un Objeto BodyCrearCategoria la cual se encarga de crear una categoria con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearCategoria
   */
  add_categoria(bodyCrear: BodyCrearCategoria): Observable<BodyResponseCrearCategoria> {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("descripcion", bodyCrear.descripcion);;
    bodyCrear.foto ? dataCrear.append("foto", bodyCrear.foto) : null;
    bodyCrear.foto2 ? dataCrear.append("foto2", bodyCrear.foto2) : null;
    return this.http.post(`${this.API_URL}/administrador/catalog/categorias/`, dataCrear) as Observable<BodyResponseCrearCategoria>;
  }
  //-----------------------------------------------------------------------------------------------------------------------


  //--------------------------------------------------- SECCIÓN PROFESION------------------------------------------------
  /**
   * Función que obtiene de la base de datos todas las profesiones registradas
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un objeto Arreglo Profesion.
   */
  obtener_profesiones(): Observable<Profesion[]> {
    return this.http.get(`${this.API_URL}/administrador/catalog/profesiones/`) as Observable<Profesion[]>;
  }
  /**
   * Función que agrega en la base de datos una profesion segun los datos pasados por parametros.
   *
   * @author Kevin Chévez
   * @param bodyCrear Recibe un Objeto BodyCrearProfesion la cual se encarga de crear una profesion con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearProfesion
   */
  add_profesion(bodyCrear: BodyCrearProfesion): Observable<BodyResponseCrearProfesion> {
    const dataCrear = new FormData();
    if (bodyCrear.nombre && bodyCrear.descripcion && bodyCrear.servicio) {
      dataCrear.append("nombre", bodyCrear.nombre);
      dataCrear.append("descripcion", bodyCrear.descripcion);
      dataCrear.append("servicio", bodyCrear.servicio);
      bodyCrear.foto ? dataCrear.append("foto", bodyCrear.foto) : null;
    }
    return this.http.post(this.API_URL + '/administrador/catalog/profesiones/', dataCrear) as Observable<BodyResponseCrearProfesion>;
  }

  /**
   * Función que elimina una profesion registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Profesion la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  delete_profesion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/catalog/profesiones/${id}/`) as Observable<any>;
  }
  //-----------------------------------------------------------------------------------------------------------------------


  //----------------------------------------------------- SECCIÓN SERVICOS ------------------------------------------------
  /**
   * Función que obtiene los serivicos registrados en la base de datos.
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un Array de un objeto Servicio
   */
  obtener_servicios(): Observable<Servicio[]> {
    return this.http.get(this.API_URL + '/administrador/catalog/servicios/', {
      params: {
        todas: "True"
      }
    }) as Observable<Servicio[]>;
  }

  /**
   * Función que actualiza el contenido de un Servicio registrado en la base de datos, segun los parametros pasados.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyActualizarServicio con los parametros necesarios para actualizar el servicio.
   * @param id Recibe un string perteneciente al ID del Servicio el cual sera modificado.
   * @returns Devuelve un Observable con un objeto Servicio actualizado.
   */
  actualizar_servicios(bodyActualizar: BodyActualizarServicio, id: string): Observable<Servicio> {
    const dataUpdate = new FormData();
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.categoria ? dataUpdate.append('categoria', bodyActualizar.categoria) : null;
    bodyActualizar.estado !== undefined ? dataUpdate.append('estado', bodyActualizar.estado.toString()) : null;
    bodyActualizar.foto ? dataUpdate.append('foto', bodyActualizar.foto) : null;
    const tokenPythonAny = this.getTokenPythonAnywhere();
    return this.http.put(`${this.API_URL}/administrador/catalog/servicios/${id}/`, dataUpdate) as Observable<Servicio>;
  }

  getTokenPythonAnywhere(): string | null {
    const key = 'tokenPythonAnywhere';
    const valor = localStorage.getItem(key);
    return valor;
  }

  /**
   * Función que elimina un servicio registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID del Servicio el cual sera eliminado.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_servicio(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/catalog/servicios/${id}/`) as Observable<any>;
  }

  /**
   * Función que elimina DEFINITIVAMENTE (hard delete) un Servicio. Distinto
   * de eliminar_servicio/eliminar_subcategoria (soft-toggle de estado): el
   * backend bloquea con 409 si hay Solicitudes o Proveedores asociados.
   *
   * @param id Recibe un number perteneciente al ID del Servicio a eliminar.
   * @returns Devuelve un Observable; en caso de bloqueo, el error trae
   * { error, solicitudes, proveedores_asociados } con status 409.
   */
  eliminar_subcategoria_definitivo(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/catalog/servicios/${id}/eliminar/`) as Observable<any>;
  }

  /**
   * Función que obtiene, paginados, los Profesion_Proveedor asociados a un
   * Servicio (emparejado por nombre con su Profesion homónima).
   *
   * @param servicioId Recibe un number perteneciente al ID del Servicio.
   * @param page Recibe el número de página a consultar (por defecto 1).
   * @returns Devuelve un Observable con el payload paginado (results, total_objects, total_pages, next, current_page_number).
   */
  obtener_proveedores_por_servicio(servicioId: number, page = 1): Observable<any> {
    return this.http.get(`${this.API_URL}/administrador/catalog/servicios/${servicioId}/proveedores/?page=${page}`) as Observable<any>;
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //---------------------------------------------------------------- Margarita  ----------------------------------------------------------------

  /**
   * Funcion que crea insignias en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear  Recibe un Objeto BodyCrearInsignia la cual se encarga de crear una insignia con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearInsignia
   */
  crear_insignia(bodyCrear: BodyCrearInsignia): Observable<BodyResponseCrearInsignia> {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    dataCrear.append("servicio", bodyCrear.servicio);
    dataCrear.append("tipoUsuario", bodyCrear.tipoUsuario);
    dataCrear.append("pedidos", bodyCrear.pedidos);
    dataCrear.append("descripcion", bodyCrear.descripcion);
    return this.http.post(`${this.API_URL}/administrador/content/insignias/`, dataCrear) as Observable<BodyResponseCrearInsignia>;
  }

  crear_medalla(bodyCrear: BodyCrearMedalla): Observable<BodyResponseCrearInsignia> {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("descripcion", bodyCrear.descripcion);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    dataCrear.append("tiempo", bodyCrear.tiempo);
    dataCrear.append("valor", bodyCrear.valor);
    dataCrear.append("cantidad", bodyCrear.cantidad);

    return this.http.post(`${this.API_URL}/administrador/content/medallas/`, dataCrear) as Observable<BodyResponseCrearInsignia>;
  }

  /**
   * Funcion que crea cargo en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyCrearCargo la cual se encarga de crear un cargo con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearCargo
   */
  crear_cargo(bodyCrear: BodyCrearCargo): Observable<BodyResponseCrearCargo> {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("porcentaje", bodyCrear.porcentaje.toString());
    dataCrear.append("titulo", bodyCrear.titulo);
    if (bodyCrear.tipo) {
      dataCrear.append("tipo", bodyCrear.tipo);
    }
    return this.http.post(`${this.API_URL}/administrador/content/cargos/`, dataCrear) as Observable<BodyResponseCrearCargo>;
  }

  /**
   * Funcion que crea subcategoria en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyCrearSubCategoria la cual se encarga de crear un cargo con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearSubCategoria
   */
  crear_servicios(bodyCrear: BodyCrearSubCategoria): Observable<BodyResponseCrearSubCategoria> {
    const dataCrear = new FormData();
    dataCrear.append("foto", bodyCrear.foto);
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("categoria", bodyCrear.categoria);
    dataCrear.append("descripcion", bodyCrear.descripcion);
    return this.http.post(`${this.API_URL}/administrador/catalog/servicios/`, dataCrear) as Observable<BodyResponseCrearSubCategoria>;
  }

  /**
   * Funcion que crea profesion de un proveedor en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param user correo del proveedor
   * @param data profesion y ano_experiencia. EJ: data = {"profesion": "Jardinero", ano_experiencia: 5 }
   * @returns Devuelve status un Observable con un objeto BodyResponseCrearProfesionProveedor
   */
  crear_profesiones_proveedor(user: string, data: BodyCrearProfesionProveedor): Observable<BodyResponseCrearProfesionProveedor> {
    return this.http.post(`${this.API_URL}/administrador/catalog/profesion-proveedor/crear/${user}/`, data) as Observable<BodyResponseCrearProfesionProveedor>;
  }


  //https://tomesoft1.pythonanywhere.com/proveedor_profesiones/melquinto20@gmail.com/128&Jardinero,Pintor|true
  eliminar_proveedores_pendientes(id: any) {//FALTA
    return this.http.delete(
      `${this.API_URL}/administrador/accounts/proveedores-pendientes/${id}/`
    );
  }

  cambio_pendiente_estado(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/accounts/proveedores-pendientes-estado/?id=${id}`, {
      estado: estado,
    }) as Observable<any>;
  }
  eliminar_proveedores(id: any) {//FALTA
    return this.http.delete(
      `${this.API_URL}/administrador/accounts/proveedores/${id}/`
    );
  }
  eliminar_proveedores_pendientes2(id: any, data: any) {//FALTA
    const razon = new FormData();
    razon.append("razon", data);
    console.log("la raozn es esta", razon)
    console.log("la raozn es ewwwwsta", data)
    return this.http.put(`${this.API_URL}/administrador/accounts/proveedores-pendientes/${id}/rechazo/`, razon);
  }
  eliminar_proveedores_rechazados(id: any) {//FALTA
    return this.http.delete(
      `${this.API_URL}/administrador/accounts/proveedores-rechazados/${id}/`
    );
  }

  update_pendiente_documento(data: any) {
    return this.http.put(`${this.API_URL}/administrador/accounts/proveedores-pendientes/`, data);
  }



  /**
 * Funcion que traer todos los cupones
 *
 * @author Margarita Mawyin
 * @returns Devuelve un Observable con un objeto Cupones
   */
  obtener_cupones(page = 1) {
    return this.http.get(this.API_URL + `/administrador/promotions/cupones/?page=${page}`);
  }

  /**
* Funcion que traer todos los cupones
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Grupos
 */
  obtener_grupos() {
    return this.http.get(this.API_URL + '/administrador/accounts/grupos/');
  }

  /**
   *  Funcion que agrega los cupones
   * @author Margarita Mawyin
   * @param data
   * @returns Devuelve un Observable con success: boolean, msg: string, cupon: Object<Cupon>
   */
  /*
  {
    "codigo": "margaritam",
    "titulo": "codigoMargarita",
    "foto": "null",
    "descripcion": "bla bla",
    "porcentaje": 0.25,
    "cantidad": 1,
    "fecha_iniciacion": "2023-01-13T23:42:06-05:00",
    "fecha_expiracion": "2023-01-31T23:42:06-05:00",
    "puntos": 10,
    "tipo_categoria": "Jardineria"
}
  */
  crear_cupon(bodyCrear: CuponCrear) {
    console.log("service crear cupon")
    const dataCrear = new FormData();
    dataCrear.append("codigo", bodyCrear.codigo);
    bodyCrear.foto ? dataCrear.append("foto", bodyCrear.foto) : null;
    dataCrear.append("titulo", bodyCrear.titulo);
    dataCrear.append("puntos", bodyCrear.puntos.toString());
    dataCrear.append("categoria", bodyCrear.categoria ? bodyCrear.categoria.toString() : '');
    dataCrear.append("cantidad", bodyCrear.cantidad.toString());
    dataCrear.append("porcentaje", bodyCrear.porcentaje.toString());
    dataCrear.append("fecha_iniciacion", bodyCrear.fecha_iniciacion);
    dataCrear.append("fecha_expiracion", bodyCrear.fecha_expiracion);
    dataCrear.append("descripcion", bodyCrear.descripcion);
    dataCrear.append("participantes", bodyCrear.participantes);
    return this.http.post(this.API_URL + '/administrador/promotions/cupones/', dataCrear);
  }


  obtener_ctgprom(promCode: any) {
    return this.http.get(`${this.API_URL}/promcategorias/${promCode}`);
  }


  /**
   * Funcion que trae los pagos en efectivo
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable con un arreglo de objetos PaymentEfectivo
   */
  obtener_pagos_efectivo(): Observable<Array<PaymentEfectivo>> {
    return this.http.get(this.API_URL + '/administrador/payments/pagos-efectivo/') as Observable<Array<PaymentEfectivo>>;
  }

  /**
   * Funcion que trae los pagos en efectivo por pagina
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable con un objeto ProveedorPaginacion
   */
  obtener_pagos_efectivoP(page = 1): Observable<any> {
    return this.http.get(`${this.API_URL}/administrador/payments/pagos-efectivo/paginado/?page=${page}`) as Observable<any>;
  }

  /**
 * Funcion que trae los pagos con tarjeta por pagina
 *
 * @author Margarita Mawyin
 * @returns Devuelve un Observable con un objeto ProveedorPaginacion
 */
  obtener_pagos_tarjetaP(page = 1): Observable<any> {
    return this.http.get(`${this.API_URL}/administrador/payments/pagos-tarjeta/paginado/?page=${page}`) as Observable<any>;

  }

  /**
* Funcion que trae el objeto { "valor__sum": 2955.63 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Efectivo
*/
  valor_total_efectivo() {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/efectivo/`);
  }

  /**
* Funcion que trae el objeto { "valor__sum": 2017.0 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Tarjeta
*/
  valor_total_tarjeta() {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/tarjeta/`);
  }

  /**
* Funcion que trae el objeto { "cargo_paymentez__sum": 6.825 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Pay Tarjeta
*/
  valor_total_pay_tarjeta() {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/pay-tarjeta/`);
  }

  /**
* Funcion que trae el objeto { "cargo_banco__sum": 20.475 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Banc Tarjeta
*/
  valor_total_banc_tarjeta(): Observable<any> {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/banc-tarjeta/`);
  }

  /**
* Funcion que trae el objeto { "cargo_sistema__sum": 9.099999999999998 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Sis Tarjeta
*/
  valor_total_sis_tarjeta() {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/sis-tarjeta/`);
  }

  /**
* Funcion que trae 4972.63
*
* @author Margarita Mawyin
* @returns 4972.63
*/
  valor_total() {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/`);
  }


  /**
 * Funcion que trae los pagos con tarjeta del usuario
 *
 * @author Margarita Mawyin
 * @returns Devuelve un Observable con un arreglo de objetos PaymentTarjeta
 */
  obtener_pagos_tarjeta(): Observable<Array<PaymentTarjeta>> {
    return this.http.get(this.API_URL + '/administrador/payments/pagos-tarjeta/') as Observable<Array<PaymentTarjeta>>;
  }

  //NO SE LO USABA EN LA ANTERIOR APP
  //NO reconoce el id sacado de obtener_pagos_efectivo()
  obtener_pago_solE(pago_ID: any) {
    return this.http.get(`${this.API_URL}/administrador/payments/pagos-solicitud/efectivo/${pago_ID}/`);
  }
  /**
   *
   * @author Margarita Mawyin
   * @param pago_ID un id de  obtener_pagos_tarjeta()
   * @returns Devuelve un Observable con un objeto PagosTarjetaUser
   */
  obtener_pago_solT(pago_ID: any): Observable<PagosTarjetaUser> {
    return this.http.get(`${this.API_URL}/administrador/payments/pagos-solicitud/tarjeta/${pago_ID}/`) as Observable<PagosTarjetaUser>;
  }
  //FALTA
  enviar_correo_alerta(correo: any, asunto: any, texto: any) {
    return this.http.get(
      `${this.API_URL}/administrador/notifications/enviar-alerta/${correo}/${asunto}/${texto}`
    );
  }
  /**
   * Funcion que cambia el estado de una sugerencia. si cambio a false sale 400, si cambio a true sale 200
   *
   * @author Margarita Mawyin
   * @param sugerencia Recibe un objeto con el estado. EJ: {"estado": true}
   * @param id id de la sugerencia
   * @returns  retorna un status 200=OK o 400=BAD_REQUEST
   */

  editar_sugerencia_estado(sugerencia: boolean, id: any) {
    return this.http.put(`${this.API_URL}/administrador/content/suggestions/estado/?id=${id}`, {estado: sugerencia,});
  }

  /**
   * Funcion que trae la sugerencia por ID especificado
   *
   * @author Margarita Mawyin
   * @param id
   * @returns Retorna un objeto Sugerencia
   */
  obtener_sugerencia(id: any): Observable<Sugerencia> {
    return this.http.get(`${this.API_URL}/administrador/content/suggestions/${id}/`) as Observable<Sugerencia>;
  }

  /**
  * Funcion que trae las sugerencias leidas por pagina especificada
  *
  * @author Margarita Mawyin
  * @param id
  * @returns Retorna objetos de ProveedorPaginacion
  */
  obtener_sugerenciasLeidas(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/content/suggestions/read/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
  * Funcion que trae las sugerencias NO leidas por pagina especificada
  *
  * @author Margarita Mawyin
  * @param id
  * @returns Retorna objetos de ProveedorPaginacion
  */
  obtener_sugerenciasNoLeidas(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/content/suggestions/unread/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
  * Funcion que trae las ciudades
  *
  * @author Margarita Mawyin
  * @param id
  * @returns Retorna 5 objetos de Ciudades
  */
  getCiudades(): Observable<Ciudad> {
    return this.http.get(`${this.API_URL}/ciudades/`) as Observable<Ciudad>;
  }

  //NO hay metodo put ciudades en la BD
  crear_Ciudades(ciudad: Ciudad) {
    return this.http.put(`${this.API_URL}/ciudades/`, ciudad);
  }

  /**
  * Funcion que trae los planes
  *
  * @author Margarita Mawyin
  * @returns Retorna arreglo de objetos  Plan
  */
  obtener_planes(): Observable<Array<Plan>> {
    return this.http.get(this.API_URL + '/administrador/payments/planes/') as Observable<Array<Plan>>;
  }


  /**
   * Funcion que crea plan en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear  Recibe un Objeto BodyCrearPlan la cual se encarga de crear una insignia con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearPlan
   */
  crear_plan(bodyCrear: BodyCrearPlan): Observable<BodyResponseCrearPlan> {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("estado", bodyCrear.estado.toString());
    dataCrear.append("descripcion", bodyCrear.descripcion);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    dataCrear.append("precio", bodyCrear.precio.toString());
    dataCrear.append("duracion", bodyCrear.duracion.toString());
    return this.http.post(this.API_URL + '/administrador/payments/planes/', dataCrear) as Observable<BodyResponseCrearPlan>;
  }

  /**
   * Funcion que actualiza un plan en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyActualizarPlan la cual se encarga de actualizar un plan con los campos necesarios.
   * @returns Devuelve un Observable con un objeto Plan
   */
  actualizar_plan(bodyActualizar: BodyActualizarPlan): Observable<Plan> {

    const dataUpdate = new FormData();
    bodyActualizar.id ? dataUpdate.append('id', bodyActualizar.id) : null
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.imagen ? dataUpdate.append('imagen', bodyActualizar.imagen) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.duracion ? dataUpdate.append('duracion', bodyActualizar.duracion) : null;
    bodyActualizar.precio ? dataUpdate.append('precio', bodyActualizar.precio) : null;
    bodyActualizar.estado ? dataUpdate.append('estado', bodyActualizar.estado.toString()) : null;

    return this.http.put(this.API_URL + '/administrador/payments/planes/', dataUpdate) as Observable<Plan>;
  }
  actualizar_plan_estado(bodyActualizar: BodyActualizarPlan): Observable<Plan> {

    const dataUpdate = new FormData();
    bodyActualizar.id ? dataUpdate.append('id', bodyActualizar.id) : null
    bodyActualizar.estado ? dataUpdate.append('estado', bodyActualizar.estado.toString()) : null;

    return this.http.put(this.API_URL + '/administrador/payments/planes/', dataUpdate) as Observable<Plan>;
  }

  /**
   * Funcion que elimina un plan por ID
   *
   * @author Margarita Mawyin
   * @param id Recibe el id del plan . ID se puede sacar de obtener_planes()
   * @returns Retorna un objeto Plan
   */
  borrar_plan(id: any): Observable<Plan> {
    return this.http.delete(`${this.API_URL}/administrador/payments/planes/${id}/`) as Observable<Plan>;
  }


  /**
   * Funcion que trae las publicidades por numero de pagina
   *
   * @author Margarita Mawyin
   * @param page Recibe un numero de pagina. 1
   * @returns Retorna un objeto ProveedorPaginacion
   */
  obtener_publicidades(page = 1): any {
    return this.http.get(`${this.API_URL}/administrador/content/publicidades/?page=${page}`)
  }

  /**
   *
   * Funcion que filtra por titulo las publicidades
   *
   * @author Margarita Mawyin
   * @param buscar Recibe el titulo , que se puede obtener de obtener_publicidades()
   * @param page Recive un numero de pagina
   * @returns Retorna un objeto ProveedorPaginacion
   */
  filtrar_publicidadName(buscar: string, page: string): Observable<ProveedorPaginacion> {
    return this.http.get(
      `${this.API_URL}/administrador/content/publicidades/buscar/?page=${page}&buscar=${buscar}`
    ) as Observable<ProveedorPaginacion>;
  }

  //YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
  /*{
      "id": 15,
      "titulo": "publicidad Margarita",
      "descripcion": "prueba de imagen",
      "fecha_creacion": "13-01-2023 22:24:18",
      "fecha_inicio": "13-01-2023 23:42:06",
      "fecha_expiracion": "31-01-2023 23:42:06",
      "imagen": null,
      "url": "https://www.google.com"
  }
  */
  /**
   * Funcion que crea publicidad en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear  Recibe un Objeto BodyCrearPublicidad la cual se encarga de crear una publicidad con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearPublicidad
   */
  crear_publicidad(bodyCrear: BodyCrearPublicidad): Observable<BodyResponseCrearPublicidad> {
    const dataCrear = new FormData();
    dataCrear.append("titulo", bodyCrear.titulo);
    dataCrear.append("descripcion", bodyCrear.descripcion);
    dataCrear.append("fecha_inicio", bodyCrear.fecha_inicio);
    dataCrear.append("fecha_expiracion", bodyCrear.fecha_expiracion);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    dataCrear.append("url", bodyCrear.url);
    return this.http.post(this.API_URL + '/administrador/content/publicidades/', dataCrear) as Observable<BodyResponseCrearPublicidad>;
  }



  /**
   *
   * @param bodyActualizar
   * @returns
   */
  actualizar_publicidad(bodyActualizar: BodyActualizarPublicidad): Observable<Publicidad> {
    const dataUpdate = new FormData();
    bodyActualizar.id ? dataUpdate.append('id', bodyActualizar.id) : null
    bodyActualizar.titulo ? dataUpdate.append('titulo', bodyActualizar.titulo) : null;
    bodyActualizar.imagen ? dataUpdate.append('imagen', bodyActualizar.imagen) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.fecha_inicio ? dataUpdate.append('fecha_inicio', bodyActualizar.fecha_inicio) : null;
    bodyActualizar.fecha_expiracion ? dataUpdate.append('fecha_expiracion', bodyActualizar.fecha_expiracion) : null;
    bodyActualizar.url ? dataUpdate.append('url', bodyActualizar.url) : null;


    return this.http.put(this.API_URL + '/administrador/content/publicidades/', dataUpdate) as any;
  }

  /**
   * Funcion que elimna la publicidad por ID especificado
   *
   * @author Margarita Mawyin
   * @param id Recibe el ID de la publicidad
   * @returns Retorna el objeto Publicidad
   */
  borrar_publicidad(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/content/publicidades/${id}/`);
  }

  /**
   * Funcion que obtiene la informacion de un administrador dado su correo
   *
   * @author Margarita Mawyin
   * @param user Recibe un correo de admin
   * @returns Retorna el objeto Administrador
   */
  obtener_admin_user(user: any) {
    return this.http.get(`${this.API_URL}/adminUser/${user}`);
  }
  /**
   * Funcion que srive para inicia sesion como admin
   *
   * @param user correo del admin
   * @param passw contraseña del admin
   * @returns Retorna un objeto admin_user_pass
   */
  obtener_admin_user_pass(user: string, passw: string): Observable<AdminUserPass> {
    return this.http.post(`${this.API_URL}/adminUserPass/`, {
      username: user,
      password: passw,
    }) as Observable<AdminUserPass>;
  }

  /**
   * Funcion que destruye la sesion , mediante la eliminacion de un token
   *
   * @param token Recibe un token que se crea con login() o obtener_admin_user_pass(*)
   * @returns Un status 200 OK o un error 400 bad request
   */
  logout(token: string) {
    return this.http.get(`${this.API_URL}/logout/${token}`);
  }


  //{"token":"022c571608c2bb1f268cdc4dbff0fb569a74798e","active":true}
  /**
   * Funcion que inicia sesion como proveedor o solicitante
   *
   * @returns
   */
  login() {
    return this.http.get(`${this.API_URL}/login/`);
  }

  /**
   * Funcion que trae las notificaciones
   *
   * @returns Retorna un objeto Notificacion
   */
  get_notificacion(): Observable<NotificacionAnuncio> {
    return this.http.get(`${this.API_URL}/administrador/notifications/notificaciones/`) as Observable<NotificacionAnuncio>;
  }

  /** Una sola programada por id, para la pantalla de detalle. */
  obtener_notificacion_detalle(id: string): Observable<NotificacionProgramada> {
    return this.http.get(`${this.API_URL}/administrador/notifications/notificaciones/${id}/`) as Observable<NotificacionProgramada>;
  }

  delete_notificacion(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/notifications/notificaciones/${id}/`);
  }

  /** Campos comunes a masivas y programadas. */
  private baseNotificacionFormData(body: any): FormData {
    const data = new FormData();
    data.append("nombre", body.nombre);
    data.append("titulo", body.titulo);
    data.append("descripcion", body.descripcion);
    data.append("ruta", body.ruta || "");
    data.append("dirigida_a", body.dirigida_a);
    // Un append por id: el backend lo lee con QueryDict.getlist('profesiones').
    (body.profesiones || []).forEach((id: number) => data.append("profesiones", String(id)));
    if (body.imagen) {
      data.append("imagen", body.imagen);
    }
    return data;
  }

  /** Recurrencia, solo de las programadas. */
  private programadaFormData(body: BodyCrearNotificacionProgramada | BodyActualizarNotificacionProgramada): FormData {
    const data = this.baseNotificacionFormData(body);
    data.append("frecuencia", body.frecuencia);
    data.append("dias_semana", body.dias_semana || "");
    data.append("hora", body.hora);
    // La clave era "fecha_inicio", que el backend nunca leyó: la fecha se
    // descartaba en silencio. Ahora gobierna la vigencia de la recurrencia.
    data.append("fecha_iniciacion", body.fecha_iniciacion || "");
    data.append("fecha_expiracion", body.fecha_expiracion || "");
    return data;
  }

  crear_notificacion(bodyCrear: BodyCrearNotificacionProgramada): Observable<any> {
    return this.http.post(
      `${this.API_URL}/administrador/notifications/notificaciones/`,
      this.programadaFormData(bodyCrear)) as Observable<any>;
  }

  put_notificacion_auto(bodyActualizar: BodyActualizarNotificacionProgramada, id: any): Observable<NotificacionAnuncio> {
    const data = this.programadaFormData(bodyActualizar);
    data.append("estado", String(bodyActualizar.estado));
    return this.http.put(
      `${this.API_URL}/administrador/notifications/notificaciones/${id}/`,
      data) as Observable<NotificacionAnuncio>;
  }

  cambio_notificacion_estado(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/notifications/notificaciones/estado/?id=${id}`, {
      estado: estado,
    }) as Observable<any>;
  }

  enviar_noti_auto(id: string, titulo: string): Observable<any> {
    return this.http.post(`${this.API_URL}/administrador/notifications/notificaciones/envio/?id=${id}`,{
      titulo: titulo,
    }) as Observable<any>;
  } 


  /**
   * Funcion que trae las notificaciones/anuncios
   *
   * @returns Retorna un objeto NotificacionAnuncio
   */
  get_notificacion_masiva(): Observable<NotificacionAnuncio> {
    return this.http.get(`${this.API_URL}/administrador/notifications/notificacion-anuncio/`) as Observable<NotificacionAnuncio>;
  }

  /** Una sola masiva por id, para la pantalla de detalle. */
  obtener_notificacion_masiva_detalle(id: string): Observable<NotificacionAnuncio> {
    return this.http.get(`${this.API_URL}/administrador/notifications/notificacion-anuncio/${id}/`) as Observable<NotificacionAnuncio>;
  }

  put_notificacion_masiva(bodyActualizar: BodyActualizarNotificacionAnuncio, id: any): Observable<NotificacionAnuncio> {
    const data = this.baseNotificacionFormData(bodyActualizar);
    data.append("estado", String(bodyActualizar.estado));
    if (bodyActualizar.programada_para) {
      data.append("programada_para", bodyActualizar.programada_para);
    }
    return this.http.put(
      `${this.API_URL}/administrador/notifications/notificacion-anuncio/${id}/`,
      data) as Observable<NotificacionAnuncio>;
  }

  cambio_notificacion_masiva_estado(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/administrador/notifications/notificacion-anuncio/estado/?id=${id}`, {
      estado: estado,
    }) as Observable<any>;
  }

  delete_notificacion_masiva(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/notifications/notificacion-anuncio/${id}/`);
  }

  enviar_noti_masi(id: string, titulo: string): Observable<any> {
    return this.http.post(`${this.API_URL}/administrador/notifications/notificacion-anuncio/envio/?id=${id}`,{
      titulo: titulo,
    }) as Observable<any>;
  }

  /**
   * Funcion que agrega una notificacion/anuncio
   *
   * @author Margarita Mawyin
   * @param bodyCrear
   * @returns Retorna un obejto con un estado OK 200 {"sucess": true}
   */
  send_notificacion(bodyCrear: BodyCrearNotificacionAnuncio): Observable<any> {
    const data = this.baseNotificacionFormData(bodyCrear);
    // Sin `programada_para` el backend la envía en el acto.
    if (bodyCrear.programada_para) {
      data.append("programada_para", bodyCrear.programada_para);
    }
    return this.http.post(
      `${this.API_URL}/administrador/notifications/notificacion-anuncio/`,
      data) as Observable<any>;
  }

  //REPETIDO, LO MISMO QUE  obtener_planes()
  obtener_plan_proveedor() {
    return this.http.get(this.API_URL + '/administrador/payments/plan-proveedor/');
  }



  /**
   * Funcion que crea un plan en la base de datos según el parametro pasado.
   *
   * YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]
   * @author Margarita Mawyin
   * @param bodyCrear ecibe un Objeto BodyCrearPlanProveedor la cual se encarga de crear un plan con los campos necesarios.
   * @returns Devuelve un Observable con un objeto PlanProveedor
   *
   */
  crear_plan_proveedor(bodyCrear: BodyCrearPlanProveedor): Observable<PlanProveedor> {
    const dataCrear = new FormData();
    dataCrear.append("planProveedor", bodyCrear.planProveedor.toString());
    dataCrear.append("proveedor", bodyCrear.proveedor.toString());
    dataCrear.append("fecha_inicio", bodyCrear.fecha_inicio);
    dataCrear.append("fecha_expiracion", bodyCrear.fecha_expiracion);
    return this.http.post(this.API_URL + '/administrador/payments/plan-proveedor/', dataCrear) as Observable<PlanProveedor>;
  }


  //error 400 bad request {"planProveedor":["Clave primaria \"15\" inválida - objeto no existe."]}
  //status 200 OK Objeto PlanProveedor
  /**
   * Funcion que actualiza un plan dado un ID y un numero de planProveedor existente
   *
   * @author Margarita Mawyin
   * @param bodyCrear  Recibe un Objeto BodyActualizarPlanProveedor la cual se encarga de actualizar un plan con los campos necesarios
   * @returns Devuelve un Observable con un objeto PlanProveedor
   */
  actualizar_plan_proveedor(bodyCrear: BodyActualizarPlanProveedor): Observable<PlanProveedor> {
    const dataCrear = new FormData();
    dataCrear.append("id", bodyCrear.id.toString());
    dataCrear.append("planProveedor", bodyCrear.planProveedor.toString());
    dataCrear.append("fecha_inicio", bodyCrear.fecha_inicio);
    dataCrear.append("fecha_expiracion", bodyCrear.fecha_expiracion);
    return this.http.put(this.API_URL + '/administrador/payments/plan-proveedor/', dataCrear) as Observable<PlanProveedor>;
  }

  // No reconoce ningun ID, parece endopoint muerto, en la anterior app no se usa
  borrar_plan_proveedor(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/payments/plan-proveedor/${id}/`);
  }
  /**
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable arreglo s con un objetos Plan
   */
  obtener_planes_estado(): Observable<Plan> {
    return this.http.get(this.API_URL + '/administrador/payments/planes-estado/') as Observable<Plan>;
  }

  //Funcion que trae lo mismo que  obtener_grupos
  obtener_roles() {
    return this.http.get(this.API_URL + '/administrador/accounts/grupos/');
  }


  /** REVISAR POR LO DE PERSMISSIONS
   * Funcion que crea un rol nuevo en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyCrearGroup la cual se encarga de crear un rol con los campos necesarios
   * @returns Devuelve un Observable con un objeto Group
   */
  crear_rol = (bodyCrear: BodyCrearGroup): Observable<Group> => {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("permisos", bodyCrear.permisos);
    return this.http.post(this.API_URL + '/administrador/accounts/roles-permisos/', dataCrear) as Observable<Group>;
  };


  actualizar_rol = (bodyCrear: BodyActualizarGroup): Observable<Group> => {
    const dataCrear = new FormData();
    dataCrear.append("id", bodyCrear.id.toString());
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("permisos", bodyCrear.permisos.toString());
    return this.http.put(this.API_URL + '/administrador/accounts/roles-permisos/', dataCrear) as Observable<Group>;
  };


  /**
   * Funcion que obtiene de la base de datos las solicitudes de profesiones para los proveedores.
   *
   * @author Margarita Mawyin
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un observable con el objeto SolicitudProfesionPaginacion
   */
  obtener_solicitudes(page = 1): Observable<SolicitudProfesionPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/catalog/solicitudes-profesion/?page=${page}`) as Observable<SolicitudProfesionPaginacion>;
  }

  /**
   * Función que busca las Solicitudes de Profesión que coincidan en sus nombres o apellidos con el parametro enviado.
   *
   * @author Kevin Chévez
   * @param usuario Recibe un string con con el contenido a buscar en los nombres y apellidos del proveedor.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto SolicitudProfesionPaginacion.
   */
  solicitudesByUser(usuario: string, page = 1): Observable<SolicitudProfesionPaginacion> {
    return this.http.get(`${this.API_URL}/administrador/catalog/solicitudes-profesion/buscar/${usuario}/?page=${page}`) as Observable<SolicitudProfesionPaginacion>;
  }

  /**
   * Función que busca las Solicitudes de Profesión que coincidan en sus nombres o apellidos con el parametro enviado.
   *
   * @author Kevin Chévez
   * @param fechaInicio Recibe un string de la fecha inicio con el formato AAAA-MM-DD para aplicar al filtro.
   * @param fechaFin Recibe un string de la fecha fin con el formato AAAA-MM-DD para aplicar al filtro.
   * @param page (Opcional) Recibe un number indicando la pagina del filtro. Por defecto 1.
   * @returns Devuelve un Observable con un objeto ProveedorPaginacion de todas las respuestas filtradas.
   */
  solicitudesByDate(fechaInicio: string, fechaFin: string, page = 1) {
    return this.http.get(`${this.API_URL}/administrador/catalog/solicitudes-profesion/fecha/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }



  /**
   * Funcion que trae las solicitudes-profesion
   *
   * @author Margarita Mawyin
   * @param id el id de la solicitud **
   * @returns Retorna un Observable SolicitudProfesion
   */
  solicitudDetail(id: any): Observable<SolicitudProfesion> {
    return this.http.get(`${this.API_URL}/administrador/catalog/solicitudes-profesion/${id}/`) as Observable<SolicitudProfesion>;
  }


  /**
   * Funcion que cambia el estado (True/False)
   *
   * @param id el id de la solicitud **
   * @param data Recibe un estado {estado:False}
   * @returns Devuelve un Observable SolicitudProfesion
   */
  solicitudChange(id: any, data: any): Observable<SolicitudProfesion> {
    return this.http.put(`${this.API_URL}/administrador/catalog/solicitudes-profesion/gestion/${id}/`, data) as Observable<SolicitudProfesion>;
  }
  //no se usa en la otra app
  solicitudDelet(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/catalog/solicitudes-profesion/gestion/${id}/`);
  }
  //FALTA
  editarProfesionProveedor(id: any, data: any) {
    return this.http.put(`${this.API_URL}/proveedor/${id}`, data);
  }

  //no se usa en la app
  correoSolicitud(data: any) {
    return this.http.post(`${this.API_URL}/administrador/notifications/correo-solicitud/`, data);
  }


  /**
   * Funcion que borra un rol especificando el ID del rol
   *
   * @author Margarita Mawyin
   * @param id Recibe el id del rol (obtenido de /grupos/)
   * @returns Retorna un status HTTP_204_NO_CONTENT en caso de exito
   */
  borrar_rol = (id: any) => {
    return this.http.delete(`${this.API_URL}/administrador/accounts/roles-permisos/${id}/`);
  };

  //no se usa en la anterior app
  obtener_rol(name: any) {
    return this.http.get(`${this.API_URL}/administrador/accounts/roles-permisos/${name}/`);
  }

  /**
   *
   * @authr Margarita Mawyin
   * @returns Retorna un arreglo de Objeto Permission
   */
  obtener_permisos(): Observable<Array<Permission>> {
    return this.http.get(`${this.API_URL}/administrador/accounts/permisos/`) as Observable<Array<Permission>>;
  }


  /**
   *
   * @author Margarita Mawyin
   * @returns //{ "totalPendientes": 29, "totalProveedores": 115}
   */
  valor_total_proveedo() {
    return this.http.get(`${this.API_URL}/administrador/payments/valor-total/proveedores/`);
  }

  //FALTA
  getProfesionProveedor(id: any) {
    return this.http.get(`${this.API_URL}/administrador/catalog/profesion-proveedor/${id}/`);
  }
  /**
   * Funcion que actualiza una profesion en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyActualizarProfesion el cual se ectualiza una profesion con los campos necesarios.
   * @returns
   */
  actualizar_profesion(bodyCrear: BodyActualizarProfesion): Observable<BodyResponseActualizarProfesion> {
    if (bodyCrear.foto) {
      console.log('Hay un File (foto): ', bodyCrear.foto);
    }
    const dataCrear = new FormData();
    dataCrear.append("id", bodyCrear.id.toString());
    bodyCrear.nombre ? dataCrear.append("nombre", bodyCrear.nombre) : null;
    bodyCrear.foto ? dataCrear.append("foto", bodyCrear.foto) : null;
    bodyCrear.descripcion ? dataCrear.append("descripcion", bodyCrear.descripcion) : null;
    dataCrear.append("servicio", bodyCrear.servicio);
    bodyCrear.estado ? dataCrear.append("estado", bodyCrear.estado.toString()) : null;
    return this.http.put(this.API_URL + '/administrador/catalog/profesiones/', dataCrear) as Observable<BodyResponseActualizarProfesion>;
  }

  //----------------------------------------------
  /**
    * Funcion que crea insignias en la base de datos según el parametro pasado.
    *
    * @author Margarita Mawyin
    * @param bodyCrear  Recibe un Objeto BodyCrearInsignia la cual se encarga de crear una insignia con los campos necesarios.
    * @returns Devuelve un Observable con un objeto BodyResponseCrearInsignia
    */
  crear_insignia2(bodyCrear: BodyCrearInsignia): Observable<BodyResponseCrearInsignia> {
    const dataCrear = new FormData();
    dataCrear.append("nombre", bodyCrear.nombre);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    dataCrear.append("servicio", bodyCrear.servicio);
    dataCrear.append("tipoUsuario", bodyCrear.tipoUsuario);
    dataCrear.append("pedidos", bodyCrear.nombre);
    dataCrear.append("imagen", bodyCrear.pedidos.toString());
    dataCrear.append("descripcion", bodyCrear.descripcion);
    return this.http.post(`${this.API_URL}/administrador/content/insignias/`, dataCrear) as Observable<BodyResponseCrearInsignia>;
  }
  //----------------------------------------------


  /**
   * Funcion que traer profesion por id (se puede ver los ids en /profesiones/)
   *
   * @author Margarita Mawyin
   * @param id Recibe el id de la profesion
   * @returns Retorna Objeto Profesion
   */
  profesionDetails(id: string): Observable<Profesion> {
    return this.http.get(`${this.API_URL}/administrador/catalog/profesion/${id}/`) as Observable<Profesion>;
  }


  /**
   * Funcion que cambia años de experiencia por id especificado
   *
   * @author Margarita Mawyin
   * @param id  El id se puede obtener de /proveedor_profesiones/
   * @param data Recibe un objeto con año y opcionalmente id (es redundante ya que se especifica en la ruta){"ano_experiencia": 4}
   * @returns Retorna un Objeto ProveedorProfesion
   */
  // Cambia años de experiencia por id (id obtener de /proveedor_profesiones/)
  actualizar_profesion_proveedor(id: number, data: any): Observable<ProveedorProfesion> {
    return this.http.put(`${this.API_URL}/administrador/catalog/profesion-proveedor/detalle/${id}/`, data) as Observable<ProveedorProfesion>;
  }

  //no se usa en la app anterior
  delete_profesion_proveedo(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/catalog/profesion-proveedor/detalle/${id}/`);
  }

  cambioContrasenia(correo: string, contrasenia: string) {
    return this.http.get(`${this.API_URL}/cambiocontrasenia/${correo}/${contrasenia}`);
  }

  loginPythonAnywhere(bodyLogin: BodyLogin): Observable<BodyLoginResponse> {
    return this.http.post(this.API_URL + '/login/', bodyLogin) as Observable<BodyLoginResponse>;
  }
  loginAdminPythonAnywhere(bodyLogin: BodyLogin): Observable<BodyLoginResponse> {
    return this.http.post(this.API_URL + '/administrador/accounts/login/', bodyLogin) as Observable<BodyLoginResponse>;
  }

  getAdminByCorreo(correo: string) {
    return this.http.get(this.API_URL + '/administrador/accounts/datos-admin/' + correo);
  }
  actualizarCaducidad(id: number, numero: any) {
    return this.http.put(`${this.API_URL}/administrador/accounts/actualizar-caducidad/${id}`, numero);
  }

  obtener_solicitudes_admin(filtros: SolicitudAdminFiltros = {}, page = 1): Observable<SolicitudAdminPaginacion> {
    const params: Record<string, string> = { page: String(page) };
    if (filtros.estado) { params['estado'] = filtros.estado; }
    if (filtros.tipoPago) { params['tipoPago'] = filtros.tipoPago; }
    if (filtros.servicio) { params['servicio'] = String(filtros.servicio); }
    if (filtros.texto) { params['texto'] = filtros.texto; }
    if (filtros.fechaInicio) { params['fechaInicio'] = filtros.fechaInicio; }
    if (filtros.fechaFin) { params['fechaFin'] = filtros.fechaFin; }
    return this.http.get(`${this.API_URL}/administrador/solicitudes/`, { params }) as Observable<SolicitudAdminPaginacion>;
  }

  obtener_solicitud_admin(id: number): Observable<SolicitudAdmin> {
    return this.http.get(`${this.API_URL}/administrador/solicitudes/${id}/`) as Observable<SolicitudAdmin>;
  }
}

function tap(arg0: () => void): import("rxjs").UnaryFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}

