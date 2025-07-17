import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { BodyEmail } from 'src/app/interfaces/email';
import { BodyActualizarProveedorPendiente, BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, SerializerCrearProveedorPendiente } from 'src/app/interfaces/proveedor';
import { Solicitante2 } from 'src/app/interfaces/solicitante2';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.css']
})
export class PendientesComponent {
  @ViewChild('modalConfirmacion4') modalConfirmacion4: ElementRef | any;
  @ViewChild('fileInput1') fileInput1!: ElementRef;
  generos: string[];
  ciudades: string[];
  tipoCuentas: string[];
  licencia: string[];
  profesiones: string[] = [];
  total = 0
  arr_pendiente!: any[];
  arr_filtered_pendiente!: any[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  pendiente_seleccionada: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isAceptar = true; isNegar = true;
  habilitar = ''
  mostrar1 = false;
  mostrar2 = false;
  fileImgPerfil: File | null = null;
  fileImgPerfil1: File | null = null;
  fileImgPerfil2: File | null = null;
  fileImgPerfil3: File | null = null;
  filePDF: File | null = null;
  filePDF1: File | null = null;
  filePDF2: File | null = null;
  filePDF3: File | null = null;
  copiaCedulaNombre = null;
  copiaLicenciaNombre = null;
  copiaDocumentosNombre = null;
  mensajeIncompleto: string[] = [];
  mensajeIncompletoString = 'Campos completos';
  nombre: any;

  // imgPerfil: string| null = null;

  showHeader: boolean = true;
  showHeaderC: boolean = false;
  showadmi: boolean = false;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechasFiltradas: any[] = [];

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
    licencia: new FormControl('',),
    copiaCedula: new FormControl(this.filePDF1 || this.fileImgPerfil1 || ''),
    tipo_cuenta: new FormControl('', [Validators.required]),
    numero_cuenta: new FormControl('', [Validators.required]),
    banco: new FormControl('', [Validators.required]),
    ano_experiencia: new FormControl('', [Validators.required]),
    copiaLicencia: new FormControl(this.filePDF2 || this.fileImgPerfil2 || ''),
    documentos: new FormControl(''),
    descripcion: new FormControl(''),
    foto: new FormControl(this.fileImgPerfil),
    filesDocuments: new FormControl([this.filePDF3 || this.fileImgPerfil3 || '']),
    // foto: new FormControl('', [Validators.required]),
  });
  formNegar: FormGroup = new FormGroup({
    razon: new FormControl(''),
  });
  apiUrl=environment.apiUrl;
  constructor(
    private pythonAnywhereService: PythonAnywhereService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {
    this.generos = ['Masculino', 'Femenino', 'Otro'];
    this.ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
    this.tipoCuentas = ['Ahorro', 'Corriente'];
    this.licencia = ['Si', 'No'];
  }

  ngOnInit() {
    this.get_servicios();
    this.get_proveedores_pendientes_act();
    this.get_proveedores_pendientes();
  }

  resetFileInput() {
    if (this.fileInput1 && (this.fileInput1.nativeElement.value === null || this.fileInput1.nativeElement.value === undefined)) {
      this.fileInput1.nativeElement.value = ''; 
    }
  }

  get_proveedores_pendientes() {
    this.pythonAnywhereService.obtener_proveedores_pendientes().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_pendiente = Object(resp).results;
      this.arr_filtered_pendiente = this.arr_pendiente;
      console.log(resp, "resp");
      console.log(this.arr_filtered_pendiente)
      if (Object(resp).next != null) {
        this.condicionNext = true
      }
      console.log(Object(resp).total_pages)
      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index)
      }
    });
  }

  get_proveedores_pendientes_act() {
    this.pythonAnywhereService.obtener_proveedores_pendientes().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_pendiente = Object(resp).results;
      this.arr_filtered_pendiente = this.arr_pendiente;
      console.log(resp, "resp");
      console.log(this.arr_filtered_pendiente)
      this.currentPage = 1;
    });
  }

  get_servicios() {
    this.pythonAnywhereService.obtener_servicios().subscribe(resp => {
      console.log(resp)
      for (let i = 0; i < resp.length; i++) {
        this.profesiones = [...this.profesiones, resp[i].nombre];
      }
    });
  }

  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_pendiente = this.arr_pendiente;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_pendiente = this.arr_filtered_pendiente?.filter((solicitud) => {
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
    } else if (tipo === 'actualizar') {
      this.isAceptar = false;
      this.isNegar = false;
    }
    this.mensajeAlerta = mensaje;
  }

  onCrear() {
    let pendiente: BodyCrearProveedorPendiente = {
      nombres: this.pendiente_seleccionada.nombres + "1",
      apellidos: this.pendiente_seleccionada.apellidos + "1",
      genero: this.pendiente_seleccionada.genero,
      telefono: this.pendiente_seleccionada.telefono,
      cedula: this.pendiente_seleccionada.cedula,
      copiaCedula: this.pendiente_seleccionada.copiaCedula,
      ciudad: this.pendiente_seleccionada.ciudad,
      direccion: this.pendiente_seleccionada.direccion,
      email: this.pendiente_seleccionada.email,
      descripcion: this.pendiente_seleccionada.descripcion,
      licencia: this.pendiente_seleccionada.licencia,
      copiaLicencia: this.pendiente_seleccionada.copiaLicencia,
      profesion: this.pendiente_seleccionada.profesion,
      ano_experiencia: this.pendiente_seleccionada.ano_experiencia,
      banco: this.pendiente_seleccionada.banco,
      numero_cuenta: this.pendiente_seleccionada.numero_cuenta,
      tipo_cuenta: this.pendiente_seleccionada.tipo_cuenta,
      planilla_servicios: this.pendiente_seleccionada.planilla_servicios,
      foto: this.pendiente_seleccionada.foto
    }
    console.log(pendiente.profesion)

    this.pythonAnywhereService.crear_proveedor_pendiente(pendiente).subscribe(resp => {
      console.log(resp)
      this.pythonAnywhereService.obtener_proveedores_pendientes().subscribe(resp => {
        this.total = Object(resp).total_objects
        this.arr_pendiente = Object(resp).results;
        this.arr_filtered_pendiente = this.arr_pendiente;
        console.log(resp, "resp");
        console.log(this.arr_filtered_pendiente)
        this.currentPage = 1;
      });
    })
    /*let email: BodyEmail = {
      password: '1234',
      email: this.pendiente_seleccionada.email,
      tipo: 'Proveedor'
    }
    this.pythonAnywhereService.enviar_email(email).subscribe(resp => {
      console.log(resp)
    })*/

  }

  onEditar() {
    this.get_proveedores_pendientes_act();
    this.resetFileInput();
    let pendiente: BodyActualizarProveedorPendiente = {
      nombres: this.formEdit.value.nombre,
      apellidos: this.formEdit.value.apellidos,
      genero: this.formEdit.value.genero,
      telefono: this.formEdit.value.telefono,
      cedula: this.formEdit.value.cedula,
      copiaCedula: this.filePDF1 || this.fileImgPerfil1,
      ciudad: this.formEdit.value.ciudad,
      direccion: this.formEdit.value.direccion,
      email: this.formEdit.value.correo,
      descripcion: this.formEdit.value.descripcion,
      licencia: this.formEdit.value.licencia,
      copiaLicencia: this.filePDF2 || this.fileImgPerfil2,
      profesion: this.formEdit.value.profesion,
      ano_experiencia: this.formEdit.value.ano_experiencia,
      banco: this.formEdit.value.banco,
      numero_cuenta: this.formEdit.value.numero_cuenta,
      tipo_cuenta: this.formEdit.value.tipo_cuenta,
      foto: this.fileImgPerfil,
      //planilla_servicios: this.formEdit.value.planilla_servicios
      filesDocuments: [this.filePDF3 || this.fileImgPerfil3]
    }
    console.log("VALORES DEL COSO")
    console.log(this.formEdit)
    console.log("LA COSAS ESAS LASMASD")
    console.log(pendiente)
    console.log("profesion: " + pendiente.profesion)
    if (pendiente.descripcion === "") {
      // if(this.pendiente_seleccionada.descripcion === ""){
      //   pendiente.descripcion = " "
      // }
      pendiente.descripcion = this.pendiente_seleccionada.descripcion || ""
    }
    this.pythonAnywhereService.editar_proveedor_pendiente(this.pendiente_seleccionada.id, pendiente).subscribe(resp => {
      console.log(resp)
      this.get_proveedores_pendientes_act();
    })
  }

  isURL(stringImage: string): boolean {
    // console.log(stringImage);
    return stringImage.match(new RegExp('https?.*')) !== null;
  }

  loadImageFromDevice(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.foto = file;
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


  loadPdfFromDevice(event: any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Cedula")
    console.log(event.target.files)
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.copiaCedula = file;
          this.filePDF = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };

  loadImageFromDeviceCI(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.copiaCedula = file;
          this.fileImgPerfil1 = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };

  loadImageFromDeviceLI(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.copiaLicencia = file;
          this.fileImgPerfil2 = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };

  loadImageFromDeviceDocCurri(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.filesDocuments = file;
          this.fileImgPerfil3 = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };

  loadPdfFromDeviceCI(event: any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Cedula")
    console.log(event.target.files)
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.copiaCedula = file;
          this.filePDF1 = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };


  loadPdfFromDeviceLI(event: any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Licencia")
    console.log(event.target.files)
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.copiaLicencia = file;
          this.filePDF2 = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };

  loadPdfFromDeviceDocCurri(event: any) {
    const file: File = event.target.files[0];
    console.log("Archivo de Copia de Curriculum")
    console.log(event.target.files)
    if (file) {
      this.extraerBase64(file)
        .then((imagen: any) => {
          this.formEdit.value.filesDocuments = file;
          this.filePDF3 = file;
          // this.imgPerfil = imagen.base;
        })
        .catch(err => console.log(err));
    }
  };


  loadFileFromDevice(event: any, formField: string) {
    const file: File = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (formField == 'copiaCedula') {
        if (fileType.includes('image')) {
          this.loadImageFromDeviceCI(event);
          console.log("Archivo Cedula image")
        } else if (fileType === 'application/pdf') {
          this.loadPdfFromDeviceCI(event);
          console.log("Archivo Cedula pdf")
        }
      } else if (formField == 'copiaLicencia') {
        if (fileType.includes('image')) {
          this.loadImageFromDeviceLI(event);
          console.log("Archivo Licencia image")
        } else if (fileType === 'application/pdf') {
          this.loadPdfFromDeviceLI(event);
          console.log("Archivo Licencia pdf")
        }
      } else if (formField == 'curriculum') {
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

  getNombreArchivo(tipo: string, archivo: File): { nombreArchivo: string, archivo: File | null } {
    const { nombres, apellidos } = this.pendiente_seleccionada || {};

    let archivoUrl = "";
    if(tipo=="documentos"){
      archivoUrl = this.pendiente_seleccionada?.documentsPendientes.at(-1)?.document
    }else{
      archivoUrl = this.pendiente_seleccionada?.[tipo];
    }

    const extension = archivoUrl ? archivoUrl.split('.').pop() : 'pdf';

    if (!nombres || !apellidos) {
      return { nombreArchivo: 'archivo_descargado', archivo: null };
    }

    // Si el tipo está definido, formateamos el nombre del archivo
    if (tipo != '' && archivo != null) {
      this.nombre = `${nombres}_${apellidos}_${tipo}.${extension}`;
      return { nombreArchivo: this.nombre, archivo };
    }

    // Retorna un nombre de archivo predeterminado si no se proporciona un tipo
    return { nombreArchivo: 'No hay documento disponible', archivo: null };
  }

  async onAceptar() {
    const email = this.pendiente_seleccionada.email;
    const password = email.substring(0, 3) + (Math.random() + 1).toString(36).substring(7);
    this.mensajeIncompletoString = 'Cargando...'
    if (email && password) {
      try{
        const arrSolicitante: Array<Solicitante2> = await firstValueFrom(this.pythonAnywhereService.getSolicitantePythonAny(email));    
        if (arrSolicitante.length === 0) {
          var validator = 0;
          const dataRegisto = new FormData();
          dataRegisto.append('tipo', 'Proveedor');
          dataRegisto.append('password', password);
          console.log(this.pendiente_seleccionada)
          if (this.pendiente_seleccionada.email != null && this.pendiente_seleccionada.email != "") {
            dataRegisto.append('email', this.pendiente_seleccionada.email);
          } else {
            this.mensajeIncompleto.push("correo")
            console.log("Problema en Email")
            validator = 1;
          }
          if (this.pendiente_seleccionada.nombres != null && this.pendiente_seleccionada.nombres != "") {
            dataRegisto.append('nombres', this.pendiente_seleccionada.nombres);
          } else {
            this.mensajeIncompleto.push("nombre")
            console.log("Problema en Nombres")
            validator = 1;
          }
          if (this.pendiente_seleccionada.apellidos != null && this.pendiente_seleccionada.apellidos != "") {
            dataRegisto.append('apellidos', this.pendiente_seleccionada.apellidos);
          } else {
            this.mensajeIncompleto.push("apellido")
            console.log("Problema en Apellidos")
            validator = 1;
          }
          if (this.pendiente_seleccionada.telefono != null && this.pendiente_seleccionada.telefono != "") {
            dataRegisto.append('telefono', this.pendiente_seleccionada.telefono);
          } else {
            this.mensajeIncompleto.push("telefono")
            console.log("Problema en telefono")
            validator = 1;
          }
          if (this.pendiente_seleccionada.cedula != null && this.pendiente_seleccionada.cedula != "") {
            dataRegisto.append('cedula', this.pendiente_seleccionada.cedula);
          } else {
            this.mensajeIncompleto.push("cédula")
            console.log("Problema en cedula")
            validator = 1;
          }
          if (this.pendiente_seleccionada.genero != null && this.pendiente_seleccionada.genero != "") {
            dataRegisto.append('genero', this.pendiente_seleccionada.genero);
          } else {
            this.mensajeIncompleto.push("género")

            console.log("Problema en genero")
            validator = 1;
          }
          if (this.pendiente_seleccionada.ciudad != null && this.pendiente_seleccionada.ciudad != "") {
            dataRegisto.append('ciudad', this.pendiente_seleccionada.ciudad);
          } else {
            this.mensajeIncompleto.push("ciudad")

            console.log("Problema en ciudad")
            validator = 1;
          }
          if (this.pendiente_seleccionada.foto != null && this.pendiente_seleccionada.foto != "") {
            dataRegisto.append('foto', this.pendiente_seleccionada.foto);
          } else {
            this.mensajeIncompleto.push("foto")

            console.log("Problema en foto")
            validator = 1;
          }
          if (this.pendiente_seleccionada.banco != null && this.pendiente_seleccionada.banco != "") {
            dataRegisto.append('banco', this.pendiente_seleccionada.banco);
          } else {
            this.mensajeIncompleto.push("banco")

            console.log("ERROR EN banco")
            validator = 1;
          }
          if (this.pendiente_seleccionada.numero_cuenta != null && this.pendiente_seleccionada.numero_cuenta != "") {
            dataRegisto.append('numero_cuenta', this.pendiente_seleccionada.numero_cuenta);
          } else {
            this.mensajeIncompleto.push("número de cuenta")

            console.log("ERROR EN numero_cuenta")
            validator = 1;
          }
          if (this.pendiente_seleccionada.tipo_cuenta != null && this.pendiente_seleccionada.tipo_cuenta != "") {
            dataRegisto.append('tipo_cuenta', this.pendiente_seleccionada.tipo_cuenta);
          } else {
            this.mensajeIncompleto.push("tipo de cuenta")

            console.log("ERROR EN tipo_cuenta")
            validator = 1;
          }
          if (this.pendiente_seleccionada.ano_experiencia != null && this.pendiente_seleccionada.ano_experiencia >= 0) {
            dataRegisto.append('ano_experiencia', this.pendiente_seleccionada.ano_experiencia);
          } else {
            this.mensajeIncompleto.push("años de experiencia")

            console.log("ERROR EN ano_experienccia")
            validator = 1;
          }
          if (this.pendiente_seleccionada.profesion != null && this.pendiente_seleccionada.profesion != "") {
            dataRegisto.append('profesion', this.pendiente_seleccionada.profesion);
          } else {
            this.mensajeIncompleto.push("profesión")

            console.log("ERROR EN profesion")
            validator = 1;
          }
          if (this.pendiente_seleccionada.direccion != null && this.pendiente_seleccionada.direccion != "") {
            dataRegisto.append('direccion', this.pendiente_seleccionada.direccion);
          } else {
            this.mensajeIncompleto.push("dirección")

            console.log("ERROR EN direccion")
            validator = 1;
          }
          if (this.pendiente_seleccionada.licencia != null && this.pendiente_seleccionada.licencia != "") {
            dataRegisto.append('licencia', this.pendiente_seleccionada.licencia);
          } else {
            this.mensajeIncompleto.push("licencia")

            console.log("ERROR EN licencia")
            validator = 1;
          }
          if (this.pendiente_seleccionada.copiaCedula != null && this.pendiente_seleccionada.copiaCedula != "") {
            dataRegisto.append('copiaCedula', this.pendiente_seleccionada.copiaCedula);
          } else {
            this.mensajeIncompleto.push("copia de cédula")

            console.log("ERROR EN copiaCedula")
            validator = 1;
          }
          if (this.pendiente_seleccionada.copiaLicencia != null && this.pendiente_seleccionada.copiaLicencia != "") {
            dataRegisto.append('copiaLicencia', this.pendiente_seleccionada.copiaLicencia);
          } else {
            dataRegisto.append('copiaLicencia', "sin licencia");
            /*this.mensajeIncompleto.push("copia de licencia")

            console.log("ERROR EN copiaLicencia")
            validator = 1;*/
          }
          if (this.pendiente_seleccionada.descripcion != null && this.pendiente_seleccionada.descripcion != "") {
            dataRegisto.append('descripcion', this.pendiente_seleccionada.descripcion);
          } else {
            this.mensajeIncompleto.push("descripción")

            console.log("ERROR EN descripcion")
            validator = 1;
          }
          if (this.pendiente_seleccionada.ano_experiencia != null && this.pendiente_seleccionada.ano_experiencia != "") {
            dataRegisto.append('ano_experiencia', this.pendiente_seleccionada.ano_experiencia);
          } else {
            this.mensajeIncompleto.push("años de experiencia")

            console.log("ERROR EN ano_experiencia")
            validator = 1;
          }
          if (this.pendiente_seleccionada.documentsPendientes != null && this.pendiente_seleccionada.documentsPendientes != "") {
            dataRegisto.append('filesDocuments', this.pendiente_seleccionada.documentsPendientes[0].document);
          } else {
            this.mensajeIncompleto.push("documentación")

            console.log("ERROR EN filesDocuments")
            validator = 1;
          }

          console.log("dataRegisto")
          console.log(dataRegisto)
          console.log("validator " + validator)
          console.log(this.pendiente_seleccionada.profesion)
          if (validator == 0) {
            try {
              const resp: any = await firstValueFrom(this.pythonAnywhereService.postRegistro(dataRegisto));
              if (!resp.error) {
                console.log('Registro pythonanywhere exitoso: ', resp);
                try {
                  const responseFirebase = await this.userService.register(email, password);
                  console.log('Registro firebase exitoso: ', responseFirebase);
                  // Eliminar pendiente solo si todo salió bien
                  try {
                    const respEliminarPendiente: any = await firstValueFrom(this.pythonAnywhereService.eliminar_proveedores_pendientes(this.pendiente_seleccionada.id));
                    this.cambiarEstado(this.pendiente_seleccionada);
                    console.log(resp);
                    this.mensajeIncompletoString = 'Campos completos'
                    this.get_proveedores_pendientes_act();
                  } catch (error) {
                    console.error('Error al eliminar pendiente:', error);
                    this.mensajeIncompletoString = 'Error al eliminar pendiente. ' + error;
                    return;
                  }

                } catch (firebaseError: any) {
                  console.log('Error al registrar en firebase: ', firebaseError);
                  const firebaseMessage = firebaseError?.error?.error?.message;
                  console.log(firebaseMessage)
                  if (firebaseMessage === 'EMAIL_EXISTS') {
                    this.mensajeIncompletoString = 'Error: el correo ya está registrado en Firebase.';
                  } else {
                    this.mensajeIncompletoString = 'Error al registrar en Firebase. '+firebaseError;
                  }
                  return;
                }

              } else {
                this.mensajeIncompletoString = resp.error;
                console.log('Hubo un error al registrar en PythonAnywhere', resp.error);
              }
            } catch (error) {
              console.error('Error de red o servidor al registrar en PythonAnywhere', error);
              this.mensajeIncompletoString = 'No se pudo registrar en PythonAnywhere. Intente nuevamente.';
            }
          } else {
            // TODO: Mostrar mensaje de campos incompletos
            if (this.mensajeIncompleto.length > 0) {
              this.mensajeIncompletoString = "Campos incompletos: " + this.mensajeIncompleto.join(', ')
              console.log(this.mensajeIncompletoString)

              this.mensajeIncompleto = []

            }
            console.log('ERROR: Faltan datos');
          }
        } else {
          this.mensajeIncompletoString = "El usuario ya existe, actualize el correo y vuevla a proceder.";
          console.log('Usuario encontrado en PythonAnywhere');
        }
      ;
    } catch (error: any)  {
        this.mensajeIncompletoString = "Error en obtener solicitante.";
        console.log('Error en obtener solicitante:', error);
    }
    }
  }

  cambiarEstado(pendiente: any) {
    const id = pendiente.id
    const estado = pendiente.estado
    const nuevoEstado = true;
    if (id) {
      this.pythonAnywhereService.cambio_pendiente_estado(id, nuevoEstado).subscribe(resp => { console.log(resp); });
    }
  }

  onNegar() {
    let razon = '';
    if (this.formNegar.value.razon != null && this.formNegar.value.razon != "") {
      razon = this.formNegar.value.razon
    }
    console.log(razon)
    this.pythonAnywhereService.eliminar_proveedores_pendientes2(this.pendiente_seleccionada.id, razon).subscribe(resp => {
      console.log(resp)
      this.pythonAnywhereService.obtener_proveedores_pendientes().subscribe(resp => {
        this.total = Object(resp).total_objects
        this.arr_pendiente = Object(resp).results;
        this.arr_filtered_pendiente = this.arr_pendiente;
        console.log(resp, "resp");
        console.log(this.arr_filtered_pendiente)
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
      case 'ano_experiencia':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'profesion':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return '';
      case 'ano_experiencia':
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
    const nombre = this.pendiente_seleccionada?.nombres;
    const apellidos = this.pendiente_seleccionada?.apellidos;
    const telefono = this.pendiente_seleccionada?.telefono;
    const cedula = this.pendiente_seleccionada?.cedula;
    const correo = this.pendiente_seleccionada?.email;
    const genero = this.pendiente_seleccionada?.genero;
    const ciudad = this.pendiente_seleccionada?.ciudad;
    const direccion = this.pendiente_seleccionada?.direccion;
    const licencia = this.pendiente_seleccionada?.licencia;
    const copiaCedula = this.pendiente_seleccionada?.copiaCedula;
    const profesion = this.pendiente_seleccionada?.profesion;
    const ano_experiencia = this.pendiente_seleccionada?.ano_experiencia;
    const banco = this.pendiente_seleccionada?.banco;
    const numero_cuenta = this.pendiente_seleccionada?.numero_cuenta;
    const copiaLicencia = this.pendiente_seleccionada?.copiaLicencia;
    const tipo_cuenta = this.pendiente_seleccionada?.tipo_cuenta;
    const documentos: any[] = this.pendiente_seleccionada?.documentsPendientes;
    const descripcion = this.pendiente_seleccionada?.descripcion;
    const foto = this.pendiente_seleccionada?.foto;

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
    numero_cuenta ? this.formEdit.get('numero_cuenta')?.setValue(numero_cuenta) : this.formEdit.get('numero_cuenta')?.reset();
    copiaLicencia ? this.formEdit.get('copiaLicencia')?.setValue(copiaLicencia) : this.formEdit.get('copiaLicencia')?.reset();
    tipo_cuenta ? this.formEdit.get('tipo_cuenta')?.setValue(tipo_cuenta) : this.formEdit.get('tipo_cuenta')?.reset();
    documentos ? this.formEdit.get('documentos')?.setValue(documentos) : this.formEdit.get('documentos')?.reset();
    descripcion ? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
    foto ? this.formEdit.get('foto')?.setValue(foto) : this.formEdit.get('foto')?.reset();
  }


  isInvalidForm(subForm: string) {


    return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty && this.getErrorMessage(this.formEdit, subForm).length !== 0;

  }

  funcionMostar() {
    console.log("asdasdasdasdasxzczxcfwef")
    console.log(this.pendiente_seleccionada)
    console.log(this.pendiente_seleccionada.copiaLicencia)
  }

  edit_pend(a: any) {
    this.get_proveedores_pendientes_act();
    this.showHeader = false;
    this.showHeaderC = true;
    this.showadmi = true;
    this.pendiente_seleccionada = a;
  }

  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_proveedores_pendientes(this.currentPage).subscribe(resp => {
      this.arr_pendiente = resp.results;
      this.arr_filtered_pendiente = this.arr_pendiente;
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_proveedores_pendientes(this.currentPage).subscribe(resp => {
      this.arr_pendiente = resp.results;
      this.arr_filtered_pendiente = this.arr_pendiente;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_proveedores_pendientes(event.target.value).subscribe(resp => {
      this.arr_pendiente = resp.results;
      this.arr_filtered_pendiente = this.arr_pendiente;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

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

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      this.arr_filtered_pendiente = this.arr_pendiente.filter(a => {
        const fechaCreacion = new Date(a.fecha_registro);
        if (this.fechaInicio && this.fechaFin) {
          return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
        }
        return true;
      });
    }
  }
}