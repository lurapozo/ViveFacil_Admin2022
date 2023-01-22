import {
  SolicitantePaginacion,
  Solicitante,
} from 'src/app/interfaces/solicitante';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador, AdministradorPaginacion, BodyActualizarAdministrador, BodyCrearAdministrador, BodyResponseCrearAdministrador, } from 'src/app/interfaces/administrador';
import { map, Observable } from 'rxjs';
import { BodyActualizarInsignia, BodyCrearInsignia, BodyResponseCrearInsignia, Insignia } from 'src/app/interfaces/insignia';
import { BodyActualizarCargo, BodyCrearCargo, BodyResponseCrearCargo, Cargo } from 'src/app/interfaces/cargo';
import { BodyPromocionActualizar, BodyResponsePromocionActualizar, Promocion } from 'src/app/interfaces/promocion';
import { BodyCuponActualizar, BodyResponseCuponActualizar, Cupon } from 'src/app/interfaces/cupon';
import { PaymentEfectivo, PaymentPaginacion, PaymentTarjeta } from 'src/app/interfaces/payment';
import { BodyActualizarProveedor, BodyActualizarProveedorPendiente, BodyCrearProfesionesProveedor, BodyCrearProveedor, BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, Proveedor, ProveedorPaginacion, ProveedorPendiente, ProveedorProfesion } from 'src/app/interfaces/proveedor';
import { Documento, DocumentoPendiente } from 'src/app/interfaces/documento';
import { CuentaBancariaProveedor } from 'src/app/interfaces/cuenta-bancaria';
import { BodyActualizarProfesion, BodyCrearProfesion, BodyResponseActualizarProfesion, BodyResponseCrearProfesion, Profesion } from 'src/app/interfaces/profesion';
import { BodyEmail, BodyResponseEmail } from 'src/app/interfaces/email';
import { BodyActualizarCategoria, BodyCrearCategoria, BodyResponseCrearCategoria, Categoria } from 'src/app/interfaces/categoria';
import { BodyActualizarServicio, Servicio } from 'src/app/interfaces/servicio';
import { BodyCrearSubCategoria, BodyResponseCrearSubCategoria } from 'src/app/interfaces/sub-categoria';
import { BodyActualizarPlan, BodyActualizarPlanProveedor, BodyCrearPlan, BodyCrearPlanProveedor, BodyResponseCrearPlan, Plan, PlanProveedor } from 'src/app/interfaces/plan';
import { BodyCrearPublicidad, BodyResponseCrearPublicidad } from 'src/app/interfaces/publicidad';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { AdminUserPass } from 'src/app/interfaces/admin-user-pass';
import { NotificacionAnuncio } from 'src/app/interfaces/notificacion-anuncio';
import { BodyActualizarGroup, BodyCrearGroup, Group, Permission } from 'src/app/interfaces/group';
import { SolicitudProfesion } from 'src/app/interfaces/solicitud';
import { PagosTarjetaUser } from 'src/app/interfaces/tarjeta';
import { Sugerencia } from 'src/app/interfaces/sugerencia';
@Injectable({
  providedIn: 'root',
})
export class PythonAnywhereService {
  API_URL = `https://tomesoft1.pythonanywhere.com`;
  administradores = 'https://tomesoft1.pythonanywhere.com/administradores';

