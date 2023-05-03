import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { BodyCuponActualizar, Cupon, CuponCrear } from 'src/app/interfaces/cupon';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent {
  arr_cupon!: Cupon[] | undefined;
  arr_filtered_cupon!: Cupon[] | undefined;
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  cupon_seleccionada: Cupon | undefined;
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";
  fileImagenActualizar: File = {} as File;
  imagenActualizar: string | undefined;
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
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
      console.log(this.arr_filtered_cupon)

    });
    this.pythonAnywhereService.obtener_categorias().subscribe((resp: any[]) => {
      this.categoria = resp
    })

    const imagenCrearControl = this.cuponCrear.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.cuponCrear.get('imagen') as AbstractControl, 'crear'));
    const imagenActualizarControl = this.formEdit.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.formEdit.get('imagen') as AbstractControl, 'actualizar'));
  }


  cuponCrear: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    codigo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    cantidad: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    inicio: new FormControl(''),
    fin: new FormControl('', [Validators.required]),
    punto: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    imagen: new FormControl(this.fileImagenActualizar),
    categoria: new FormControl(''),


  });

  formEdit: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    cantidad: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    inicio: new FormControl('', [Validators.required]),
    fin: new FormControl('', [Validators.required]),
    punto: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    imagen: new FormControl(this.fileImagenActualizar),
    categoria: new FormControl('', [Validators.required]),

  });

  cambiarEstado(event: any) {
    let estado = event.srcElement.checked
    if (this.cupon_seleccionada) {
      this.pythonAnywhereService.cambio_cupon_estado(this.cupon_seleccionada.id, estado).subscribe(resp => { 
        this.mostrarToastInfo('Estado de la Insignia ', 'Insignia editada correctamente', false);
       });
    }


  }
  ver(cupon: any) {
    this.cupon_seleccionada = cupon
    if (this.activoCond) {
      this.activo = 'Activo'

    } else {
      this.activo = 'Inactivo'
    }


  }

  limpiarForm(tipo: string) {
    if (tipo === 'crear') {
      this.existImageCrear = false;
      this.cuponCrear.get('titulo')?.reset();
      this.cuponCrear.get('imagen')?.reset();
      this.cuponCrear.get('descuento')?.reset();
      this.cuponCrear.get('descripcion')?.reset();
      this.cuponCrear.get('cantidad')?.reset()
      this.cuponCrear.get('inicio')?.reset()
      this.cuponCrear.get('fin')?.reset()
      this.cuponCrear.get('punto')?.reset()
      this.cuponCrear.get('categoria')?.reset()
      this.cuponCrear.get('imagen')?.reset()
      this.cuponCrear.get('codigo')?.reset()



    } else if (tipo === 'actualizar') {

      const titulo = this.cupon_seleccionada?.titulo;
      const descripcion = this.cupon_seleccionada?.descripcion;
      const descuento = this.cupon_seleccionada?.porcentaje;
      const cantidad = this.cupon_seleccionada?.cantidad;
      const punto = this.cupon_seleccionada?.puntos;
      const categoria = this.cupon_seleccionada?.tipo_categoria;
      const inicio = this.cupon_seleccionada?.fecha_iniciacion;
      const fin = this.cupon_seleccionada?.fecha_expiracion;


      this.existImageActualizar = false;
      this.formEdit.get('imagen')?.reset();
      titulo ? this.formEdit.get('titulo')?.setValue(titulo) : this.formEdit.get('nombre')?.reset();
      descripcion ? this.formEdit.get('descripcion')?.setValue(descripcion) : this.formEdit.get('descripcion')?.reset();
      descuento ? this.formEdit.get('descuento')?.setValue(descuento) : this.formEdit.get('descuento')?.reset();
      cantidad ? this.formEdit.get('cantidad')?.setValue(cantidad) : this.formEdit.get('cantidad')?.reset();
      punto ? this.formEdit.get('punto')?.setValue(punto) : this.formEdit.get('punto')?.reset();
      categoria ? this.formEdit.get('categoria')?.setValue(categoria) : this.formEdit.get('categoria')?.reset();
      inicio ? this.formEdit.get('inicio')?.setValue(inicio) : this.formEdit.get('inicio')?.reset();
      fin ? this.formEdit.get('fin')?.setValue(inicio) : this.formEdit.get('fin')?.reset();



    }
  }


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
          return 'El campo Titulo es requerido';
        }
        return '';

      case 'descripcion':
        if (itemControl.hasError('required')) {
          return 'El campo descripcion es requerido';
        }
        return '';

      case 'descuento':
        if (itemControl.hasError('required')) {
          return 'El campo descuento es requerido';
        } else if (itemControl.hasError('maxlength')) {
          return ' El número máximo  permitido es 99';
        } else if (itemControl.hasError('pattern')) {
          return ' Solo se permiten números.';
        }
        return '';
      case 'punto':
        if (itemControl.hasError('required')) {
          return 'El campo punto es requerido';
        } else if (itemControl.hasError('maxlength')) {
          return ' El número máximo  permitido es 99';
        } else if (itemControl.hasError('pattern')) {
          return ' Solo se permiten números.';
        }
        return '';
      case 'categoria':
        if (itemControl.hasError('required')) {
          return 'El campo categoria es requerido';
        }
        return '';
      case 'rol':
        if (itemControl.hasError('required')) {
          return 'el campo rol es requerido';
        }
        return '';
      case 'cantidad':
        if (itemControl.hasError('required')) {
          return 'El campo cantidad es requerido';
        } else if (itemControl.hasError('maxlength')) {
          return ' El número máximo  permitido es 99';
        } else if (itemControl.hasError('pattern')) {
          return ' Solo se permiten números.';
        }
        return '';
      case 'inicio':
        if (itemControl.hasError('required')) {
          return 'el campo Inicio es requerido';
        }
        return '';
      case 'fin':
        if (itemControl.hasError('required')) {
          return 'El campo fin es requerido';
        }
        return '';
      case 'codigo':
        if (itemControl.hasError('required')) {
          return 'El campo codigo es requerido';
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

      return this.formEdit.get(subForm)?.invalid && this.formEdit.get(subForm)?.touched || this.formEdit.get(subForm)?.dirty && this.getErrorMessage(this.formEdit, subForm).length !== 0;
    }
  }


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
            else if (tipo === 'actualizar') {
              this.cuponCrear.get('imagen')?.setValue(null);
              this.existImageActualizar = false;
            }
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if (tipo === 'crear') {
            this.existImageCrear = true;
          }
          else if (tipo === 'actualizar') {
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
          else if (tipo === 'actualizar') {

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

  onCrear() {
    let cupon: CuponCrear = {
      codigo: '',
      titulo: '',
      descripcion: '',
      porcentaje: 0,
      fecha_iniciacion: '',
      fecha_expiracion: '',
      puntos: 0,
      tipo_categoria: '',
      cantidad: 0
    }
    const codigo = this.cuponCrear.get('codigo')?.value;
    const titulo = this.cuponCrear.get('titulo')?.value;
    const descripcion = this.cuponCrear.get('descripcion')?.value;
    const inicio = this.cuponCrear.get('inicio')?.value;
    const fin = this.cuponCrear.get('fin')?.value;
    const cantidad = this.cuponCrear.get('cantidad')?.value;
    const puntos = this.cuponCrear.get('punto')?.value;
    const categoria = this.cuponCrear.get('categoria')?.value;
    const descuento = this.cuponCrear.get('descuento')?.value;
    const foto = this.cuponCrear.get('imagen')?.value



    if (titulo && descripcion && inicio && fin && cantidad && puntos && categoria && descuento) {
      cupon.codigo = codigo
      cupon.titulo = titulo
      cupon.descripcion = descripcion
      cupon.fecha_iniciacion = inicio
      cupon.fecha_expiracion = fin
      cupon.porcentaje = descuento
      cupon.cantidad = cantidad
      cupon.puntos = puntos
      cupon.tipo_categoria = categoria
      console.log('entre')
      if (foto && this.existImageCrear) {

        cupon.foto = foto;
        console.log("nullo", cupon.foto)


      }
      this.pythonAnywhereService.crear_cupon(cupon).subscribe(resp => {
        this.limpiarForm('crear');
        this.mostrarToastInfo('Estado del Cupon ', 'Cupon Creado correctamente', false);
        this.pythonAnywhereService.obtener_cupones().subscribe(resp => {
          this.arr_cupon = Object(resp)
          this.arr_filtered_cupon = this.arr_cupon
          console.log(this.arr_filtered_cupon)
    
        });
      })


    }

  }
  onActualizar() {
    let cupon: BodyCuponActualizar = {
      codigo: '',
      titulo: '',
      descripcion: '',
      fecha_iniciacion: '',
      fecha_expiracion: '',
      porcentaje: 0,
      cantidad: 0,
      puntos: 0,
      tipo_categoria: ''
    }

    const titulo = this.formEdit.get('titulo')?.value;
    const descripcion = this.formEdit.get('descripcion')?.value;
    const inicio = this.formEdit.get('inicio')?.value;
    const fin = this.formEdit.get('fin')?.value;
    const cantidad = this.formEdit.get('cantidad')?.value;
    const puntos = this.formEdit.get('punto')?.value;
    const categoria = this.formEdit.get('categoria')?.value;
    const descuento = this.formEdit.get('descuento')?.value;
    const foto = this.formEdit.get('imagen')?.value as File
    if (this.cupon_seleccionada) {
      cupon.codigo = this.cupon_seleccionada?.codigo
    }

    if (titulo && descripcion && inicio && fin && cantidad && puntos && categoria && descuento) {
      cupon.titulo = titulo
      cupon.descripcion = descripcion
      cupon.fecha_iniciacion = inicio
      cupon.fecha_expiracion = fin
      cupon.porcentaje = descuento
      cupon.cantidad = cantidad
      cupon.puntos = puntos
      cupon.tipo_categoria = categoria

    }

    console.log(foto, this.existImageActualizar)
    if (foto && this.existImageActualizar) {
      console.log('entre')
      cupon.foto = foto; // Si hay foto se le agrega al body.
      console.log(cupon.foto)
    }
    console.log(this.formEdit)
    if (this.cupon_seleccionada) {
      const id = this.cupon_seleccionada.id
      console.log(id)
      this.pythonAnywhereService.actualizar_cupon(cupon, id).subscribe(resp => {

        this.limpiarForm('actualizar');
        this.mostrarToastInfo('Estado del Cupon ', 'Cupon editada correctamente', false);
      })

    }
  }

  getCurrentDate(): string {
    return moment().format('YYYY-MM-DD');
  }

  getMinDateAvailable(): string {
    const minDate = moment().add(45, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
    return minDate;
  }

  getMaxDateAvailable() {
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
    }
  }

  onDelete() {
    if (this.cupon_seleccionada) {
      this.pythonAnywhereService.eliminar_cupon(this.cupon_seleccionada.id).subscribe(resp => this.mostrarToastInfo('Estado del Cupon ', 'Cupon Eliminado correctamente', false))
    }

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
