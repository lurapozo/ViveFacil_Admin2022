import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyEmail } from 'src/app/interfaces/email';
import { BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, SerializerCrearProveedorPendiente } from 'src/app/interfaces/proveedor';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.css']
})
export class PendientesComponent {


  total = 0
  arr_pendiente!: any[];
  arr_filtered_pendiente!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  pendiente_seleccionada: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
 isAceptar = false; isNegar = false;
  habilitar = ''



  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_proveedores_pendientes().subscribe(resp => {
      this.total =Object(resp).total_objects
      this.arr_pendiente = Object(resp).results;
   
      this.arr_filtered_pendiente = this.arr_pendiente;
      console.log( this.arr_filtered_pendiente)
      if (Object(resp).next != null) {
        this.condicionNext = true
      }
      console.log( Object(resp).total_pages)
      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index)

      }

    });
  }

  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_pendiente = this.arr_pendiente;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_pendiente = this.arr_filtered_pendiente?.filter((solicitud) => {
        return solicitud.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }}

    establecerMensaje(mensaje: string, tipo: string) {
        
      if (tipo === 'aceptar') {
        this.isAceptar = true;
        this.isNegar = false;
       
      }
      else if (tipo === 'negar') {
        this.isNegar = true;
        this.isAceptar= false;
        
      }
     
      this.mensajeAlerta = mensaje;
    }
 onAceptar(){
let pendiente : BodyCrearProveedorPendiente ={
  nombres: this.pendiente_seleccionada.nombres,
  apellidos: this.pendiente_seleccionada.apellidos,
  genero: this.pendiente_seleccionada.genero,
  telefono: this.pendiente_seleccionada.telefono,
  cedula: this.pendiente_seleccionada.cedula,
  copiaCedula: this.pendiente_seleccionada.copiaCedula,
  ciudad:  this.pendiente_seleccionada.ciudad,
  direccion: this.pendiente_seleccionada.direccion,
  email: this.pendiente_seleccionada.email,
  descripcion: this.pendiente_seleccionada.descripcion,
  licencia: this.pendiente_seleccionada.licencia,
  copiaLicencia: this.pendiente_seleccionada.copiaLicencia,
  profesion: this.pendiente_seleccionada.profesion,
  ano_experiencia: this.pendiente_seleccionada.ano_experiencia,
  banco: this.pendiente_seleccionada.banco,
  numero_cuenta: this.pendiente_seleccionada.numero_cuenta,
  tipo_cuenta: this.pendiente_seleccionada.tipo_cuenta,
  planilla_servicios:  this.pendiente_seleccionada.planilla_servicios
}

this.pythonAnywhereService.crear_proveedor_pendiente(pendiente).subscribe(resp=>{
  console.log(resp)
})
let email :BodyEmail={
  password: '1234',
  email: this.pendiente_seleccionada.email,
  tipo: 'Proveedor'
}
this.pythonAnywhereService.enviar_email(email).subscribe(resp=>{
  console.log(resp)
})
 }
onNegar(){
  let pendiente : BodyCrearProveedorPendiente ={
    nombres: this.pendiente_seleccionada.nombres,
    apellidos: this.pendiente_seleccionada.apellidos,
    genero: this.pendiente_seleccionada.genero,
    telefono: this.pendiente_seleccionada.telefono,
    cedula: this.pendiente_seleccionada.cedula,
    copiaCedula: this.pendiente_seleccionada.copiaCedula,
    ciudad:  this.pendiente_seleccionada.ciudad,
    direccion: this.pendiente_seleccionada.direccion,
    email: this.pendiente_seleccionada.email,
    descripcion: this.pendiente_seleccionada.descripcion,
    licencia: this.pendiente_seleccionada.licencia,
    copiaLicencia: this.pendiente_seleccionada.copiaLicencia,
    profesion: this.pendiente_seleccionada.profesion,
    ano_experiencia: this.pendiente_seleccionada.ano_experiencia,
    banco: this.pendiente_seleccionada.banco,
    numero_cuenta: this.pendiente_seleccionada.numero_cuenta,
    tipo_cuenta: this.pendiente_seleccionada.tipo_cuenta,
    planilla_servicios:  this.pendiente_seleccionada.planilla_servicios
  }
this.pythonAnywhereService.eliminar_proveedores_pendientes(this.pendiente_seleccionada.id).subscribe(resp=>{
  console.log(resp)
})
}
}
