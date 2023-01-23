import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SolicitudProfesion } from 'src/app/interfaces/solicitud';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { BodyCrearProfesionProveedor, Proveedor } from '../../interfaces/proveedor';

@Component({
  selector: 'app-solicitudes-profesiones',
  templateUrl: './solicitudes-profesiones.component.html',
  styleUrls: ['./solicitudes-profesiones.component.css']
})
export class SolicitudesProfesionesComponent {

  total = 0
  arr_soli?: SolicitudProfesion[];
  arr_filtered_soli?: SolicitudProfesion[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  soli_seleccionada?: SolicitudProfesion;
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isAceptar = false; isNegar = false;
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_solicitudes().subscribe(resp => {
      console.log(resp);
      this.total = resp.total_objects;
      this.arr_soli = resp.results;
      this.arr_filtered_soli= this.arr_soli;
      if (resp.next != null) {
        this.condicionNext = true
      }
      for (let index = 1; index <= resp.total_pages; index++) {
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
        return solicitud.proveedor.user_datos.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

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
    this.pythonAnywhereService.solicitudChange(this.soli_seleccionada?.id,{"estado":true}).subscribe(resp=>{
      console.log(resp)
    })
  }

  onAceptar(){
    if(this.soli_seleccionada){
      const dataCrearProfesionProveedor: BodyCrearProfesionProveedor = {
        profesion: this.soli_seleccionada.profesion,
        ano_experiencia: this.soli_seleccionada.anio_experiencia
      };
      this.pythonAnywhereService.crear_profesiones_proveedor(this.soli_seleccionada.proveedor.user_datos.user.username, dataCrearProfesionProveedor).subscribe(respuesta => {
        console.log(respuesta);
        if(respuesta.success){
          this.mostrarToastInfo('Estado de la solicitud profesion', respuesta.message, false);
          console.log(respuesta.message);
          this.pythonAnywhereService.solicitudDelet(this.soli_seleccionada?.id).subscribe(resp=>{
            console.log(resp);
          })
        } else {
          this.mostrarToastInfo('Estado de la solicitud profesion', respuesta.message, true);
          console.log(respuesta.message);
        }
      });
    }
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
    });
  }

  mostrarToastInfo(titulo: string, mensaje: string, isErrorToast: boolean) {
    this.isErrorToast = isErrorToast;
    this.tituloToast = titulo;
    this.mensajeToast = mensaje;
    const toast = document.getElementById('liveToast');
    if(toast){
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 7000);
    } else {
      console.log('No hay toast renderizado');
    }
  }

}
