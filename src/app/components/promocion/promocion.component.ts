import { Component } from '@angular/core';
import { BodyPromocionActualizar, Promocion, PromocionCrear } from '../../interfaces/promocion';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-promocion',
  templateUrl: './promocion.component.html',
  styleUrls: ['./promocion.component.css']
})
export class PromocionComponent {

  arr_promocion!: Promocion[]  | undefined;
  arr_filtered_promocion!: Promocion[]  | undefined;
  imagenCrear: any
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  promocion_seleccionada:  Promocion  | undefined;
  fileImagenActualizar: File = {} as File
  imagenActualizar: any
  fileImagenCrear: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  categoria!: any[];
  participante = ['Solicitante','Proveedor']



  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_promociones().subscribe(resp => {
    this.arr_promocion = Object(resp)
    this.arr_filtered_promocion = this.arr_promocion
    console.log(this.arr_filtered_promocion)
  
    });
    this.pythonAnywhereService.obtener_categorias().subscribe((resp:any[])=>{
     this.categoria=resp
     
  
    })

    const imagenCrearControl = this.promocionCrear.get('imagen') as FormControl;
   imagenCrearControl.addValidators(this.createImageValidator(this.promocionCrear.get('imagen') as AbstractControl, 'crear'));
     const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));
}

promocionCrear: FormGroup = new FormGroup({
  codigo: new FormControl(),
  titulo: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required]),
  descuento: new FormControl('', [Validators.required]),
  cantidad: new FormControl(''),
  inicio: new FormControl(''),
  fin: new FormControl('',[Validators.required]),
  imagen: new FormControl(this.fileImagenActualizar),
  categoria: new FormControl(''),
  participante:new FormControl('', [Validators.required]),


});


formEdit: FormGroup = new FormGroup({
  codigo: new FormControl(),
  titulo: new FormControl('', [Validators.required]),
  descripcion: new FormControl('', [Validators.required]),
  descuento: new FormControl('', [Validators.required]),
  cantidad: new FormControl(''),
  inicio: new FormControl(''),
  fin: new FormControl('',[Validators.required]),
  imagen: new FormControl(this.fileImagenActualizar),
  categoria: new FormControl(''),
  participante:new FormControl('', [Validators.required]),


});

cambiarEstado(event:any){
  let estado = event.srcElement.checked
  if(this.promocion_seleccionada){
    this.pythonAnywhereService.cambio_promocion_estado(this.promocion_seleccionada.id,estado).subscribe(resp=>{console.log(resp);});
  }


}

ver(cupon:any){
  this.promocion_seleccionada=cupon
  if (this.activoCond) {
    this.activo = 'Activo'

  } else {
    this.activo = 'Inactivo'
  }


}

