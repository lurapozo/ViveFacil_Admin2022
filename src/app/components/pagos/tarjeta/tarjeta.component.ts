import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { PaymentTarjeta } from 'src/app/interfaces/payment';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent {
  fechaInicio: Date | null = null; 
  fechaFin: Date | null = null; 
  fechasFiltradas: any[] = [];
  showHeader = true;

  arr_tarjeta!: PaymentTarjeta[] | [];
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
  this.pythonAnywhereService.valor_total_tarjeta().subscribe(resp => {
    const valor = Number(resp);
    if (resp === null || isNaN(valor)) {
      this.totalTarjeta  = '00.00';
      console.log("Es null o 0")
    } else {
      this.totalTarjeta = Object(resp).valor__sum.toFixed(2)
      console.log(resp)
    }
  })
  this.pythonAnywhereService.valor_total().subscribe((resp: any) => {
    if (resp === null || isNaN(resp)) {
      this.total = '00.00';
      console.log("Es null o 0")
    } else {
      this.total = parseFloat(resp).toFixed(2);
    }
    console.log(resp);
  })
  this.pythonAnywhereService.valor_total_pay_tarjeta().subscribe(resp => {
    const valor = Number(resp);
    if (resp === null || isNaN(valor)) {
      this.totalPayment = '00.00';
      console.log("Es null o 0")
    } else {
      this.totalPayment = Object(resp).cargo_paymentez__sum.toFixed(2)
      console.log(resp)
    }
  })

  this.pythonAnywhereService.valor_total_banc_tarjeta().subscribe(resp => {
    if (resp === null || isNaN(resp)) {
      this.totalBanco = '00.00';
      console.log("Es null o 0")
    } else {
    this.totalBanco = resp.cargo_banco__sum.toFixed(2)
    console.log("valor")
    }
    console.log(resp)
  })

  this.pythonAnywhereService.valor_total_sis_tarjeta().subscribe(resp => {
    this.totalSistema = Object(resp).argo_sistema__sum

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
        return solicitud.solicitud?.proveedor.user_datos.user.username.toLowerCase().includes(texto.toLowerCase());
      });
    }
  }

  exportCSV() {
    if (this.arr_filtered_tarjeta) {
      const data = this.arr_filtered_tarjeta.map(tarjeta => ({
        id: tarjeta.id,
        usuario: tarjeta.usuario ?? '',
        solicitante_correo: tarjeta.user?.username ?? '',
        tarjeta: 'SI',
        promocion: tarjeta.promocion?.porcentaje ?? '',
        valor: tarjeta.valor.toFixed(2),
        descripcion: tarjeta.descripcion,
        impuesto: tarjeta.impuesto.toFixed(2),
        referencia: tarjeta.referencia,
        fecha: this.formatDate(tarjeta.fecha_creacion),
        carrier_id: tarjeta.carrier_id ?? 'N/A',
        carrier_code: tarjeta.carrier_code ?? 'N/A',
        concepto: tarjeta.concepto,
        pago_proveedor: tarjeta.pago_proveedor,
        cargo_paymentez: tarjeta.cargo_paymentez.toFixed(2),
        cargo_banco: tarjeta.cargo_banco.toFixed(2),
        cargo_sistema: tarjeta.cargo_sistema.toFixed(2),
        proveedor: tarjeta.solicitud?.proveedor.user_datos.nombres + ' ' + tarjeta.solicitud?.proveedor.user_datos.apellidos,
        proveedor_correo: tarjeta.solicitud?.proveedor.user_datos.user.username,

      }));

      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'pagos_tarjeta.csv');
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

      this.arr_filtered_tarjeta= this.arr_tarjeta.filter(a => {
        const fechaCreacion = new Date(a.fecha_creacion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }

}
