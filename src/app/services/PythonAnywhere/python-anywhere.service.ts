import {
  SolicitantePaginacion,
  Solicitante,
} from 'src/app/interfaces/solicitante';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador, AdministradorPaginacion, BodyActualizarAdministrador, BodyCrearAdministrador, BodyResponseCrearAdministrador,} from 'src/app/interfaces/administrador';
import { map, Observable } from 'rxjs';
import { BodyActualizarInsignia, Insignia } from 'src/app/interfaces/insignia';
import { BodyActualizarCargo, Cargo } from 'src/app/interfaces/cargo';
import { BodyPromocionActualizar, BodyResponsePromocionActualizar, Promocion } from 'src/app/interfaces/promocion';
import { BodyCuponActualizar, BodyResponseCuponActualizar, Cupon } from 'src/app/interfaces/cupon';
import { PaymentPaginacion } from 'src/app/interfaces/payment';
import { BodyActualizarProveedor, BodyActualizarProveedorPendiente, BodyCrearProveedor, BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, Proveedor, ProveedorPaginacion, ProveedorPendiente, ProveedorProfesion } from 'src/app/interfaces/proveedor';
import { Documento, DocumentoPendiente } from 'src/app/interfaces/documento';
import { CuentaBancariaProveedor } from 'src/app/interfaces/cuenta-bancaria';
import { BodyCrearProfesion, BodyResponseCrearProfesion, Profesion } from 'src/app/interfaces/profesion';
import { BodyEmail, BodyResponseEmail } from 'src/app/interfaces/email';
import { BodyActualizarCategoria, BodyCrearCategoria, BodyResponseCrearCategoria, Categoria } from 'src/app/interfaces/categoria';
import { BodyActualizarServicio, Servicio } from 'src/app/interfaces/servicio';
@Injectable({
  providedIn: 'root',
})
export class PythonAnywhereService {
  API_URL = `https://tomesoft1.pythonanywhere.com`;
  administradores = 'https://tomesoft1.pythonanywhere.com/administradores';

  constructor(private http: HttpClient) {}

  // getAdministradores(): Observable<Administrador[]> {
  //   return this.http
  //     .get<fetchAllAdmi>(this.administradores)
  //     .pipe(map(this.getAdmiDatos));
  // }

  // private getAdmiDatos(resp: fetchAllAdmi) {
  //   const admiList: Administrador[] = resp.results.map((admi) => {
  //     return {
  //       id: admi.id,
  //       user_datos: admi.user_datos,
  //       estado: admi.estado,
  //     };
  //   });
  //   return admiList;
  // }

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
  cambio_solicitante_estado(
    estado: boolean,
    id: string
  ): Observable<Solicitante> {
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
    bodyActualizar.nombre? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.imagen? dataUpdate.append('imagen', bodyActualizar.imagen) : null;
    bodyActualizar.servicio? dataUpdate.append('servicio', bodyActualizar.servicio) : null;
    bodyActualizar.tipo_usuario? dataUpdate.append('tipo_usuario', bodyActualizar.tipo_usuario) : null;
    dataUpdate.append('estado', bodyActualizar.estado.toString());
    bodyActualizar.pedidos? dataUpdate.append('pedidos', bodyActualizar.pedidos.toString()) : null;
    bodyActualizar.descripcion? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    bodyActualizar.tipo? dataUpdate.append('tipo', bodyActualizar.tipo) : null;

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
    bodyActualizar.fecha_iniciacion? dataUpdate.append("fecha_iniciacion", bodyActualizar.fecha_iniciacion) : null;
    dataUpdate.append("fecha_expiracion", bodyActualizar.fecha_expiracion);
    dataUpdate.append("porcentaje", bodyActualizar.porcentaje.toString());
    dataUpdate.append("cantidad", bodyActualizar.cantidad.toString());
    dataUpdate.append("participantes", bodyActualizar.participantes);
    bodyActualizar.foto? dataUpdate.append("foto", bodyActualizar.foto) : null;
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
    return this.http.put(`${this.API_URL}/cupon_estado/?id=${id}`, {estado: estado,});
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
    bodyActualizar.fecha_iniciacion? dataUpdate.append("fecha_iniciacion", bodyActualizar.fecha_iniciacion) : null;
    dataUpdate.append("fecha_expiracion", bodyActualizar.fecha_expiracion);
    dataUpdate.append("porcentaje", bodyActualizar.porcentaje.toString());
    dataUpdate.append("cantidad", bodyActualizar.cantidad.toString());
    dataUpdate.append("puntos", bodyActualizar.puntos.toString());
    bodyActualizar.foto? dataUpdate.append("foto", bodyActualizar.foto) : null;
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
    return this.http.put(`${this.API_URL}/tarjeta_pago/?id=${id}`, {estado: estado,});
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
    return this.http.put(`${this.API_URL}/proveedor_estado/${id}`, {estado: estado,}) as Observable<Proveedor>;
  }

