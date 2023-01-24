import { Component } from '@angular/core';
import { BodyActualizarPlan, BodyCrearPlan, BodyCrearPlanProveedor, Plan } from '../../interfaces/plan';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent {

  arr_planes: any[] | undefined;
  arr_filtered_planes: any[] | undefined;
  arr_servicios: Plan[] | undefined;
  planes_seleccionada: any | any;
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  existImageCrear = false; existImageActualizar = false;
  estadoCond=''
estado = ['Habilitado','Deshabilitado']

  planCrear = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    duracion: new FormControl('', [Validators.required]),
    estado:new FormControl('', [Validators.required]),
  }, []);


  formEdit = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    duracion: new FormControl('', [Validators.required]),
    estado:new FormControl('', [Validators.required]),
  }, []);


  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer){
    this.pythonAnywhereService.obtener_planes().subscribe(resp => {
      this.arr_planes = resp;
      this.arr_filtered_planes = this.arr_planes;
    });
  
    // Validators
    // const imagenCrearControl = this.crearProfesionesForm.get('imagen') as FormControl;
    // imagenCrearControl.addValidators(this.createImageValidator(this.crearProfesionesForm.get('imagen') as AbstractControl, 'crear'));
    // const imagenActualizarControl = this.actualizarProfesionesForm.get('imagen') as FormControl;
    // imagenActualizarControl.addValidators(this.createImageValidator(this.actualizarProfesionesForm.get('imagen') as AbstractControl, 'actualizar'));
  }
  search(evento: any) {
    const texto = evento.target.value;
    // console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_planes = this.arr_planes;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_planes = this.arr_filtered_planes?.filter((profesion) => {
        return profesion.nombre.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

  limpiarForm(tipo: string) {
    if(tipo === 'crear') {
      this.existImageCrear = false;
      this.planCrear.get('imagen')?.reset();
      this.planCrear.get('nombre')?.reset();
      this.planCrear.get('descripcion')?.reset();
      this.planCrear.get('precio')?.reset();
      this.planCrear.get('duracion')?.reset();
      this.planCrear.get('estado')?.reset();
    } else if(tipo === 'actualizar') {
      // console.log(this.profesion_seleccionada);
      let estadoString =''
      const duracion = this.planes_seleccionada?.duracion
      const nombre = this.planes_seleccionada?.nombre;
      const descripcion = this.planes_seleccionada?.descripcion;
      const estado = this.planes_seleccionada?.estado;
      if(estado){
          estadoString='Habilitado'
      }{
        estadoString='Deshabilitado'
      }
      const precio = this.planes_seleccionada?.precio;
      this.existImageActualizar = false;
      this.formEdit.get('imagen')?.reset();
      nombre? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
      descripcion? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
      estado? this.formEdit.get('estado')?.setValue(estadoString) : this.formEdit.get('estado')?.reset();
      precio? this.formEdit.get('precio')?.setValue(precio) : this.formEdit.get('precio')?.reset();
      duracion? this.formEdit.get('duracion')?.setValue(duracion) : this.formEdit.get('duracion')?.reset();
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

  
  loadImageFromDevice(event:any, tipo: string) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        if(tipo === 'crear'){
          this.planCrear.get('imagen')?.setValue(file);
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

  isInvalidForm(subForm: string, tipo: string){
    if(tipo === 'crear') {
      return this.planCrear.get(subForm)?.invalid && this.planCrear.get(subForm)?.touched || this.planCrear.get(subForm)?.dirty  && this.getErrorMessage(this.planCrear, subForm).length!==0;
    } else {
      return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty  && this.getErrorMessage(this.formEdit, subForm).length!==0;
    }
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

      case 'precio':
        if (itemControl.hasError('required')) {
          return 'Debe especificar un servicio';
        }
        return '';

      case 'duracion':
        if (itemControl.hasError('required')) {
          return 'Debe seleccionar un estado';
        }
        return '';

        case 'estado':
          if (itemControl.hasError('required')) {
            return 'Debe seleccionar un estado';
          }
          return '';
      default:
        return '';
    }
  }

  ver(plan:any){
    this.planes_seleccionada=plan
    if(this.planes_seleccionada?.estado){
      this.estadoCond='Habilitado'

    }else{
      this.estadoCond='Deshabilitado'
    }

  }
  onCrear(){
    const crearPlan : BodyCrearPlan={
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 0,
  
    }
    let estadoCond =false
    const nombre = this.planCrear.get('nombre')?.value;
    const descripcion = this.planCrear.get('decripcion')?.value;
    const precio = this.planCrear.get('precio')?.value;
    const duracion = this.planCrear.get('duracion')?.value;
    const estado = this.planCrear.get('estado')?.value;
    const foto = this.planCrear.get('imagen')?.value;
    if(estado==='Habilitado'){
       estadoCond=true
    }
    if(nombre && descripcion && precio && duracion && estado){
      crearPlan.nombre=nombre
      crearPlan.descripcion=descripcion
    
      crearPlan.precio=parseInt(precio)
      if(foto && this.existImageCrear){
        crearPlan.imagen = foto; // Si hay foto se le agrega al body.
      }

      this.pythonAnywhereService.crear_plan(crearPlan).subscribe(resp=>{
        console.log(resp)
      })
    }

  }
  onDelete(){
    if(this.planes_seleccionada){
      this.pythonAnywhereService.borrar_plan(this.planes_seleccionada.id).subscribe(resp=>{
        console.log(resp)
      })
    }

  }
  onActualizar(){
    console.log('dg')
    const actualizar : BodyActualizarPlan ={
      id:0
    }
    let estadoCond=this.planes_seleccionada?.estado
    const id = this.planes_seleccionada?.id;
    const nombre = this.formEdit.get('nombre')?.value;
    const descripcion = this.formEdit.get('descripcion')?.value;
    const precio = this.formEdit.get('precio')?.value;
    const duracion = this.formEdit.get('duracion')?.value;
    const estado = this.formEdit.get('estado')?.value;
    const foto = this.formEdit.get('imagen')?.value;
    console.log(id,nombre,descripcion,precio,duracion,estado)
    console.log(this.formEdit)
    if(estado==='Habilitado'){
      estadoCond=true
   }
    if(this.existImageActualizar && foto){
      actualizar.imagen = foto; // Si hay foto se le agrega al body.
    }
    if(nombre && descripcion && precio && duracion && estado){
      actualizar.nombre=nombre
      actualizar.descripcion=descripcion
      actualizar.estado=estadoCond
      actualizar.precio=parseInt(precio)
      if(this.planes_seleccionada){
        actualizar.id=this.planes_seleccionada.id
      }
      this.pythonAnywhereService.actualizar_plan(actualizar).subscribe(resp=>{
        console.log(resp)
       })
     
    
    
    }

  }
}
