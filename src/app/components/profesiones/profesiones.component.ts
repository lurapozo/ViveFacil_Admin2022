import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Profesion, BodyCrearProfesion } from 'src/app/interfaces/profesion';
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
  fileImagen: File = {} as File;
  imagen: string | undefined;
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  existImage = false;

  crearProfesionesForm = new FormGroup({
    imagen: new FormControl(this.fileImagen),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    servicio: new FormControl('', [Validators.required]),
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
    const imagenControl = this.crearProfesionesForm.get('imagen') as FormControl;
    imagenControl.addValidators(this.createImageValidator(this.crearProfesionesForm.get('imagen') as AbstractControl));
  }

  createImageValidator(controlImage: AbstractControl){
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
            this.crearProfesionesForm.get('imagen')?.setValue(null);
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          this.existImage = true;
        }
        return null;
      } else {
        console.log('No hay imagen seleccionada');
        return null;
      }
    };
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
    // const bodyCrearProfesion: BodyCrearProfesion = {
    //   servicio: '',
    //   nombre: '',
    //   descripcion: '',
    //   foto: undefined
    // };
    // this.pythonAnywhereService.add_profesion(bodyCrearProfesion).subscribe(resp => {
    //   if(resp.success) {
    //     console.log(resp.mensaje);
    //     console.log('Profesion creada: ', resp.profesion);
    //   }
    //   else {
    //     console.log(resp.mensaje);
    //   }
    // })
  }

  onActualizar() {
    console.log('Actuazlizar');
  }

  onDelete() {
    console.log('Eliminar');
  }

  loadImageFromDevice(event:any) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.crearProfesionesForm.get('imagen')?.setValue(file);
        this.fileImagen = file;
        this.imagen = imagen.base;
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

  isInvalidForm(subForm: string){
    return this.crearProfesionesForm.get(subForm)?.invalid && this.crearProfesionesForm.get(subForm)?.touched || this.crearProfesionesForm.get(subForm)?.dirty  && this.getErrorMessage(this.crearProfesionesForm, subForm).length!==0;
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

      default:
        return '';
    }
  }
}