  /**
   * Función que obtiene los proveedores registrados en la base de datos con un formato de paginacion.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto ProveedorPaginacion
   */
  obtener_proveedores(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/proveedores/?page=${page}`) as Observable<ProveedorPaginacion> ;
  }

  /**
   * Función que obtiene todos los proveedores pendientes que se encuentran en la base de datos.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto ProveedorPaginacion
   */
  obtener_proveedores_pendientes(page = 1): Observable<ProveedorPaginacion> {
    return this.http.get(`${this.API_URL}/proveedores_pendientes/?page=${page}`) as Observable<ProveedorPaginacion> ;
  }

  /**
   * Función que obtiene al proveedor pendiente que se encuentra en la base de datos segun el ID pasado como parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string ID del proveedor pendiente objetivo a buscar en la Base de datos.
   * @returns Devuelve un observable con el objeto ProveedorPendiente
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
    return this.http.get(`${this.API_URL}/pendientes-filterDate/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}` );
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
  obtener_documentos_pendientes(): Observable<DocumentoPendiente[]>{
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
  obtener_documentos(): Observable<Documento[]>{
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
    bodyActualizar.nombre? dataUpdate.append('nombre', bodyActualizar.nombre) : null;
    bodyActualizar.descripcion? dataUpdate.append('descripcion', bodyActualizar.descripcion) : null;
    dataUpdate.append('estado', bodyActualizar.estado.toString());
    bodyActualizar.foto? dataUpdate.append('foto', bodyActualizar.foto) : null;
    bodyActualizar.foto2? dataUpdate.append('foto2', bodyActualizar.foto2) : null;

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
    bodyCrear.foto? dataCrear.append("foto", bodyCrear.foto) : null;
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

  //---------------------------------------------------------------- PEDRO! TE TOCA DOCUMENTAR ESTO ----------------------------------------------------------------
  crear_insignia(data: any) {
    return this.http.post(`${this.API_URL}/insignias/`, data);
  }

  crear_cargo(data: any) {
    return this.http.post(`${this.API_URL}/cargos/`, data);
  }

  /*
      crear_subcategoria
      autor: lilibeth
      descripccion: crea una subcategoria
      parametros: none
    */
  crear_subcategoria(data: any) {
    return this.http.post(`${this.API_URL}/servicios/`, data);
  }
  /*
      crear_profesiones_proveedor
      autor: lilibeth
      descripccion: crea una profesion a un proveedor
      parametros: user
    */

  crear_profesiones_proveedor(user: any, data: any) {
    return this.http.post(`${this.API_URL}/proveedor_profesiones/${user}`,data);
  }

  /*
      eliminar proveedor pendiente
      autor: lilibeth
      descripccion: elimina proveedor pendiente
      parametros: user
    */
  eliminar_proveedores_pendientes(user: any, data: any) {
    return this.http.delete(
      `${this.API_URL}/proveedores_pendientes/${user}/${data}`
    );
  }

  update_pendiente_documento(data: any) {
    return this.http.put(`${this.API_URL}/proveedores_pendientes/`, data);
  }

  /*
    obtener_promociones
    autor: Kelly
    descripccion: Obtiene todas las promociones registradas en la base de datos
    parametros: None
  */

  obtener_promociones() {
    return this.http.get(this.API_URL + '/promociones/');
  }

  obtener_cupones() {
    return this.http.get(this.API_URL + '/cupones/');
  }

  obtener_grupos() {
    return this.http.get(this.API_URL + '/grupos/');
  }

  /*
    crear_promocion
    autor: Kelly
    descripccion: Crea una nueva promocion
    parametros: data
  */

  crear_promocion(data: any) {
    return this.http.post(this.API_URL + '/promociones/', data);
  }

  crear_cupon(data: any) {
    return this.http.post(this.API_URL + '/cupones/', data);
  }


  obtener_ctgprom(promCode: any) {
    return this.http.get(`${this.API_URL}/promcategorias/${promCode}`);
  }

  /*
  obtener_pagos_efectivo
  autor: Kelly
  descripccion: Retorna todas los pagos en efectivo
  parametros: none
*/

  obtener_pagos_efectivo() {
    return this.http.get(this.API_URL + '/pago_efectivos/');
  }

  obtener_pagos_efectivoP(page: any) {
    return this.http.get(`${this.API_URL}/pago_efectivosP/?page=${page}`);
  }

  obtener_pagos_tarjetaP(page: any) {
    return this.http.get(`${this.API_URL}/pago_tarjetasP/?page=${page}`);
  }

  valor_total_efectivo() {
    return this.http.get(`${this.API_URL}/valor_total_efectivo/`);
  }

  valor_total_tarjeta() {
    return this.http.get(`${this.API_URL}/valor_total_tarjeta/`);
  }

  valor_total_pay_tarjeta() {
    return this.http.get(`${this.API_URL}/valor_total_pay_tarjeta/`);
  }

  /**
   *
   * @returns
   */
  valor_total_banc_tarjeta(): Observable<any> {
    return this.http.get(`${this.API_URL}/valor_total_banc_tarjeta/`);
  }

  valor_total_sis_tarjeta() {
    return this.http.get(`${this.API_URL}/valor_total_sis_tarjeta/`);
  }

  valor_total() {
    return this.http.get(`${this.API_URL}/valor_total/`);
  }

  /*
    obtener_pagos_tarjeta
    autor: Kelly
    descripccion: Retorna todas los pagos con tarjeta
    parametros: none
  */

  obtener_pagos_tarjeta() {
    return this.http.get(this.API_URL + '/pago_tarjetas/');
  }

  obtener_pago_solE(pago_ID: any) {
    return this.http.get(`${this.API_URL}/pagosol_efectivo/${pago_ID}`);
  }

  obtener_pago_solT(pago_ID: any) {
    return this.http.get(`${this.API_URL}/pagosol_tarjeta/${pago_ID}`);
  }

  enviar_alerta(correo: any, asunto: any, texto: any) {
    return this.http.get(
      `${this.API_URL}/enviaralerta/${correo}/${asunto}/${texto}`
    );
  }

  editar_sugerencia_estado(sugerencia: any, id: any) {
    return this.http.put(`${this.API_URL}/suggestion/${id}`, sugerencia);
  }

  obtener_sugerencia(id: any) {
    return this.http.get(`${this.API_URL}/suggestion/${id}`);
  }

  obtener_sugerenciasLeidas(page: any) {
    return this.http.get(`${this.API_URL}/read-suggestions/?page=${page}`);
  }

  obtener_sugerenciasNoLeidas(page: any) {
    return this.http.get(`${this.API_URL}/unread-suggestions/?page= ${page}`);
  }

  getCiudades() {
    return this.http.get(`${this.API_URL}/ciudades/`);
  }

  crear_Ciudades(ciudad: any) {
    return this.http.put(`${this.API_URL}/ciudades/`, ciudad);
  }

  obtener_planes() {
    return this.http.get(this.API_URL + '/planes/');
  }

  crear_plan(data: any) {
    return this.http.post(this.API_URL + '/planes/', data);
  }

  actualizar_plan(data: any) {
    return this.http.put(this.API_URL + '/planes/', data);
  }

  borrar_plan(id: any) {
    return this.http.delete(`${this.API_URL}/planes/${id}`);
  }

  obtener_publicidades(page: any) {
    return this.http.get(`${this.API_URL}/publicidades/?page=${page}`);
  }

  filtrar_publicidadName(buscar: any, page: any) {
    return this.http.get(
      `${this.API_URL}/publicidades_search/?page=${page}&buscar=${buscar}`
    );
  }

  crear_publicidad(data: any) {
    return this.http.post(this.API_URL + '/publicidades/', data);
  }

  actualizar_publicidad(data: any) {
    return this.http.put(this.API_URL + '/publicidades/', data);
  }

  borrar_publicidad(id: any) {
    return this.http.delete(`${this.API_URL}/publicidades/${id}`);
  }

  obtener_admin_user(user: any) {
    return this.http.get(`${this.API_URL}/adminUser/${user}`);
  }

  obtener_admin_user_pass(user: any, passw: any) {
    return this.http.post(`${this.API_URL}/adminUserPass/`, {
      username: user,
      password: passw,
    });
  }

  logout(token: any) {
    return this.http.get(`${this.API_URL}/logout/${token}`);
  }

  get_notificacion(page: any) {
    return this.http.get(`${this.API_URL}/notificacion-anuncio/`);
  }

  send_notificacion(data: any) {
    return this.http.post(`${this.API_URL}/notificacion-anuncio/`, data);
  }

  obtener_plan_proveedor() {
    return this.http.get(this.API_URL + '/planes/');
  }

  crear_plan_proveedor(data: any) {
    return this.http.post(this.API_URL + '/planProveedor/', data);
  }

  actualizar_plan_proveedor(data: any) {
    return this.http.put(this.API_URL + '/planProveedor/', data);
  }

  borrar_plan_proveedor(id: any) {
    return this.http.delete(`${this.API_URL}/planProveedor/${id}`);
  }

  obtener_planes_estado() {
    return this.http.get(this.API_URL + '/planesEstado/');
  }

  obtener_roles() {
    return this.http.get(this.API_URL + '/grupos/');
  }

  crear_rol = (data: any) => {
    return this.http.post(this.API_URL + '/roles-permisos/', data);
  };

  actualizar_rol = (data: any) => {
    return this.http.put(this.API_URL + '/roles-permisos/', data);
  };

  obtener_solicitudes(page: any) {
    return this.http.get(
      `${this.API_URL}/solicitudes-proveedores/?page=${page}`
    );
  }

  solicitudesByUser(usuario: any, page: any) {
    return this.http.get(
      `${this.API_URL}/solicitudesUser_search/${usuario}?page=${page}`
    );
  }

  solicitudesByDate(fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(
      `${this.API_URL}/solicitudesDate_search/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`
    );
  }

  solicitudDetail(id: any) {
    return this.http.get(`${this.API_URL}/solicitud-profesion/${id}`);
  }

  solicitudChange(id: any, data: any) {
    return this.http.put(`${this.API_URL}/change-solicitud/${id}`, data);
  }

  solicitudDelet(id: any) {
    return this.http.delete(`${this.API_URL}/change-solicitud/${id}`);
  }

  editarProfesionProveedor(id: any, data: any) {
    return this.http.put(`${this.API_URL}/proveedor/${id}`, data);
  }

  correoSolicitud(data: any) {
    return this.http.post(`${this.API_URL}/correo-solicitud/`, data);
  }

  borrar_rol = (id: any) => {
    return this.http.delete(`${this.API_URL}/roles-permisos/${id}`);
  };

  obtener_rol(name: any) {
    return this.http.get(`${this.API_URL}/roles-permisos/${name}`);
  }

  obtener_permisos() {
    return this.http.get(`${this.API_URL}/permisos`);
  }

  valor_total_proveedo() {
    return this.http.get(`${this.API_URL}/valor_total_provider/`);
  }

  getProfesionProveedo(id: any) {
    return this.http.get(`${this.API_URL}/profesion_proveedor/${id}`);
  }

  actualizar_profesio(data: any) {
    return this.http.put(this.API_URL + '/profesiones/', data);
  }

  profesionDetails(id: any) {
    return this.http.get(`${this.API_URL}/profesion/${id}`);
  }

  actualizar_profesion_proveedo(id: any, data: any) {
    return this.http.put(`${this.API_URL}/profesion_prov/${id}`, data);
  }

  delete_profesion_proveedo(id: any) {
    return this.http.delete(`${this.API_URL}/profesion_prov/${id}`);
  }

}