  constructor(private http: HttpClient) { }



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
      `${this.API_URL}/solicitantes/?page=${page}`
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
    return this.http.get(`${this.API_URL}/fechas-filtro/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`) as Observable<SolicitantePaginacion>;
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
    return this.http.get(`${this.API_URL}/filtro-usuario/${usuario}?page=${page}`) as Observable<SolicitantePaginacion>;
  }

  /**
   * Función que cambia el estado del solicitante que se encuentra registrado en la base de datos.
   *
   * @author Kevin Chévez
   * @param estado Recibe un boolean indicando el estado del solicitante. (true - false).
   * @param id Recibe un string indicando el ID del Solicitante (ID más externo de la tabla de solicitante).
   * @returns Devuelve un Observable con el objeto Solicitante el cuál fue modificado.
   */
  cambio_solicitante_estado( estado: boolean, id: string ): Observable<Solicitante> {
    return this.http.put(`${this.API_URL}/solicitante_estado/${id}`, {
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
    return this.http.delete(`${this.API_URL}/solicitante_delete/${id}`);
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
    return this.http.get(this.API_URL + '/insignias/') as Observable<Insignia[]>;
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
      `${this.API_URL}/insignias/${id}`
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
    return this.http.put(`${this.API_URL}/insignia_estado/?id=${id}`, {
      estado: estado,
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
  actualizar_insignia(bodyActualizar: BodyActualizarInsignia, id: string): Observable<Insignia> {
    const dataUpdate = new FormData();
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.imagen ? dataUpdate.append('imagen', bodyActualizar.imagen) : null;
    bodyActualizar.servicio ? dataUpdate.append('servicio', bodyActualizar.servicio) : null;
    bodyActualizar.tipo_usuario ? dataUpdate.append('tipo_usuario', bodyActualizar.tipo_usuario) : null;
    dataUpdate.append('estado', bodyActualizar.estado.toString());
    bodyActualizar.pedidos ? dataUpdate.append('pedidos', bodyActualizar.pedidos.toString()) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.tipo ? dataUpdate.append('tipo', bodyActualizar.tipo) : null;

    return this.http.put(`${this.API_URL}/insignia_update/${id}`, dataUpdate) as Observable<Insignia>;
  }

  /**
   * Función que elimina una insignia registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Insignia la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_insignia(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/insignia_delete/${id}`) as Observable<any>;
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
    return this.http.get(this.API_URL + '/cargos/') as Observable<Cargo[]>;
  }

  /**
   * Funcion que trae de la base de datos el cargo solicitado por parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe como parámetro el ID del cargo a traer de la base de datos.
   * @returns Devuelve un Observable del Objeto Cargo solicitado.
   */
  obtener_cargo(id: string): Observable<Cargo> {
    return this.http.get(`${this.API_URL}/cargos/${id}`) as Observable<Cargo>;
  }

  /**
   * Función que actualiza el contenido de un Cargo registrado en la base de datos, segun los parametros pasados.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyActualizarCargo con los parametros necesarios para actualizar el cargo.
   * @param id Recibe un string perteneciente al ID del cargo el cual sera modificado.
   * @returns Devuelve un Observable con un objeto Cargo actualizado.
   */
  actualizar_cargo(bodyActualizar: BodyActualizarCargo, id: string): Observable<Cargo> {
    return this.http.put(`${this.API_URL}/cargo_update/${id}`, bodyActualizar) as Observable<Cargo>;
  }

  /**
   * Función que elimina un cargo registrado en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID del Cargo el cual sera eliminado.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_cargo(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/cargo_delete/${id}`) as Observable<any>;
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //---------------------------------------------------- SECCIÓN PROMOCIÓN ------------------------------------------------
  /**
   * Obtiene las promociones registradas en la base de datos segun el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe como parametro el un string ID de la promocion.
   * @returns Devuelve un Observable con un arreglo de objetos Promocion.
   */
  obtener_promocion(id: string): Observable<Promocion[]> {
    return this.http.get(`${this.API_URL}/promociones/${id}`) as Observable<Promocion[]>;
  }

  /**
   * Función que cambia el estado de la promocion que se encuentra registrada en la base de datos.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID de la promocion.
   * @param estado Recibe un boolean indicando el estado de la promocion. (true - false).
   * @returns Devuelve un Observable con la respuesta OK(200) o Error(500).
   */
  cambio_promocion_estado(id: string, estado: boolean): Observable<any> {
    return this.http.put(`${this.API_URL}/promocion_estado/?id=${id}`, {
      estado: estado,
    });
  }

  /**
   * Función que actualiza el contenido de una Promocion registrada en la base de datos, segun los parametros pasados.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyPromocionActualizar con los parametros necesarios para actualizar la promocion.
   * @param id Recibe un string perteneciente al ID de la promocion la cual sera modificada.
   * @returns Devuelve un Observable con un objeto BodyResponsePromocionActualizar.
   */
  actualizar_promocion(bodyActualizar: BodyPromocionActualizar, id: string): Observable<BodyResponsePromocionActualizar> {
    const dataUpdate = new FormData();
    dataUpdate.append("codigo", bodyActualizar.codigo);
    dataUpdate.append("titulo", bodyActualizar.titulo);
    dataUpdate.append("descripcion", bodyActualizar.descripcion);
    bodyActualizar.fecha_iniciacion ? dataUpdate.append("fecha_iniciacion", bodyActualizar.fecha_iniciacion) : null;
    dataUpdate.append("fecha_expiracion", bodyActualizar.fecha_expiracion);
    dataUpdate.append("porcentaje", bodyActualizar.porcentaje.toString());
    dataUpdate.append("cantidad", bodyActualizar.cantidad.toString());
    dataUpdate.append("participantes", bodyActualizar.participantes);
    bodyActualizar.foto ? dataUpdate.append("foto", bodyActualizar.foto) : null;
    dataUpdate.append("tipo_categoria", bodyActualizar.tipo_categoria);

    return this.http.put(`${this.API_URL}/promocion_update/${id}`, dataUpdate) as Observable<BodyResponsePromocionActualizar>;
  }

  /**
   * Función que elimina una promocion registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Promocion la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_promocion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/promocion_delete/${id}`);
  }
  //-----------------------------------------------------------------------------------------------------------------------

  //------------------------------------------------------ SECCIÓN CUPON --------------------------------------------------
  /**
   * Funcion que obtiene un cupon segun el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID del cupo a traer de la base de datos.
   * @returns Devuelve un Observable con el objeto Cupon esperado.
   */
  obtener_cupon(id: string): Observable<Cupon> {
    return this.http.get(`${this.API_URL}/cupones/${id}`) as Observable<Cupon>;
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
    return this.http.put(`${this.API_URL}/cupon_estado/?id=${id}`, { estado: estado, });
  }

  /**
   * Función que actualiza el contenido de un Cupon registrado en la base de datos, segun los parametros pasados.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyCuponActualizar con los parametros necesarios para actualizar el cupon.
   * @param id Recibe un string perteneciente al ID del cupon la cual sera modificada.
   * @returns Devuelve un Observable con un objeto BodyResponseCuponActualizar.
   */
  actualizar_cupon(bodyActualizar: BodyCuponActualizar, id: string): Observable<BodyResponseCuponActualizar> {
    const dataUpdate = new FormData();
    dataUpdate.append("codigo", bodyActualizar.codigo);
    dataUpdate.append("titulo", bodyActualizar.titulo);
    dataUpdate.append("descripcion", bodyActualizar.descripcion);
    bodyActualizar.fecha_iniciacion ? dataUpdate.append("fecha_iniciacion", bodyActualizar.fecha_iniciacion) : null;
    dataUpdate.append("fecha_expiracion", bodyActualizar.fecha_expiracion);
    dataUpdate.append("porcentaje", bodyActualizar.porcentaje.toString());
    dataUpdate.append("cantidad", bodyActualizar.cantidad.toString());
    dataUpdate.append("puntos", bodyActualizar.puntos.toString());
    bodyActualizar.foto ? dataUpdate.append("foto", bodyActualizar.foto) : null;
    dataUpdate.append("tipo_categoria", bodyActualizar.tipo_categoria);

    return this.http.put(`${this.API_URL}/cupon_update/${id}`, dataUpdate) as Observable<BodyResponseCuponActualizar>;
  }

  /**
   * Función que elimina un cupon registrado en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID del Cupon el cual sera eliminado.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_cupon(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/cupon_delete/${id}`) as Observable<any>;
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
    return this.http.get(`${this.API_URL}/administradores/?page=${page}`) as Observable<AdministradorPaginacion>;
  }

  /**
   * Función que obtiene un administrador desde la base de datos según si ID pasado como parámetro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID del administrador a traer de la base de datos.
   * @returns Devuelve un Observable del objeto Administrador
   */
  obtener_administrador(id: string): Observable<Administrador> {
    return this.http.get(`${this.API_URL}/administrador/${id}`) as Observable<Administrador>;
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
    return this.http.put(`${this.API_URL}/administrador/${id}`, body);
  }

  /**
   * Función que crea un administrador y lo registra en la base de datos.
   *
   * @author Kevin Chévez
   * @param user Recibe como parametro un objeto BodyCrearAdministrador con los parametros del registro.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearAdministrador.
   */
  crear_administrador(user: BodyCrearAdministrador): Observable<BodyResponseCrearAdministrador> {
    return this.http.post(`${this.API_URL}/administradores/`, user) as Observable<BodyResponseCrearAdministrador>;
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
    return this.http.get(`${this.API_URL}/admin-filtro/${usuario}?page=${page}`) as Observable<AdministradorPaginacion>;
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
    return this.http.get(`${this.API_URL}/fechas_admin/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`) as Observable<AdministradorPaginacion>;
  }

  /**
   * Función que elimina a un administrador registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Administrador (ID más externo de la tabla de administrador) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_administrador(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador_delete/${id}`);
  }

  /**
   * Función que elimina a un administrador registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Administrador (ID más externo de la tabla de administrador) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_admin(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/administrador/${id}`);
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
    return this.http.get(`${this.API_URL}/fechas_efectivo/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`) as Observable<PaymentPaginacion>;
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
    return this.http.get(`${this.API_URL}/fechas_tarjeta/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  /**
   * Función que cambia el estado del cupon que se encuentra registrada en la base de datos.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del cupon.
   * @param estado Recibe un boolean indicando el estado del cupon. (true - false).
   * @returns Devuelve un Observable con la respuesta OK(200) o Error(500).
   */
  cambio_pago_proveedor_estado(id: string, estado: boolean) {
    return this.http.put(`${this.API_URL}/tarjeta_pago/?id=${id}`, { estado: estado, });
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
    return this.http.put(`${this.API_URL}/proveedor_estado/${id}`, { estado: estado, }) as Observable<Proveedor>;
  }

  /**
   * Función que obtiene los proveedores registrados en la base de datos con un formato de paginacion.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto ProveedorPaginacion
   */
  obtener_proveedores(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/proveedores/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
   * Función que obtiene todos los proveedores pendientes que se encuentran en la base de datos.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto ProveedorPaginacion
   */
  obtener_proveedores_pendientes(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/proveedores_pendientes/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
   * Función que obtiene al proveedor pendiente que se encuentra en la base de datos segun el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del proveedor pendiente objetivo a buscar en la Base de datos.
   * @returns Devuelve un observable con objeto ProveedorPendiente
   */
  obtener_proveedor_pendiente(id: string): Observable<ProveedorPendiente> {
    return this.http.get(`${this.API_URL}/proveedores_pendientes/${id}`) as Observable<ProveedorPendiente>;
  }

  /**
   * Función que elimina a un proveedor pendiente registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del ProveedorPendientea ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
  */
  eliminar_proveedor_pendiente(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/proveedores_pendientes/${id}`);
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
    return this.http.get(`${this.API_URL}/pendientes-search/${user}?page=${page}`) as Observable<ProveedorPaginacion>;
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
    return this.http.get(`${this.API_URL}/pendientes-filterDate/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  /**
   * Función que crea un objeto ProveedorPendiente y lo registra en la base de datos.
   *
   * @author Kevin Chévez
   * @param data Recibe un objeto BodyCrearProveedorPendiente con los parametros necesarios para crear el ProveedorPendiente
   * @returns Devuelve Observable con un objeto BodyResponseCrearProveedorPendiente
   */
  crear_proveedor_pendiente(data: BodyCrearProveedorPendiente): Observable<BodyResponseCrearProveedorPendiente> {
    return this.http.post(`${this.API_URL}/proveedor_pendiente/`, data) as Observable<BodyResponseCrearProveedorPendiente>;
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
    return this.http.put(`${this.API_URL}/proveedores_pendientes/${id}`, data) as Observable<ProveedorPendiente>;
  }

  /**
   * Función que edita la información de un objeto Proveedor registrado en la base de datos.
   *
   * @author Kevin Chévez
   * @param data Recibe un objeto BodyActualizarProveedor con los campos a actualizar/editar.
   * @returns Devuelve un Observable con un objeto {"sucess": "Exito"} en caso de exito.
   */
  editar_proveedor(data: BodyActualizarProveedor): Observable<any> {
    return this.http.put(`${this.API_URL}/edicion_proveedor/`, data);
  }

  /**
   * Función que elimina a un proveedor registrado en la base de datos según el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string indicando el ID del Proveedor (ID más externo de la tabla de proveedor) a ser eliminado de la Base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
  */
  eliminar_proveedor(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/proveedor_delete/${id}`);
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
    return this.http.get(`${this.API_URL}/documentos_pendientes/`) as Observable<DocumentoPendiente[]>;
  }

  /**
   * Función que elimina el documento pendiente en la ruta /pendientes-documents que se encuentra registrado en la base de datos segun el ID.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del documento pendiente objetivo a eliminar de la base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
  */
  eliminar_documento_pendiente(id: string) {
    return this.http.delete(`${this.API_URL}/documentos_pendientes/?id=${id}`);
  }

  /**
   * Funcion que obtiene y presenta todos los documentos que se encuentra en la base de datos en la ruta /documents.
   *
   * @author Kevin Chévez
   * @returns Devuelve un Observable con un arreglo de objetos Documento
   */
  obtener_documentos(): Observable<Documento[]> {
    return this.http.get(`${this.API_URL}/documentos_proveedores/`) as Observable<Documento[]>;
  }

  /**
   * Función que elimina el documento en la ruta /documents que se encuentra registrado en la base de datos segun el ID.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del documento objetivo a eliminar de la base de datos.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_documento(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/documentos_proveedores/?id=${id}`);
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
    return this.http.post(this.API_URL + '/email/', data) as Observable<BodyResponseEmail>;
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
    return this.http.get(this.API_URL + '/categorias/') as Observable<Categoria[]>;
  }

  /**
   * Función que actualiza una categoria registrada en la base de datos, segun los parametros pasados o por estado de categoria.
   *
   * @author Kevin Chévez
   * @param bodyActualizar Recibe un objeto BodyActualizarCategoria con los parametros indicador para actualizar la insignia.
   * @param id Recibe un string del ID de la categoria a actualizar el estado.
   * @returns Devuelve un Observable de un Objeto Categoria el cual fue modificado.
   */
  actualizar_categoria(bodyActualizar: BodyActualizarCategoria, id: string): Observable<Categoria> {
    const dataUpdate = new FormData();
    bodyActualizar.nombre ? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.descripcion ? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    dataUpdate.append('estado', bodyActualizar.estado.toString());
    bodyActualizar.foto ? dataUpdate.append('foto', bodyActualizar.foto) : null;
    bodyActualizar.foto2 ? dataUpdate.append('foto2', bodyActualizar.foto2) : null;

    return this.http.put(`${this.API_URL}/categoria_update/${id}`, dataUpdate) as Observable<Categoria>;
  }

  /**
   * Función que elimina una categoria registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Categorias la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_categoria(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/categoria_delete/${id}`) as Observable<any>;
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
    dataCrear.append("descripcion", bodyCrear.descripcion);
    bodyCrear.foto ? dataCrear.append("foto", bodyCrear.foto) : null;
    return this.http.post(`${this.API_URL}/categorias/`, bodyCrear) as Observable<BodyResponseCrearCategoria>;
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
    return this.http.get(`${this.API_URL}/profesiones/`) as Observable<Profesion[]>;
  }
  /**
   * Función que agrega en la base de datos una promocion segun los datos pasados por parametros.
   *
   * @author Kevin Chévez
   * @param bodyCrear Recibe un Objeto BodyCrearProfesion la cual se encarga de crear una profesion con los campos necesarios.
   * @returns Devuelve un Observable con un objeto BodyResponseCrearProfesion
   */
  add_profesion(bodyCrear: BodyCrearProfesion): Observable<BodyResponseCrearProfesion> {
    const dataCrear = new FormData();
    if(bodyCrear.nombre && bodyCrear.descripcion && bodyCrear.servicio){
      dataCrear.append("nombre", bodyCrear.nombre);
      dataCrear.append("descripcion", bodyCrear.descripcion);
      dataCrear.append("servicio", bodyCrear.servicio);
      bodyCrear.foto? dataCrear.append("foto", bodyCrear.foto) : null;
    }
    return this.http.post(this.API_URL + '/profesiones/', dataCrear) as Observable<BodyResponseCrearProfesion>;
  }

  /**
   * Función que elimina una profesion registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID de la Profesion la cual sera eliminada.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  delete_profesion(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/profesiones/${id}`) as Observable<any>;
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
    return this.http.get(this.API_URL + '/servicios/')as Observable<Servicio[]>;
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
    return this.http.put(`${this.API_URL}/servicios_update/${id}`, bodyActualizar) as Observable<Servicio>;
  }

  /**
   * Función que elimina un servicio registrada en la base de datos según el parametro pasado.
   *
   * @author Kevin Chévez
   * @param id Recibe un string perteneciente al ID del Servicio el cual sera eliminado.
   * @returns Devuelve un Observable con una respuesta OK(204) or Error(500).
   */
  eliminar_servicio(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/servicios_delete/${id}`) as Observable<any>;
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
    dataCrear.append("pedidos", bodyCrear.nombre);
    dataCrear.append("imagen", bodyCrear.pedidos.toString());
    dataCrear.append("descripcion", bodyCrear.descripcion);
    return this.http.post(`${this.API_URL}/insignias/`, dataCrear) as Observable<BodyResponseCrearInsignia>;
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
    return this.http.post(`${this.API_URL}/cargos/`, dataCrear) as Observable<BodyResponseCrearCargo>;
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
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("categoria", bodyCrear.descripcion);
    dataCrear.append("titulo", bodyCrear.categoria.toString());
    return this.http.post(`${this.API_URL}/servicios/`, dataCrear) as Observable<BodyResponseCrearSubCategoria>;
  }

  /**
   * Funcion que crea profesion de un proveedor en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param user correo del proveedor
   * @param data profesion y ano_experiencia. EJ: data = {"profesion": "Jardinero", ano_experiencia: 5 }
   * @returns Devuelve status 200ok y un Observable con un objeto any
   */
  crear_profesiones_proveedor(user: string, data: BodyCrearProfesionesProveedor) : Observable<Array<ProveedorProfesion>> {
    return this.http.post(`${this.API_URL}/proveedor_profesiones/${user}`, data) as Observable<Array<ProveedorProfesion>>;
  }


  //https://tomesoft1.pythonanywhere.com/proveedor_profesiones/melquinto20@gmail.com/128&Jardinero,Pintor|true
  eliminar_proveedores_pendientes(id: any) {//FALTA
    return this.http.delete(
      `${this.API_URL}/proveedores_pendientes/${id}`
    );
  }

  update_pendiente_documento(data: any) {
    return this.http.put(`${this.API_URL}/proveedores_pendientes/`, data);
  }


  /**
   * Funcion que traer todas las promociones
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable con un objeto Promociones
     */
  obtener_promociones() {
    return this.http.get(this.API_URL + '/promociones/');
  }

  /**
 * Funcion que traer todos los cupones
 *
 * @author Margarita Mawyin
 * @returns Devuelve un Observable con un objeto Cupones
   */
  obtener_cupones() {
    return this.http.get(this.API_URL + '/cupones/');
  }

  /**
* Funcion que traer todos los cupones
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Grupos
 */
  obtener_grupos() {
    return this.http.get(this.API_URL + '/grupos/');
  }

  /**
   * Funcion que agrega las promociones
   * @author Margarita Mawyin
   * @param data
   * @returns  Devuelve un Observable con succes: boolean, msg : string, promocion: Obejct<Promocion>
   */
  /*
  data = {
    "codigo": "Margarita",
    "titulo": "Codigo Margarita",
    "descripcion": "Sin valor",
    "porcentaje": 0,
    "fecha_iniciacion": "2023-01-13T23:42:06-05:00",
    "fecha_expiracion": "2023-01-31T23:42:06-05:00",
    "participantes": "Solicitante",
    "foto": null,
    "tipo_categoria": "Plomería",
    "cantidad": 1
      }
  */
  crear_promocion(data: any) {
    return this.http.post(this.API_URL + '/promociones/', data);
  }

  /**
   *  Funcion que agrega los cupones
   * @author Margarita Mawyin
   * @param data
   * @returns Devuelve un Observable con succes: boolean, msg : string, promocion: Obejct<Cupon>
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
  crear_cupon(data: any) {
    return this.http.post(this.API_URL + '/cupones/', data);
  }

  //NO SE LO USABA EN LA ANTERIOR APP
  obtener_ctgprom(promCode: any) {
    return this.http.get(`${this.API_URL}/promcategorias/${promCode}`);
  }


  /**
   * Funcion que trae los pagos en efectivo
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable con un arreglo de objetos PaymentEfectivo
   */
  obtener_pagos_efectivo() : Observable<Array<PaymentEfectivo>> {
    return this.http.get(this.API_URL + '/pago_efectivos/') as Observable<Array<PaymentEfectivo>>;
  }

  /**
   * Funcion que trae los pagos en efectivo por pagina
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable con un objeto ProveedorPaginacion
   */
  obtener_pagos_efectivoP(page: any) : Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/pago_efectivosP/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
 * Funcion que trae los pagos con tarjeta por pagina
 *
 * @author Margarita Mawyin
 * @returns Devuelve un Observable con un objeto ProveedorPaginacion
 */
  obtener_pagos_tarjetaP(page: any) :  Observable<ProveedorPaginacion>{
    return this.http.get(`${this.API_URL}/pago_tarjetasP/?page=${page}`) as  Observable<ProveedorPaginacion>;
  }

  /**
* Funcion que trae el objeto { "valor__sum": 2955.63 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Efectivo
*/
  valor_total_efectivo() {
    return this.http.get(`${this.API_URL}/valor_total_efectivo/`);
  }

  /**
* Funcion que trae el objeto { "valor__sum": 2017.0 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Tarjeta
*/
  valor_total_tarjeta() {
    return this.http.get(`${this.API_URL}/valor_total_tarjeta/`);
  }

  /**
* Funcion que trae el objeto { "cargo_paymentez__sum": 6.825 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Pay Tarjeta
*/
  valor_total_pay_tarjeta() {
    return this.http.get(`${this.API_URL}/valor_total_pay_tarjeta/`);
  }

  /**
* Funcion que trae el objeto { "cargo_banco__sum": 20.475 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Banc Tarjeta
*/
  valor_total_banc_tarjeta(): Observable<any> {
    return this.http.get(`${this.API_URL}/valor_total_banc_tarjeta/`);
  }

  /**
* Funcion que trae el objeto { "cargo_sistema__sum": 9.099999999999998 }
*
* @author Margarita Mawyin
* @returns Devuelve un Observable con un objeto Valor Total Sis Tarjeta
*/
  valor_total_sis_tarjeta() {
    return this.http.get(`${this.API_URL}/valor_total_sis_tarjeta/`);
  }

  /**
* Funcion que trae 4972.63
*
* @author Margarita Mawyin
* @returns 4972.63
*/
  valor_total() {
    return this.http.get(`${this.API_URL}/valor_total/`);
  }


  /**
 * Funcion que trae los pagos con tarjeta del usuario
 *
 * @author Margarita Mawyin
 * @returns Devuelve un Observable con un arreglo de objetos PaymentTarjeta
 */
  obtener_pagos_tarjeta() : Observable<Array<PaymentTarjeta>>{
    return this.http.get(this.API_URL + '/pago_tarjetas/') as Observable<Array<PaymentTarjeta>>;
  }

  //NO SE LO USABA EN LA ANTERIOR APP
  //NO reconoce el id sacado de obtener_pagos_efectivo()
  obtener_pago_solE(pago_ID: any) {
    return this.http.get(`${this.API_URL}/pagosol_efectivo/${pago_ID}`);
  }
  /**
   * 
   * @author Margarita Mawyin
   * @param pago_ID un id de  obtener_pagos_tarjeta()
   * @returns Devuelve un Observable con un objeto PagosTarjetaUser
   */
  obtener_pago_solT(pago_ID: any) : Observable<PagosTarjetaUser> {
    return this.http.get(`${this.API_URL}/pagosol_tarjeta/${pago_ID}`)  as Observable<PagosTarjetaUser>;
  }
  //FALTA 
  enviar_correo_alerta(correo: any, asunto: any, texto: any) {
    return this.http.get(
      `${this.API_URL}/enviaralerta/${correo}/${asunto}/${texto}`
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
  
  editar_sugerencia_estado(sugerencia: any, id: any) {
    return this.http.put(`${this.API_URL}/suggestion/${id}`, sugerencia);
  }
  /**
   * Funcion que trae la sugerencia por ID especificado
   *
   * @author Margarita Mawyin
   * @param id
   * @returns Retorna un objeto Sugerencia
   */
  obtener_sugerencia(id: any): Observable<Sugerencia>{
    return this.http.get(`${this.API_URL}/suggestion/${id}`) as Observable<Sugerencia>;
  }

  /**
  * Funcion que trae las sugerencias leidas por pagina especificada
  *
  * @author Margarita Mawyin
  * @param id 
  * @returns Retorna objetos de ProveedorPaginacion
  */
  obtener_sugerenciasLeidas(page: any) : Observable<ProveedorPaginacion>{
    return this.http.get(`${this.API_URL}/read-suggestions/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
  * Funcion que trae las sugerencias NO leidas por pagina especificada
  *
  * @author Margarita Mawyin
  * @param id 
  * @returns Retorna objetos de ProveedorPaginacion
  */
  obtener_sugerenciasNoLeidas(page: any) : Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/unread-suggestions/?page=${page}`) as Observable<ProveedorPaginacion>;
  }

  /**
  * Funcion que trae las ciudades
  *
  * @author Margarita Mawyin
  * @param id
  * @returns Retorna 5 objetos de Ciudades
  */
  getCiudades() : Observable<Ciudad> {
    return this.http.get(`${this.API_URL}/ciudades/`) as Observable<Ciudad>;
  }

  //NO hay metodo put ciudades en la BD
  crear_Ciudades(ciudad: Ciudad)  {
    return this.http.put(`${this.API_URL}/ciudades/`, ciudad) ;
  }

  /**
  * Funcion que trae los planes 
  * 
  * @author Margarita Mawyin 
  * @returns Retorna arreglo de objetos  Plan
  */
  obtener_planes() : Observable<Array<Plan>> {
    return this.http.get(this.API_URL + '/planes/') as Observable<Array<Plan>>;
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
    dataCrear.append("descripcion", bodyCrear.descripcion);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    dataCrear.append("precio", bodyCrear.precio.toString());
    dataCrear.append("duracion", bodyCrear.duracion.toString());
    return this.http.post(this.API_URL + '/planes/', dataCrear) as Observable<BodyResponseCrearPlan>;
  }

  /** 
   * Funcion que actualiza un plan en la base de datos según el parametro pasado.
   * 
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyActualizarPlan la cual se encarga de actualizar un plan con los campos necesarios.
   * @returns Devuelve un Observable con un objeto Plan
   */
  actualizar_plan(bodyCrear: BodyActualizarPlan) : Observable<Plan> {
    const dataCrear = new FormData();
    dataCrear.append("id", bodyCrear.id.toString());
    bodyCrear.descripcion ? dataCrear.append("descripcion", bodyCrear.descripcion) : null;
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    bodyCrear.precio ? dataCrear.append("precio", bodyCrear.precio.toString()) : null;
    bodyCrear.duracion ? dataCrear.append("duracion", bodyCrear.duracion.toString()) : null;
    bodyCrear.estado ? dataCrear.append("estado", bodyCrear.estado.toString()) : null;
    return this.http.put(this.API_URL + '/planes/', dataCrear) as Observable<Plan>;
  }


  /**
   * Funcion que elimina un plan por ID
   *
   * @author Margarita Mawyin
   * @param id Recibe el id del plan . ID se puede sacar de obtener_planes()
   * @returns Retorna un objeto Plan
   */
  borrar_plan(id: any) : Observable<Plan>{
    return this.http.delete(`${this.API_URL}/planes/${id}`) as Observable<Plan>;
  }


  /**
   * Funcion que trae las publicidades por numero de pagina
   *
   * @author Margarita Mawyin
   * @param page Recibe un numero de pagina. 1
   * @returns Retorna un objeto ProveedorPaginacion
   */
  obtener_publicidades(page: string) : Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/publicidades/?page=${page}`) as Observable<ProveedorPaginacion>;
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
  filtrar_publicidadName(buscar: string, page: string) : Observable<ProveedorPaginacion>{
    return this.http.get(
      `${this.API_URL}/publicidades_search/?page=${page}&buscar=${buscar}`
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
    return this.http.post(this.API_URL + '/publicidades/', dataCrear) as Observable<BodyResponseCrearPublicidad>;
  }



/**
 * 
 * @param bodyActualizar 
 * @returns 
 */
  actualizar_publicidad(bodyActualizar: any) {
    const dataCrear = new FormData();

    return this.http.put(this.API_URL + '/publicidades/', dataCrear);
  }

  /**
   * Funcion que elimna la publicidad por ID especificado
   *
   * @author Margarita Mawyin
   * @param id Recibe el ID de la publicidad
   * @returns Retorna el objeto Publicidad
   */
  borrar_publicidad(id: any) {
    return this.http.delete(`${this.API_URL}/publicidades/${id}`);
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
   * Funcion que trae las notificaciones/anuncios
   *
   * @returns Retorna un objeto NotificacionAnuncio
   */
  get_notificacion(): Observable<NotificacionAnuncio> {
    return this.http.get(`${this.API_URL}/notificacion-anuncio/`) as Observable<NotificacionAnuncio>;
  }


  /**
   * Funcion que agrega una notificacion/anuncio
   *
   * @author Margarita Mawyin
   * @param bodyCrear
   * @returns Retorna un obejto con un estado OK 200 {"sucess": true}
   */
  send_notificacion(bodyCrear: NotificacionAnuncio) {
    const dataCrear = new FormData();
    dataCrear.append("titulo", bodyCrear.titulo);
    dataCrear.append("mensaje", bodyCrear.mensaje);
    dataCrear.append("descripcion", bodyCrear.descripcion);
    dataCrear.append("ruta", bodyCrear.ruta);
    bodyCrear.imagen ? dataCrear.append("imagen", bodyCrear.imagen) : null;
    return this.http.post(`${this.API_URL}/notificacion-anuncio/`, dataCrear);
  }

  //REPETIDO, LO MISMO QUE  obtener_planes()
  obtener_plan_proveedor() {
    return this.http.get(this.API_URL + '/planes/');
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
    return this.http.post(this.API_URL + '/planProveedor/', dataCrear) as Observable<PlanProveedor>;
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
    return this.http.put(this.API_URL + '/planProveedor/', dataCrear) as Observable<PlanProveedor>;
  }

  // No reconoce ningun ID, parece endopoint muerto, en la anterior app no se usa
  borrar_plan_proveedor(id: any) {
    return this.http.delete(`${this.API_URL}/planProveedor/${id}`);
  }
  /**
   *
   * @author Margarita Mawyin
   * @returns Devuelve un Observable arreglo s con un objetos Plan
   */
  obtener_planes_estado(): Observable<Plan> {
    return this.http.get(this.API_URL + '/planesEstado/') as Observable<Plan>;
  }

  //Funcion que trae lo mismo que  obtener_grupos
  obtener_roles() {
    return this.http.get(this.API_URL + '/grupos/');
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
    return this.http.post(this.API_URL + 'https://tomesoft1.pythonanywhere.com/planesEstado/', dataCrear) as Observable<Group>;
  };


  actualizar_rol = (bodyCrear: BodyActualizarGroup): Observable<Group> => {
    const dataCrear = new FormData();
    dataCrear.append("id", bodyCrear.id.toString());
    dataCrear.append("nombre", bodyCrear.nombre);
    dataCrear.append("permisos", bodyCrear.permisos.toString());
    return this.http.put(this.API_URL + '/roles-permisos/', dataCrear) as Observable<Group>;
  };


  /**
   * @author Margarita Mawyin
   * @param page El numero de pagina. ! Solo he visto pagina con page=1, mas haya salen invalidas
   * @returns // { "page_size": 10, "total_objects": 0, "total_pages": 1, "current_page_number": 1,  "next": null, "previous": null,  "results": [ SolicitudProfesion ] }
   */
  obtener_solicitudes(page=1) {
    return this.http.get(`${this.API_URL}/solicitudes-proveedores/?page=${page}`);
  }


  /**
   *
   * @author Margarita Mawyin
   * @param usuario Correo del usuario soliciante, proveedor o admin
   * @param page El numero de pagina. ! Solo he visto pagina con page=1, mas haya salen invalidas
   * @returns // { "page_size": 10, "total_objects": 0, "total_pages": 1, "current_page_number": 1,  "next": null, "previous": null,  "results": [] }
   */
  solicitudesByUser(usuario: any, page: any) {
    return this.http.get(`${this.API_URL}/solicitudesUser_search/${usuario}?page=${page}`);
  }
  //no se usa en la otra app
  solicitudesByDate(fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(`${this.API_URL}/solicitudesDate_search/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }



  /**
   * Funcion que trae las solicitudes-profesion
   *
   * @author Margarita Mawyin
   * @param id el id de la solicitud **
   * @returns Retorna un Observable SolicitudProfesion
   */
  solicitudDetail(id: any): Observable<SolicitudProfesion> {
    return this.http.get(`${this.API_URL}/solicitud-profesion/${id}`) as Observable<SolicitudProfesion>;
  }


  /**
   * Funcion que cambia el estado (True/False)
   *
   * @param id el id de la solicitud **
   * @param data Recibe un estado {estado:False}
   * @returns Devuelve un Observable SolicitudProfesion
   */
  solicitudChange(id: any, data: any): Observable<SolicitudProfesion> {
    return this.http.put(`${this.API_URL}/change-solicitud/${id}`, data) as Observable<SolicitudProfesion>;
  }
  //no se usa en la otra app
  solicitudDelet(id: any) {
    return this.http.delete(`${this.API_URL}/change-solicitud/${id}`);
  }
  //FALTA
  editarProfesionProveedor(id: any, data: any) {
    return this.http.put(`${this.API_URL}/proveedor/${id}`, data);
  }

  //no se usa en la app
  correoSolicitud(data: any) {
    return this.http.post(`${this.API_URL}/correo-solicitud/`, data);
  }


  /**
   * Funcion que borra un rol especificando el ID del rol
   *
   * @author Margarita Mawyin
   * @param id Recibe el id del rol (obtenido de /grupos/)
   * @returns Retorna un status HTTP_204_NO_CONTENT en caso de exito
   */
  borrar_rol = (id: any) => {
    return this.http.delete(`${this.API_URL}/roles-permisos/${id}`);
  };

  //no se usa en la anterior app
  obtener_rol(name: any) {
    return this.http.get(`${this.API_URL}/roles-permisos/${name}`);
  }

  /**
   *
   * @authr Margarita Mawyin
   * @returns Retorna un arreglo de Objeto Permission
   */
  obtener_permisos(): Observable<Array<Permission>> {
    return this.http.get(`${this.API_URL}/permisos`) as Observable<Array<Permission>>;
  }


  /**
   *
   * @author Margarita Mawyin
   * @returns //{ "totalPendientes": 29, "totalProveedores": 115}
   */
  valor_total_proveedo() {
    return this.http.get(`${this.API_URL}/valor_total_provider/`);
  }

  //FALTA
  getProfesionProveedor(id: any) {
    return this.http.get(`${this.API_URL}/profesion_proveedor/${id}`);
  }
  /**
   * Funcion que actualiza una profesion en la base de datos según el parametro pasado.
   *
   * @author Margarita Mawyin
   * @param bodyCrear Recibe un Objeto BodyActualizarProfesion el cual se ectualiza una profesion con los campos necesarios.
   * @returns
   */
  actualizar_profesion(bodyCrear: BodyActualizarProfesion) : Observable<BodyResponseActualizarProfesion>{
    if(bodyCrear.foto) {
      console.log('Hay un File (foto): ', bodyCrear.foto);
    }
    const dataCrear = new FormData();
    dataCrear.append("id", bodyCrear.id.toString());
    bodyCrear.nombre ? dataCrear.append("nombre", bodyCrear.nombre) : null;
    bodyCrear.foto ? dataCrear.append("foto", bodyCrear.foto) : null;
    bodyCrear.descripcion ? dataCrear.append("descripcion", bodyCrear.descripcion) : null;
    dataCrear.append("servicio", bodyCrear.servicio);
    bodyCrear.estado ? dataCrear.append("estado", bodyCrear.estado.toString()) : null;
    return this.http.put(this.API_URL + '/profesiones/', dataCrear) as Observable<BodyResponseActualizarProfesion>;
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
    return this.http.post(`${this.API_URL}/insignias/`, dataCrear) as Observable<BodyResponseCrearInsignia>;
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
    return this.http.get(`${this.API_URL}/profesion/${id}`) as Observable<Profesion>;
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
    return this.http.put(`${this.API_URL}/profesion_prov/${id}`, data) as Observable<ProveedorProfesion>;
  }

  //no se usa en la app anterior
  delete_profesion_proveedo(id: any) {
    return this.http.delete(`${this.API_URL}/profesion_prov/${id}`);
  }

}

