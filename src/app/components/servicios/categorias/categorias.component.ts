import { Component } from '@angular/core';
import { FormControl, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { BodyActualizarCategoria, BodyCrearCategoria, Categoria } from '../../../interfaces/categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent {
  isCrear = false; isActualizar = false; isEliminar = false;
  existImageCrear = false; existImageActualizar = false;
  existImageCrear2 = false; existImageActualizar2 = false;
  mensajeAlerta: string = '';
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
  fileImagenActualizar2: File = {} as File;
  imagenActualizar2: string | undefined;
  fileImagenCrear2: File = {} as File;
  imagenCrear2: string | undefined;
  categoria?: Categoria[];
  categoria_seleccionada?: Categoria
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_categorias().subscribe((resp: any[]) => {
      this.categoria = resp
      console.log(resp)

    })

    const imagenCrearControl = this.crearCategoria.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearCategoria.get('imagen') as AbstractControl, 'crear'));
    const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));

    const imagenCrearControl2 = this.crearCategoria.get('imagen2') as FormControl;
    imagenCrearControl2.addValidators(this.createImageValidator2(this.crearCategoria.get('imagen2') as AbstractControl, 'crear'));
    const imagenActualizarControl2 = this.formEdit.get('imagen2') as FormControl;
    imagenActualizarControl2.addValidators(this.createImageValidator2(this.formEdit.get('imagen2') as AbstractControl, 'actualizar'));


  }
  crearCategoria = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    imagen2: new FormControl(this.fileImagenActualizar2),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  }, []);
  formEdit = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar, [Validators.required]),
    imagen2: new FormControl(this.fileImagenActualizar2, [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  }, []);

  createImageValidator(controlImage: AbstractControl, tipo: string) {
    return () => {
      const file = controlImage.value as File;

      if (file && file.name) {
        console.log('Ingresa al validator if');
        console.log(file);
        const tokensImgName: any[] = file.name.split('.');
        console.log(tokensImgName);
        if (tokensImgName.length === 2) {
          const imgExtension = tokensImgName[1];
          if (imgExtension !== 'jpg' && imgExtension !== 'jpeg' && imgExtension !== 'png' && imgExtension !== 'jfif') {
            console.log('Entra en error de imagen');
            if (tipo === 'crear') {
              this.crearCategoria.get('imagen')?.setValue(null);
              this.existImageCrear = false;
            }
            else if (tipo === 'actualizar') {
              this.formEdit.get('imagen')?.setValue(null);
              this.existImageActualizar = false;
            }
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if (tipo === 'crear') {
            this.existImageCrear = true;
          }
          else if (tipo === 'actualizar') {
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
  loadImageFromDevice(event: any, tipo: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          if (tipo === 'crear') {
            this.crearCategoria.get('imagen')?.setValue(file);
            this.fileImagenCrear = file;
            this.imagenCrear = imagen.base;
          }
          else if (tipo === 'actualizar') {
            this.formEdit.get('imagen')?.setValue(file);
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

  createImageValidator2(controlImage: AbstractControl, tipo: string) {
    return () => {
      const file = controlImage.value as File;

      if (file && file.name) {
        console.log('Ingresa al validator if');
        console.log(file);
        const tokensImgName: any[] = file.name.split('.');
        console.log(tokensImgName);
        if (tokensImgName.length === 2) {
          const imgExtension = tokensImgName[1];
          if (imgExtension !== 'jpg' && imgExtension !== 'jpeg' && imgExtension !== 'png' && imgExtension !== 'jfif') {
            console.log('Entra en error de imagen');
            if (tipo === 'crear') {
              this.crearCategoria.get('imagen2')?.setValue(null);
              this.existImageCrear2 = false;
            }
            else if (tipo === 'actualizar') {
              this.formEdit.get('imagen2')?.setValue(null);
              this.existImageActualizar2 = false;
            }
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if (tipo === 'crear') {
            this.existImageCrear2 = true;
          }
          else if (tipo === 'actualizar') {
            this.existImageActualizar2 = true;
          }
        }
        return null;
      } else {
        console.log('No hay imagen seleccionada');
        return null;
      }
    };
  }
  loadImageFromDevice2(event: any, tipo: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          if (tipo === 'crear') {
            this.crearCategoria.get('imagen2')?.setValue(file);
            this.fileImagenCrear2 = file;
            this.imagenCrear2 = imagen.base;
          }
          else if (tipo === 'actualizar') {
            this.formEdit.get('imagen2')?.setValue(file);
            this.fileImagenActualizar2 = file;
            this.imagenActualizar2 = imagen.base;
          }
        })
        .catch(err => console.log(err));
    }
  };


  isInvalidForm(subForm: string, tipo: string) {
    if (tipo === 'crear') {
      return this.crearCategoria.get(subForm)?.invalid && this.crearCategoria.get(subForm)?.touched || this.crearCategoria.get(subForm)?.dirty && this.getErrorMessage(this.crearCategoria, subForm).length !== 0;
    } else {
      return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty && this.getErrorMessage(this.formEdit, subForm).length !== 0;
    }
  }
  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.categoria = this.categoria;
    if (texto && texto.trim() !== '') {
      this.categoria = this.categoria?.filter((solicitud) => {
        return solicitud.nombre.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }
  establecerMensaje(mensaje: string, tipo: string) {
    if (tipo === 'actualizar') {
      this.isActualizar = true;
      this.isEliminar = false;
      this.isCrear = false;
    }
    else if (tipo === 'eliminar') {
      this.isEliminar = true;
      this.isActualizar = false;
      this.isCrear = false;
    }
    else if (tipo === 'crear') {
      this.isCrear = true;
      this.isEliminar = false;
      this.isActualizar = false;
    }
    this.mensajeAlerta = mensaje;
  }

  getErrorMessage(formGroup: FormGroup, item: string): string {
    const itemControl: FormControl = formGroup.get(item) as FormControl;
    switch (item) {
      case 'imagen':
        if (itemControl.hasError('image_error')) {
          return itemControl.getError('image_error');
        }
        return '';

      case 'imagen2':
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




        if (itemControl.hasError('required')) {
          console.log('entre')
          return 'Debe seleccionar un estado';
        }
        return '';
      default:
        return '';
    }
  }
  limpiarForm(tipo: string) {
    if (tipo === 'crear') {
      this.existImageCrear = false;
      this.existImageCrear2 = false;
      this.crearCategoria.get('imagen')?.reset();
      this.crearCategoria.get('imagen2')?.reset();
      this.crearCategoria.get('nombre')?.reset();
      this.crearCategoria.get('descripcion')?.reset();

    } else if (tipo === 'actualizar') {

      const nombre = this.categoria_seleccionada?.nombre;
      const descripcion = this.categoria_seleccionada?.descripcion;
      const estado = this.categoria_seleccionada?.estado;

      this.existImageActualizar = false;
      this.existImageActualizar2 = false;
      this.formEdit.get('imagen')?.reset();
      this.formEdit.get('imagen2')?.reset();
      nombre ? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
      descripcion ? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();


    }
  }
  cambiarEstado(event: any) {
    let estado = console.log(event.srcElement.checked)
    let categoria: BodyActualizarCategoria = {
      estado: event.srcElement.checked
    }

    if(this.categoria_seleccionada?.id){
      this.pythonAnywhereService.actualizar_categoria_estado(categoria,this.categoria_seleccionada?.id).subscribe(
        resp=>{
          this.mostrarToastInfo('Estado de la Categoria ', 'Categoria editada correctamente', false)
        }
      )
    }
  }


  onCrear() {
    let categoria: BodyCrearCategoria = {

      nombre: '',
      descripcion: '',


    }

    const nombre = this.crearCategoria.get('nombre')?.value;
    const descripcion = this.crearCategoria.get('descripcion')?.value;
    const foto = this.crearCategoria.get('imagen')?.value;
    const foto2 = this.crearCategoria.get('imagen2')?.value;
    console.log(foto,foto2)
    if (nombre && descripcion) {
      console.log(nombre, descripcion)
      categoria.nombre = nombre;
      categoria.descripcion = descripcion;

      if (foto && this.existImageCrear) {
        categoria.foto = foto;
      }
      if (foto2 && this.existImageCrear2) {
        categoria.foto2 = foto2;
      }
      console.log(categoria)
      this.pythonAnywhereService.add_categoria(categoria).subscribe(resp => {
        this.mostrarToastInfo('Estado de la Categoria ', 'Categoria Creada  correctamente', false)
      })

    }

  }
  onActualizar() {
    let categoria: BodyActualizarCategoria = {
      estado: false
    }
    if (this.categoria_seleccionada?.estado) {
      categoria.estado = this.categoria_seleccionada?.estado
    }
    const nombre = this.formEdit.get('nombre')?.value;
    const descripcion = this.formEdit.get('descripcion')?.value;
    const foto = this.formEdit.get('imagen')?.value;
    const foto2 = this.formEdit.get('imagen2')?.value;


    if (nombre && descripcion) {
      console.log(nombre, descripcion)
      categoria.nombre = nombre;
      categoria.descripcion = descripcion;

      if (foto && this.existImageCrear) {
        categoria.foto = foto;
      }
      if (foto2 && this.existImageCrear2) {
        categoria.foto2 = foto2;
      }
      console.log(categoria)
      if(this.categoria_seleccionada?.id){
        this.pythonAnywhereService.actualizar_categoria(categoria,this.categoria_seleccionada?.id).subscribe(
          resp=>{
            this.mostrarToastInfo('Estado de la  Categoria ', 'Categoria Editada correctamente', false)
          }
        )
      }
  

    }


  }
  onEliminar() {
    if (this.categoria_seleccionada?.id) {
      this.pythonAnywhereService.eliminar_categoria(this.categoria_seleccionada?.id).subscribe(resp => {
        this.mostrarToastInfo('Estado de la Categoria ', 'Categoria Eliminada correctamente', false)
      }

      )

    }


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
      }, 7000);
    } else {
      console.log('No hay toast renderizado');
    }
  }
}
