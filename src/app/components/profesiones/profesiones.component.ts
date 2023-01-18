import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Profesion, BodyCrearProfesion, BodyActualizarProfesion } from 'src/app/interfaces/profesion';
import { Servicio } from 'src/app/interfaces/servicio';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-profesiones',
  templateUrl: './profesiones.component.html',
  styleUrls: ['./profesiones.component.css']
})
export class ProfesionesComponent {
  arr_profesiones: Profesion[] | undefined;
  arr_filtered_profesiones: Profesion[] | undefined;
  arr_servicios: Servicio[] | undefined;
  profesion_seleccionada: Profesion | undefined;
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  existImageCrear = false; existImageActualizar = false;

  crearProfesionesForm = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    servicio: new FormControl('', [Validators.required]),
  }, []);

  actualizarProfesionesForm = new FormGroup({
    imagen: new FormControl(this.fileImagenCrear),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    servicio: new FormControl('', [Validators.required]),
    estado: new FormControl(false, [Validators.required])
  }, []);

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer){
    this.pythonAnywhereService.obtener_profesiones().subscribe(resp => {
      this.arr_profesiones = resp;
      this.arr_filtered_profesiones = this.arr_profesiones;
    });
    this.pythonAnywhereService.obtener_servicios().subscribe((resp) => {
      this.arr_servicios = resp;
    });
    // Validators
    const imagenCrearControl = this.crearProfesionesForm.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearProfesionesForm.get('imagen') as AbstractControl, 'crear'));
    const imagenActualizarControl = this.actualizarProfesionesForm.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.actualizarProfesionesForm.get('imagen') as AbstractControl, 'actualizar'));
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
            if(tipo === 'crear'){
              this.crearProfesionesForm.get('imagen')?.setValue(null);
              this.existImageCrear = false;
            }
            else if(tipo === 'actualizar'){
              this.actualizarProfesionesForm.get('imagen')?.setValue(null);
              this.existImageActualizar = false;
            }
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if(tipo === 'crear'){
            this.existImageCrear = true;
          }
          else if(tipo === 'actualizar'){
            this.existImageActualizar = true;
          }
        }
        return null;
      } else {
        console.log('No hay imagen seleccionada');
        return null;
      }
    };
  }

  limpiarForm(tipo: string) {
    if(tipo === 'crear') {
      this.existImageCrear = false;
      this.crearProfesionesForm.get('imagen')?.reset();
      this.crearProfesionesForm.get('nombre')?.reset();
      this.crearProfesionesForm.get('descripcion')?.reset();
      this.crearProfesionesForm.get('servicio')?.setValue('');
    } else if(tipo === 'actualizar') {
      // console.log(this.profesion_seleccionada);
      // console.log('Servicio de la profesion seleccionada: ', this.profesion_seleccionada?.servicio[0].nombre);
      const servicio = this.profesion_seleccionada?.servicio[0].nombre;
      const nombre = this.profesion_seleccionada?.nombre;
      const descripcion = this.profesion_seleccionada?.descripcion;
      const estado = this.profesion_seleccionada?.estado;
      this.existImageActualizar = false;
      this.actualizarProfesionesForm.get('imagen')?.reset();
      nombre? this.actualizarProfesionesForm.get('nombre')?.setValue(nombre) : this.actualizarProfesionesForm.get('nombre')?.reset();
      descripcion? this.actualizarProfesionesForm.get('descripcion')?.setValue(descripcion) : this.actualizarProfesionesForm.get('descripcion')?.reset();
      servicio? this.actualizarProfesionesForm.get('servicio')?.setValue(servicio) : this.actualizarProfesionesForm.get('servicio')?.reset();
      if(estado != undefined) this.actualizarProfesionesForm.get('estado')?.setValue(estado)
    } else {
      console.log('Se paso algo erroneo en limpiar form');
    }
  }

  search(evento: any) {
    const texto = evento.target.value;
    // console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_profesiones = this.arr_profesiones;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_profesiones = this.arr_filtered_profesiones?.filter((profesion) => {
        return profesion.nombre.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

  establecerMensaje(mensaje: string, tipo: string){
    if(tipo === 'actualizar') {
      this.isActualizar = true;
      this.isEliminar = false;
      this.isCrear = false;
    }
    else if(tipo === 'eliminar') {
      this.isEliminar = true;
      this.isActualizar = false;
      this.isCrear = false;
    }
    else if(tipo === 'crear') {
      this.isCrear = true;
      this.isEliminar = false;
      this.isActualizar = false;
    }
    this.mensajeAlerta = mensaje;
  }

  onCrear(){
    console.log('Crear');
    const bodyCrearProfesion: BodyCrearProfesion = {
      servicio: '',
      nombre: '',
      descripcion: ''
    };
    const servicio = this.crearProfesionesForm.get('servicio')?.value;
    const nombre = this.crearProfesionesForm.get('nombre')?.value;
    const descripcion = this.crearProfesionesForm.get('descripcion')?.value;
    const foto = this.crearProfesionesForm.get('imagen')?.value;
    if(nombre && servicio && descripcion) {
      bodyCrearProfesion.servicio = servicio;
      bodyCrearProfesion.nombre = nombre;
      bodyCrearProfesion.descripcion = descripcion;
      if(foto && this.existImageCrear){
        bodyCrearProfesion.foto = foto; // Si hay foto se le agrega al body.
      }
      this.pythonAnywhereService.add_profesion(bodyCrearProfesion).subscribe(resp => {
        if(resp.success) {
          console.log(resp.mensaje);
          console.log('Profesion creada: ', resp.profesion);
          this.limpiarForm('crear');
        }
        else {
          console.log(resp.mensaje);
        }
      });
    } else {
      console.error('Los campos principales para crear la profesion estan incompletos.');
    }
  }

  onActualizar() {
    console.log('Actualizar');
    const bodyActualizarProfesion: BodyActualizarProfesion = {
      id: 0,
      servicio: ''
    };
    const id = this.profesion_seleccionada?.id;
    const servicio = this.actualizarProfesionesForm.get('servicio')?.value;
    const nombre = this.actualizarProfesionesForm.get('nombre')?.value;
    const descripcion = this.actualizarProfesionesForm.get('descripcion')?.value;
    const estado = this.actualizarProfesionesForm.get('estado')?.value;
    const foto = this.actualizarProfesionesForm.get('imagen')?.value;
    if(id && nombre && servicio && descripcion && estado) {
      bodyActualizarProfesion.id = id;
      bodyActualizarProfesion.servicio = servicio;
      bodyActualizarProfesion.nombre = nombre;
      bodyActualizarProfesion.descripcion = descripcion;
      bodyActualizarProfesion.estado = estado;
      if(this.existImageActualizar && foto){
        bodyActualizarProfesion.foto = foto; // Si hay foto se le agrega al body.
      }
      this.pythonAnywhereService.actualizar_profesion(bodyActualizarProfesion).subscribe(resp => {
        if(resp) {
          console.log('Profesion actualizada: ', resp);
          this.limpiarForm('actualizar');
        }
        else {
          console.log(resp);
        }
      });
    } else {
      console.error('Los campos principales para actualizar la profesion estan incompletos.');
    }
  }

  onDelete() {
    console.log('Eliminar');
    if(this.profesion_seleccionada){
      this.pythonAnywhereService.delete_profesion(this.profesion_seleccionada.id.toString()).subscribe(resp => {
        console.log('Profesion eliminada correctamente: ', resp);
      });
    }
  }

  loadImageFromDevice(event:any, tipo: string) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        if(tipo === 'crear'){
          this.crearProfesionesForm.get('imagen')?.setValue(file);
          this.fileImagenCrear = file;
          this.imagenCrear = imagen.base;
        }
        else if(tipo === 'actualizar'){
          this.actualizarProfesionesForm.get('imagen')?.setValue(file);
          this.fileImagenActualizar = file;
          this.imagenActualizar = imagen.base;
        }
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

  isInvalidForm(subForm: string, tipo: string){
    if(tipo === 'crear') {
      return this.crearProfesionesForm.get(subForm)?.invalid && this.crearProfesionesForm.get(subForm)?.touched || this.crearProfesionesForm.get(subForm)?.dirty  && this.getErrorMessage(this.crearProfesionesForm, subForm).length!==0;
    } else {
      return this.actualizarProfesionesForm.get(subForm)?.invalid && this.actualizarProfesionesForm.get(subForm)?.touched || this.actualizarProfesionesForm.get(subForm)?.dirty  && this.getErrorMessage(this.actualizarProfesionesForm, subForm).length!==0;
    }
  }

  getErrorMessage( formGroup: FormGroup, item: string): string {
    const itemControl: FormControl = formGroup.get(item) as FormControl;
    switch (item) {
      case 'imagen':
        if (itemControl.hasError('image_error')) {
          return itemControl.getError('image_error');
        }
        return '';

      case 'nombre':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';

      case 'descripcion':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';

      case 'servicio':
        if (itemControl.hasError('required')) {
          return 'Debe especificar un servicio';
        }
        return '';

      case 'estado':
        if (itemControl.hasError('required')) {
          return 'Debe seleccionar un estado';
        }
        return '';
      default:
        return '';
    }
  }

  getNameServicio(profesion: Profesion): string{
    // console.log('Nombre de servicio retornado: ', profesion.servicio[0].nombre);
    return profesion.servicio[0].nombre;
  }

  
}
