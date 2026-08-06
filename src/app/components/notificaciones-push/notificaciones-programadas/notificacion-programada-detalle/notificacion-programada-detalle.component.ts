import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { BodyActualizarNotificacionProgramada, DirigidaA, Frecuencia, NotificacionProgramada } from 'src/app/interfaces/notificacion';
import { Profesion } from 'src/app/interfaces/profesion';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-notificacion-programada-detalle',
  templateUrl: './notificacion-programada-detalle.component.html',
  styleUrls: ['./notificacion-programada-detalle.component.css'],
})
export class NotificacionProgramadaDetalleComponent implements OnInit {
  notificacion: NotificacionProgramada | null = null;
  cargando = true;
  noEncontrado = false;
  editando = false;

  profesiones: Profesion[] = [];
  /** Las 48 marcas de media hora en las que corre el job. */
  slotsHora: string[] = Array.from({ length: 48 }, (_, i) =>
    `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
  /** weekday() de Python: 0=Lunes … 6=Domingo. */
  diasSemana = [
    { valor: '0', etiqueta: 'Lunes' },
    { valor: '1', etiqueta: 'Martes' },
    { valor: '2', etiqueta: 'Miércoles' },
    { valor: '3', etiqueta: 'Jueves' },
    { valor: '4', etiqueta: 'Viernes' },
    { valor: '5', etiqueta: 'Sábado' },
    { valor: '6', etiqueta: 'Domingo' },
  ];

  fotoFile: File | null = null;
  fotoPreview: string | null = null;

  isErrorToast = false;
  mensajeToast = '';
  tituloToast = '';

  formEdit = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    ruta: new FormControl(''),
    dirigida_a: new FormControl('ambas', [Validators.required]),
    profesiones: new FormControl<number[]>([]),
    frecuencia: new FormControl('unica', [Validators.required]),
    dias_semana: new FormControl<string[]>([]),
    hora: new FormControl('', [Validators.required]),
    fecha_iniciacion: new FormControl(''),
    fecha_expiracion: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pythonAnywhereService: PythonAnywhereService,
  ) {}

  ngOnInit(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    if (!pk) {
      this.noEncontrado = true;
      this.cargando = false;
      return;
    }
    this.pythonAnywhereService.obtener_profesiones().subscribe((resp: Profesion[]) => {
      this.profesiones = resp;
    });
    this.cargar(pk);
  }

  private cargar(pk: string) {
    this.pythonAnywhereService.obtener_notificacion_detalle(pk).subscribe({
      next: (notificacion) => {
        this.notificacion = notificacion;
        this.limpiarForm();
        this.cargando = false;
      },
      error: () => {
        this.noEncontrado = true;
        this.cargando = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/notificaciones/programadas']);
  }

  etiquetaDirigidaA(valor?: DirigidaA): string {
    return { ambas: 'Ambas apps', proveedor: 'Proveedores', solicitante: 'Solicitantes' }[valor || 'ambas'] || 'Ambas apps';
  }

  etiquetaFrecuencia(valor?: Frecuencia): string {
    return { unica: 'Una sola vez', diaria: 'Todos los días', semanal: 'Días de la semana' }[valor || 'unica'] || '—';
  }

  /** Nombres de los días marcados, para la vista de solo lectura. */
  etiquetaDias(csv?: string): string {
    const marcados = (csv || '').split(',').filter(d => d);
    if (!marcados.length) {
      return '—';
    }
    return this.diasSemana.filter(d => marcados.includes(d.valor)).map(d => d.etiqueta).join(', ');
  }

  limpiarForm() {
    this.formEdit.patchValue({
      nombre: this.notificacion?.nombre || '',
      titulo: this.notificacion?.titulo || '',
      descripcion: this.notificacion?.descripcion || '',
      ruta: this.notificacion?.ruta || '',
      dirigida_a: this.notificacion?.dirigida_a || 'ambas',
      profesiones: this.notificacion?.profesiones || [],
      frecuencia: this.notificacion?.frecuencia || 'unica',
      dias_semana: (this.notificacion?.dias_semana || '').split(',').filter(d => d),
      hora: (this.notificacion?.hora || '').slice(0, 5),
      fecha_iniciacion: this.notificacion?.fecha_iniciacion ? moment(this.notificacion.fecha_iniciacion).format('YYYY-MM-DD') : '',
      fecha_expiracion: this.notificacion?.fecha_expiracion ? moment(this.notificacion.fecha_expiracion).format('YYYY-MM-DD') : '',
    });
  }

  onFotoSeleccionada(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) { return; }
    if (this.fotoPreview) { URL.revokeObjectURL(this.fotoPreview); }
    this.fotoFile = file;
    this.fotoPreview = URL.createObjectURL(file);
  }

  quitarFotoSeleccionada() {
    if (this.fotoPreview) { URL.revokeObjectURL(this.fotoPreview); }
    this.fotoFile = null;
    this.fotoPreview = null;
  }

  isInvalidForm(campo: string): boolean {
    const control = this.formEdit.get(campo);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  diaSeleccionado(valor: string): boolean {
    return (this.formEdit.get('dias_semana')?.value || []).includes(valor);
  }

  toggleDia(valor: string, marcado: boolean) {
    const actuales: string[] = this.formEdit.get('dias_semana')?.value || [];
    const siguientes = marcado ? [...actuales, valor] : actuales.filter(d => d !== valor);
    this.formEdit.get('dias_semana')?.setValue(siguientes);
  }

  onActualizar() {
    if (!this.notificacion || this.formEdit.invalid) {
      this.formEdit.markAllAsTouched();
      return;
    }
    const v = this.formEdit.value;
    const dirigida_a = (v.dirigida_a as DirigidaA) || 'ambas';
    const frecuencia = (v.frecuencia as Frecuencia) || 'unica';
    const body: BodyActualizarNotificacionProgramada = {
      id: this.notificacion.id,
      nombre: v.nombre ?? '',
      titulo: v.titulo ?? '',
      descripcion: v.descripcion ?? '',
      ruta: v.ruta || '',
      dirigida_a,
      // El filtro por profesión solo tiene sentido para proveedores.
      profesiones: dirigida_a === 'proveedor' ? (v.profesiones ?? []) : [],
      frecuencia,
      // Los días solo cuentan en la frecuencia semanal.
      dias_semana: frecuencia === 'semanal' ? (v.dias_semana ?? []).join(',') : '',
      hora: v.hora ?? '',
      // El input type="date" entrega "YYYY-MM-DD"; el backend espera un
      // DateTimeField completo (formato ISO con hora), si no rechaza el request.
      fecha_iniciacion: v.fecha_iniciacion ? moment(v.fecha_iniciacion).startOf('day').format() : '',
      fecha_expiracion: v.fecha_expiracion ? moment(v.fecha_expiracion).endOf('day').format() : '',
      estado: this.notificacion.estado,
    };
    if (this.fotoFile) { body.imagen = this.fotoFile; }

    this.pythonAnywhereService.put_notificacion_auto(body, String(this.notificacion.id)).subscribe({
      next: () => {
        this.mostrarToastInfo('Notificación actualizada', 'Se guardaron los cambios correctamente', false);
        this.editando = false;
        this.quitarFotoSeleccionada();
        this.recargar();
      },
      error: () => this.mostrarToastInfo('No se pudo actualizar', 'Error de conexión.', true),
    });
  }

  cambiarEstado(activar: boolean) {
    if (!this.notificacion) { return; }
    this.pythonAnywhereService.cambio_notificacion_estado(String(this.notificacion.id), activar).subscribe({
      next: () => {
        this.mostrarToastInfo(
          activar ? 'Notificación habilitada' : 'Notificación deshabilitada',
          'Se actualizó el estado correctamente', false,
        );
        this.recargar();
      },
      error: () => this.mostrarToastInfo('No se pudo cambiar el estado', 'Error de conexión.', true),
    });
  }

  enviarAhora() {
    if (!this.notificacion) { return; }
    this.pythonAnywhereService.enviar_noti_auto(String(this.notificacion.id), this.notificacion.titulo).subscribe({
      next: () => {
        this.mostrarToastInfo('Notificación enviada', 'Se envió correctamente', false);
        this.recargar();
      },
      error: () => this.mostrarToastInfo('No se pudo enviar', 'Error de conexión.', true),
    });
  }

  eliminar() {
    if (!this.notificacion) { return; }
    this.pythonAnywhereService.delete_notificacion(this.notificacion.id).subscribe({
      next: () => {
        this.mostrarToastInfo('Notificación eliminada', 'Se eliminó correctamente', false);
        this.volver();
      },
      error: () => this.mostrarToastInfo('No se pudo eliminar', 'Error de conexión.', true),
    });
  }

  private recargar() {
    const pk = this.notificacion?.id;
    if (!pk) { return; }
    this.cargar(String(pk));
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
