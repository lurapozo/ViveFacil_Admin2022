import { Component } from '@angular/core';
import { BodyActualizarPlan, BodyCrearPlan, BodyCrearPlanProveedor, Plan } from '../../interfaces/plan';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { ProfesionesComponent } from '../profesiones/profesiones.component';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css']
})
export class PlanesComponent {

  arr_planes: Plan[] | undefined;
  arr_filtered_planes: Plan[] | undefined;
  arr_servicios: Plan[] | undefined;
  planes_seleccionada: Plan | any;
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  existImageCrear = false; existImageActualizar = false;
  estadoCond=''
  estados = ['Habilitado','Deshabilitado'] 
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";
estadoActual=false
  planCrear = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    duracion: new FormControl('', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])$/), Validators.min(1), Validators.max(2)]),
    estado:new FormControl('', [Validators.required]),
  }, []);


  formEdit = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.minLength(1),
      Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    duracion: new FormControl('', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2])$/), Validators.min(1), Validators.max(2)]),
    
  }, []);


  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer){
    this.pythonAnywhereService.obtener_planes().subscribe(resp => {
      this.arr_planes = resp;
      this.arr_filtered_planes = this.arr_planes;
    });
  
    Validators
    const imagenCrearControl = this.planCrear.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.planCrear.get('imagen') as AbstractControl, 'crear'));
    const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));
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
     
      const precio = this.planes_seleccionada?.precio;
      this.existImageActualizar = false;
      this.formEdit.get('imagen')?.reset();
      nombre? this.formEdit.get('nombre')?.setValue(nombre) : this.formEdit.get('nombre')?.reset();
      descripcion? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
      
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
          return 'El campo precio es requerido';
        } else if (itemControl.hasError('maxlength')) {
          return ' El número máximo  permitido es 99';
        } else if (itemControl.hasError('pattern')) {
          return ' Solo se permiten números.';
        }
        return '';

      case 'duracion':
        if (itemControl.hasError('required')) {
          return 'El duracion Duracion es requerido';
        } else if (itemControl.hasError('maxlength')) {
          return ' El número máximo  permitido es 12';
        } else if (itemControl.hasError('pattern')) {
          return ' Solo se permiten números.';
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
  createImageValidator(controlImage: AbstractControl, tipo: string){
    return () => {
      const file = controlImage.value as File;

      if(file && file.name){
        console.log('Ingresa al validator if');
        console.log(file);
        const tokensImgName: any[] = file.name.split('.');
        console.log(tokensImgName);
        if(tokensImgName.length === 2 ){
          const imgExtension = tokensImgName[1];
          if(imgExtension !== 'jpg' && imgExtension !== 'jpeg' && imgExtension !== 'png' && imgExtension !== 'jfif'){
            console.log('Entra en error de imagen');
            if(tipo === 'crear'){
              this.planCrear.get('imagen')?.setValue(null);
              this.existImageCrear = false;
            }
            else if(tipo === 'actualizar'){
              this.formEdit.get('imagen')?.setValue(null);
              this.existImageActualizar = false;
            }
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if(tipo === 'crear'){
            this.existImageCrear = true;
          }
          else if(tipo === 'actualizar'){
          
            this.existImageActualizar = true;
            console.log(this.existImageActualizar)
          }
        }
        return null;
      } else {
        console.log('No hay imagen seleccionada');
        return null;
      }
    };
  }
  onCrear(){
    const crearPlan : BodyCrearPlan={
      nombre: '',
      descripcion: '',
      precio: 0,
      duracion: 0,
      estado: false
    }
   const estado =this.planCrear.get('estado')?.value;
    const nombre = this.planCrear.get('nombre')?.value;
    const descripcion = this.planCrear.get('descripcion')?.value;
    const precio = this.planCrear.get('precio')?.value;
    const duracion = this.planCrear.get('duracion')?.value;
    const foto = this.planCrear.get('imagen')?.value;
    if(estado==='Habilitado'){
      crearPlan.estado=true
    }else{
      crearPlan.estado=false
    }

    if(nombre && descripcion && precio && duracion){
      console.log('entre')
      crearPlan.nombre=nombre
      crearPlan.descripcion=descripcion
      crearPlan.duracion=parseInt(duracion)
      crearPlan.precio=parseInt(precio)
      if(foto && this.imagenCrear ){
  
        crearPlan.imagen = foto; 
      }

      this.pythonAnywhereService.crear_plan(crearPlan).subscribe(resp=>{
        this.mostrarToastInfo('Estado del Plan ', 'Plan Creado correctamente', false);
      })
    }

  }
  onDelete(){
    if(this.planes_seleccionada){
      this.pythonAnywhereService.borrar_plan(this.planes_seleccionada.id).subscribe(resp=>{
        this.mostrarToastInfo('Estado del Plan ', 'Plan  eliminado correctamente', false);
      })
    }

  }
  onActualizar(){

    const actualizar : BodyActualizarPlan ={
      id:0
    }

    const id = this.planes_seleccionada?.id;
    const nombre = this.formEdit.get('nombre')?.value;
    const descripcion = this.formEdit.get('descripcion')?.value;
    const precio = this.formEdit.get('precio')?.value;
    const duracion = this.formEdit.get('duracion')?.value;
    const foto = this.formEdit.get('imagen')?.value;
   
console.log(nombre,precio,duracion,descripcion)
    if(nombre && descripcion && precio && duracion){
      console.log(nombre,descripcion,precio,duracion)
      actualizar.id=id
      actualizar.nombre=nombre
      actualizar.descripcion=descripcion
      actualizar.precio=precio
      actualizar.duracion=duracion
      if( foto && this.imagenActualizar){
     
        actualizar.imagen = foto; 
      }
          this.pythonAnywhereService.actualizar_plan(actualizar).subscribe(resp=>{
            this.mostrarToastInfo('Estado del Plan ', 'Plan editado correctamente', false);
         })

     
    
    
    }

  }

  cambiarEstado(event:any){
    this.estadoActual=event.srcElement.checked
    console.log()
    const actualizar : BodyActualizarPlan ={
      id:this.planes_seleccionada?.id,
      estado: event.srcElement.checked
    }
  
    console.log(actualizar)
    this.pythonAnywhereService.actualizar_plan_estado(actualizar).subscribe(resp=>{
      this.mostrarToastInfo('Estado del Plan ', 'Plan editado correctamente', false);
     })


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
