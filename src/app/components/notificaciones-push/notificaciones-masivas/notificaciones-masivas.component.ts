import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { BodyCrearNotificacionAnuncio, DirigidaA, NotificacionAnuncio } from 'src/app/interfaces/notificacion';
import { Profesion } from 'src/app/interfaces/profesion';
import * as moment from 'moment';

// ponytail: bootstrap.bundle.min.js se carga como script global (angular.json),
// no como módulo — así se referencia sin reimportarlo.
declare const bootstrap: any;

@Component({
  selector: 'app-notificaciones-masivas',
  templateUrl: './notificaciones-masivas.component.html',
  styleUrls: ['./notificaciones-masivas.component.css']
})
export class NotificacionesMasivasComponent {
  fileImagenNotificacion: File = {} as File;
  imagenNotificacion: string | undefined;
  existImageNotificacion = false;
  mensajeAlerta: string = '';
  /** Notificación pendiente de confirmar en #modalEliminarNotificacion. */
  notificacionAEliminar: NotificacionAnuncio | null = null;
  tituloToast = '';
  mensajeToast = '';
  isErrorToast = false;

  showHeader = true;
  showHeaderC = false;
  mostrarFiltro: boolean = false;
  filtroActual: string = 'todos';
  filtrosDisponibles: string[] = [];

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  arr_noti?: NotificacionAnuncio[] | undefined;
  arr_filtered_notificacion!: NotificacionAnuncio[] | undefined;

  /** Catálogo de Profesion para el ng-select múltiple. */
  profesiones: Profesion[] = [];
  /** Horas ofrecibles, alineadas al job (:00 y :30). */
  slotsHora: string[] = [];

  crearNotificacionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    ruta: new FormControl(''),
    imagen: new FormControl(this.fileImagenNotificacion),
    dirigida_a: new FormControl('ambas', [Validators.required]),
    profesiones: new FormControl<number[]>([]),
    // Sin programar = se envía al crear.
    programar: new FormControl(false),
    fecha_programada: new FormControl(''),
    hora_programada: new FormControl(''),
    estado: new FormControl(true),
  }, []);

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    const imagenCrearControl = this.crearNotificacionForm.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearNotificacionForm.get('imagen') as AbstractControl));

    this.get_profesiones();
    this.get_notificaciones();
  }

  /** Antes cargaba SERVICIOS en un select llamado "tipo de proveedores". La
   *  relación real de un proveedor es con Profesion (api_profesion_proveedor). */
  get_profesiones() {
    this.pythonAnywhereService.obtener_profesiones().subscribe((resp: Profesion[]) => {
      this.profesiones = resp;
    });
  }

  /** El job corre en :00 y :30, así que solo esos slots son entregables. Para
   *  hoy se descartan los pasados y los que caen en menos de 2 minutos (guardar
   *  a las 10:59:50 para las 11:00 no llega a tiempo). */
  recalcularSlots(form: FormGroup) {
    const fecha = form.get('fecha_programada')?.value;
    const limite = moment().add(2, 'minutes');
    const esHoy = fecha === this.getCurrentDate();
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
    const elegida = form.get('hora_programada')?.value;
    if (elegida && !slots.includes(elegida)) {
      form.get('hora_programada')?.setValue('');
    }
  }

  /** Junta fecha + slot en el ISO que espera el backend, o '' si no se programó. */
  private programadaPara(form: FormGroup): string {
    if (!form.get('programar')?.value) {
      return '';
    }
    const fecha = form.get('fecha_programada')?.value;
    const hora = form.get('hora_programada')?.value;
    return fecha && hora ? `${fecha}T${hora}:00` : '';
  }

  get_notificaciones() {
    this.pythonAnywhereService.get_notificacion_masiva().subscribe(resp => {
      this.arr_noti = Object(resp);
      this.arr_filtered_notificacion = this.arr_noti;
      this.generarFiltros();
    });
  }

  crear_noti() {
    this.showHeader = false;
    this.showHeaderC = true;
    this.recalcularSlots(this.crearNotificacionForm);
  }

  establecerMensaje(mensaje: string) {
    this.mensajeAlerta = mensaje;
  }

  etiquetaDirigidaA(valor: DirigidaA): string {
    return { ambas: 'Ambas apps', proveedor: 'Proveedores', solicitante: 'Solicitantes' }[valor] || 'Ambas apps';
  }

  borrar_notificacion(id: any) {
    this.pythonAnywhereService.delete_notificacion_masiva(id).subscribe(() => {
      this.get_notificaciones();
    });
  }

  // La fila entera es clickable (routerLink al detalle) y su stopPropagation
  // impide que el data-bs-toggle delegado por Bootstrap (escucha en
  // document) reciba el click, así que el modal se abre a mano — mismo
  // patrón que proveedores.component.ts::prepararEliminarProveedor.
  prepararEliminarNotificacion(notificacion: NotificacionAnuncio, event: Event) {
    event.stopPropagation();
    this.notificacionAEliminar = notificacion;
    const modalEl = document.getElementById('modalEliminarNotificacion');
    if (modalEl) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  enviarNotificacionmasiva(notificacion: NotificacionAnuncio) {
    this.pythonAnywhereService.enviar_noti_masi(String(notificacion.id), notificacion.titulo).subscribe(() => {
      this.get_notificaciones();
      this.mostrarToastInfo('Notificación enviada', 'Se envió correctamente a sus destinatarios', false);
    });
  }

  toggleFiltro() {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  generarFiltros() {
    const titulosUnicos = new Set(this.arr_filtered_notificacion?.map(n => n.titulo));
    this.filtrosDisponibles = ['todos', ...Array.from(titulosUnicos)];
  }

  filtrar(filtro: string) {
    this.filtroActual = filtro;
    if (filtro === 'todos') {
      this.arr_filtered_notificacion = this.arr_noti;
    } else {
      this.arr_filtered_notificacion = this.arr_noti?.filter(n => n.titulo === filtro);
    }
    this.toggleFiltro();
  }

  createImageValidator(controlImage: AbstractControl) {
    return () => {
      const file = controlImage.value as File;

      if (file && file.name) {
        const tokensImgName: any[] = file.name.split('.');
        if (tokensImgName.length === 2) {
          const imgExtension = tokensImgName[1];
          if (imgExtension !== 'jpg' && imgExtension !== 'jpeg' && imgExtension !== 'png' && imgExtension !== 'jfif') {
            this.crearNotificacionForm.get('imagen')?.setValue(null);
            this.existImageNotificacion = false;
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          this.existImageNotificacion = true;
        }
        return null;
      }
      return null;
    };
  }

  mostrarToastInfo(titulo: string, mensaje: string, isErrorToast: boolean) {
    this.isErrorToast = isErrorToast;
    this.tituloToast = titulo;
    this.mensajeToast = mensaje;
    const toast = document.getElementById('liveToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
      this.get_notificaciones();
    }
  }

  isInvalidForm(subForm: string) {
    return this.crearNotificacionForm.get(subForm)?.invalid && this.crearNotificacionForm.get(subForm)?.touched || this.crearNotificacionForm.get(subForm)?.dirty && this.getErrorMessage(this.crearNotificacionForm, subForm).length !== 0;
  }

  getErrorMessage(formGroup: FormGroup, item: string): string {
    const itemControl: FormControl = formGroup.get(item) as FormControl;
    if (item === 'imagen') {
      return itemControl.hasError('image_error') ? itemControl.getError('image_error') : '';
    }
    if (!itemControl?.hasError('required')) {
      return '';
    }
    const textos: { [campo: string]: string } = {
      nombre: 'Debe llenar este campo para establecer el nombre de la notificación',
      titulo: 'Debe llenar este campo para establecer el título de la notificación',
      descripcion: 'Debe llenar este campo para establecer la descripción de la notificación',
      dirigida_a: 'Debe elegir a qué aplicación va dirigida la notificación',
    };
    return textos[item] || '';
  }

  limpiarForm() {
    this.existImageNotificacion = false;
    this.imagenNotificacion = undefined;
    this.crearNotificacionForm.reset({
      dirigida_a: 'ambas', profesiones: [], programar: false, estado: true,
      nombre: '', titulo: '', descripcion: '', ruta: '',
      fecha_programada: '', hora_programada: '',
    });
  }

  eliminarImagen() {
    this.existImageNotificacion = false;
    this.crearNotificacionForm.get('imagen')?.reset();
  }

  loadImageFromDevice(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.crearNotificacionForm.get('imagen')?.setValue(file);
          this.fileImagenNotificacion = file;
          this.imagenNotificacion = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };

  extraerBase64 = async ($event: any) => new Promise((resolve) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };
      return image;
    } catch (e) {
      return null;
    }
  });

  getCurrentDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  search(evento: any) {
    const texto = evento.target.value;
    const notificacionesArray = this.arr_noti ? Object.values(this.arr_noti) : [];
    if (texto && texto.trim() !== '') {
      this.arr_filtered_notificacion = notificacionesArray?.filter((noti) => {
        return noti.titulo.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      const notificacionesArray = this.arr_noti ? Object.values(this.arr_noti) : [];
      this.arr_filtered_notificacion = notificacionesArray.filter(a => {
        const fechaCreacion = new Date(a.fecha_creacion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    } else {
      this.arr_filtered_notificacion = this.arr_noti ? Object.values(this.arr_noti) : [];
    }
  }

  onCrearNotificacion() {
    if (this.crearNotificacionForm.invalid) {
      this.mostrarToastInfo('Formulario incompleto', 'Revise los campos marcados en rojo.', true);
      return;
    }
    const dirigida_a = this.crearNotificacionForm.get('dirigida_a')?.value as DirigidaA;
    const imagen = this.crearNotificacionForm.get('imagen')?.value;
    const body: BodyCrearNotificacionAnuncio = {
      nombre: this.crearNotificacionForm.get('nombre')?.value ?? '',
      titulo: this.crearNotificacionForm.get('titulo')?.value ?? '',
      descripcion: this.crearNotificacionForm.get('descripcion')?.value ?? '',
      ruta: this.crearNotificacionForm.get('ruta')?.value || '',
      dirigida_a,
      // El filtro por profesión solo tiene sentido para proveedores.
      profesiones: dirigida_a === 'proveedor' ? (this.crearNotificacionForm.get('profesiones')?.value ?? []) : [],
      programada_para: this.programadaPara(this.crearNotificacionForm),
      ...(imagen instanceof File ? { imagen } : {}),
    };
    this.pythonAnywhereService.send_notificacion(body).subscribe({
      next: resp => {
        if (resp.success) {
          this.limpiarForm();
        }
        this.mostrarToastInfo('Estado de la solicitud', resp.message, !resp.success);
      },
      error: () => this.mostrarToastInfo('Error', 'No se pudo crear la notificación.', true),
    });
  }

}
