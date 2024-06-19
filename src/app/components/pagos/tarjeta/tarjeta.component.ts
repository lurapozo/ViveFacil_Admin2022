import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { PaymentTarjeta } from 'src/app/interfaces/payment';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent {
  arr_tarjeta!: PaymentTarjeta[]  | undefined;
  arr_filtered_tarjeta!: PaymentTarjeta[]  | undefined;
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  tarjeta_seleccionada:  PaymentTarjeta  | undefined;
  mensajeAlerta: string = '';
total:any
totalTarjeta:any
totalBanco:any
totalSistema:any
totalPayment:any
mensajeToast = "";
tituloToast = "";
isErrorToast = false;
constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
  this.pythonAnywhereService.obtener_pagos_tarjetaP().subscribe(resp => {
  this.arr_tarjeta = resp.results
  this.arr_filtered_tarjeta =  this.arr_tarjeta
  console.log(this.arr_filtered_tarjeta)
  if (resp.next != null) {
    this.condicionNext = true
  }
  for (let index = 1; index <= resp.total_pages; index++) {
    this.pageNumber.push(index)

  }

  });
  this.pythonAnywhereService.valor_total_tarjeta().subscribe(resp=>{
  this.totalTarjeta=Object(resp).valor__sum.toFixed(2)
  console.log(resp)
  })
  this.pythonAnywhereService.valor_total().subscribe((resp: any)=>{
  this.total=parseFloat(resp).toFixed(2)
  console.log(resp)
  })
  this.pythonAnywhereService.valor_total_pay_tarjeta().subscribe(resp=>{
    this.totalPayment=Object(resp).cargo_paymentez__sum.toFixed(2)

    console.log(resp)
    })

    this.pythonAnywhereService.valor_total_banc_tarjeta().subscribe(resp=>{
      this.totalBanco=resp.cargo_banco__sum.toFixed(2)
      console.log(resp)
      })

      this.pythonAnywhereService.valor_total_sis_tarjeta().subscribe(resp=>{
        this.totalSistema=Object(resp).argo_sistema__sum

        console.log(resp)
        })
  }


  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_pagos_tarjetaP(this.currentPage).subscribe(resp => {
      this.arr_tarjeta = resp.results
    this.arr_filtered_tarjeta =  this.arr_tarjeta
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_pagos_tarjetaP(this.currentPage).subscribe(resp => {
      this.arr_tarjeta = resp.results;
      this.arr_filtered_tarjeta = this.arr_tarjeta;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_pagos_tarjetaP(event.target.value).subscribe(resp => {
      this.arr_tarjeta = resp.results;
      this.arr_filtered_tarjeta = this.arr_tarjeta;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }

  cambiarEstado(event:any){
    if(this.tarjeta_seleccionada){
      const id = this.tarjeta_seleccionada.id
      let estado = event.srcElement.checked
      this.pythonAnywhereService.cambio_pago_proveedor_estado(id,estado).subscribe(resp=>{
        this.pythonAnywhereService.obtener_pagos_tarjetaP().subscribe(resp => {
          this.arr_tarjeta = resp.results
          this.arr_filtered_tarjeta =  this.arr_tarjeta
          console.log(this.arr_filtered_tarjeta)
          if (resp.next != null) {
            this.condicionNext = true
          }
          for (let index = 1; index <= resp.total_pages; index++) {
            this.pageNumber.push(index)
        
          }
        
          });
          
        this.mostrarToastInfo('Estado del Pago', 'se pago con exito', false);

      })
    }


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

  filterByUser(event: any) {
    const user = event.target.value;
    console.log('Filtrando por usuario: ', user);
    this.arr_filtered_tarjeta = this.arr_tarjeta?.filter(tarjeta => tarjeta.user?.username.toLowerCase().includes(user.toLowerCase())) ?? [];
  }

  filterByDate(event: any) {
    const date = event.target.value;
    console.log('Filtrando por fecha: ', date);
    this.arr_filtered_tarjeta = this.arr_tarjeta?.filter(tarjeta => tarjeta.fecha_creacion.startsWith(date)) ?? [];
  }
  searchProveedor(event: any) {
    const texto = event.target.value;
    console.log('Buscar proveedor: ', texto);
    this.arr_filtered_tarjeta = this.arr_tarjeta;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_tarjeta = this.arr_filtered_tarjeta?.filter((solicitud) => {
        return solicitud.prov_correo.toLowerCase().includes(texto.toLowerCase());
      });
    }
  }

}
