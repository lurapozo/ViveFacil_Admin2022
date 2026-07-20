import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';
import { Servicio } from 'src/app/interfaces/servicio';
import { EstadoProceso, SolicitudAdmin } from 'src/app/interfaces/solicitud-admin';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: SolicitudAdmin[] = [];
  servicios: Servicio[] = [];

  readonly estados: { valor: EstadoProceso | ''; etiqueta: string }[] = [
    { valor: '', etiqueta: 'Todos los estados' },
    { valor: 'ABIERTA', etiqueta: 'Abierta' },
    { valor: 'POR PAGAR', etiqueta: 'Por pagar' },
    { valor: 'POR FINALIZAR', etiqueta: 'Por finalizar' },
    { valor: 'FINALIZADO', etiqueta: 'Finalizado' },
    { valor: 'CANCELADO', etiqueta: 'Cancelado' },
    { valor: 'EXPIRADA', etiqueta: 'Expirada' },
  ];

  filtroEstado = '';
  filtroTipoPago = '';
  filtroServicio = '';
  filtroTexto = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  currentPage = 1;
  pageNumbers: number[] = [];

  constructor(private pythonAnywhereService: PythonAnywhereService, private router: Router) {}

  ngOnInit(): void {
    this.pythonAnywhereService.obtener_servicios().subscribe((resp) => (this.servicios = resp));
    this.buscar();
  }

  buscar(page = 1): void {
    this.currentPage = page;
    this.pythonAnywhereService
      .obtener_solicitudes_admin(
        {
          estado: (this.filtroEstado || undefined) as EstadoProceso | undefined,
          tipoPago: this.filtroTipoPago || undefined,
          servicio: this.filtroServicio ? Number(this.filtroServicio) : undefined,
          texto: this.filtroTexto || undefined,
          fechaInicio: this.fechaInicio ? this.formatDate(this.fechaInicio) : undefined,
          fechaFin: this.fechaFin ? this.formatDate(this.fechaFin) : undefined,
        },
        page
      )
      .subscribe((resp) => {
        this.solicitudes = resp.results;
        this.pageNumbers = Array.from({ length: resp.total_pages }, (_, i) => i + 1);
      });
  }

  // ponytail: window de +-2 páginas alrededor de la actual + primera/última,
  // evita renderizar todos los botones de pageNumbers de una vez.
  get paginasVisibles(): (number | string)[] {
    const total = this.pageNumbers.length;
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

  irAPagina(n: number | string): void {
    if (typeof n === 'number') {
      this.buscar(n);
    }
  }

  previous(): void {
    if (this.currentPage > 1) {
      this.buscar(this.currentPage - 1);
    }
  }

  next(): void {
    if (this.currentPage < this.pageNumbers.length) {
      this.buscar(this.currentPage + 1);
    }
  }

  verDetalle(s: SolicitudAdmin): void {
    this.router.navigate(['/pagos/solicitudes', s.id]);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  exportCSV(): void {
    if (!this.solicitudes.length) {
      return;
    }
    const data = this.solicitudes.map((s) => ({
      id: s.id,
      solicitante: `${s.solicitante?.user_datos?.nombres ?? ''} ${s.solicitante?.user_datos?.apellidos ?? ''}`.trim(),
      solicitante_correo: s.solicitante?.user_datos?.user?.username ?? '',
      proveedor: s.proveedor ? `${s.proveedor.user_datos?.nombres ?? ''} ${s.proveedor.user_datos?.apellidos ?? ''}`.trim() : 'Sin asignar',
      proveedor_correo: s.proveedor?.user_datos?.user?.username ?? '',
      servicio: s.servicio?.nombre ?? '',
      tipo_pago: s.tipo_pago?.nombre ?? '',
      valor: s.valor != null ? s.valor.toFixed(2) : '',
      estado: s.estado_proceso,
      direccion: s.ubicacion?.direccion ?? '',
      fecha_creacion: s.fecha_creacion,
      fecha_expiracion: s.fecha_expiracion,
      descripcion: s.descripcion,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'solicitudes.csv');
  }
}
