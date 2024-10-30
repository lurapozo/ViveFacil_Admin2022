import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyEmail } from 'src/app/interfaces/email';
import { BodyActualizarProveedorPendiente, BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, SerializerCrearProveedorPendiente } from 'src/app/interfaces/proveedor';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent {
  fechaInicio: Date | null = null; 
  fechaFin: Date | null = null; 
  fechasFiltradas: any[] = [];

  showHeader: boolean = true;
  showHeaderC: boolean = false;
  showadmi: boolean = false;
  nombre: any;
  selectedDate: string | null = null;
  generos = ['Masculino', 'Femenino', 'Otro'];
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  tipoCuentas = ['Ahorro', 'Corriente'];
  licencia = ['Si', 'No'];
  total = 0
  arr_proveedor!: any[];
  arr_filtered_proveedor!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  proveedor_seleccionado: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isAceptar = false; isNegar = false;
  habilitar = ''
  mostrar1=false
  filePDF: File| null = null;
  filePDF1: File| null = null;
  filePDF2: File| null = null;
  filePDF3: File| null = null;
  fileImgPerfil: File| null = null;
  fileImgPerfil1: File| null = null;
  fileImgPerfil2: File| null = null;
  fileImgPerfil3: File| null = null;
  profesiones: string[] = [];
  copiaCedulaNombre= null;
  copiaLicenciaNombre= null;
  copiaDocumentosNombre= null;
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
    licencia: new FormControl(''),
    copiaCedula: new FormControl(this.filePDF),
    tipo_cuenta: new FormControl('', [Validators.required]),
    numero_cuenta: new FormControl('', [Validators.required]),
    banco: new FormControl('', [Validators.required]),
    ano_profesion: new FormControl('', [Validators.required]),
    copiaLicencia: new FormControl(this.filePDF2),
    descripcion: new FormControl(''),
    foto: new FormControl(this.fileImgPerfil),
    documentos: new FormControl([this.filePDF3]),
  });

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_proveedores_proveedores().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_proveedor = Object(resp).results;
      console.log(resp, "resp")
      this.arr_filtered_proveedor = this.arr_proveedor;
      console.log(this.arr_filtered_proveedor)
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
        this.profesiones= [...this.profesiones, resp[i].nombre];
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
    this.arr_filtered_proveedor = this.arr_proveedor;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_proveedor = this.arr_filtered_proveedor?.filter((solicitud) => {
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
      nombres: this.proveedor_seleccionado.user_datos.nombres,
      apellidos: this.proveedor_seleccionado.apellidos,
      genero: this.proveedor_seleccionado.genero,
      telefono: this.proveedor_seleccionado.telefono,
      cedula: this.proveedor_seleccionado.cedula,
      copiaCedula: this.proveedor_seleccionado.copiaCedula,
      ciudad: this.proveedor_seleccionado.ciudad,
      direccion: this.proveedor_seleccionado.direccion,
      email: this.proveedor_seleccionado.email,
      descripcion: this.proveedor_seleccionado.descripcion,
      licencia: this.proveedor_seleccionado.licencia,
      copiaLicencia: this.proveedor_seleccionado.copiaLicencia,
      profesion: this.proveedor_seleccionado.profesion,
      ano_experiencia: this.proveedor_seleccionado.ano_profesion,
      banco: this.proveedor_seleccionado.banco,
      numero_cuenta: this.proveedor_seleccionado.numero_cuenta,
      tipo_cuenta: this.proveedor_seleccionado.tipo_cuenta,
      planilla_servicios: this.proveedor_seleccionado.planilla_servicios,
      foto: this.proveedor_seleccionado.foto
    }
    this.pythonAnywhereService.eliminar_proveedores(this.proveedor_seleccionado.id).subscribe(resp => {
      console.log(resp)
      this.pythonAnywhereService.obtener_proveedores_proveedores().subscribe(resp => {
        this.total = Object(resp).total_objects
        this.arr_proveedor = Object(resp).results;
        this.arr_filtered_proveedor = this.arr_proveedor;
        console.log(resp, "resp")
        console.log(this.arr_filtered_proveedor)
        this.currentPage = 1;  
      });
    })
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
      case 'tipo_cuenta':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'numero_cuenta':
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
      default:
        return '';
    }
  }

  limpiarForm() {
    const nombre = this.proveedor_seleccionado?.user_datos.nombres;
    const apellidos = this.proveedor_seleccionado?.user_datos.apellidos;
    const telefono = this.proveedor_seleccionado?.user_datos.telefono;
    const cedula = this.proveedor_seleccionado?.user_datos.cedula;
    const correo = this.proveedor_seleccionado?.user_datos.user.email;
    const genero = this.proveedor_seleccionado?.user_datos.genero;
    const ciudad = this.proveedor_seleccionado?.user_datos.ciudad;
    const direccion = this.proveedor_seleccionado?.user_datos.direccion;
    const licencia = this.proveedor_seleccionado?.licencia;
    const copiaCedula = this.proveedor_seleccionado?.copiaCedula;
    const profesion = this.proveedor_seleccionado?.profesion;
    const ano_experiencia = this.proveedor_seleccionado?.user_datos.ano_profesion;
    const banco = this.proveedor_seleccionado?.user_datos.banco;
    const numero_cuenta = this.proveedor_seleccionado?.user_datos.numero_cuenta;
    const copiaLicencia = this.proveedor_seleccionado?.copiaLicencia;
    const tipo_cuenta = this.proveedor_seleccionado?.tipo_cuenta;
    const documentos: any[] = this.proveedor_seleccionado?.user_datos.documentsPendientes;
    const descripcion = this.proveedor_seleccionado?.user_datos.descripcion;
    const foto = this.proveedor_seleccionado?.foto;

    nombre ? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
    apellidos ? this.formEdit.get('apellidos')?.setValue(apellidos) : this.formEdit.get('apellidos')?.reset();
    telefono ? this.formEdit.get('telefono')?.setValue(telefono) : this.formEdit.get('telefono')?.reset();
    cedula ? this.formEdit.get('cedula')?.setValue(cedula) : this.formEdit.get('cedula')?.reset();
    correo ? this.formEdit.get('correo')?.setValue(correo) : this.formEdit.get('correo')?.reset();
    genero ? this.formEdit.get('genero')?.setValue(genero) : this.formEdit.get('genero')?.reset();
    ciudad ? this.formEdit.get('ciudad')?.setValue(ciudad) : this.formEdit.get('ciudad')?.reset();
    direccion ? this.formEdit.get('direccion')?.setValue(direccion) : this.formEdit.get('direccion')?.reset();
    licencia ? this.formEdit.get('licencia')?.setValue(licencia) : this.formEdit.get('licencia')?.reset();
    copiaCedula ? this.formEdit.get('copiaCedula')?.setValue(copiaCedula) : this.formEdit.get('copiaCedula')?.reset();
    profesion ? this.formEdit.get('profesion')?.setValue(profesion) : this.formEdit.get('profesion')?.reset();
    ano_experiencia ? this.formEdit.get('ano_experiencia')?.setValue(ano_experiencia) : this.formEdit.get('ano_experiencia')?.reset();
    banco ? this.formEdit.get('banco')?.setValue(banco) : this.formEdit.get('banco')?.reset();
    numero_cuenta ? this.formEdit.get('numero_cuenta')?.setValue(numero_cuenta) : this.formEdit.get('numero_Cuenta')?.reset();
    copiaLicencia ? this.formEdit.get('copiaLicencia')?.setValue(copiaLicencia) : this.formEdit.get('copiaLicencia')?.reset();
    tipo_cuenta ? this.formEdit.get('tipo_cuenta')?.setValue(tipo_cuenta) : this.formEdit.get('tipo_cuenta')?.reset();
    documentos ? this.formEdit.get('documentos')?.setValue(documentos) : this.formEdit.get('documentos')?.reset();
    descripcion ? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
    foto ? this.formEdit.get('foto')?.setValue(foto) : this.formEdit.get('foto')?.reset();
  }

  prepararCaducidad(){
    const ddasda = this.proveedor_seleccionado?.fecha_caducidad
  }
  onActualizar() {
    const proveedor: BodyActualizarProveedorPendiente = {
      nombres: this.formEdit.value.nombre,
      apellidos: this.formEdit.value.apellidos,
      genero: this.formEdit.value.genero,
      telefono: this.formEdit.value.telefono,
      cedula: this.formEdit.value.cedula,
      ciudad: this.formEdit.value.ciudad,
      direccion: this.formEdit.value.direccion,
      email: this.formEdit.value.correo,
      descripcion: this.formEdit.value.descripcion,
      licencia: this.formEdit.value.licencia,
      profesion: this.formEdit.value.profesion,
      ano_experiencia: this.formEdit.value.ano_profesion,
      banco: this.formEdit.value.banco,
      numero_cuenta: this.formEdit.value.numero_cuenta,
      tipo_cuenta: this.formEdit.value.tipo_cuenta,
      foto: this.fileImgPerfil,
      //planilla_servicios: this.formEdit.value.planilla_servicios
      filesDocuments: [this.filePDF3 || this.fileImgPerfil3],
      copiaLicencia: this.filePDF2 || this.fileImgPerfil2,
      copiaCedula: this.filePDF1 || this.fileImgPerfil1,
    }
    const id = this.proveedor_seleccionado.id

    console.log("VALORES DEL COSO")
    console.log(this.formEdit)
    console.log("LA COSAS ESAS LASMASD")
    console.log(proveedor)
    console.log("profesion: " + proveedor.profesion)
    if(proveedor.descripcion === ""){
      // if(this.pendiente_seleccionada.descripcion === ""){
      //   pendiente.descripcion = " "
      // }
      proveedor.descripcion = this.proveedor_seleccionado.descripcion
    }
    this.pythonAnywhereService.editar_proveedor_proveedor(id, proveedor).subscribe(resp => {
      console.log(resp)
      this.pythonAnywhereService.obtener_proveedores_proveedores().subscribe(resp => {
        this.total = Object(resp).total_objects
        this.arr_proveedor = Object(resp).results;
        console.log(resp, "resp")
        this.arr_filtered_proveedor = this.arr_proveedor;
        console.log(this.arr_filtered_proveedor)
        this.currentPage = 1;  
      });
    })
    
  }

  isInvalidForm(subForm: string) {
    return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty && this.getErrorMessage(this.formEdit, subForm).length !== 0;
  }
  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_proveedores_proveedores(this.currentPage).subscribe(resp => {
      this.arr_proveedor = resp.results;
      this.arr_filtered_proveedor = this.arr_proveedor;
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_proveedores_proveedores(this.currentPage).subscribe(resp => {
      this.arr_proveedor = resp.results;
      this.arr_filtered_proveedor = this.arr_proveedor;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_proveedores_proveedores(event.target.value).subscribe(resp => {
      this.arr_proveedor = resp.results;
      this.arr_filtered_proveedor = this.arr_proveedor;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }
  funcionMostar(){
    console.log("asdasdasdasdasxzczxcfwef")
    console.log(this.proveedor_seleccionado)
    console.log(this.proveedor_seleccionado.copiaLicencia)
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

  loadPdf2FromDevice(event:any) {
    const file: File = event.target.files[0];
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

  loadPdf3FromDevice(event:any) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        this.formEdit.value.copiaLicencia=file;
        this.filePDF3 = file;
        // this.imgPerfil = imagen.base;
      })
      .catch(err => console.log(err));
    }
  };

  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numberOnlyPluss(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  actualizarCaducidad(number:any){
    let inputValue = number

    let pendiente ={
      id: this.proveedor_seleccionado.id,
      input: inputValue
    }
    this.pythonAnywhereService.actualizarCaducidad(this.proveedor_seleccionado.id, pendiente).subscribe(resp => {
      console.log(resp)
      this.pythonAnywhereService.obtener_proveedores_proveedores().subscribe(resp => {
        this.total = Object(resp).total_objects
        this.arr_proveedor = Object(resp).results;
        this.arr_filtered_proveedor = this.arr_proveedor;
        console.log(resp, "resp")
        console.log(this.arr_filtered_proveedor)
        this.currentPage = 1;  
      });
    })
  }

  
  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      this.arr_filtered_proveedor= this.arr_proveedor.filter(a => {
        const fechaCreacion1 = new Date(a.user_datos.fecha_creacion);
        const fechaCreacion = new Date(a.fecha_caducidad );
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion1 >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }
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
    const { nombres, apellidos } = this.proveedor_seleccionado|| {};
    
    const archivoUrl = this.proveedor_seleccionado?.[tipo]; 
    
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

  edit_prov(a: any) {
    this.showHeader = false;
    this.showHeaderC = true;
    this.proveedor_seleccionado = a;    
  }
}
