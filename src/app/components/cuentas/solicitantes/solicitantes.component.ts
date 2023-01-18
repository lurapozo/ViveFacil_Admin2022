import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ignoreElements } from 'rxjs';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-solicitantes',
  templateUrl: './solicitantes.component.html',
  styleUrls: ['./solicitantes.component.css']
})
export class SolicitantesComponent {

  total = 0
  arr_soli!: any[];
  arr_filtered_soli!: any[];
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  generos = ['Masculino', 'Femenino', 'Otro'];
  roles = ['Hangaroa', 'Secretario', 'administrador de publicidades', 'enfermito'];
  imagenCrear: any
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  soli_seleccionada: any
  fileImagenActualizar: File = {} as File
  imagenActualizar: any
  fileImagenCrear: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  habilitar = ''






  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_solicitantes().subscribe(resp => {
      this.total = resp.total_objects
      this.arr_soli = resp.results;

      this.arr_filtered_soli = this.arr_soli;
      if (resp.next != null) {
        this.condicionNext = true
      }
      console.log( resp.total_pages)
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
        return solicitud.user_datos.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }}
  cambiarEstado(event: any) {
    const id = this.soli_seleccionada.id
    let estado = event.srcElement.checked
    console.log(estado,id)

    this.pythonAnywhereService.cambio_solicitante_estado(estado,id).subscribe(resp=>{
      console.log(resp)
    })
  }
  ver(event: any) {
    this.soli_seleccionada = event
    this.activoCond = this.soli_seleccionada.estado
    if (this.activoCond) {
      this.activo = 'Activo'

    } else {
      this.activo = 'Inactivo'
    }


  }

  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_solicitantes(this.currentPage).subscribe(resp => {
      this.arr_soli = resp.results;
      this.arr_filtered_soli = this.arr_soli;
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_solicitantes(this.currentPage).subscribe(resp => {
      this.arr_soli = resp.results;
      this.arr_filtered_soli = this.arr_soli;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_solicitantes(event.target.value).subscribe(resp => {
      this.arr_soli = resp.results;
      this.arr_filtered_soli = this.arr_soli;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }

}