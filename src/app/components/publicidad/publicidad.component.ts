import { Component } from '@angular/core';
import { BodyActualizarPublicidad, BodyCrearPublicidad, Publicidad } from '../../interfaces/publicidad';
import { FormControl, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import * as moment from 'moment';
@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.css']
})
export class PublicidadComponent {


  arr_publicidad?: Publicidad[] 
  arr_filtered_publicidad?: Publicidad[]
  imagenCrear: string | undefined;
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  publicidad_seleccionada?:  Publicidad;
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  categoria!: any[];
  participante = ['Solicitante','Proveedor']



  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_publicidades().subscribe((resp:any )=> {
    this.arr_publicidad = resp.results
    this.arr_filtered_publicidad = this.arr_publicidad
    console.log(this.arr_filtered_publicidad)
    if (resp.next != null) {
      this.condicionNext = true
    }
    for (let index = 1; index <= resp.total_pages; index++) {
      this.pageNumber.push(index)

    }
  
    });
    this.pythonAnywhereService.obtener_categorias().subscribe((resp:any[])=>{
     this.categoria=resp
     
  
    })

    const imagenCrearControl = this.publicidadCrear
    .get('imagen') as FormControl;
   imagenCrearControl.addValidators(this.createImageValidator(this.publicidadCrear
    .get('imagen') as AbstractControl, 'crear'));
     const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));
}

publicidadCrear
: FormGroup = new FormGroup({

  titulo: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required]),
  inicio: new FormControl(''),
  fin: new FormControl('',[Validators.required]),
  imagen: new FormControl(this.fileImagenActualizar),
  url: new FormControl(''),
 


});


formEdit: FormGroup = new FormGroup({

  titulo: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required]),
  inicio: new FormControl(''),
  fin: new FormControl('',[Validators.required]),
  imagen: new FormControl(this.fileImagenActualizar),
  url: new FormControl(''),
 


});



ver(cupon:any){
  this.publicidad_seleccionada=cupon
  
}

limpiarForm(tipo: string) {
  if(tipo === 'crear') {
    this.existImageCrear = false;
    this.publicidadCrear
    .get('titulo')?.reset();
    this.publicidadCrear
    .get('descripcion')?.reset();
    this.publicidadCrear
    .get('inicio')?.setValue('');
    this.publicidadCrear
    .get('fin')?.setValue('');
    this.publicidadCrear
    .get('punto')?.setValue('');
    this.publicidadCrear
    .get('imagen')?.reset();
    this.publicidadCrear
    .get('url')?.setValue('');

  } else if(tipo === 'actualizar') {

    const titulo = this.publicidad_seleccionada?.titulo;
    const descripcion = this.publicidad_seleccionada?.descripcion;
    const inicio = this.publicidad_seleccionada?.fecha_inicio;
    const fin = this.publicidad_seleccionada?.fecha_expiracion;
    const url = this.publicidad_seleccionada?.url;
  
    this.existImageActualizar = false;
    this.formEdit.get('imagen')?.reset();
    inicio?this.formEdit.get('inicio')?.setValue(inicio) : this.formEdit.get('inicio')?.reset();
    titulo? this.formEdit.get('titulo')?.setValue(titulo) : this.formEdit.get('nombre')?.reset();
    descripcion? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
    fin? this.formEdit.get('fin')?.setValue(fin) : this.formEdit.get('fin')?.reset();
    url? this.formEdit.get('url')?.setValue(url) : this.formEdit.get('url')?.reset();
 
}}


