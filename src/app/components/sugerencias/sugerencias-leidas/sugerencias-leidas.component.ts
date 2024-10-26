import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-sugerencias-leidas',
  templateUrl: './sugerencias-leidas.component.html',
  styleUrls: ['./sugerencias-leidas.component.css']
})
export class SugerenciasLeidasComponent {
  total = 0
  arr_sugerencias!: any[];
  arr_filtered_sugerencias!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  sugerencia_seleccionada: any;

  fechaInicio: Date | null = null; 
  fechaFin: Date | null = null; 
  fechasFiltradas: any[] = [];

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_sugerenciasLeidas(1).subscribe(resp => {
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
    this.pythonAnywhereService.obtener_sugerenciasLeidas(this.currentPage).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias= this.arr_sugerencias;
    

    });
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_sugerenciasLeidas(this.currentPage).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias= this.arr_sugerencias;
    

    });
  }

  iteracion(event: any) {
 
    this.pythonAnywhereService.obtener_sugerenciasLeidas(event.target.value).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias= this.arr_sugerencias;
      this.currentPage = Object(resp).current_page_number
      if (Object(resp).next != null) {
        this.condicionNext = true
      }

    })
    };

    
  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_sugerencias = this.sugerencia_seleccionada;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_sugerencias = this.arr_filtered_sugerencias?.filter((solicitud) => {
        return solicitud.user_datos.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      this.arr_filtered_sugerencias= this.arr_sugerencias.filter(a => {
        const fechaCreacion = new Date(a.fecha_creacion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }

}

