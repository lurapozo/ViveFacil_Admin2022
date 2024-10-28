import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Administrador, BodyActualizarAdministrador, BodyCrearAdministrador } from 'src/app/interfaces/administrador';
import { Cargo } from 'src/app/interfaces/cargo';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent {

total=0
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

  showHeader: boolean = true;
  showHeaderC: boolean = false;
  showadmi: boolean = false;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechasFiltradas: any[] = [];

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
    estado: new FormControl(''),
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
      this.total = resp.total_objects
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
    const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));
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
          else if(tipo === 'actualizar'){
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
            else if(tipo === 'actualizar'){
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

  onCrear() {
    this.admi.nombres = this.admiCrear.value.nombre
    this.admi.username = this.admiCrear.value.correo
    this.admi.email = this.admiCrear.value.correo
    this.admi.password = this.admiCrear.value.password
    this.admi.tipo = "Administrador"
    this.admi.apellidos = this.admiCrear.value.apellidos
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
      console.log("Invalid")
      return;
    } else {
      this.pythonAnywhereService.crear_administrador(this.admi).subscribe(resp => {
        console.log(resp)
        this.pythonAnywhereService.obtener_administradores().subscribe(resp => {
          this.total = resp.total_objects
          this.arr_admi = resp.results;
          this.arr_filtered_admi = this.arr_admi;
          console.log(resp, "resp");
          console.log(this.arr_filtered_admi)
          this.currentPage = 1;
        });
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
      foto: '',
      estado:true
    }
    const id = this.admi_seleccionada.id
    admiEditar.id = this.admi_seleccionada.id
    admiEditar.nombres = this.formEdit.get('nombre')?.value;
    admiEditar.username = this.formEdit.get('correo')?.value;
    admiEditar.email = this.formEdit.get('correo')?.value;
    // admiEditar.password = this.formEdit.get('password')?.value;
    admiEditar.tipo = this.formEdit.get('rol')?.value;
    admiEditar.apellidos = this.formEdit.get('apellidos')?.value;
    admiEditar.cedula = this.formEdit.get('cedula')?.value;
    admiEditar.ciudad = this.formEdit.get('ciudad')?.value;
    admiEditar.emailNuevo = this.formEdit.get('correo')?.value;
    admiEditar.genero = this.formEdit.get('genero')?.value;
    admiEditar.telefono = this.formEdit.get('telefono')?.value;
    admiEditar.estado = this.formEdit.get('estado')?.value;
     console.log( this.formEdit)
    if (this.formEdit.status == "INVALID") {
      console.log("Invalid")
      return;
    } else {
      this.pythonAnywhereService.actualizar_administrador(id, admiEditar).subscribe(resp => {console.log(resp)
        this.pythonAnywhereService.obtener_administradores().subscribe(resp => {
          this.total = resp.total_objects
          this.arr_admi = resp.results;
          this.arr_filtered_admi = this.arr_admi;
          console.log(resp, "resp");
          console.log(this.arr_filtered_admi)
          this.currentPage = 1;
        });
      })
    }
  }

  limpiarForm(tipo: string) {
    if(tipo === 'crear') {
      this.existImageCrear = false;
      this.admiCrear.get('nombre')?.reset();
      this.admiCrear.get('apellidos')?.reset();
      this.admiCrear.get('ciudad')?.reset();
      this.admiCrear.get('telefono')?.reset();
      this.admiCrear.get('genero')?.reset();
      this.admiCrear.get('rol')?.reset();
      this.admiCrear.get('correo')?.reset();
      this.admiCrear.get('password')?.reset();
      this.admiCrear.get('confirmPassword')?.reset();
      this.admiCrear.get('imagen')?.reset();

    } else if(tipo === 'actualizar') {
      // console.log(this.profesion_seleccionada);
      // console.log('Servicio de la profesion seleccionada: ', this.profesion_seleccionada?.servicio[0].nombre);
      const nombre = this.admi_seleccionada?.user_datos.nombres;
      const apellidos = this.admi_seleccionada?.user_datos.apellidos;
      const telefono = this.admi_seleccionada?.user_datos.telefono;
      const cedula = this.admi_seleccionada?.user_datos.cedula;
      const correo = this.admi_seleccionada?.user_datos.user.email;
      const genero = this.admi_seleccionada?.user_datos.genero;
      const ciudad = this.admi_seleccionada?.user_datos.ciudad;
      const rol = this.admi_seleccionada?.user_datos.user.groups[0].name;
      const foto = this.admi_seleccionada?.user_datos.foto;
      // const contra = this.admi_seleccionada?.user_datos.password;
      const estado = this.admi_seleccionada?.user_datos.estado;
      this.existImageActualizar = false;
      this.formEdit.get('imagen')?.reset();
      nombre? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
      apellidos? this.formEdit.get('apellidos')?.setValue(apellidos) : this.formEdit.get('apellidos')?.reset();
      telefono? this.formEdit.get('telefono')?.setValue(telefono) : this.formEdit.get('telefono')?.reset();
      cedula? this.formEdit.get('cedula')?.setValue(cedula) : this.formEdit.get('cedula')?.reset();
      correo? this.formEdit.get('correo')?.setValue(correo) : this.formEdit.get('correo')?.reset();
      genero? this.formEdit.get('genero')?.setValue(genero) : this.formEdit.get('genero')?.reset();
      ciudad? this.formEdit.get('ciudad')?.setValue(ciudad) : this.formEdit.get('ciudad')?.reset();
      // contra? this.formEdit.get('password')?.setValue(contra) : this.formEdit.get('password')?.reset();
      rol? this.formEdit.get('rol')?.setValue(rol) : this.formEdit.get('rol')?.reset();
      if(estado != undefined) this.formEdit.get('estado')?.setValue(estado)
    } else {
      console.log('Se paso algo erroneo en limpiar form');
    }
  }

  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_admi = this.arr_admi;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_admi = this.arr_filtered_admi?.filter((solicitud) => {
        return solicitud.user_datos.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }}

    cambiarEstado(event:any){
      let estado = event.srcElement.checked
      const id = this.admi_seleccionada.id
      this.pythonAnywhereService.cambio_administrador_estado(id,estado).subscribe(resp=>{
        console.log(resp)
        this.pythonAnywhereService.obtener_administradores().subscribe(resp => {
          this.total = resp.total_objects
          this.arr_admi = resp.results;
          this.arr_filtered_admi = this.arr_admi;
          console.log(resp, "resp");
          console.log(this.arr_filtered_admi)
          this.currentPage = 1;
        });
      })
    }

    crearAdministrador() {
      this.showHeader = false;
      this.showHeaderC = true;
      this.showadmi = false;
    }
  
    cancelar() {
      this.showHeader = true;
      this.showHeaderC = false;
      this.showadmi = false;
    }
  
    editar(admi: any) {
      this.admi_seleccionada = admi;
      this.showHeader = false;
      this.showHeaderC = false;
      this.showadmi = true;
    }
  
    filtrarPorFechas() {
      if (this.fechaInicio && this.fechaFin) {
        const fechaInicio = new Date(this.fechaInicio);
        const fechaFin = new Date(this.fechaFin);
  
        this.arr_filtered_admi = this.arr_admi.filter(a => {
          const fechaCreacion = new Date(a.user_datos.fecha_creacion);
          if (this.fechaInicio && this.fechaFin) {
            return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
          }
          return true;
        });
      }
    }
}