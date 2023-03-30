import { Component } from '@angular/core';
import { Solicitante2 } from 'src/app/interfaces/solicitante2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyEmail } from 'src/app/interfaces/email';
import { BodyActualizarProveedorPendiente, BodyCrearProveedorPendiente, BodyResponseCrearProveedorPendiente, SerializerCrearProveedorPendiente } from 'src/app/interfaces/proveedor';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrls: ['./pendientes.component.css']
})
export class PendientesComponent {

  generos = ['Masculino', 'Femenino', 'Otro'];
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  licencia = ['Si', 'No'];
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
    TipoCuenta: new FormControl('', [Validators.required]),
    numeroCuenta: new FormControl('', [Validators.required]),
    banco: new FormControl('', [Validators.required]),
    experiencia: new FormControl('', [Validators.required]),
    copiaLicencia: new FormControl(''),
    documentos: new FormControl(''),
    descripcion: new FormControl(''),

  });

  constructor(
    private pythonAnywhereService: PythonAnywhereService,
    private userService: UserService, 
    private sanitizer: DomSanitizer
    ) {
    

    this.pythonAnywhereService.obtener_proveedores_pendientes().subscribe(resp => {
      this.total = Object(resp).total_objects
      this.arr_pendiente = Object(resp).results;

      this.arr_filtered_pendiente = this.arr_pendiente;
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
    } else if (tipo === 'editar') {
      this.isAceptar = false;
      this.isNegar = false;
    }

    this.mensajeAlerta = mensaje;
  }

  onCrear() {
    let pendiente: BodyCrearProveedorPendiente = {
      nombres: this.pendiente_seleccionada.nombres+"1",
      apellidos: this.pendiente_seleccionada.apellidos+"1",
      genero: this.pendiente_seleccionada.genero,
      telefono: this.pendiente_seleccionada.telefono,
      cedula: this.pendiente_seleccionada.cedula,
      copiaCedula: this.pendiente_seleccionada.copiaCedula,
      ciudad: this.pendiente_seleccionada.ciudad,
      direccion: this.pendiente_seleccionada.direccion,
      email: this.pendiente_seleccionada.email+"1",
      descripcion: this.pendiente_seleccionada.descripcion,
      licencia: this.pendiente_seleccionada.licencia,
      copiaLicencia: this.pendiente_seleccionada.copiaLicencia,
      profesion: this.pendiente_seleccionada.profesion,
      ano_experiencia: this.pendiente_seleccionada.ano_experiencia,
      banco: this.pendiente_seleccionada.banco,
      numero_cuenta: this.pendiente_seleccionada.numero_cuenta,
      tipo_cuenta: this.pendiente_seleccionada.tipo_cuenta,
      planilla_servicios: this.pendiente_seleccionada.planilla_servicios
    }

    const email = "abababa@ababa.com";
    const password = "ababa";
    if (email && password) {
      this.pythonAnywhereService.getSolicitantePythonAny(email).subscribe((arrSolicitante: Array<Solicitante2>) => {
        if (arrSolicitante.length === 0) {
          const dataRegisto = new FormData();
          dataRegisto.append('tipo', 'Solicitante');
          dataRegisto.append('email', email);
          dataRegisto.append('password', password);
          dataRegisto.append('nombres', "ababa");
          dataRegisto.append('apellidos', "ababa");
          dataRegisto.append('telefono', "0987654321");
          dataRegisto.append('cedula', "0987654321");
          dataRegisto.append('genero', "Otro");
          dataRegisto.append('ciudad', "si");
          dataRegisto.append('foto', "xd.jpg");
          // Registro PythonAnywhere
          this.pythonAnywhereService.postRegistro(dataRegisto).subscribe(async (resp: any) => {
            if (!resp.error) {
              console.log('Registro pythonanywhere exitoso: ', resp);
              // Registro Firebase
              // this.userService
              //   .register(email, password)
              //   .then((response) => {
              //     console.log('Registro firebase exitoso: ', response);
              //     // this.presentAlert('Completada!', 'El registro se ha completado exitosamente.').then(() => {
              //     //   console.log('Registro completo...');
              //     //   this.userService
              //     //     .logout()
              //     //     .then(() => {
              //     //       this.router.navigate(['/login']);
              //     //       console.log('fuera de sesion');
              //     //     })
              //     //     .catch((error) => {
              //     //       console.log(error);
              //     //     });
              //     // });
              //   })
              //   .catch((error) => {
              //     console.log('Error al registrar en firebase: ', error);
              //     // this.isRegistered = true;
              //   });
            } else {
              console.log('Hubo un error al registrar en PythonAnywhere', resp.error);
              // this.presentAlert('Error en el registro :(', 'Vuelva a intentarlo pronto...', false);
            }
          });
        } else {
          console.log('Usuario encontrado en PythonAnywhere');
          // this.presentAlert(
          //   'Error en el registro :(',
          //   'El usuario ya se encuentra registrado en la aplicación.',
          //   false
          // );
          // this.isRegistered = true;
        }
      });
    }

    this.pythonAnywhereService.crear_proveedor_pendiente(pendiente).subscribe(resp => {
      console.log(resp)
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

  onAceptar() {
    let pendiente: BodyCrearProveedorPendiente = {
      nombres: this.pendiente_seleccionada.nombres,
      apellidos: this.pendiente_seleccionada.apellidos,
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
      planilla_servicios: this.pendiente_seleccionada.planilla_servicios
    }

    this.pythonAnywhereService.crear_proveedor_proveedor(pendiente).subscribe(resp => {
      console.log(resp)
    })
    this.pythonAnywhereService.eliminar_proveedores_pendientes(this.pendiente_seleccionada.id).subscribe(resp => {
      console.log(resp)
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

  onNegar() {
    let pendiente: BodyCrearProveedorPendiente = {
      nombres: this.pendiente_seleccionada.nombres,
      apellidos: this.pendiente_seleccionada.apellidos,
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
      planilla_servicios: this.pendiente_seleccionada.planilla_servicios
    }
    this.pythonAnywhereService.eliminar_proveedores_pendientes(this.pendiente_seleccionada.id).subscribe(resp => {
      console.log(resp)
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
    const experiencia = this.pendiente_seleccionada?.ano_experiencia;
    const banco = this.pendiente_seleccionada?.banco;
    const numeroCuenta = this.pendiente_seleccionada?.numero_cuenta;
    const copiaLicencia = this.pendiente_seleccionada?.copiaLicencia;
    const tipoCuenta = this.pendiente_seleccionada?.copiaLicencia;
    const documentos: any[] = this.pendiente_seleccionada?.documentsPendientes;
    const descripcion = this.pendiente_seleccionada?.descripcion;

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
    tipoCuenta ? this.formEdit.get('tipoCuenta')?.setValue(ciudad) : this.formEdit.get('tipoCuenta')?.reset();
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
      tipo_cuenta: this.formEdit.get('tipoCuenta')?.value,
      ano_experiencia: this.formEdit.get('experiencia')?.value,
      profesion: this.formEdit.get('profesion')?.value
    }
    const id = this.pendiente_seleccionada.id

    console.log(this.formEdit)
    if (this.formEdit.status == "INVALID") {

      return;
    } else {
      this.pythonAnywhereService.editar_proveedor_pendiente(id, pendiente).subscribe(resp => console.log(resp)
      )
    }
  }

  isInvalidForm(subForm: string) {


    return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty && this.getErrorMessage(this.formEdit, subForm).length !== 0;

  }
}