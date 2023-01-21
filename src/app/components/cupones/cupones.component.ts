import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BodyCuponActualizar, Cupon } from 'src/app/interfaces/cupon';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent {
  arr_cupon!: any[];
  arr_filtered_cupon!: any[];
  imagenCrear: any
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  cupon_seleccionada: any
  fileImagenActualizar: File = {} as File
  imagenActualizar: any
  fileImagenCrear: any
  existImageCrear = false; existImageActualizar = false;
  activo = ''
  activoCond = false
  mensajeAlerta: string = '';
  isCrear = false; isActualizar = false; isEliminar = false;
  categoria!: any[];
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_cupones().subscribe(resp => {
    this.arr_cupon = Object(resp)
    this.arr_filtered_cupon = this.arr_cupon
  
    });
    this.pythonAnywhereService.obtener_categorias().subscribe((resp:any[])=>{
     this.categoria=resp
     
  
      
    })
  
   const imagenCrearControl = this.cuponCrear.get('imagen') as FormControl;
   imagenCrearControl.addValidators(this.createImageValidator(this.cuponCrear.get('imagen') as AbstractControl, 'crear'));
     const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));
  }


  cuponCrear: FormGroup = new FormGroup({
    codigo: new FormControl(),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required]),
    cantidad: new FormControl(''),
    inicio: new FormControl(''),
    fin: new FormControl('',[Validators.required]),
    punto: new FormControl('',[Validators.required]),
    imagen: new FormControl(this.fileImagenActualizar),
    categoria: new FormControl(''),


  });

  formEdit: FormGroup = new FormGroup({

    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required]),
    cantidad: new FormControl(''),
    inicio: new FormControl(''),
    fin: new FormControl('',[Validators.required]),
    punto: new FormControl('',[Validators.required]),
    imagen: new FormControl(this.fileImagenActualizar),
    categoria: new FormControl(''),

  });

  cambiarEstado(event:any){
    let estado = event.srcElement.checked
    this.pythonAnywhereService.cambio_cupon_estado(this.cupon_seleccionada.id,estado).subscribe(resp=>{console.log(resp);});

  }
  ver(cupon:any){
    this.cupon_seleccionada=cupon
    if (this.activoCond) {
      this.activo = 'Activo'

    } else {
      this.activo = 'Inactivo'
    }


  }

  limpiarForm(tipo: string) {
    if(tipo === 'crear') {
      this.existImageCrear = false;
      this.cuponCrear.get('titulo')?.reset();
      this.cuponCrear.get('descuento')?.reset();
      this.cuponCrear.get('descripcion')?.reset();
      this.cuponCrear.get('cantidad')?.setValue('');
      this.cuponCrear.get('inicio')?.setValue('');
      this.cuponCrear.get('fin')?.setValue('');
      this.cuponCrear.get('punto')?.setValue('');
      this.cuponCrear.get('categoria')?.setValue('');
      this.cuponCrear.get('imagen')?.setValue('');
   

    } else if(tipo === 'actualizar') {

      const titulo = this.cupon_seleccionada?.titulo;
      const descripcion = this.cupon_seleccionada?.descripcion;
      const descuento = this.cupon_seleccionada?.porcentaje;
      const cantidad = this.cupon_seleccionada?.cantidad;
      const punto = this.cupon_seleccionada?.puntos;
      const categoria = this.cupon_seleccionada?.tipo_categoria;
      const inicio = this.cupon_seleccionada?.fecha_iniciacion;
      const fin = this.cupon_seleccionada?.fecha_expiracion;
      const foto = this.cupon_seleccionada?.foto;

    
      this.existImageActualizar = false;
      this.formEdit.get('imagen')?.reset();
      titulo? this.formEdit.get('titulo')?.setValue(titulo) : this.formEdit.get('nombre')?.reset();
      descripcion? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
      descuento? this.formEdit.get('descuento')?.setValue(descuento) : this.formEdit.get('descuento')?.reset();
      cantidad? this.formEdit.get('cantidad')?.setValue(cantidad) : this.formEdit.get('cantidad')?.reset();
      punto? this.formEdit.get('punto')?.setValue(punto) : this.formEdit.get('punto')?.reset();
      categoria? this.formEdit.get('categoria')?.setValue(categoria) : this.formEdit.get('categoria')?.reset();
      inicio? this.formEdit.get('inicio')?.setValue(inicio) : this.formEdit.get('inicio')?.reset();
      fin? this.formEdit.get('fin')?.setValue(inicio) : this.formEdit.get('fin')?.reset();
      foto? this.formEdit.get('imagen')?.setValue(inicio) : this.formEdit.get('imagen')?.reset();

   
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
      case 'punto':
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
      case 'rol':
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

      return this.cuponCrear.get(subForm)?.invalid && this.cuponCrear.get(subForm)?.touched || this.cuponCrear.get(subForm)?.dirty && this.getErrorMessage(this.cuponCrear, subForm).length !== 0;
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
              this.cuponCrear.get('imagen')?.setValue(null);
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
            this.cuponCrear.get('imagen')?.setValue(file);
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
    let cupon : Cupon={
      codigo: "45",
      titulo: this.cuponCrear.value.titulo,
      descripcion: this.cuponCrear.value.descripcion,
      porcentaje: this.cuponCrear.value.descuento,
      fecha_iniciacion: this.cuponCrear.value.inicio,
      fecha_expiracion: this.cuponCrear.value.fin,
      puntos: this.cuponCrear.value.punto,
      foto: this.cuponCrear.value.imagen,
      tipo_categoria: this.cuponCrear.value.categoria,
      cantidad: this.cuponCrear.value.cantidad
    }
    console.log(cupon)
  this.pythonAnywhereService.crear_cupon(cupon).subscribe(resp => {
    console.log(resp)
  })

  }
  onActualizar(){
    let cupon :BodyCuponActualizar ={
      codigo: '',
      titulo: '',
      descripcion: '',
      fecha_iniciacion: null,
      fecha_expiracion: '',
      porcentaje: 0,
      cantidad: 0,
      puntos: 0,
      foto: null,
      tipo_categoria: ''
    }

    cupon.codigo = this.formEdit.get('titulo')?.value;
    cupon.titulo = this.formEdit.get('titulo')?.value;
    cupon.descripcion = this.formEdit.get('descripcion')?.value;
    cupon.fecha_iniciacion = this.formEdit.get('inicio')?.value;
    cupon.fecha_expiracion = this.formEdit.get('fin')?.value;
    cupon.porcentaje = this.formEdit.get('descuento')?.value;
    cupon.cantidad = this.formEdit.get('cantidad')?.value;
    cupon.puntos = this.formEdit.get('punto')?.value;
    cupon.foto = this.formEdit.get('imagen')?.value;
    cupon.tipo_categoria = this.formEdit.get('categoria')?.value;
    
    console.log(cupon)
    const id = this.cupon_seleccionada.id
    console.log(this.formEdit)
    this.pythonAnywhereService.actualizar_cupon(cupon,id).subscribe(resp=>{console.log(resp);})
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
    this.arr_filtered_cupon = this.arr_cupon;
    if (texto && texto.trim() !== '') {
      this.arr_filtered_cupon = this.arr_filtered_cupon?.filter((solicitud) => {
        return solicitud.titulo.toLowerCase().includes(texto.toLowerCase())
      });
    }}

    onDelete(){

      this.pythonAnywhereService.eliminar_cupon(this.cupon_seleccionada.id).subscribe(resp=>console.log(resp))
    }
}
