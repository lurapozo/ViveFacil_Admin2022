import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Sugerencia } from 'src/app/interfaces/sugerencia';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-sugerencias-no-leidas',
  templateUrl: './sugerencias-no-leidas.component.html',
  styleUrls: ['./sugerencias-no-leidas.component.css']
})
export class SugerenciasNoLeidasComponent {
  total = 0
  arr_sugerencias!: any[];
  arr_filtered_sugerencias!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  sugerencia_seleccionada: any

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_sugerenciasNoLeidas().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_sugerencias = Object(resp).results;

      this.arr_filtered_sugerencias= this.arr_sugerencias;
      if ( Object(resp).next != null) {
        this.condicionNext = true
      }
   
      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index)

      }

    });
  }


  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_sugerenciasNoLeidas(this.currentPage).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias= this.arr_sugerencias;
    

    });
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_sugerenciasNoLeidas(this.currentPage).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias= this.arr_sugerencias;
    

    });
  }

  iteracion(event: any) {
 
    this.pythonAnywhereService.obtener_sugerenciasNoLeidas(event.target.value).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias= this.arr_sugerencias;
      this.currentPage = Object(resp).current_page_number
      if (Object(resp).next != null) {
        this.condicionNext = true
      }

    })
    };

    ver(event:any){
    this.sugerencia_seleccionada=event
    let sugerencia :Sugerencia = {
      id: 18,
      usuario: this.sugerencia_seleccionada.usuario,
      correo: this.sugerencia_seleccionada.correo,
      descripcion: this.sugerencia_seleccionada.descripcion,
      foto: this.sugerencia_seleccionada.foto,
      estado: true,
      fecha_creacion: this.sugerencia_seleccionada.fecha_creacion
    }
    this.pythonAnywhereService.editar_sugerencia_estado( sugerencia,this.sugerencia_seleccionada.id).subscribe(resp=>{
      console.log(resp)
    })

    }
}