limpiarForm(tipo: string) {
  if(tipo === 'crear') {
    this.existImageCrear = false;
    this.promocionCrear.get('titulo')?.reset();
    this.promocionCrear.get('descuento')?.reset();
    this.promocionCrear.get('descripcion')?.reset();
    this.promocionCrear.get('cantidad')?.setValue('');
    this.promocionCrear.get('inicio')?.setValue('');
    this.promocionCrear.get('fin')?.setValue('');
    this.promocionCrear.get('punto')?.setValue('');
    this.promocionCrear.get('categoria')?.setValue('');
    this.promocionCrear.get('imagen')?.setValue('');
    this.promocionCrear.get('participante')?.setValue('');

  } else if(tipo === 'actualizar') {

    const titulo = this.promocion_seleccionada?.titulo;
    const descripcion = this.promocion_seleccionada?.descripcion;
    const descuento = this.promocion_seleccionada?.porcentaje;
    const cantidad = this.promocion_seleccionada?.cantidad;
    const categoria = this.promocion_seleccionada?.tipo_categoria;
    const inicio = this.promocion_seleccionada?.fecha_iniciacion;
    const fin = this.promocion_seleccionada?.fecha_expiracion;
    const foto = this.promocion_seleccionada?.foto;
    const participante = this.promocion_seleccionada?.participantes;
  
    this.existImageActualizar = false;
    this.formEdit.get('imagen')?.reset();
    titulo? this.formEdit.get('titulo')?.setValue(titulo) : this.formEdit.get('nombre')?.reset();
    descripcion? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
    descuento? this.formEdit.get('descuento')?.setValue(descuento) : this.formEdit.get('descuento')?.reset();
    cantidad? this.formEdit.get('cantidad')?.setValue(cantidad) : this.formEdit.get('cantidad')?.reset();
    categoria? this.formEdit.get('categoria')?.setValue(categoria) : this.formEdit.get('categoria')?.reset();
    inicio? this.formEdit.get('inicio')?.setValue(inicio) : this.formEdit.get('inicio')?.reset();
    fin? this.formEdit.get('fin')?.setValue(inicio) : this.formEdit.get('fin')?.reset();
    foto? this.formEdit.get('imagen')?.setValue(inicio) : this.formEdit.get('imagen')?.reset();
    participante? this.formEdit.get('participante')?.setValue(participante) : this.formEdit.get('participante')?.reset();
 
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

    case 'descuento':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';
    case 'participante':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';
    case 'foto':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';
    case 'categoria':
      if (itemControl.hasError('required')) {
        return 'Debe llenar este campo';
      }
      return '';
    case 'cantidad':
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

    return this.promocionCrear.get(subForm)?.invalid && this.promocionCrear.get(subForm)?.touched || this.promocionCrear.get(subForm)?.dirty && this.getErrorMessage(this.promocionCrear, subForm).length !== 0;
  } else {
    return
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
            this.promocionCrear.get('imagen')?.setValue(null);
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
          this.promocionCrear.get('imagen')?.setValue(file);
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
  let cupon : PromocionCrear={
    codigo: '',
    titulo: '',
    descripcion: '',
    porcentaje: 0,
    fecha_iniciacion: '',
    fecha_expiracion: '',
    foto: '',
    tipo_categoria: '',
    cantidad: 0,
    participantes: '',
    estado: false
  }

  const codigo = this.promocionCrear.get('titulo')?.value;
  const titulo = this.promocionCrear.get('titulo')?.value;
  const descripcion = this.promocionCrear.get('descripcion')?.value;
  const inicio = this.promocionCrear.get('inicio')?.value;
  const fin = this.promocionCrear.get('fin')?.value;
  const cantidad = this.promocionCrear.get('cantidad')?.value;
  const participante = this.promocionCrear.get('participante')?.value;
  const categoria = this.promocionCrear.get('categoria')?.value;
  const descuento = this.promocionCrear.get('descuento')?.value;
  const foto = this.promocionCrear.get('imagen')?.value;

  console.log(codigo , titulo , descripcion , inicio , fin , cantidad , participante , categoria , descuento)
  if(codigo && titulo && descripcion && inicio && fin && cantidad && participante && categoria && descuento ){
    cupon.titulo = codigo
    cupon.descripcion = descripcion
    cupon.fecha_iniciacion = inicio
    cupon.fecha_expiracion = fin
    cupon.porcentaje = descuento
    cupon.cantidad =cantidad
    cupon.participantes = participante
    cupon.tipo_categoria = categoria
    if(foto && this.existImageCrear){
      cupon.foto = foto; // Si hay foto se le agrega al body.
    }
    this.pythonAnywhereService.crear_promocion(cupon).subscribe(resp => {
      console.log(resp)
    })

  }
  
}


onActualizar(){
  let cupon :BodyPromocionActualizar ={
    codigo: '',
    titulo: '',
    descripcion: '',
    fecha_iniciacion: null,
    fecha_expiracion: '',
    porcentaje: 0,
    cantidad: 0,
    foto: null,
    tipo_categoria: '',
    participantes: ''
  }
  const codigo = this.formEdit.get('codigo')?.value;
  const titulo = this.formEdit.get('titulo')?.value;
  const descripcion = this.formEdit.get('descripcion')?.value;
  const inicio = this.formEdit.get('inicio')?.value;
  const fin = this.formEdit.get('fin')?.value;
  const cantidad = this.formEdit.get('cantidad')?.value;
  const participante = this.formEdit.get('participante')?.value;
  const categoria = this.formEdit.get('categoria')?.value;
  const descuento = this.formEdit.get('descuento')?.value;
  const foto = this.formEdit.get('imagen')?.value;
  if(codigo && titulo && descripcion && inicio && fin && cantidad && participante && categoria && descuento ){
    cupon.titulo = codigo
    cupon.descripcion = descripcion
    cupon.fecha_iniciacion = inicio
    cupon.fecha_expiracion = fin
    cupon.porcentaje = descuento
    cupon.cantidad =cantidad
    cupon.participantes = participante
    cupon.tipo_categoria = categoria

  }

  if(foto && this.existImageCrear){
    cupon.foto = foto; 
  }
  if(this.promocion_seleccionada){
    const id = this.promocion_seleccionada.id
    console.log(this.formEdit)
    this.pythonAnywhereService.actualizar_promocion(cupon,id).subscribe(resp=>{console.log(resp);})

  }

;

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
  this.arr_filtered_promocion = this.arr_promocion;
  if (texto && texto.trim() !== '') {
    this.arr_filtered_promocion = this.arr_filtered_promocion?.filter((solicitud) => {
      return solicitud.titulo.toLowerCase().includes(texto.toLowerCase())
    });
  }}

  onDelete(){
  if(this.promocion_seleccionada){
    this.pythonAnywhereService.eliminar_promocion(this.promocion_seleccionada.id).subscribe(resp=>console.log(resp))
  }
    
  }

}