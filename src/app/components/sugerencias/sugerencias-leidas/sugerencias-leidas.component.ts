import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Sugerencia } from 'src/app/interfaces/sugerencia';
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

  // ponytail: window de +-2 páginas alrededor de la actual + primera/última,
  // evita renderizar todos los botones de pageNumber de una vez.
  get paginasVisibles(): (number | string)[] {
    const total = this.pageNumber.length;
    const actual = this.currentPage;
    const delta = 2;
    const paginas: (number | string)[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= actual - delta && i <= actual + delta)) {
        paginas.push(i);
      } else if (paginas[paginas.length - 1] !== '...') {
        paginas.push('...');
      }
    }
    return paginas;
  }
  sugerencia_seleccionada: any;
  tituloToast = '';
  mensajeToast = '';
  isErrorToast = false;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechasFiltradas: any[] = [];

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.getSugerencias();
  }

  getSugerencias(){
    this.pythonAnywhereService.obtener_sugerenciasLeidas(1).subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_sugerencias = Object(resp).results;

      this.arr_filtered_sugerencias = this.arr_sugerencias;
      if (Object(resp).next != null) {
        this.condicionNext = true
      }

      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index)

      }

    });
  }

  ver(a: any) {
    this.sugerencia_seleccionada = a;
    console.log("su", this.sugerencia_seleccionada);
  }

  cambiarEstado(sugerencia: any) {
    const id = sugerencia.id
    const estado = sugerencia.estado
    const nuevoEstado = !estado;
    if (id) {
      this.pythonAnywhereService.editar_sugerencia_estado(nuevoEstado,id).subscribe(resp => { console.log(resp); });
    }
    this.pythonAnywhereService.obtener_sugerenciasNoLeidas(1).subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_sugerencias = Object(resp).results;

      this.arr_filtered_sugerencias = this.arr_sugerencias;  
    });
  }
  
  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_sugerenciasLeidas(this.currentPage).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias = this.arr_sugerencias;


    });
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_sugerenciasLeidas(this.currentPage).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias = this.arr_sugerencias;


    });
  }

  iteracion(event: any) {

    this.pythonAnywhereService.obtener_sugerenciasLeidas(event.target.value).subscribe(resp => {
      this.arr_sugerencias = Object(resp).results;
      this.arr_filtered_sugerencias = this.arr_sugerencias;
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

      this.arr_filtered_sugerencias = this.arr_sugerencias.filter(a => {
        const fechaCreacion = new Date(a.fecha_creacion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }


}

