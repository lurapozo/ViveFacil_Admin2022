import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyCrearNotificacionAnuncio,  NotificacionAnuncio  } from 'src/app/interfaces/notificacion';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

interface Notificacion {
  tipo: string;
  mensaje: string;
  fecha: string;
  habilitado: boolean;
}

@Component({
  selector: 'app-notificaciones-automaticas',
  templateUrl: './notificaciones-automaticas.component.html',
  styleUrls: ['./notificaciones-automaticas.component.css']
})
export class NotificacionesAutomaticasComponent {
  fechaInicio: Date | null = null; 
  fechaFin: Date | null = null; 
  fechasFiltradas: any[] = [];

  showHeader=true;
  mostrarFiltro: boolean = false;
  filtroActual: string = 'todos';

  arr_noti?: NotificacionAnuncio[] | undefined;
  arr_filtered_notificacion!: NotificacionAnuncio[] | undefined;
  notificaciones: Notificacion[] = [
    { tipo: 'CUMPLEAÑOS', mensaje: 'FELIZ CUMPLEAÑOS TE DESEA EL EQUIPO DE VIVE FÁCIL!', fecha: '10/10/2024', habilitado: true },
    { tipo: 'CUMPLEAÑOS', mensaje: 'FELIZ CUMPLEAÑOS TE DESEA EL EQUIPO DE VIVE FÁCIL!', fecha: '10/10/2024', habilitado: false },
    { tipo: 'COMPRA', mensaje: 'GRACIAS POR CONFIAR EN NOSOTROS', fecha: '10/10/2024', habilitado: true },
    { tipo: 'INGRESO COMPLETO', mensaje: 'HA SIDO AGREGADO EL PROVEEDOR STRONGVIKING', fecha: '10/10/2024', habilitado: true },
    { tipo: 'CUMPLEAÑOS', mensaje: 'FELIZ CUMPLEAÑOS TE DESEA EL EQUIPO DE VIVE FÁCIL!', fecha: '10/10/2024', habilitado: false },
    { tipo: 'COMPRA', mensaje: 'GRACIAS POR CONFIAR EN NOSOTROS', fecha: '10/10/2024', habilitado: true },
    { tipo: 'INGRESO COMPLETO', mensaje: 'HA SIDO AGREGADO EL PROVEEDOR STRONGVIKING', fecha: '10/10/2024', habilitado: true }
  ];

  notificacionesFiltradas: Notificacion[] = this.notificaciones;
  isEnabled = true;

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.get_notificacion().subscribe(resp => {
      this.arr_noti = Object(resp);
      this.arr_filtered_notificacion =  this.arr_noti;
      console.log("noti", this.arr_filtered_notificacion)
    });
  }

  borrar_notificacion(id:any) {
    this.pythonAnywhereService.delete_notificacion(id).subscribe(resp => {
      this.arr_noti = Object(resp);
      this.arr_filtered_notificacion =  this.arr_noti;
      console.log("noti delete", this.arr_filtered_notificacion)
    });
    
  }
  
  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
  }

  toggleFiltro() {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  filtrar(filtro: string) {
    this.filtroActual = filtro;
    if (filtro === 'todos') {
      this.notificacionesFiltradas = this.notificaciones;
    } else {
      this.notificacionesFiltradas = this.notificaciones.filter(n => n.tipo.toLowerCase() === filtro);
    }
    this.toggleFiltro(); 
  }

  habilitarDeshabilitar(index: number) {
    this.notificacionesFiltradas[index].habilitado = !this.notificacionesFiltradas[index].habilitado;
  }

  enviarNotificacion(index: number) {
    alert(`Notificación enviada: ${this.notificacionesFiltradas[index].mensaje}`);
  }

  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    const notificacionesArray =  this.arr_noti ? Object.values(this.arr_noti) : [];
    if (texto && texto.trim() !== '') {
      this.arr_filtered_notificacion= notificacionesArray?.filter((noti) => {
        return noti.titulo.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }
  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      const notificacionesArray =  this.arr_noti ? Object.values(this.arr_noti) : [];
      this.arr_filtered_notificacion= notificacionesArray.filter(a => {
        const fechaCreacion = new Date(a.fecha_creacion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    } else {
      this.arr_filtered_notificacion = this.arr_noti ? Object.values(this.arr_noti) : [];
    }
  }
}