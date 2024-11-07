import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyActualizarNotificacionAutomatica, BodyCrearNotificacionAnuncio, BodyCrearNotificacionAutomatica, NotificacionAnuncio} from 'src/app/interfaces/notificacion';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import * as moment from 'moment';

interface Notificacion {
  tipo: string;
  mensaje: string;
  fecha: string;
  habilitado: boolean;
}

@Component({
  selector: 'app-notificaciones-automaticas',
  templateUrl: './notificaciones-automaticas.component.html',
  styleUrls: ['./notificaciones-automaticas.component.css']
})
export class NotificacionesAutomaticasComponent {
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechasFiltradas: any[] = [];

  showHeader = true;
  showHeaderC = false;
  showHeaderE = false;
  mostrarFiltro: boolean = false;
  filtroActual: string = 'todos';
  filtrosDisponibles: string[] = [];
  mensajeAlerta: string = '';
  fileImagenNotificacion: File = {} as File;

  arr_noti?: NotificacionAnuncio[] | undefined;
  arr_filtered_notificacion!: NotificacionAnuncio[] | undefined;
  noti_seleccionada: any;
  isEnabled = true;

  imagenNotificacion: string | undefined;
  existImageNotificacion = false;
  tituloToast = '';
  mensajeToast = '';
  isErrorToast = false;
  horaSeleccionada: string = '12:00';

  categoria?: any[];
  proveedores?: any[];
  frecuencia = ['Una vez al día', 'Dos veces al día', 'Otro'];
  
  crearNotificacionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    ruta: new FormControl(' ', [Validators.required]),
    imagen: new FormControl(this.fileImagenNotificacion),
    tipo_proveedores: new FormControl('', [Validators.required]),
    frecuencia: new FormControl('', [Validators.required]),
    fecha_iniciacion: new FormControl('', [Validators.required]),
    fecha_expiracion: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
  }, []);

  editNotificacionForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    ruta: new FormControl(''),
    imagen: new FormControl(this.fileImagenNotificacion),
    tipo_proveedores: new FormControl('', [Validators.required]),
    frecuencia: new FormControl('', [Validators.required]),
    fecha_iniciacion: new FormControl('', [Validators.required]),
    fecha_expiracion: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
  }, []);

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.get_servicios();
    this.get_notificaciones();
    
  }

  get_servicios() {
    this.pythonAnywhereService.obtener_servicios().subscribe((resp: any[]) => {
      this.proveedores = resp
    })
  }

  get_notificaciones(){
    this.pythonAnywhereService.get_notificacion().subscribe((resp: any) => {
      const noti =  resp.results
      this.arr_noti = Object(noti);
      this.arr_filtered_notificacion = this.arr_noti;
      console.log("noti", this.arr_filtered_notificacion)
      this.generarFiltros();
    });
  }

  generarFiltros() {
    const titulosUnicos = new Set(this.arr_filtered_notificacion?.map(n => n.titulo.toLowerCase())); 
    console.log("unicos", titulosUnicos)
    this.filtrosDisponibles = ['todos', ...Array.from(titulosUnicos)]; 
  }

  crear_noti(){
    this.showHeader = false;
    this.showHeaderC = true;
    this.showHeaderE = false;
  }

  editar(noti : any){
    this.noti_seleccionada = noti;
    this.showHeader = false;
    this.showHeaderC = false;
    this.showHeaderE = true;
  }

  establecerMensaje(mensaje: string){
    this.mensajeAlerta = mensaje;
  }


  borrar_notificacion(id: any) {
    this.pythonAnywhereService.delete_notificacion(id).subscribe(resp => {
      this.arr_noti = Object(resp);
      this.arr_filtered_notificacion = this.arr_noti;
      console.log("noti delete", this.arr_filtered_notificacion);
      this.get_notificaciones();
    });

  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
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

  habilitarDeshabilitar(index: number) {
    //this.arr_filtered_notificacion[index].habilitado = !this.arr_filtered_notificacion[index].habilitado;
  }

  enviarNotificacion(index: number) {
    return "";
    //alert(`Notificación enviada: ${this.arr_filtered_notificacion?[index].mensaje}`);
  }

  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
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

  createImageValidator(controlImage: AbstractControl, tipo: string){
    return () => {
      const file = controlImage.value as File;

      if(file && file.name){
        console.log('Ingresa al validator if');
        console.log(file);
        const tokensImgName: any[] = file.name.split('.');
        console.log(tokensImgName);
        if(tokensImgName.length === 2 ){
          const imgExtension = tokensImgName[1];
          if(imgExtension !== 'jpg' && imgExtension !== 'jpeg' && imgExtension !== 'png' && imgExtension !== 'jfif'){
            console.log('Entra en error de imagen');
            this.crearNotificacionForm.get('imagen')?.setValue(null);
            this.existImageNotificacion = false;
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          this.existImageNotificacion = true;
        }
        return null;
      } else {
        console.log('No hay imagen seleccionada');
        return null;
      }
    };
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
      }, 3000);
      this.get_notificaciones();
    } else {
      console.log('No hay toast renderizado');
    }
  }

  isInvalidForm(subForm: string){
    return this.crearNotificacionForm.get(subForm)?.invalid && this.crearNotificacionForm.get(subForm)?.touched || this.crearNotificacionForm.get(subForm)?.dirty  && this.getErrorMessage(this.crearNotificacionForm, subForm).length!==0;
  }

  getErrorMessage( formGroup: FormGroup, item: string): string {
    const itemControl: FormControl = formGroup.get(item) as FormControl;
    switch (item) {
      case 'imagen':
        if (itemControl.hasError('image_error')) {
          return itemControl.getError('image_error');
        }
        return '';

      case 'titulo':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo para establecer el título de la notificación';
        }
        return '';
      case 'nombre':
          if (itemControl.hasError('required')) {
            return 'Debe llenar este campo para establecer el nombre de la notificación';
          }
          return '';
      case 'frec':
          if (itemControl.hasError('required')) {
            return 'Debe llenar este campo para establecer la frec de la notificación';
          }
          return '';
      case 'inicio':
            if (itemControl.hasError('required')) {
              return 'Debe llenar este campo para establecer el inicio de la notificación';
            }
            return '';
      case 'fin':
              if (itemControl.hasError('required')) {
                return 'Debe llenar este campo para establecer fin de la notificación';
              }
              return '';
      case 'descripcion':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo para establecer la descripción de la notificación';
        }
        return '';

      case 'mensaje':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo para establecer el mensaje de la notificación';
        }
        return '';

      case 'ruta':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo para establecer la ruta de la notificación';
        }
        return '';
      default:
        return '';
    }
  }

  limpiarForm() {
    this.existImageNotificacion = false;
    this.crearNotificacionForm.get('titulo')?.reset();
    this.crearNotificacionForm.get('mensaje')?.reset();
    this.crearNotificacionForm.get('descripcion')?.reset();
    this.crearNotificacionForm.get('ruta')?.reset();
    this.crearNotificacionForm.get('imagen')?.reset();
  }

  eliminarImagen() {
    this.existImageNotificacion = false;
    this.crearNotificacionForm.get('imagen')?.reset();
  }

  loadImageFromDevice(event:any, tipo: string) {
    const file: File = event.target.files[0];
    if(file){
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

  getMinDateAvailable(): string {
    const minDate = moment().add(45, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
    return minDate;
  }

  getMaxDateAvailable() {
    const maxDate = moment().add(2, 'months').format('YYYY-MM-DDTHH:mm:ssZ');
    return maxDate;
  }

  onCrearNotificacion() {
    console.log("Click en crear");
    const bodyNotificacion: BodyCrearNotificacionAutomatica = {
      nombre: '',
      titulo: '',
      descripcion: '',
      tipo_proveedores: '',
      frecuencia: '',
      fecha_iniciacion: '',
      fecha_expiracion: '',
      hora: '',
      ruta: 'ruta',
    };
    const nombre = this.crearNotificacionForm.get('nombre')?.value;
    const titulo = this.crearNotificacionForm.get('titulo')?.value;
    const descripcion = this.crearNotificacionForm.get('descripcion')?.value;
    const tipo_proveedores = this.crearNotificacionForm.get('tipo_proveedores')?.value;
    const frecuencia = this.crearNotificacionForm.get('frecuencia')?.value;
    const fecha_iniciacion = this.crearNotificacionForm.get('fecha_iniciacion')?.value;
    const fecha_expiracion = this.crearNotificacionForm.get('fecha_expiracion')?.value;
    const hora = this.crearNotificacionForm.get('hora')?.value;
    const ruta = 'ruta';
    const imagen = this.crearNotificacionForm.get('imagen')?.value;
    console.log('nombre',this.crearNotificacionForm);
    
    if (nombre && titulo && descripcion && tipo_proveedores && frecuencia && fecha_iniciacion && fecha_expiracion && hora && ruta) {
      bodyNotificacion.nombre = nombre;
      bodyNotificacion.titulo = titulo;
      bodyNotificacion.descripcion = descripcion;
      bodyNotificacion.tipo_proveedores = tipo_proveedores;
      bodyNotificacion.frecuencia = frecuencia;
      bodyNotificacion.fecha_iniciacion = fecha_iniciacion;
      bodyNotificacion.fecha_expiracion = fecha_expiracion;
      bodyNotificacion.hora = hora;
      bodyNotificacion.ruta = ruta;
      if (imagen && this.existImageNotificacion) {
        bodyNotificacion.imagen = imagen; // Si hay imagen se le agrega al body.
      }

      console.log("bodyNotificacion antes de enviar:", bodyNotificacion);

      this.pythonAnywhereService.crear_notificacion(bodyNotificacion).subscribe(resp => {
        if (resp.success) {
          console.log(resp.message);
          this.limpiarForm();
          this.mostrarToastInfo('Estado de la solicitud', resp.message, false);
        }
        else {
          console.log(resp.message);
          this.mostrarToastInfo('Estado de la solicitud', resp.message, true);
        }
      });
    } else {
      console.log("body",bodyNotificacion)
      console.error('Los campos principales para crear la notificacion estan incompletos.');
    }
  }

  onActualizar() {
    const notiEditar: BodyActualizarNotificacionAutomatica = {
      id: 0,
      nombre: '',
      titulo: '',
      descripcion: '',
      tipo_proveedores: '',
      frecuencia: '',
      fecha_iniciacion: '',
      fecha_expiracion: '',
      hora: '',
      estado: false,
      ruta: '',
    }

    const id = this.noti_seleccionada.id;
    notiEditar.id = id;
    console.log("id",id)
    // Asignar valores con validación
    notiEditar.nombre = this.editNotificacionForm.get('nombre')?.value ?? '';
    notiEditar.titulo = this.editNotificacionForm.get('titulo')?.value ?? '';
    notiEditar.descripcion = this.editNotificacionForm.get('descripcion')?.value ?? '';
    notiEditar.tipo_proveedores = this.editNotificacionForm.get('tipo_proveedores')?.value ?? '';
    notiEditar.frecuencia = this.editNotificacionForm.get('frecuencia')?.value ?? '';
    notiEditar.fecha_iniciacion = this.editNotificacionForm.get('fecha_iniciacion')?.value ?? '';
    notiEditar.fecha_expiracion = this.editNotificacionForm.get('fecha_expiracion')?.value ?? '';
    notiEditar.hora = this.editNotificacionForm.get('hora')?.value ?? '';
    notiEditar.ruta = this.noti_seleccionada.ruta;
    const imagen = this.editNotificacionForm.get('imagen')?.value;
    console.log('edit',this.editNotificacionForm);
    console.log(this.editNotificacionForm);
    if (imagen && this.existImageNotificacion) {
      notiEditar.imagen = imagen;
    }

    if (this.editNotificacionForm.status === "INVALID") {
      console.log("Formulario inválido");
      return;
    } else {
      this.pythonAnywhereService.put_notificacion_auto(notiEditar,id.toString()).subscribe({
        next: resp => {
          console.log("Notificación actualizada:", resp);
          this.get_notificaciones();
      },
      });
    }
  }

  cambiarEstado(notificacion: any) {
    const id = notificacion.id
    const estado = notificacion.estado
    const nuevoEstado = !estado;
    if (id) {
      this.pythonAnywhereService.cambio_notificacion_estado(id, nuevoEstado).subscribe(resp => { console.log(resp); });
      this.get_notificaciones();
      this.mostrarToastInfo('Estado de notificacion ', 'Notificacion editada correctamente', false);
    }
  }

}