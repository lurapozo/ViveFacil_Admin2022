import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SolicitudProfesion } from 'src/app/interfaces/solicitud';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { Proveedor } from '../../interfaces/proveedor';

@Component({
  selector: 'app-solicitudes-profesiones',
  templateUrl: './solicitudes-profesiones.component.html',
  styleUrls: ['./solicitudes-profesiones.component.css']
})
export class SolicitudesProfesionesComponent {

  total = 0
  arr_soli!: any[];
  arr_filtered_soli!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  soli_seleccionada: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isAceptar = false; isNegar = false;



  
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_solicitudes().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_soli = Object(resp).results;
     
      this.arr_filtered_soli= this.arr_soli;
      if ( Object(resp).next != null) {
        this.condicionNext = true
      }
   
      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index)

      }

    });
  }

  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_soli = this.arr_soli;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_soli = this.arr_filtered_soli?.filter((solicitud) => {
        return solicitud.user_datos.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }}
    establecerMensaje(mensaje: string, tipo: string) {

      if (tipo === 'aceptar') {
        this.isAceptar = true;
        this.isNegar = false;
  
      }
      else if (tipo === 'negar') {
        this.isNegar = true;
        this.isAceptar = false;
  
      } 
      this.mensajeAlerta=mensaje
}
onNegar(){
  this.pythonAnywhereService.solicitudDelet(this.soli_seleccionada.id).subscribe(resp=>{
    console.log(resp)
  })

}
onAceptar(){

this.pythonAnywhereService.solicitudChange(this.soli_seleccionada.id,{"estado":true}).subscribe(resp=>{
  console.log(resp)
})

}


next(event: any) {

  this.currentPage = this.currentPage + 1
  this.pythonAnywhereService.obtener_solicitudes(this.currentPage).subscribe(resp => {
    this.arr_soli = Object(resp).results;
    this.arr_filtered_soli = this.arr_soli;
  })
}

previous(event: any) {

  this.currentPage = this.currentPage - 1
  this.pythonAnywhereService.obtener_solicitudes(this.currentPage).subscribe(resp => {
    this.arr_soli =Object(resp).results;
    this.arr_filtered_soli = this.arr_soli;
  })
}

iteracion(event: any) {
  this.pythonAnywhereService.obtener_solicitudes(event.target.value).subscribe(resp => {
    this.arr_soli = Object(resp).results;
    this.arr_filtered_soli = this.arr_soli;
    this.currentPage = Object(resp).current_page_number
    if (Object(resp).next != null) {
      this.condicionNext = true
    }

  })

}
}