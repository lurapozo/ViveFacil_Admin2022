import { SolicitantePaginacion, Solicitante } from 'src/app/interfaces/solicitante';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador, AdministradorPaginacion, BodyActualizarAdministrador, BodyCrearAdministrador, BodyResponseCrearAdministrador } from 'src/app/interfaces/administrador';
import { map, Observable } from 'rxjs';
import { Insignias } from 'src/app/interfaces/insignias';
import { Cargo } from 'src/app/interfaces/cargo';
import { Promocion } from 'src/app/interfaces/promocion';
import { Cupon } from 'src/app/interfaces/cupon';
import { PaymentPaginacion } from 'src/app/interfaces/payment';
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
   return this.http.get(`${this.API_URL}/solicitantes/?page=${page}`) as Observable<SolicitantePaginacion>;
  }

  /**
   * Obtene el solicitante desde la base de datos.
  *
  * @author Kevin Chévez
  * @param user Recibe un string que pertenece al correo del solicitante a buscar en la base de datos.
  * @returns Devuelve un Observable con un objeto Arreglo de Solicitante
  */
 obtener_solicitante(user: string): Observable<Solicitante[]> {
   return this.http.get(`${this.API_URL}/solicitante/${user}`) as Observable<Solicitante[]>;
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
  * @param usuario Recibe un string con el que se realizará el filtro del usuario con respecto a su correo.
  * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
  * @returns Devuelve un Observable con un objeto SolicitantePaginación.
  */
 buscar_solicitante(usuario: string, page = 1): Observable<SolicitantePaginacion> {
   return this.http.get(`${this.API_URL}/filtro-usuario/${usuario}?page=${page}`) as Observable<SolicitantePaginacion>;
  }

  /**
   *
   * @param estado
   * @param id
   * @returns
   */
  cambio_solicitante_estado(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/solicitante_estado/${id}`, estado);
  }
  //-----------------------------------------------------------------------------------------------------------------------



  //-------------------------------------------------- SECCIÓN INSIGNIAS --------------------------------------------------
  /**
   * Función que trae de la base de datos todas las insignias.
   *
   * @author Kevin Chévez
   * @returns Devuelve un observable con un arreglo de objeto Insignias
   */
  obtener_insignias() : Observable<Insignias[]>{
    return this.http.get(this.API_URL+'/insignias/') as Observable<Insignias[]>;
  }

  /**
   * Función que obtiene la insignia seleccionada por parametro.
   *
   * @author Kevin Chévez
   * @param id Recibe un string del ID de la insignia a traer de la base de datos.
   * @returns Devuelve un Observable con la insignia requerida.
   */
  obtener_insignia(id: string) : Observable<Insignias>{
    return this.http.get(`${this.API_URL}/insignias/${id}`) as Observable<Insignias>;
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
    return this.http.get(this.API_URL+'/cargos/') as Observable<Cargo[]>;
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
  //-----------------------------------------------------------------------------------------------------------------------



  //------------------------------------------------------ SECCIÓN ADMIN --------------------------------------------------
  /**
   * Función que obtiene los administradores registrados en la base de datos.
   *
   * @author Kevin Chévez
   * @param page (Opcional) Recibe un number indicando el número de la página. Por defecto 1.
   * @returns Devuelve un Obsevable del objeto AdministradorPaginacion
   */
  obtener_administradores(page = 1) : Observable<AdministradorPaginacion> {
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
  actualizar_administrador(id: string, body: BodyActualizarAdministrador): Observable<any> {
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
    console.log(fechaInicio);
    console.log(fechaFin);
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
    console.log(fechaInicio);
    console.log(fechaFin);
    return this.http.get(`${this.API_URL}/fechas_tarjeta/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }
  //-----------------------------------------------------------------------------------------------------------------------


  /*
    eliminar_solicitante
    autor: Axell
    descripccion: Elimina un solicitante
    parametros: int id
  */
  eliminar_solicitante(id: any) {
    return this.http.delete(`${this.API_URL}/solicitante_delete/${id}`);
  }

  /*
    cambio_proveedor_estado
    autor: Axell
    descripccion: Cambia estado de un proveedor
    parametros: boolean estado, int id
  */
  cambio_proveedor_estado(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/proveedor_estado/${id}`, estado);
  }

  /*
    cambio_administrador_estado
    autor: Axell
    descripccion: Cambia estado de un administrador
    parametros: boolean estado, int id
  */
  cambio_administrador_estado(id: any, estado: any) {
    return this.http.put(`${this.API_URL}/administrador_estado/?id=${id}`, estado);
  }

  cambio_insignia_estado(id: any, estado: any) {
    return this.http.put(`${this.API_URL}/insignia_estado/?id=${id}`, estado);
  }

  cambio_promocion_estado(id: any, estado: any) {
    return this.http.put(`${this.API_URL}/promocion_estado/?id=${id}`, estado);
  }

  cambio_cupon_estado(id: any, estado: any) {
    return this.http.put(`${this.API_URL}/cupon_estado/?id=${id}`, estado);
  }

  cambio_pago_proveedor_estado(id: any, estado: any) {
    return this.http.put(`${this.API_URL}/tarjeta_pago/?id=${id}`, estado);
  }

  /*
    eliminar_proveedor
    autor: Axell
    descripccion: Elimina un proveedor
    parametros: int id
  */
  eliminar_proveedor(id: any) {
    return this.http.delete(`${this.API_URL}/proveedor_delete/${id}`);
  }

  /*
    eliminar_administrador
    autor: Axell
    descripccion: Elimina un administrador
    parametros: int id
  */
  eliminar_administrador(id: any) {
    return this.http.delete(`${this.API_URL}/administrador_delete/${id}`);
  }

  eliminar_admin(id: any) {
    return this.http.delete(`${this.API_URL}/administrador/${id}`);
  }

  /*
    obtener_proveedores
    autor: Kelly
    descripccion: Obtiene todas las proveedores
    parametros: None
  */
  obtener_proveedores() {
    return this.http.get(this.API_URL+'/proveedores/');
  }

  obtener_providers(page: any) {
    return this.http.get(`${this.API_URL}/proveedores/?page=${page}`);
  }
  /*
    obtener_proveedores_pendientes
    autor: Kelly
    descripccion: Obtiene todas las proveedores pendientes
    parametros: None
  */
  obtener_proveedores_pendientes() {
    return this.http.get(this.API_URL+'/proveedores_pendientes/');
  }

  obtener_pendientes(page: any) {
    return this.http.get(`${this.API_URL}/proveedor_pendiente/?page=${page}`);
  }

  obt_proveedor_pendiente(id: any) {
    return this.http.get(`${this.API_URL}/proveedores_pendientes/${id}`);
  }

  filtrar_pendientesName(user: any, page: any) {
    return this.http.get(`${this.API_URL}/pendientes-search/${user}?page=${page}`);
  }

  filtrar_pendienteDate(fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(`${this.API_URL}pendientes-filterDate/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  editar_pendiente(id: any, data: any) {
    return this.http.put(`${this.API_URL}/proveedores_pendientes/${id}`, data);
  }

  editar_proveedor(data: any) {
    return this.http.put(`${this.API_URL}/edicion_proveedor/`, data);
  }

  eliminarDocPendiente(id: any) {
    return this.http.delete(`${this.API_URL}/documentos_pendientes/?id=${id}`);
  }

  eliminarDocProveedor(id: any) {
    return this.http.delete(`${this.API_URL}/documentos_proveedores/?id=${id}`);
  }

  eliminarPendiente(id: any) {
    return this.http.delete(`${this.API_URL}/proveedores_pendientes/${id}`);
  }

  /*
    obtener_cuenta_proveedor
    autor: Kelly
    descripccion: Obtiene las de los proveedores
    parametros: el id del proveedor
  */

  obtener_cuenta_proveedor(proveedorID: any) {
    return this.http.get(`${this.API_URL}/cuenta_proveedor/${proveedorID}`);
  }

  /*
    register_proveedor
    autor: Kelly
    descripccion: Obtiene todas las proveedores
    parametros: diccionario con los campos necesarios
  */

  register_proveedor(data: any) {
    let url = this.API_URL+'/register_proveedor/';
    return this.http.post(url, data);
  }

  obtener_proveedorInfo(id: any) {
    return this.http.get(`${this.API_URL}/proveedor/${id}`);
  }

  crear_proveedor(data: any) {
    return this.http.post(`${this.API_URL}/proveedores_registro/`, data);
  }

  filtrar_providersName(user: any, page: any) {
    return this.http.get(`${this.API_URL}/providers-search/${user}?page=${page}`);
  }

  filtrar_providersDate(fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(`${this.API_URL}/dates-providers/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  filtrar_planProvidersDate(fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(`${this.API_URL}/dates-planproviders/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`);
  }

  filtrar_planprovidersNameDate(user: any, fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(`${this.API_URL}/providersdate_search/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}&user=${user}`);
  }
  /*
    obtener_profesiones
    autor: Kelly
    descripccion: Obtiene todas las profesiones de los proveedores
    parametros: usuario
  */

  obtener_profesiones(user: any) {
    return this.http.get(`${this.API_URL}/proveedor_profesiones/${user}`);
  }

  get_profesiones() {
    return this.http.get(`${this.API_URL}/profesiones/`);
  }

  filtrar_pendientes(user: any) {
    return this.http.get(`${this.API_URL}/pendientes-search/${user}`);
  }

  /*
    enviar_email
    autor: Kelly
    descripccion: envia email a los proveedores pendientes aceptados
    parametros: data
  */

  enviar_email(data: any) {
    return this.http.post(this.API_URL+'/email/', data)
  }

  obtener_todas_profesiones() {
    return this.http.get(this.API_URL+'/profesiones/');
  }

  actualizar_pendiente(url: string, data: any) {
    return this.http.post(url, data);
  }

  /*
    obtener_categorias
    autor: Lilibeth
    descripccion: Obtiene todas las categorias
    parametros: None
  */
  obtener_categorias() {
    return this.http.get(this.API_URL+'/categorias/');
  }
  /*
     cambio_categoria_estado
     autor: Lilibeth
     descripccion: Cambia estado de una categoria
     parametros: boolean estado, int id
   */
  cambio_categoria_update(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/categoria_update/${id}`, estado);
  }

  cambio_insignia(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/insignia_update/${id}`, estado);
  }

  cambio_promocion(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/promocion_update/${id}`, estado);
  }

  cambio_cupon(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/cupon_update/${id}`, estado);
  }

  cambio_cargo(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/cargo_update/${id}`, estado);
  }

  /*
      eliminar_categoria
      autor: lilibeth
      descripccion: Elimina una categoria
      parametros: int id
    */
  eliminar_categoria(id: any) {
    return this.http.delete(`${this.API_URL}/categoria_delete/${id}`);
  }

  eliminar_insignia(id: any) {
    return this.http.delete(`${this.API_URL}/insignia_delete/${id}`);
  }

  eliminar_cargo(id: any) {
    return this.http.delete(`${this.API_URL}/cargo_delete/${id}`);
  }

  eliminar_promocion(id: any) {
    return this.http.delete(`${this.API_URL}/promocion_delete/${id}`);
  }

  eliminar_cupon(id: any) {
    return this.http.delete(`${this.API_URL}/cupon_delete/${id}`);
  }

  /*
    obtener_Subcategorias
    autor: Lilibeth
    descripccion: Obtiene todas las sub-categorias
    parametros: None
  */
  obtener_subcategorias() {
    return this.http.get(this.API_URL+'/servicios/');
  }

  add_profesion(data: any) {
    return this.http.post(this.API_URL+'/profesiones/', data);
  }

  delete_profesion(id: any) {
    return this.http.delete(`${this.API_URL}/profesiones/${id}`);
  }

  /*
    cambio_subcategoria_estado
    autor: Lilibeth
    descripccion: Cambia estado de una subcategoria
    parametros: boolean estado, int id
  */
  cambio_subcategoria_update(estado: any, id: any) {
    console.log(estado, id);
    return this.http.put(`${this.API_URL}/servicios_update/${id}`, estado);
  }
  /*
  eliminar_subcategoria
  autor: lilibeth
  descripccion: Elimina una subcategoria
  parametros: int id
  */
  eliminar_subcategoria(id: any) {
    return this.http.delete(`${this.API_URL}/servicios_delete/${id}`);
  }
  /*
  crear_categoria
  autor: lilibeth
  descripccion: crear una categoria
  parametros: none
  */
 crear_categoria(data: any) {
   return this.http.post(`${this.API_URL}/categorias/`, data);
  }

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
    return this.http.post(`${this.API_URL}/proveedor_profesiones/${user}`, data);
  }

  // crear_profesion_proveedor(user, data) {
  //   return this.http.post(`${this.API_URL}/proveedor_profesiones/${user}`, data)
  // };

  /*
      eliminar proveedor pendiente
      autor: lilibeth
      descripccion: elimina proveedor pendiente
      parametros: user
    */
  eliminar_proveedores_pendientes(user: any, data: any) {
    return this.http.delete(`${this.API_URL}/proveedores_pendientes/${user}/${data}`);
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
    return this.http.get(this.API_URL+'/promociones/');
  }

  obtener_cupones() {
    return this.http.get(this.API_URL+'/cupones/');
  }

  obtener_grupos() {
    return this.http.get(this.API_URL+'/grupos/');
  }

  /*
    crear_promocion
    autor: Kelly
    descripccion: Crea una nueva promocion
    parametros: data
  */

  crear_promocion(data: any) {
    return this.http.post(this.API_URL+'/promociones/', data);
  }

  crear_cupon(data: any) {
    return this.http.post(this.API_URL+'/cupones/', data);
  }

  /*
    crear_promocion
    autor: Kelly
    descripccion: Crea una nueva promocion
    parametros: data
  */

  actualizar_promocion(data: any) {
    return this.http.put(this.API_URL+'/promociones/', data);
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
    return this.http.get(this.API_URL+'/pago_efectivos/');
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
  valor_total_banc_tarjeta(): Observable<any>{
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
    return this.http.get(this.API_URL+'/pago_tarjetas/');
  }

  obtener_pago_solE(pago_ID: any) {
    return this.http.get(`${this.API_URL}/pagosol_efectivo/${pago_ID}`);
  }

  obtener_pago_solT(pago_ID: any) {
    return this.http.get(`${this.API_URL}/pagosol_tarjeta/${pago_ID}`);
  }

  enviar_alerta(correo: any, asunto: any, texto: any) {
    return this.http.get(`${this.API_URL}/enviaralerta/${correo}/${asunto}/${texto}`);
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
    return this.http.get(this.API_URL+'/planes/');
  }

  crear_plan(data: any) {
    return this.http.post(this.API_URL+'/planes/', data);
  }

  actualizar_plan(data: any) {
    return this.http.put(this.API_URL+'/planes/', data);
  }

  borrar_plan(id: any) {
    return this.http.delete(`${this.API_URL}/planes/${id}`);
  }

  obtener_publicidades(page: any) {
    return this.http.get(`${this.API_URL}/publicidades/?page=${page}`);
  }

  filtrar_publicidadName(buscar: any, page: any) {
    return this.http.get(`${this.API_URL}/publicidades_search/?page=${page}&buscar=${buscar}`);
  }

  crear_publicidad(data: any) {
    return this.http.post(this.API_URL+'/publicidades/', data);
  }

  actualizar_publicidad(data: any) {
    return this.http.put(this.API_URL+'/publicidades/', data);
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
    return this.http.get(this.API_URL+'/planes/');
  }

  crear_plan_proveedor(data: any) {
    return this.http.post(this.API_URL+'/planProveedor/', data);
  }

  actualizar_plan_proveedor(data: any) {
    return this.http.put(this.API_URL+'/planProveedor/', data);
  }

  borrar_plan_proveedor(id: any) {
    return this.http.delete(`${this.API_URL}/planProveedor/${id}`);
  }

  obtener_planes_estado() {
    return this.http.get(this.API_URL+'/planesEstado/');
  }

  obtener_roles() {
    return this.http.get(this.API_URL+'/grupos/');
  }

  crear_rol = (data: any) => {
    return this.http.post(this.API_URL+'/roles-permisos/', data);
  };

  actualizar_rol = (data: any) => {
    return this.http.put(this.API_URL+'/roles-permisos/', data);
  };

  obtener_solicitudes(page: any) {
    return this.http.get(`${this.API_URL}/solicitudes-proveedores/?page=${page}`);
  }

  solicitudesByUser(usuario: any, page: any) {
    return this.http.get(`${this.API_URL}/solicitudesUser_search/${usuario}?page=${page}`);
  }

  solicitudesByDate(fechaInicio: any, fechaFin: any, page: any) {
    return this.http.get(`${this.API_URL}/solicitudesDate_search/?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&page=${page}`
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
    return this.http.put(this.API_URL+'/profesiones/', data);
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
