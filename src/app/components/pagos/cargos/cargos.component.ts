import { Component } from '@angular/core';
import { FormControl, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyActualizarCargo, BodyCrearCargo, Cargo } from 'src/app/interfaces/cargo';
import { Publicidad } from 'src/app/interfaces/publicidad';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent {


  arr_cargo!: Cargo[]  | undefined;
  arr_filtered_cargo!: Cargo[]  | undefined;
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  cargo_seleccionada:  Cargo  | undefined;
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_cargos().subscribe((resp:any )=> {
    this.arr_cargo = resp
    this.arr_filtered_cargo = this.arr_cargo
    console.log(this.arr_filtered_cargo)
  
  
    });
   
}


cargoCrear
: FormGroup = new FormGroup({
  porcentaje: new FormControl('', [Validators.required]),
  titulo: new FormControl('', [Validators.required]),
  nombre: new FormControl('', [Validators.required]),

});

formEdit
: FormGroup = new FormGroup({
  porcentaje: new FormControl('', [Validators.required]),
  titulo: new FormControl('', [Validators.required]),
  nombre: new FormControl('', [Validators.required]),

});

ver(cupon:any){
  this.cargo_seleccionada=cupon
  
}


limpiarForm(tipo: string) {
  if(tipo === 'crear') {
 
    this.cargoCrear
    .get('titulo')?.reset();
    this.cargoCrear
    .get('porcentaje')?.reset();
    this.cargoCrear.get('nombre')?.reset();


  } else if(tipo === 'actualizar') {

    const titulo = this.cargo_seleccionada?.titulo;
    const porcentaje = this.cargo_seleccionada?.porcentaje;
    const nombre = this.cargo_seleccionada?.nombre;
    titulo? this.formEdit.get('titulo')?.setValue(titulo) : this.formEdit.get('nombre')?.reset();
    porcentaje? this.formEdit.get('porcentaje')?.setValue(porcentaje) : this.formEdit.get('porcentaje')?.reset();
    nombre? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
 
 
}}


getErrorMessage(formGroup: FormGroup, item: string): string {
  const itemControl: FormControl = formGroup.get(item) as FormControl;
  switch (item) {
    case 'titulo':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

    case 'porcentaje':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

      case 'nombre':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

    default:
      return '';
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


isInvalidForm(subForm: string, tipo: string) {
  if (tipo === 'crear') {

    return this.cargoCrear
    .get(subForm)?.invalid && this.cargoCrear
    .get(subForm)?.touched || this.cargoCrear
    .get(subForm)?.dirty && this.getErrorMessage(this.cargoCrear
      , subForm).length !== 0;
  } else {
    
    return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty  && this.getErrorMessage(this.formEdit, subForm).length!==0;
  }
}
onCrear(){
  let cupon : BodyCrearCargo={
    titulo: '',
    nombre: '',
    porcentaje: 0,
    
  }


  const titulo = this.cargoCrear
  .get('titulo')?.value;
  const nombre = this.cargoCrear
  .get('nombre')?.value;
  const porcentaje = this.cargoCrear
  .get('porcentaje')?.value;


 
  if( titulo && nombre && porcentaje){

    cupon.nombre = nombre
    cupon.titulo = titulo
    cupon.porcentaje = porcentaje
  
    this.pythonAnywhereService.crear_cargo(cupon).subscribe(resp => {
      this.mostrarToastInfo('Estado de la solicitud profesion', 'El cargo ha sido creado con exito', false);
    })

  }
  
}

onActualizar(){
  let cupon : BodyActualizarCargo={
    titulo: '',
    nombre: '',
    porcentaje: 0,
    
  }


  const titulo = this.formEdit
  .get('titulo')?.value;
  const nombre = this.formEdit
  .get('nombre')?.value;
  const porcentaje = this.formEdit
  .get('porcentaje')?.value;


 
  if( titulo && nombre && porcentaje){

    cupon.nombre = nombre
    cupon.titulo = titulo
    cupon.porcentaje = porcentaje
  
    
  if(this.cargo_seleccionada){
    this.pythonAnywhereService.actualizar_cargo(cupon, this.cargo_seleccionada.id).subscribe(resp => {
      this.mostrarToastInfo('Estado de la solicitud profesion', 'El cargo ha sido actualizada con exito', false);
    })
  }
  

  }
  
}

search(evento: any) {
  const texto = evento.target.value;
  console.log('Escribe en el buscador: ', texto)
  this.arr_filtered_cargo = this.arr_cargo;
  if (texto && texto.trim() !== '') {
    this.arr_filtered_cargo = this.arr_filtered_cargo?.filter((solicitud) => {
      return solicitud.titulo.toLowerCase().includes(texto.toLowerCase())
    });
  }}

  onDelete(){
  if(this.cargo_seleccionada){
    this.pythonAnywhereService.eliminar_cargo(this.cargo_seleccionada.id).subscribe(resp=>console.log(resp))
  }
    
  }


  mostrarToastInfo(titulo: string, mensaje: string, isErrorToast: boolean) {
    this.isErrorToast = isErrorToast;
    this.tituloToast = titulo;
    this.mensajeToast = mensaje;
    const toast = document.getElementById('liveToast');
    if(toast){
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 7000);
    } else {
      console.log('No hay toast renderizado');
    }
  }
}
