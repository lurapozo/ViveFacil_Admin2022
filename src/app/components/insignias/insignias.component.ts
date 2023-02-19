import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { BodyActualizarInsignia, BodyCrearInsignia, Insignia } from '../../interfaces/insignia';
import { Servicio } from 'src/app/interfaces/servicio';
import { Categoria } from '../../interfaces/categoria';

@Component({
  selector: 'app-insignias',
  templateUrl: './insignias.component.html',
  styleUrls: ['./insignias.component.css']
})
export class InsigniasComponent {

  total = 0
  arr_insignia?: Insignia[];
  arr_filtered_insignia?: Insignia[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  insignia_seleccionada?: Insignia;
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
  profesion = ['Automotriz','Hogar','Oficina','Promociones']
  arr_tipo = ['Solicitante','Proveedor']
  arr_servicios: Servicio[] | undefined;
  arr_categoria?: Categoria[] | undefined;

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {

    this.pythonAnywhereService.obtener_insignias().subscribe(resp => {
 
  
      this.arr_insignia = resp;
      this.arr_filtered_insignia= this.arr_insignia;
     console.log(this.arr_filtered_insignia)
    });
    this.pythonAnywhereService.obtener_servicios().subscribe((resp) => {
      this.arr_servicios = resp;
      console.log(this.arr_servicios)
    });

    this.pythonAnywhereService.obtener_categorias().subscribe(resp=>{
      this.arr_categoria=resp
    }

    )
    const imagenCrearControl = this.crearInsignias.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearInsignias.get('imagen') as AbstractControl, 'crear'));
    const imagenActualizarControl = this.editarInsignias.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.editarInsignias.get('imagen') as AbstractControl, 'actualizar'));
  }
  crearInsignias = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    pedidos: new FormControl('', [Validators.required]),
    servicio: new FormControl('', [Validators.required]),
    cat:new FormControl('', [Validators.required]),
    usuario:new FormControl('', [Validators.required]),
    descripcion:new FormControl('', [Validators.required]),
  }, []);

  editarInsignias = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    pedidos: new FormControl('', [Validators.required]),
    servicio: new FormControl('', [Validators.required]),
    cat:new FormControl('', [Validators.required]),
    usuario:new FormControl('', [Validators.required]),
    descripcion:new FormControl('', [Validators.required]),
  }, []);
  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.arr_filtered_insignia = this.arr_insignia;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_insignia = this.arr_filtered_insignia?.filter((solicitud) => {
        return solicitud.nombre.toLowerCase().includes(texto.toLowerCase())
      });
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
              this.crearInsignias.get('imagen')?.setValue(null);
              this.existImageCrear = false;
            }
            else if(tipo === 'actualizar'){
              this.editarInsignias.get('imagen')?.setValue(null);
              this.existImageActualizar = false;
            }
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if(tipo === 'crear'){
            this.existImageCrear = true;
          }
          else if(tipo === 'actualizar'){
            console.log("imagen actualizando")
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
  loadImageFromDevice(event:any, tipo: string) {
    const file: File = event.target.files[0];
    if(file){
      this.extraerBase64(file)
      .then((imagen: any) => {
        if(tipo === 'crear'){
          this.crearInsignias.get('imagen')?.setValue(file);
          this.fileImagenCrear = file;
          this.imagenCrear = imagen.base;
    
        }
        else if(tipo === 'actualizar'){
          this.editarInsignias.get('imagen')?.setValue(file);
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
      return this.crearInsignias.get(subForm)?.invalid && this.crearInsignias.get(subForm)?.touched || this.crearInsignias.get(subForm)?.dirty  && this.getErrorMessage(this.crearInsignias, subForm).length!==0;
    } else {
      return this.editarInsignias.get(subForm)?.invalid && this.editarInsignias.get(subForm)?.touched || this.editarInsignias.get(subForm)?.dirty  && this.getErrorMessage(this.editarInsignias, subForm).length!==0;
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

      case 'servicio':
        if (itemControl.hasError('required')) {
          return 'Debe especificar un servicio';
        }
        return '';

        case 'cat':
          
          if (itemControl.hasError('required')) {
            return 'Debe seleccionar un estado';
          }
          return '';
          case 'usuario':
          if (itemControl.hasError('required')) {
             console.log('entre')
            return 'Debe seleccionar un estado';
          }
          return '';
      default:
        return '';
    }
  }
  limpiarForm(tipo: string) {
    if(tipo === 'crear') {
      this.existImageCrear = false;
      this.crearInsignias.get('imagen')?.reset();
      this.crearInsignias.get('nombre')?.reset();
      this.crearInsignias.get('descripcion')?.reset();
      this.crearInsignias.get('servicio')?.setValue('');
      this.crearInsignias.get('cat')?.setValue('');
      this.crearInsignias.get('pedidos')?.setValue('');
      this.crearInsignias.get('servicio')?.setValue('');
      this.crearInsignias.get('usuario')?.setValue('');
    } else if(tipo === 'actualizar') {

      const servicio = this.insignia_seleccionada?.servicio;
      const nombre = this.insignia_seleccionada?.nombre;
      const descripcion = this.insignia_seleccionada?.descripcion;
      const estado = this.insignia_seleccionada?.estado;
      const tipo =  this.insignia_seleccionada?.tipo;
      const pedido =  this.insignia_seleccionada?.pedidos;
      const usuario =  this.insignia_seleccionada?.tipo_usuario;
      this.existImageActualizar = false;
      this.editarInsignias.get('imagen')?.reset();
      nombre? this.editarInsignias.get('nombre')?.setValue(nombre) : this.editarInsignias.get('nombre')?.reset();
      descripcion? this.editarInsignias.get('descripcion')?.setValue(descripcion) : this.editarInsignias.get('descripcion')?.reset();
      servicio? this.editarInsignias.get('servicio')?.setValue(servicio) : this.editarInsignias.get('servicio')?.reset();
      tipo? this.editarInsignias.get('cat')?.setValue(tipo) : this.editarInsignias.get('cat')?.reset();
      pedido? this.editarInsignias.get('pedidos')?.setValue(pedido) : this.editarInsignias.get('pedidos')?.reset();
      
    } 
  }
  onCrear(){

    const Insignia :BodyCrearInsignia={
      nombre: '',
      servicio: '',
      tipoUsuario: '',
      pedidos: '',
      descripcion: '',
      tipo: ''
      
    }
    const pedidos = this.crearInsignias.get('pedidos')?.value;
    const servicio = this.crearInsignias.get('servicio')?.value;
    const nombre = this.crearInsignias.get('nombre')?.value;
    const descripcion = this.crearInsignias.get('descripcion')?.value;
    const tipo = this.crearInsignias.get('cat')?.value;
    const usuario = this.crearInsignias.get('usuario')?.value;
    const foto = this.crearInsignias.get('imagen')?.value;
    if(nombre && servicio && descripcion && tipo && pedidos && usuario) {
      Insignia.servicio = servicio;
      Insignia.nombre = nombre;
      Insignia.descripcion = descripcion;
      Insignia.tipo= tipo
      Insignia.tipoUsuario = usuario
      Insignia.pedidos = pedidos
      if(foto && this.existImageCrear){
        Insignia.imagen = foto; // Si hay foto se le agrega al body.
      }
    console.log(Insignia)
    this.pythonAnywhereService.crear_insignia(Insignia).subscribe(resp=>{
      this.limpiarForm('crear');
      this.mostrarToastInfo('Estado de la Insignia profesion', 'Insignia Creada correctamente', false);
    })
  }
}

onActualizar(){
  const insignia :BodyActualizarInsignia={
    nombre:'',
    estado: false,
    descripcion:'',
    tipo:'',
    pedidos:'',
    tipo_usuario:'',
    servicio:''
  }

  const id = this.insignia_seleccionada?.id;
    const servicio = this.editarInsignias.get('servicio')?.value;
    const nombre = this.editarInsignias.get('nombre')?.value;
    const descripcion = this.editarInsignias.get('descripcion')?.value;
    const tipo = this.editarInsignias.get('cat')?.value;
    const usuario = this.editarInsignias.get('usuario')?.value;
    const pedidos = this.editarInsignias.get('pedidos')?.value;
    const foto = this.editarInsignias.get('imagen')?.value;
   console.log(nombre , servicio , descripcion  , tipo , usuario && pedidos)
    if(nombre && servicio && descripcion  && tipo && usuario && pedidos) {
      insignia.tipo= tipo
      insignia.tipo_usuario=usuario
      insignia.servicio = servicio;
      insignia.nombre = nombre;
      insignia.descripcion = descripcion;
      insignia.pedidos= pedidos
 
   
   
}
if(this.existImageActualizar && foto){
  insignia.imagen = foto; 
}

this.pythonAnywhereService.actualizar_insignia(insignia,id).subscribe(resp=>{
  console.log(resp)
  this.limpiarForm('actualizar');
  this.mostrarToastInfo('Estado de la Insignia profesion', 'Insignia editada correctamente', false);
})
}

onEliminar(){
  if(this.insignia_seleccionada){
    this.pythonAnywhereService.eliminar_insignia(this.insignia_seleccionada.id).subscribe(resp=>{
      this.mostrarToastInfo('Estado de la solicitud Insignia', 'Insignia Eliminada correctamente', false);
    })
  }
  
}
ver(cupon:any){
  this.insignia_seleccionada=cupon
  if (!this.activoCond) {
    this.activo = 'Activo'

  } else {
    this.activo = 'Inactivo'
  }


}

cambiarEstado(event:any){
  let estado = event.srcElement.checked
  if(this.insignia_seleccionada){
    this.pythonAnywhereService.cambio_insignia_estado(this.insignia_seleccionada.id,estado).subscribe(resp=>{console.log(resp);});
    this.mostrarToastInfo('Estado de la Insignia ', 'Insignia editada correctamente', false);
  } 


}



}