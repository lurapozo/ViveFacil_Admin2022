import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Administrador, BodyActualizarAdministrador, BodyCrearAdministrador } from 'src/app/interfaces/administrador';
import { Cargo } from 'src/app/interfaces/cargo';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent {


  arr_admi!: any[];
  arr_filtered_admi!: any[];
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  generos = ['Masculino', 'Femenino', 'Otro'];
  roles = ['Hangaroa', 'Secretario', 'administrador de publicidades', 'enfermito'];
  imagenCrear: any
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  admi_seleccionada: any
  fileImagenActualizar: File = {} as File
  imagenActualizar: any
  fileImagenCrear: any
  existImageCrear = false; existImageActualizar = false;

  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;

  admi: BodyCrearAdministrador = {
    username: "",
    email: "",
    password: "",
    ciudad: "",
    tipo: "",
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    genero: "",
    rol: "",
    foto: null,

  }

  formEdit: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    cedula: new FormControl('',
    [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    telefono: new FormControl('',
    [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    ciudad: new FormControl('', [Validators.required]),
    rol: new FormControl(''),
    genero: new FormControl(''),
    password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
    imagen: new FormControl(this.fileImagenActualizar),

  });
  admiCrear: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    cedula: new FormControl('',
    [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    telefono: new FormControl('',
    [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    ciudad: new FormControl('', [Validators.required]),
    rol: new FormControl(''),
    genero: new FormControl(''),
    password: new FormControl('',[Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('',[Validators.required, Validators.minLength(6)]),
    imagen: new FormControl(this.fileImagenActualizar),

  });
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_administradores().subscribe(resp => {
      this.arr_admi = resp.results;
      this.arr_filtered_admi = this.arr_admi;
      if (resp.next != null) {
        this.condicionNext = true
      }
      for (let index = 1; index <= resp.total_pages; index++) {
        this.pageNumber.push(index)

      }
    });

    // Validators
    const imagenCrearControl = this.admiCrear.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.admiCrear.get('imagen') as AbstractControl, 'crear'));
    // const imagenActualizarControl = this.actualizarProfesionesForm.get('imagen') as FormControl;
    // imagenActualizarControl.addValidators(this.createImageValidator(this.actualizarProfesionesForm.get('imagen') as AbstractControl, 'actualizar'));
  }


  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_administradores(this.currentPage).subscribe(resp => {
      this.arr_admi = resp.results;
      this.arr_filtered_admi = this.arr_admi;
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_administradores(this.currentPage).subscribe(resp => {
      this.arr_admi = resp.results;
      this.arr_filtered_admi = this.arr_admi;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_administradores(event.target.value).subscribe(resp => {
      this.arr_admi = resp.results;
      this.arr_filtered_admi = this.arr_admi;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }

  loadImageFromDevice(event: any, tipo: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          if (tipo === 'crear') {
            this.admiCrear.get('imagen')?.setValue(file);
            this.fileImagenCrear = file;
            this.imagenCrear = imagen.base;
          }
          // else if(tipo === 'actualizar'){
          //   this.actualizarProfesionesForm.get('imagen')?.setValue(file);
          //   this.fileImagenActualizar = file;
          //   this.imagenActualizar = imagen.base;
          // }
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

  getErrorMessage(formGroup: FormGroup, item: string): string {
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

      case 'apellidos':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';

      case 'cedula':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'telefono':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'password':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'genero':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'rol':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'ciudad':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'confirmPassword':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'correo':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';

      default:
        return '';
    }
  }
  establecerMensaje(mensaje: string, tipo: string) {
    console.log(this.admiCrear)
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

  isInvalidForm(subForm: string, tipo: string) {
    if (tipo === 'crear') {

      return this.admiCrear.get(subForm)?.invalid && this.admiCrear.get(subForm)?.touched || this.admiCrear.get(subForm)?.dirty && this.getErrorMessage(this.admiCrear, subForm).length !== 0;
    } else {
      return
      return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty  && this.getErrorMessage(this.formEdit, subForm).length!==0;
    }
  }

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
              this.admiCrear.get('imagen')?.setValue(null);
              this.existImageCrear = false;
            }
            // else if(tipo === 'actualizar'){
            //   this.actualizarProfesionesForm.get('imagen')?.setValue(null);
            //   this.existImageActualizar = false;
            // }
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

  onCrear() {
    this.admi.nombres = this.admiCrear.value.nombre
    this.admi.username = this.admiCrear.value.correo
    this.admi.email = this.admiCrear.value.correo
    this.admi.password = this.admiCrear.value.password
    this.admi.tipo = "Administrador"
    this.admi.apellidos = this.admiCrear.value.apellido
    this.admi.cedula = this.admiCrear.value.cedula
    this.admi.ciudad = this.admiCrear.value.ciudad
    this.admi.rol = this.admiCrear.value.rol
    this.admi.genero = this.admiCrear.value.genero
    this.admi.telefono = this.admiCrear.value.telefono
    const foto = this.admiCrear.get('imagen')?.value;
    if (foto && this.existImageCrear) {
      this.admi.foto = this.admiCrear.value.foto; // Si hay foto se le agrega al body.
    }

    if (this.admiCrear.status == "INVALID") {

      return;
    } else {
      this.pythonAnywhereService.crear_administrador(this.admi).subscribe(resp => {

        console.log(resp)
      })
    }
  }
  onActualizar() {
    const admiEditar: BodyActualizarAdministrador = {
      id: 0,
      username: '',
      email: '',
      password: '',
      tipo: '',
      nombres: '',
      apellidos: '',
      ciudad: '',
      cedula: '',
      telefono: '',
      genero: '',
      emailNuevo: '',
      foto: null
    }
    const id = this.admi_seleccionada.id
    admiEditar.nombres = this.formEdit.get('nombre')?.value;
    admiEditar.username = this.formEdit.get('correo')?.value;
    admiEditar.email = this.formEdit.get('correo')?.value;
    admiEditar.password = this.formEdit.get('password')?.value;
    admiEditar.tipo = this.formEdit.get('rol')?.value;
    admiEditar.apellidos = this.formEdit.get('apellidos')?.value;
    admiEditar.cedula = this.formEdit.get('cedula')?.value;
    admiEditar.ciudad = this.formEdit.get('ciudad')?.value;
    admiEditar.emailNuevo = this.formEdit.get('correo')?.value;
    admiEditar.genero = this.formEdit.get('genero')?.value;
    admiEditar.telefono = this.formEdit.get('telefono')?.value;

    console.log(this.admi_seleccionada)
     console.log( this.formEdit)
    if (this.formEdit.status == "INVALID") {

      return;
    } else {
      this.pythonAnywhereService.actualizar_administrador(id, admiEditar).subscribe(resp => console.log(resp)
      )
    }
  }
}