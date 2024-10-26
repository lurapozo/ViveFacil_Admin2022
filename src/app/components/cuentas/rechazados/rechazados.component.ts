import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyEmail } from 'src/app/interfaces/email';
import { BodyActualizarProveedorPendiente, BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, SerializerCrearProveedorPendiente } from 'src/app/interfaces/proveedor';
import { Solicitante2 } from 'src/app/interfaces/solicitante2';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-rechazados',
  templateUrl: './rechazados.component.html',
  styleUrls: ['./rechazados.component.css']
})
export class RechazadosComponent {
  fechaInicio: Date | null = null; 
  fechaFin: Date | null = null; 
  fechasFiltradas: any[] = [];

  showHeader: boolean = true;
  showHeaderC: boolean = false;
  showadmi: boolean = false;
  nombre: any;

  filePDF: File| null = null;
  filePDF1: File| null = null;
  filePDF2: File| null = null;
  filePDF3: File| null = null;
  fileImgPerfil: File| null = null;
  fileImgPerfil1: File| null = null;
  fileImgPerfil2: File| null = null;
  fileImgPerfil3: File| null = null;

  generos = ['Masculino', 'Femenino', 'Otro'];
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  licencia = ['Si', 'No'];
  tipoCuentas = ['Ahorro', 'Corriente'];
  profesiones: string[] = [];
  total = 0
  arr_rechazados!: any[];
  arr_filtered_rechazados!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  rechazados_seleccionada: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isAceptar = false; isNegar = false;
  habilitar = ''
  mostrar1=false
  mostrar2=false
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
    direccion: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    profesion: new FormControl('', [Validators.required]),
    licencia: new FormControl('', [Validators.required]),
    copiaCedula: new FormControl('', [Validators.required]),
    tipo_cuenta: new FormControl('', [Validators.required]),
    numeroCuenta: new FormControl('', [Validators.required]),
    banco: new FormControl('', [Validators.required]),
    experiencia: new FormControl('', [Validators.required]),
    copiaLicencia: new FormControl(''),
    documentos: new FormControl(''),
    descripcion: new FormControl(''),
    foto: new FormControl('', [Validators.required]),
  });

  constructor(
    private pythonAnywhereService: PythonAnywhereService,
    private userService: UserService, 
    private sanitizer: DomSanitizer
    ) {
    

    this.pythonAnywhereService.obtener_proveedores_rechazados().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_rechazados = Object(resp).results;

      this.arr_filtered_rechazados = this.arr_rechazados;
      console.log(this.arr_filtered_rechazados)
      if (Object(resp).next != null) {
        this.condicionNext = true
      }
      console.log(Object(resp).total_pages)
      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index)

      }

    });

    this.pythonAnywhereService.obtener_servicios().subscribe(resp => {
      console.log(resp)
      for (let i=0; i<resp.length; i++){
        this.profesiones.push(resp[i].nombre)
      }
    });
  }

  ngOnInit() {
    this.loadGeneros();
    this.loadCiudades();
  }
  
  loadGeneros() {
    this.generos = ['Masculino', 'Femenino', 'Otro']; 
  }

  loadCiudades() {
    this.ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  }
  
  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_rechazados = this.arr_rechazados;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_rechazados = this.arr_filtered_rechazados?.filter((solicitud) => {
        return solicitud.nombres.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

  establecerMensaje(mensaje: string, tipo: string) {

    if (tipo === 'aceptar') {
      this.isAceptar = true;
      this.isNegar = false;
    }
    else if (tipo === 'negar') {
      this.isAceptar = false;
      this.isNegar = true;
    } else if (tipo === 'editar') {
      this.isAceptar = false;
      this.isNegar = false;
    }

    this.mensajeAlerta = mensaje;
  }

  onNegar() {
    let pendiente: BodyCrearProveedorPendiente = {
      nombres: this.rechazados_seleccionada.nombres,
      apellidos: this.rechazados_seleccionada.apellidos,
      genero: this.rechazados_seleccionada.genero,
      telefono: this.rechazados_seleccionada.telefono,
      cedula: this.rechazados_seleccionada.cedula,
      copiaCedula: this.rechazados_seleccionada.copiaCedula,
      ciudad: this.rechazados_seleccionada.ciudad,
      direccion: this.rechazados_seleccionada.direccion,
      email: this.rechazados_seleccionada.email,
      descripcion: this.rechazados_seleccionada.descripcion,
      licencia: this.rechazados_seleccionada.licencia,
      copiaLicencia: this.rechazados_seleccionada.copiaLicencia,
      profesion: this.rechazados_seleccionada.profesion,
      ano_experiencia: this.rechazados_seleccionada.ano_experiencia,
      banco: this.rechazados_seleccionada.banco,
      numero_cuenta: this.rechazados_seleccionada.numero_cuenta,
      tipo_cuenta: this.rechazados_seleccionada.tipo_cuenta,
      planilla_servicios: this.rechazados_seleccionada.planilla_servicios,
      foto: this.rechazados_seleccionada.foto
    }
    this.pythonAnywhereService.eliminar_proveedores_rechazados(this.rechazados_seleccionada.id).subscribe(resp => {
      console.log(resp)
      this.pythonAnywhereService.obtener_proveedores_rechazados().subscribe(resp => {
        this.total = Object(resp).total_objects
        this.arr_rechazados = Object(resp).results;
        this.arr_filtered_rechazados = this.arr_rechazados;
        console.log(resp, "resp");
        console.log(this.arr_filtered_rechazados)
        this.currentPage = 1;
  
      });
    })
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnlyPluss(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getErrorMessage(formGroup: FormGroup, item: string): string {
    const itemControl: FormControl = formGroup.get(item) as FormControl;
    switch (item) {

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
      case 'licencia':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'genero':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'copiaCedula':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'ciudad':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'descripcion':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'correo':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'tipoCuenta':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'numeroCuenta':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'experiencia':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'profesion':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'experiencia':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'descripcion':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      default:
        return '';
    }
  }

  limpiarForm() {


    const nombre = this.rechazados_seleccionada?.nombres;
    const apellidos = this.rechazados_seleccionada?.apellidos;
    const telefono = this.rechazados_seleccionada?.telefono;
    const cedula = this.rechazados_seleccionada?.cedula;
    const correo = this.rechazados_seleccionada?.email;
    const genero = this.rechazados_seleccionada?.genero;
    const ciudad = this.rechazados_seleccionada?.ciudad;
    const direccion = this.rechazados_seleccionada?.direccion;
    const licencia = this.rechazados_seleccionada?.licencia;
    const copiaCedula = this.rechazados_seleccionada?.copiaCedula;
    const profesion = this.rechazados_seleccionada?.profesion;
    const experiencia = this.rechazados_seleccionada?.ano_experiencia;
    const banco = this.rechazados_seleccionada?.banco;
    const numeroCuenta = this.rechazados_seleccionada?.numero_cuenta;
    const copiaLicencia = this.rechazados_seleccionada?.copiaLicencia;
    const tipo_cuenta = this.rechazados_seleccionada?.tipo_cuenta;
    const documentos: any[] = this.rechazados_seleccionada?.documentsPendientes;
    const descripcion = this.rechazados_seleccionada?.descripcion;

    nombre ? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
    apellidos ? this.formEdit.get('apellidos')?.setValue(apellidos) : this.formEdit.get('apellidos')?.reset();
    telefono ? this.formEdit.get('telefono')?.setValue(telefono) : this.formEdit.get('telefono')?.reset();
    cedula ? this.formEdit.get('cedula')?.setValue(cedula) : this.formEdit.get('cedula')?.reset();
    correo ? this.formEdit.get('correo')?.setValue(correo) : this.formEdit.get('correo')?.reset();
    genero ? this.formEdit.get('genero')?.setValue(genero) : this.formEdit.get('genero')?.reset();
    ciudad ? this.formEdit.get('ciudad')?.setValue(ciudad) : this.formEdit.get('ciudad')?.reset();
    direccion ? this.formEdit.get('direccion')?.setValue(ciudad) : this.formEdit.get('direccion')?.reset();
    licencia ? this.formEdit.get('licencia')?.setValue(ciudad) : this.formEdit.get('licencia')?.reset();
    copiaCedula ? this.formEdit.get('copiaCedula')?.setValue(ciudad) : this.formEdit.get('copiaCedula')?.reset();
    profesion ? this.formEdit.get('profesion')?.setValue(ciudad) : this.formEdit.get('profesion')?.reset();
    experiencia ? this.formEdit.get('experiencia')?.setValue(ciudad) : this.formEdit.get('experiencia')?.reset();
    banco ? this.formEdit.get('banco')?.setValue(ciudad) : this.formEdit.get('banco')?.reset();
    numeroCuenta ? this.formEdit.get('numeroCuenta')?.setValue(ciudad) : this.formEdit.get('numeroCuenta')?.reset();
    copiaLicencia ? this.formEdit.get('copiaLicencia')?.setValue(ciudad) : this.formEdit.get('copiaLicencia')?.reset();
    tipo_cuenta ? this.formEdit.get('tipo_cuenta')?.setValue(ciudad) : this.formEdit.get('tipo_cuenta')?.reset();
    documentos ? this.formEdit.get('documentos')?.setValue(ciudad) : this.formEdit.get('documentos')?.reset();
    descripcion ? this.formEdit.get('descripcion')?.setValue(ciudad) : this.formEdit.get('descripcion')?.reset();

  }

  onActualizar() {
    const pendiente: BodyActualizarProveedorPendiente = {
      nombres: this.formEdit.get('nombre')?.value,
      apellidos: this.formEdit.get('apellidos')?.value,
      ciudad: this.formEdit.get('ciudad')?.value,
      direccion: this.formEdit.get('direccion')?.value,
      genero: this.formEdit.get('apellidos')?.value,
      licencia: this.formEdit.get('licencia')?.value,
      copiaLicencia: this.formEdit.get('copiaLicencia')?.value,
      copiaCedula: this.formEdit.get('copiaCedula')?.value,
      filesDocuments: this.formEdit.get('documentos')?.value,
      cedula: this.formEdit.get('cedula')?.value,
      telefono: this.formEdit.get('telefono')?.value,
      descripcion: this.formEdit.get('descripcion')?.value,
      email: this.formEdit.get('correo')?.value,
      banco: this.formEdit.get('banco')?.value,
      numero_cuenta: this.formEdit.get('numeroCuenta')?.value,
      tipo_cuenta: this.formEdit.get('tipo_cuenta')?.value,
      ano_experiencia: this.formEdit.get('experiencia')?.value,
      profesion: this.formEdit.get('profesion')?.value,
      foto: this.formEdit.get('foto')?.value
    }
    const id = this.rechazados_seleccionada.id

    console.log(this.formEdit)
    if (this.formEdit.status == "INVALID") {

      return;
    } else {
      this.pythonAnywhereService.editar_proveedor_pendiente(id, pendiente).subscribe(resp => {
        console.log(resp)
        this.pythonAnywhereService.obtener_proveedores_rechazados().subscribe(resp => {
          this.total = Object(resp).total_objects
          this.arr_rechazados = Object(resp).results;
          this.arr_filtered_rechazados = this.arr_rechazados;
          console.log(resp, "resp");
          console.log(this.arr_filtered_rechazados)
          this.currentPage = 1;
    
        });
      })
    }
  }

  isInvalidForm(subForm: string) {


    return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty && this.getErrorMessage(this.formEdit, subForm).length !== 0;

  }

  
  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_proveedores_proveedores(this.currentPage).subscribe(resp => {
      this.arr_rechazados = resp.results;
      this.arr_filtered_rechazados = this.arr_rechazados;
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_proveedores_proveedores(this.currentPage).subscribe(resp => {
      this.arr_rechazados = resp.results;
      this.arr_filtered_rechazados = this.arr_rechazados;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_proveedores_proveedores(event.target.value).subscribe(resp => {
      this.arr_rechazados = resp.results;
      this.arr_filtered_rechazados = this.arr_rechazados;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      this.arr_filtered_rechazados= this.arr_rechazados.filter(a => {
        const fechaCreacion = new Date(a.fecha_registro );
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }

  loadImageFromDevice(event:any) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.foto=file;
        this.fileImgPerfil = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
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
      return null;

    } catch (e) {
      return null;
    }
  });

  
  loadPdfFromDevice(event:any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Cedula")
    console.log(event.target.files)
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.copiaCedula=file;
        this.filePDF = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  loadImageFromDeviceCI(event:any) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.copiaCedula=file;
        this.fileImgPerfil1 = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  loadImageFromDeviceLI(event:any) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.copiaLicencia=file;
        this.fileImgPerfil2 = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  loadImageFromDeviceDocCurri(event:any) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.filesDocuments=file;
        this.fileImgPerfil3 = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  loadPdfFromDeviceCI(event:any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Cedula")
    console.log(event.target.files)
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.copiaCedula=file;
        this.filePDF1 = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };


  loadPdfFromDeviceLI(event:any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Licencia")
    console.log(event.target.files)
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.copiaLicencia=file;
        this.filePDF2 = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  loadPdfFromDeviceDocCurri(event:any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Curriculum")
    console.log(event.target.files)
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.documentos=file;
        this.filePDF3= file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  
  loadFileFromDevice(event: any, formField: string) {
    const file: File = event.target.files[0];  
    if (file) {
      const fileType = file.type;  
      if(formField== 'copiaCedula'){
        if (fileType.includes('image')) {
          this.loadImageFromDeviceCI(event); 
          console.log("Archivo Cedula image")
        } else if (fileType === 'application/pdf') {
          this.loadPdfFromDeviceCI(event); 
          console.log("Archivo Cedula pdf")
        } 
      }else if(formField== 'copiaLicencia'){
        if (fileType.includes('image')) {
          this.loadImageFromDeviceLI(event); 
          console.log("Archivo Licencia image")
        } else if (fileType === 'application/pdf') {
          this.loadPdfFromDeviceLI(event); 
          console.log("Archivo Licencia pdf")
        } 
      }else if(formField== 'curriculum'){
        if (fileType.includes('image')) {
          this.loadImageFromDeviceDocCurri(event); 
          console.log("Archivo Curriculum image")
        } else if (fileType === 'application/pdf') {
          this.loadPdfFromDeviceDocCurri(event); 
          console.log("Archivo Currilculum pdf")
        } 
      }   
    }
  } 

  getNombreArchivo(tipo: string, archivo: File): { nombreArchivo: string, archivo: File| null } {
    const { nombres, apellidos } = this.rechazados_seleccionada || {};
    
    const archivoUrl = this.rechazados_seleccionada?.[tipo]; 
    
    const extension = archivoUrl ? archivoUrl.split('.').pop() : 'pdf'; 
  
    if (!nombres || !apellidos) {
      return { nombreArchivo: 'archivo_descargado', archivo: null };
    }
    
    // Si el tipo está definido, formateamos el nombre del archivo
    if (tipo != '' && archivo!=null) {
      this.nombre = `${nombres}_${apellidos}_${tipo}.${extension}`;
      return { nombreArchivo: this.nombre , archivo };
    }
    
    // Retorna un nombre de archivo predeterminado si no se proporciona un tipo
    return { nombreArchivo: 'No hay documento disponible', archivo : null};
  }

  edit_rec(a: any) {
    this.showHeader = false;
    this.showHeaderC = true;
    this.rechazados_seleccionada = a;
  }
}