getErrorMessage(formGroup: FormGroup, item: string): string {
  const itemControl: FormControl = formGroup.get(item) as FormControl;
  switch (item) {
    case 'imagen':
      if (itemControl.hasError('image_error')) {
        return itemControl.getError('image_error');
      }
      return '';

    case 'titulo':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

    case 'descripcion':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

    case 'url':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

    case 'foto':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';

    case 'inicio':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';
    case 'fin':
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

    return this.publicidadCrear
    .get(subForm)?.invalid && this.publicidadCrear
    .get(subForm)?.touched || this.publicidadCrear
    .get(subForm)?.dirty && this.getErrorMessage(this.publicidadCrear
      , subForm).length !== 0;
  } else {
    
    return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty  && this.getErrorMessage(this.formEdit, subForm).length!==0;
  }
}

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
            this.publicidadCrear
            .get('imagen')?.setValue(null);
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
loadImageFromDevice(event: any, tipo: string) {
  const file: File = event.target.files[0];
  if (file) {
    this.extraerBase64(file)
      .then((imagen: any) => {
        if (tipo === 'crear') {
          this.publicidadCrear
          .get('imagen')?.setValue(file);
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


onCrear(){
  let cupon : BodyCrearPublicidad={
    titulo: '',
    descripcion: '',
    fecha_expiracion: '',
    url: '',
    fecha_inicio: ''
  }


  const titulo = this.publicidadCrear
  .get('titulo')?.value;
  const descripcion = this.publicidadCrear
  .get('descripcion')?.value;
  const inicio = this.publicidadCrear
  .get('inicio')?.value;
  const fin = this.publicidadCrear
  .get('fin')?.value;
  const url = this.publicidadCrear
  .get('url')?.value;
  const foto = this.publicidadCrear
  .get('imagen')?.value as File;


   console.log(this.publicidadCrear)
    cupon.descripcion = descripcion
    cupon.fecha_inicio = moment(inicio).format("YYYY-MM-DDTHH:mm:SS")
    cupon.fecha_expiracion = moment(fin).format("YYYY-MM-DDTHH:mm:SS")
    cupon.url = url
    cupon.titulo = titulo
    
    if(foto && this.existImageCrear){
      cupon.imagen = foto; // Si hay foto se le agrega al body.
    }
    // this.pythonAnywhereService.crear_publicidad(cupon).subscribe(resp => {
    //   console.log(resp)
    // })


  
}


onActualizar(){
  let publi :BodyActualizarPublicidad ={
    id: '',
    fecha_inicio:this.publicidad_seleccionada?.fecha_inicio,
    fecha_expiracion:this.publicidad_seleccionada?.fecha_expiracion
  }
 publi.id=this.publicidad_seleccionada?.id
 console.log(this.publicidad_seleccionada?.fecha_inicio)
  const titulo = this.formEdit.get('titulo')?.value;
  const descripcion = this.formEdit.get('descripcion')?.value;
  const inicio = this.formEdit.get('inicio')?.value;
  const fin = this.formEdit.get('fin')?.value;
  const url = this.formEdit.get('url')?.value;
  const foto = this.formEdit.get('imagen')?.value as File;
  console.log("soy nulo",inicio,fin)
  if(foto && this.existImageCrear){
    publi.imagen = foto;
  }
  console.log(inicio)
if(titulo && descripcion && inicio && fin && url){
  publi.titulo = titulo
  publi.descripcion = descripcion           
  publi.fecha_inicio = moment(inicio).format('YYYY-MM-DDTHH:mm:ssZ')
  publi.fecha_expiracion = moment(fin).format("YYYY-MM-DDTHH:mm:SS")
  publi.url = url

  if(this.publicidad_seleccionada){

   
    this.pythonAnywhereService.actualizar_publicidad(publi).subscribe(resp=>{console.log(resp);})
    console.log("soy nulo",inicio,fin)
  
}
}
   

}


getCurrentDate(): string{
  return moment().format('YYYY-MM-DD');
}

getMinDateAvailable(): string{
  const minDate = moment().add(45, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
  return minDate;
}

getMaxDateAvailable(){
  const maxDate = moment().add(2, 'months').format('YYYY-MM-DDTHH:mm:ssZ');
  return maxDate;
}

search(evento: any) {
  const texto = evento.target.value;
  console.log('Escribe en el buscador: ', texto)
  this.arr_filtered_publicidad = this.arr_publicidad;
  if (texto && texto.trim() !== '') {
    this.arr_filtered_publicidad = this.arr_filtered_publicidad?.filter((solicitud) => {
      return solicitud.titulo.toLowerCase().includes(texto.toLowerCase())
    });
  }}

  onDelete(){
  if(this.publicidad_seleccionada){
    this.pythonAnywhereService.borrar_publicidad(this.publicidad_seleccionada.id).subscribe(resp=>console.log(resp))
  }
    
  }

  
  next(event: any) {

    this.currentPage = this.currentPage + 1
    this.pythonAnywhereService.obtener_publicidades(this.currentPage).subscribe((resp:any) =>{
      this.arr_publicidad = resp.results;
      this.arr_filtered_publicidad = this.arr_publicidad;
    })
  }

  previous(event: any) {

    this.currentPage = this.currentPage - 1
    this.pythonAnywhereService.obtener_publicidades(this.currentPage).subscribe((resp:any) => {
      this.arr_publicidad = resp.results;
      this.arr_filtered_publicidad = this.arr_publicidad;
    })
  }

  iteracion(event: any) {
    this.pythonAnywhereService.obtener_publicidades(this.currentPage).subscribe((resp:any) => {
      this.arr_publicidad= resp.results;
      this.arr_filtered_publicidad = this.arr_publicidad;
      this.currentPage = resp.current_page_number
      if (resp.next != null) {
        this.condicionNext = true
      }

    })

  }

  
}
