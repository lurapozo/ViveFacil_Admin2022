import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentEfectivo, PaymentPaginacion } from 'src/app/interfaces/payment';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-efectivo',
  templateUrl: './efectivo.component.html',
  styleUrls: ['./efectivo.component.css']
})
export class EfectivoComponent {
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechasFiltradas: any[] = [];
  showHeader = true;
  showHeaderC = true;

  arr_efectivo!: PaymentEfectivo[] | [];
  arr_filtered_efectivo!: PaymentEfectivo[] | [];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  efectivo_seleccionada:  any;
  mensajeAlerta: string = '';
  totalEfectivo:any
  total:any


  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_pagos_efectivoP().subscribe((resp) => {
    this.arr_efectivo = resp.results
    this.arr_filtered_efectivo =  this.arr_efectivo
    console.log(this.arr_filtered_efectivo, "arr_filtered_efectivo")
    console.log("efe",this.efectivo_seleccionada);
    if (resp.next != null) {
      this.condicionNext = true
    }
    for (let index = 1; index <= resp.total_pages; index++) {
      this.pageNumber.push(index)

    }
  
    });
    this.pythonAnywhereService.valor_total_efectivo().subscribe(resp => {
      const valor = Number(Object(resp).valor__sum);
      if (valor=== null || isNaN(valor)) {
        this.totalEfectivo = '00.00';
        console.log("Efectivo null o 0")
      } else {
        this.totalEfectivo = valor.toFixed(2)
      }
    })
    this.pythonAnywhereService.valor_total().subscribe((resp: any) => {
      const valor = parseFloat(Object(resp).total);
      if (valor === null || isNaN(valor)) {
        this.total = '00.00';
        console.log("Valor total es 0")
      } else {
        this.total = valor.toFixed(2);
      }
    })
   
}

  efect_sele(a: any){
    this.efectivo_seleccionada =  a;
    console.log(a)
  }
  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_pagos_efectivoP(this.currentPage).subscribe(resp => {
      this.arr_efectivo = resp.results
    this.arr_filtered_efectivo =  this.arr_efectivo
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_pagos_efectivoP(this.currentPage).subscribe(resp => {
      this.arr_efectivo = resp.results;
      this.arr_filtered_efectivo = this.arr_efectivo;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_pagos_efectivoP(event.target.value).subscribe(resp => {
      this.arr_efectivo = resp.results;
      this.arr_filtered_efectivo = this.arr_efectivo;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }


  filterByUser(user: any) {
    let usuario = user.target.value
    console.log('Filtrando por usuario: ', usuario);
    this.arr_filtered_efectivo = this.arr_efectivo?.filter(efectivo => efectivo.user?.username.toLowerCase().includes(usuario.toLowerCase()));
  }

  searchProveedor(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto);
    this.arr_filtered_efectivo = this.arr_efectivo;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_efectivo = this.arr_filtered_efectivo?.filter((solicitud) => {
        return solicitud.solicitud?.proveedor.user_datos.user.username.toLowerCase().includes(texto.toLowerCase());
      });
    }
  }

  filterByDate(event: any) {
    const date = event.target.value;
    console.log('Filtrando por fecha: ', date);
    this.arr_filtered_efectivo = this.arr_efectivo?.filter(efectivo => efectivo.fecha_creacion.startsWith(date)) ?? [];
  }

  exportCSV() {
    if (this.arr_filtered_efectivo) {
      const data = this.arr_filtered_efectivo.map(tarjeta => ({
        id: tarjeta.id,
        usuario: tarjeta.usuario ?? '',
        solicitante_correo: tarjeta.user?.username ?? '',
        tarjeta: 'NO',
        promocion: tarjeta.promocion?.porcentaje ?? '',
        valor: tarjeta.valor.toFixed(2),
        descripcion: tarjeta.descripcion,
        referencia: tarjeta.referencia,
        fecha: this.formatDate(tarjeta.fecha_creacion),
        concepto: tarjeta.concepto,
        proveedor: tarjeta.solicitud?.proveedor.user_datos.nombres + ' ' + tarjeta.solicitud?.proveedor.user_datos.apellidos,
        proveedor_correo: tarjeta.solicitud?.proveedor.user_datos.user.username,

      }));

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'pagos_efectivo.csv');
    } else {
      console.log('No hay datos para exportar');
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
    const day = ('0' + date.getDate()).slice(-2); // Adding leading zero if needed
    return `${year}-${month}-${day}`;
  }

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      this.arr_filtered_efectivo = this.arr_efectivo.filter(a => {
        const fechaCreacion = new Date(a.fecha_creacion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }

}
