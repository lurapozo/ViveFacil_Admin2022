import { Component } from '@angular/core';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-historial-puntos',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialPuntosComponent {
  movimientos: any[] = [];
  total = 0;
  currentPage = 1;
  pageNumber: number[] = [];
  filtroUser = '';

  emailAgregar = '';
  montoAgregar: number | null = null;
  referenciaAgregar = '';

  isErrorToast = false;
  mensajeToast = '';
  tituloToast = '';

  constructor(private pythonAnywhereService: PythonAnywhereService) {
    this.cargar();
  }

  // ponytail: mismo window de paginación que rechazados.component
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

  cargar(page = 1) {
    this.currentPage = page;
    this.pythonAnywhereService.obtener_movimientos_puntos(page, this.filtroUser).subscribe(resp => {
      this.total = Object(resp).total_objects;
      this.movimientos = Object(resp).results || [];
      this.pageNumber = [];
      for (let i = 1; i <= Object(resp).total_pages; i++) {
        this.pageNumber.push(i);
      }
    });
  }

  buscar(evento: any) {
    this.filtroUser = (evento.target.value || '').trim();
    this.cargar(1);
  }

  irPagina(p: number | string) {
    if (typeof p === 'number') {
      this.cargar(p);
    }
  }

  // Color del monto: verde si gana, rojo si gasta.
  claseMonto(monto: number): string {
    return monto >= 0 ? 'monto-positivo' : 'monto-negativo';
  }

  limpiarFormAgregar() {
    this.emailAgregar = '';
    this.montoAgregar = null;
    this.referenciaAgregar = '';
  }

  agregarPuntos() {
    if (!this.emailAgregar || !this.montoAgregar) {
      return;
    }
    this.pythonAnywhereService.otorgar_puntos_manual(this.emailAgregar, this.montoAgregar, this.referenciaAgregar).subscribe({
      next: (resp: any) => {
        if (!resp?.success) {
          this.mostrarToastInfo('No se pudo aplicar', resp?.error || 'Revisa los datos.', true);
          return;
        }
        this.mostrarToastInfo('Puntos actualizados', 'Se aplicó el ajuste correctamente', false);
        this.limpiarFormAgregar();
        this.cargar(this.currentPage);
      },
      error: (err) => {
        this.mostrarToastInfo('No se pudo aplicar', err?.error?.error || 'Error de conexión.', true);
      },
    });
  }

  mostrarToastInfo(titulo: string, mensaje: string, isErrorToast: boolean) {
    this.isErrorToast = isErrorToast;
    this.tituloToast = titulo;
    this.mensajeToast = mensaje;
    const toast = document.getElementById('liveToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 7000);
    }
  }
}
