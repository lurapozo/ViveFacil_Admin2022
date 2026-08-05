import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { BodyActualizarNotificacionAnuncio, DirigidaA, NotificacionAnuncio } from 'src/app/interfaces/notificacion';
import { Profesion } from 'src/app/interfaces/profesion';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-notificacion-masiva-detalle',
  templateUrl: './notificacion-masiva-detalle.component.html',
  styleUrls: ['./notificacion-masiva-detalle.component.css'],
})
export class NotificacionMasivaDetalleComponent implements OnInit {
  notificacion: NotificacionAnuncio | null = null;
  cargando = true;
  noEncontrado = false;
  editando = false;

  profesiones: Profesion[] = [];
  /** El job corre en :00 y :30, así que solo esos slots son entregables. */
  slotsHora: string[] = [];

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
    programar: new FormControl(false),
    fecha_programada: new FormControl(''),
    hora_programada: new FormControl(''),
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
    this.pythonAnywhereService.obtener_notificacion_masiva_detalle(pk).subscribe({
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
    this.router.navigate(['/notificaciones/masivas']);
  }

  etiquetaDirigidaA(valor?: DirigidaA): string {
    return { ambas: 'Ambas apps', proveedor: 'Proveedores', solicitante: 'Solicitantes' }[valor || 'ambas'] || 'Ambas apps';
  }

  limpiarForm() {
    const programada = this.notificacion?.programada_para ? moment(this.notificacion.programada_para) : null;
    this.formEdit.patchValue({
      nombre: this.notificacion?.nombre || '',
      titulo: this.notificacion?.titulo || '',
      descripcion: this.notificacion?.descripcion || '',
      ruta: this.notificacion?.ruta || '',
      dirigida_a: this.notificacion?.dirigida_a || 'ambas',
      profesiones: this.notificacion?.profesiones || [],
      programar: !!programada,
      fecha_programada: programada ? programada.format('YYYY-MM-DD') : '',
      hora_programada: programada ? programada.format('HH:mm') : '',
    });
    this.recalcularSlots();
  }

  /** Para hoy se descartan los pasados y los que caen en menos de 2 minutos
   *  (guardar a las 10:59:50 para las 11:00 no llega a tiempo). */
  recalcularSlots() {
    const fecha = this.formEdit.get('fecha_programada')?.value;
    const limite = moment().add(2, 'minutes');
    const esHoy = fecha === moment().format('YYYY-MM-DD');
    const slots: string[] = [];
    for (let minutos = 0; minutos < 24 * 60; minutos += 30) {
      const hh = String(Math.floor(minutos / 60)).padStart(2, '0');
      const mm = String(minutos % 60).padStart(2, '0');
      if (esHoy && moment(`${fecha} ${hh}:${mm}`, 'YYYY-MM-DD HH:mm').isBefore(limite)) {
        continue;
      }
      slots.push(`${hh}:${mm}`);
    }
    this.slotsHora = slots;
    const elegida = this.formEdit.get('hora_programada')?.value;
    if (elegida && !slots.includes(elegida)) {
      this.formEdit.get('hora_programada')?.setValue('');
    }
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

  onActualizar() {
    if (!this.notificacion || this.formEdit.invalid) {
      this.formEdit.markAllAsTouched();
      return;
    }
    const v = this.formEdit.value;
    const dirigida_a = (v.dirigida_a as DirigidaA) || 'ambas';
    const body: BodyActualizarNotificacionAnuncio = {
      id: this.notificacion.id,
      nombre: v.nombre ?? '',
      titulo: v.titulo ?? '',
      descripcion: v.descripcion ?? '',
      ruta: v.ruta || '',
      dirigida_a,
      // El filtro por profesión solo tiene sentido para proveedores.
      profesiones: dirigida_a === 'proveedor' ? (v.profesiones ?? []) : [],
      programada_para: v.programar && v.fecha_programada && v.hora_programada
        ? `${v.fecha_programada}T${v.hora_programada}:00` : '',
      estado: this.notificacion.estado,
    };
    if (this.fotoFile) { body.imagen = this.fotoFile; }

    this.pythonAnywhereService.put_notificacion_masiva(body, String(this.notificacion.id)).subscribe({
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
    this.pythonAnywhereService.cambio_notificacion_masiva_estado(String(this.notificacion.id), activar).subscribe({
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
    this.pythonAnywhereService.enviar_noti_masi(String(this.notificacion.id), this.notificacion.titulo).subscribe({
      next: () => {
        this.mostrarToastInfo('Notificación enviada', 'Se envió correctamente a sus destinatarios', false);
        this.recargar();
      },
      error: () => this.mostrarToastInfo('No se pudo enviar', 'Error de conexión.', true),
    });
  }

  eliminar() {
    if (!this.notificacion) { return; }
    this.pythonAnywhereService.delete_notificacion_masiva(this.notificacion.id).subscribe({
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
