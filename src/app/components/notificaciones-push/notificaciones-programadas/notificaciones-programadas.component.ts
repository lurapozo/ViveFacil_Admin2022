import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyCrearNotificacionProgramada, DirigidaA, Frecuencia, NotificacionProgramada } from 'src/app/interfaces/notificacion';
import { Profesion } from 'src/app/interfaces/profesion';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import * as moment from 'moment';

// ponytail: bootstrap.bundle.min.js se carga como script global (angular.json),
// no como módulo — así se referencia sin reimportarlo.
declare const bootstrap: any;

@Component({
  selector: 'app-notificaciones-programadas',
  templateUrl: './notificaciones-programadas.component.html',
  styleUrls: ['./notificaciones-programadas.component.css']
})
export class NotificacionesProgramadasComponent {
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  showHeader = true;
  showHeaderC = false;
  mostrarFiltro: boolean = false;
  filtroActual: string = 'todos';
  filtrosDisponibles: string[] = [];
  mensajeAlerta: string = '';
  fileImagenNotificacion: File = {} as File;
  /** Notificación pendiente de confirmar en #modalEliminarNotificacion. */
  notificacionAEliminar: NotificacionProgramada | null = null;

  arr_noti?: NotificacionProgramada[] | undefined;
  arr_filtered_notificacion!: NotificacionProgramada[] | undefined;

  imagenNotificacion: string | undefined;
  existImageNotificacion = false;
  tituloToast = '';
  mensajeToast = '';
  isErrorToast = false;

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

  crearNotificacionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    ruta: new FormControl(''),
    imagen: new FormControl(this.fileImagenNotificacion),
    dirigida_a: new FormControl('ambas', [Validators.required]),
    profesiones: new FormControl<number[]>([]),
    frecuencia: new FormControl('unica', [Validators.required]),
    dias_semana: new FormControl<string[]>([]),
    hora: new FormControl('', [Validators.required]),
    fecha_iniciacion: new FormControl(''),
    fecha_expiracion: new FormControl(''),
    estado: new FormControl(true),
  }, []);

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    const imagenCrearControl = this.crearNotificacionForm.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearNotificacionForm.get('imagen') as AbstractControl));

    this.get_profesiones();
    this.get_notificaciones();
  }

  /** El select decía "tipo de proveedores" pero cargaba SERVICIOS. La relación
   *  real de un proveedor es con Profesion (api_profesion_proveedor). */
  get_profesiones() {
    this.pythonAnywhereService.obtener_profesiones().subscribe((resp: Profesion[]) => {
      this.profesiones = resp;
    });
  }

  get_notificaciones() {
    this.pythonAnywhereService.get_notificacion().subscribe((resp: any) => {
      const noti = resp.results
      this.arr_noti = Object(noti);
      this.arr_filtered_notificacion = this.arr_noti;
      this.generarFiltros();
    });
  }

  generarFiltros() {
    const titulosUnicos = new Set(this.arr_filtered_notificacion?.map(n => n.titulo.toLowerCase()));
    this.filtrosDisponibles = ['todos', ...Array.from(titulosUnicos)];
  }

  crear_noti() {
    this.showHeader = false;
    this.showHeaderC = true;
  }

  etiquetaDirigidaA(valor: DirigidaA): string {
    return { ambas: 'Ambas apps', proveedor: 'Proveedores', solicitante: 'Solicitantes' }[valor] || 'Ambas apps';
  }

  etiquetaFrecuencia(valor: Frecuencia): string {
    return { unica: 'Una sola vez', diaria: 'Todos los días', semanal: 'Días de la semana' }[valor] || '—';
  }

  /** Nombres de los días marcados, para la tabla. */
  etiquetaDias(csv: string): string {
    const marcados = (csv || '').split(',').filter(d => d);
    if (!marcados.length) {
      return '—';
    }
    return this.diasSemana.filter(d => marcados.includes(d.valor)).map(d => d.etiqueta).join(', ');
  }

  establecerMensaje(mensaje: string) {
    this.mensajeAlerta = mensaje;
  }

  borrar_notificacion(id: any) {
    this.pythonAnywhereService.delete_notificacion(id).subscribe(() => {
      this.get_notificaciones();
    });
  }

  // La fila entera es clickable (routerLink al detalle) y su stopPropagation
  // impide que el data-bs-toggle delegado por Bootstrap (escucha en
  // document) reciba el click, así que el modal se abre a mano — mismo
  // patrón que proveedores.component.ts::prepararEliminarProveedor.
  prepararEliminarNotificacion(notificacion: NotificacionProgramada, event: Event) {
    event.stopPropagation();
    this.notificacionAEliminar = notificacion;
    const modalEl = document.getElementById('modalEliminarNotificacion');
    if (modalEl) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  enviarNotificacionProgramada(notificacion: NotificacionProgramada) {
    this.pythonAnywhereService.enviar_noti_auto(String(notificacion.id), notificacion.titulo).subscribe(() => {
      this.get_notificaciones();
      this.mostrarToastInfo('Notificación enviada', 'Se envió correctamente', false);
    });
  }

  toggleFiltro() {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  filtrar(filtro: string) {
    this.filtroActual = filtro;
    if (filtro === 'todos') {
      this.arr_filtered_notificacion = this.arr_noti;
    } else {
      this.arr_filtered_notificacion = this.arr_noti?.filter(n => n.titulo.toLowerCase() === filtro);
    }
    this.toggleFiltro();
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
    // Antes los case eran 'frec'/'inicio'/'fin', que no son nombres de control:
    // esos mensajes no se mostraban nunca.
    const textos: { [campo: string]: string } = {
      nombre: 'Debe llenar este campo para establecer el nombre de la notificación',
      titulo: 'Debe llenar este campo para establecer el título de la notificación',
      descripcion: 'Debe llenar este campo para establecer la descripción de la notificación',
      dirigida_a: 'Debe elegir a qué aplicación va dirigida la notificación',
      frecuencia: 'Debe elegir cada cuánto se envía la notificación',
      hora: 'Debe elegir la hora de envío',
    };
    return textos[item] || '';
  }

  limpiarForm() {
    this.existImageNotificacion = false;
    this.imagenNotificacion = undefined;
    this.crearNotificacionForm.reset({
      dirigida_a: 'ambas', profesiones: [], frecuencia: 'unica', dias_semana: [],
      estado: true, nombre: '', titulo: '', descripcion: '', ruta: '',
      hora: '', fecha_iniciacion: '', fecha_expiracion: '',
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

  // El input type="date" entrega "YYYY-MM-DD"; el backend espera un
  // DateTimeField completo (formato ISO con hora), si no rechaza el request.
  private aFechaIniciacionISO(fecha: string): string {
    return fecha ? moment(fecha).startOf('day').format() : '';
  }

  private aFechaExpiracionISO(fecha: string): string {
    return fecha ? moment(fecha).endOf('day').format() : '';
  }

  onCrearNotificacion() {
    if (this.crearNotificacionForm.invalid) {
      this.mostrarToastInfo('Formulario incompleto', 'Revise los campos marcados en rojo.', true);
      return;
    }
    const dirigida_a = this.crearNotificacionForm.get('dirigida_a')?.value as DirigidaA;
    const frecuencia = this.crearNotificacionForm.get('frecuencia')?.value as Frecuencia;
    const imagen = this.crearNotificacionForm.get('imagen')?.value;
    const body: BodyCrearNotificacionProgramada = {
      nombre: this.crearNotificacionForm.get('nombre')?.value ?? '',
      titulo: this.crearNotificacionForm.get('titulo')?.value ?? '',
      descripcion: this.crearNotificacionForm.get('descripcion')?.value ?? '',
      ruta: this.crearNotificacionForm.get('ruta')?.value || '',
      dirigida_a,
      // El filtro por profesión solo tiene sentido para proveedores.
      profesiones: dirigida_a === 'proveedor' ? (this.crearNotificacionForm.get('profesiones')?.value ?? []) : [],
      frecuencia,
      // Los días solo cuentan en la frecuencia semanal.
      dias_semana: frecuencia === 'semanal' ? (this.crearNotificacionForm.get('dias_semana')?.value ?? []).join(',') : '',
      hora: this.crearNotificacionForm.get('hora')?.value ?? '',
      fecha_iniciacion: this.aFechaIniciacionISO(this.crearNotificacionForm.get('fecha_iniciacion')?.value ?? ''),
      fecha_expiracion: this.aFechaExpiracionISO(this.crearNotificacionForm.get('fecha_expiracion')?.value ?? ''),
      ...(imagen instanceof File ? { imagen } : {}),
    };
    this.pythonAnywhereService.crear_notificacion(body).subscribe({
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
