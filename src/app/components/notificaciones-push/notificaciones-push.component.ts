import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyCrearNotificacionAnuncio } from 'src/app/interfaces/notificacion';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-notificaciones-push',
  templateUrl: './notificaciones-push.component.html',
  styleUrls: ['./notificaciones-push.component.css']
})
export class NotificacionesPushComponent {
  fileImagenNotificacion: File = {} as File;
  imagenNotificacion: string | undefined;
  existImageNotificacion = false;
  mensajeAlerta: string = '';
  tituloToast = '';
  mensajeToast = '';
  isErrorToast = false;

  crearNotificacionForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    mensaje: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    ruta: new FormControl(' ', [Validators.required]),
    imagen: new FormControl(this.fileImagenNotificacion)
  }, []);

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer){
    // Validators
    const imagenCrearControl = this.crearNotificacionForm.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearNotificacionForm.get('imagen') as AbstractControl, 'crear'));
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

  establecerMensaje(mensaje: string){
    this.mensajeAlerta = mensaje;
  }

  onCrearNotificacion(){
    const bodyNotificacion: BodyCrearNotificacionAnuncio = {
      titulo: '',
      mensaje: '',
      descripcion: '',
      ruta: ''
    };
    const titulo = this.crearNotificacionForm.get('titulo')?.value;
    const mensaje = this.crearNotificacionForm.get('mensaje')?.value;
    const descripcion = this.crearNotificacionForm.get('descripcion')?.value;
    const ruta = this.crearNotificacionForm.get('ruta')?.value;
    const imagen = this.crearNotificacionForm.get('imagen')?.value;
    if(titulo && mensaje && descripcion && ruta) {
      bodyNotificacion.titulo = titulo;
      bodyNotificacion.mensaje = mensaje;
      bodyNotificacion.descripcion = descripcion;
      bodyNotificacion.ruta = ruta;
      if(imagen && this.existImageNotificacion){
        bodyNotificacion.imagen = imagen; // Si hay imagen se le agrega al body.
      }
      this.pythonAnywhereService.send_notificacion(bodyNotificacion).subscribe(resp => {
        if(resp.success) {
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
      console.error('Los campos principales para crear la profesion estan incompletos.');
    }
  }
}
