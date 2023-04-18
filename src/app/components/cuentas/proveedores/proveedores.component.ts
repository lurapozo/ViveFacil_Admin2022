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
  generos = ['Masculino', 'Femenino', 'Otro'];
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
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

  onCrear() {
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
      ano_experiencia: this.proveedor_seleccionado.ano_experiencia,
      banco: this.proveedor_seleccionado.banco,
      numero_cuenta: this.proveedor_seleccionado.numero_cuenta,
      tipo_cuenta: this.proveedor_seleccionado.tipo_cuenta,
      planilla_servicios: this.proveedor_seleccionado.planilla_servicios
    }

    this.pythonAnywhereService.crear_proveedor_pendiente(pendiente).subscribe(resp => {
      console.log(resp)
    })
    let email: BodyEmail = {
      password: '1234',
      email: this.proveedor_seleccionado.email,
      tipo: 'Proveedor'
    }
    this.pythonAnywhereService.enviar_email(email).subscribe(resp => {
      console.log(resp)
    })
  }

  // onAceptar() {
  //   let pendiente: BodyCrearProveedorPendiente = {
  //     nombres: this.proveedor_seleccionado.nombres,
  //     apellidos: this.proveedor_seleccionado.apellidos,
  //     genero: this.proveedor_seleccionado.genero,
  //     telefono: this.proveedor_seleccionado.telefono,
  //     cedula: this.proveedor_seleccionado.cedula,
  //     copiaCedula: this.proveedor_seleccionado.copiaCedula,
  //     ciudad: this.proveedor_seleccionado.ciudad,
  //     direccion: this.proveedor_seleccionado.direccion,
  //     email: this.proveedor_seleccionado.email,
  //     descripcion: this.proveedor_seleccionado.descripcion,
  //     licencia: this.proveedor_seleccionado.licencia,
  //     copiaLicencia: this.proveedor_seleccionado.copiaLicencia,
  //     profesion: this.proveedor_seleccionado.profesion,
  //     ano_experiencia: this.proveedor_seleccionado.ano_experiencia,
  //     banco: this.proveedor_seleccionado.banco,
  //     numero_cuenta: this.proveedor_seleccionado.numero_cuenta,
  //     tipo_cuenta: this.proveedor_seleccionado.tipo_cuenta,
  //     planilla_servicios: this.proveedor_seleccionado.planilla_servicios
  //   }

  //   this.pythonAnywhereService.crear_proveedor_proveedor(pendiente).subscribe(resp => {
  //     console.log(resp)
  //   })
  //   this.pythonAnywhereService.eliminar_proveedores_pendientes(this.proveedor_seleccionado.id).subscribe(resp => {
  //     console.log(resp)
  //   })
  //   /*let email: BodyEmail = {
  //     password: '1234',
  //     email: this.proveedor_seleccionado.email,
  //     tipo: 'Proveedor'
  //   }
  //   this.pythonAnywhereService.enviar_email(email).subscribe(resp => {
  //     console.log(resp)
  //   })*/
  // }

  onEditar() {
    let pendiente: BodyActualizarProveedorPendiente = {
      nombres: this.formEdit.value.nombre,
      apellidos: this.formEdit.value.apellidos,
      genero: this.formEdit.value.genero,
      telefono: this.formEdit.value.telefono,
      cedula: this.formEdit.value.cedula,
      copiaCedula: this.formEdit.value.copiaCedula,
      ciudad: this.formEdit.value.ciudad,
      direccion: this.formEdit.value.direccion,
      email: this.formEdit.value.correo,
      descripcion: this.formEdit.value.descripcion,
      licencia: this.formEdit.value.licencia,
      copiaLicencia: this.formEdit.value.copiaLicencia,
      profesion: this.formEdit.value.profesion,
      ano_experiencia: this.formEdit.value.ano_experiencia,
      banco: this.formEdit.value.banco,
      numero_cuenta: this.formEdit.value.numero_cuenta,
      tipo_cuenta: this.formEdit.value.tipo_cuenta,
      foto: this.formEdit.value.foto,
      //planilla_servicios: this.formEdit.value.planilla_servicios
      filesDocuments: []
    }
    console.log(pendiente)
    console.log(this.formEdit.value.descripcion)
    console.log(this.proveedor_seleccionado.descripcion)
    if(pendiente.descripcion === ""){
      // if(this.proveedor_seleccionado.descripcion === ""){
      //   pendiente.descripcion = " "
      // }
      pendiente.descripcion = this.proveedor_seleccionado.descripcion
    }
    this.pythonAnywhereService.editar_proveedor_proveedor(this.proveedor_seleccionado.id, pendiente).subscribe(resp => {
      console.log(resp)
    })
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
      ano_experiencia: this.proveedor_seleccionado.ano_experiencia,
      banco: this.proveedor_seleccionado.banco,
      numero_cuenta: this.proveedor_seleccionado.numero_cuenta,
      tipo_cuenta: this.proveedor_seleccionado.tipo_cuenta,
      planilla_servicios: this.proveedor_seleccionado.planilla_servicios
    }
    this.pythonAnywhereService.eliminar_proveedores_pendientes(this.proveedor_seleccionado.id).subscribe(resp => {
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


    const nombre = this.proveedor_seleccionado?.nombres;
    const apellidos = this.proveedor_seleccionado?.apellidos;
    const telefono = this.proveedor_seleccionado?.telefono;
    const cedula = this.proveedor_seleccionado?.cedula;
    const correo = this.proveedor_seleccionado?.email;
    const genero = this.proveedor_seleccionado?.genero;
    const ciudad = this.proveedor_seleccionado?.ciudad;
    const direccion = this.proveedor_seleccionado?.direccion;
    const licencia = this.proveedor_seleccionado?.licencia;
    const copiaCedula = this.proveedor_seleccionado?.copiaCedula;
    const profesion = this.proveedor_seleccionado?.profesion;
    const experiencia = this.proveedor_seleccionado?.ano_experiencia;
    const banco = this.proveedor_seleccionado?.banco;
    const numeroCuenta = this.proveedor_seleccionado?.numero_cuenta;
    const copiaLicencia = this.proveedor_seleccionado?.copiaLicencia;
    const tipoCuenta = this.proveedor_seleccionado?.copiaLicencia;
    const documentos: any[] = this.proveedor_seleccionado?.documentsPendientes;
    const descripcion = this.proveedor_seleccionado?.descripcion;

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
      profesion: this.formEdit.get('profesion')?.value,
      foto: this.formEdit.get('foto')?.value
    }
    const id = this.proveedor_seleccionado.id

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
}
