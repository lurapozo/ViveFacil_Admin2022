import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentEfectivo, PaymentPaginacion } from 'src/app/interfaces/payment';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-efectivo',
  templateUrl: './efectivo.component.html',
  styleUrls: ['./efectivo.component.css']
})
export class EfectivoComponent {
  arr_efectivo!: PaymentEfectivo[]  | undefined;
  arr_filtered_efectivo!: PaymentEfectivo[]  | undefined;
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  efectivo_seleccionada:  PaymentEfectivo  | undefined;
  mensajeAlerta: string = '';
totalEfectivo:any
total:any


  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_pagos_efectivoP().subscribe((resp) => {
    this.arr_efectivo = resp.results
    this.arr_filtered_efectivo =  this.arr_efectivo
    console.log(this.arr_filtered_efectivo)
    if (resp.next != null) {
      this.condicionNext = true
    }
    for (let index = 1; index <= resp.total_pages; index++) {
      this.pageNumber.push(index)

    }
  
    });
this.pythonAnywhereService.valor_total_efectivo().subscribe(resp=>{
  this.totalEfectivo=Object(resp).valor__sum
  console.log(resp)
})
this.pythonAnywhereService.valor_total().subscribe(resp=>{
  this.total=resp
  console.log(resp)
})
   
}
search(evento: any) {
  const texto = evento.target.value;
  console.log('Escribe en el buscador: ', texto)
  this.arr_filtered_efectivo = this.arr_efectivo;
  if (texto && texto.trim() !== '') {
    this.arr_filtered_efectivo = this.arr_filtered_efectivo?.filter((solicitud) => {
      return solicitud.proveedor.toLowerCase().includes(texto.toLowerCase())
    });
  }}


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

}
