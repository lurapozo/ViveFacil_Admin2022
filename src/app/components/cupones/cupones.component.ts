import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { BodyCuponActualizar, Cupon, CuponCrear } from 'src/app/interfaces/cupon';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { BodyActualizarCategoria, BodyCrearCategoria, Categoria } from 'src/app/interfaces/categoria';
import { BodyCrearSubCategoria, BodyResponseCrearSubCategoria, SubCategoria } from 'src/app/interfaces/sub-categoria';

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent {
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechasFiltradas: any[] = [];
  codigo = Math.random().toString(36).substr(2, 6);
  arr_cupon!: Cupon[] | [];
  arr_filtered_cupon!: Cupon[] | [];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  total = 0
  cupon_seleccionada: any | undefined;
  isErrorToast = false;
  mensajeToast = "";
  tituloToast = "";
  fileImagenCrear: File = {} as File;
  imagenCrear: string | undefined;
  existImageCrear = false;
  mensajeAlerta: string = '';
  isCrear = false; isEliminar = false;
  dropdownOpen: boolean = false;
  categoria?: Categoria[];
  listCategorias?: Categoria[];
  primeraCat?: string;

  /**
   * Vigencia: si el cupón sirve HOY por sus fechas y sus cupos. Va en su propia
   * columna, separada de `estado` (el interruptor manual del admin), porque son
   * cosas independientes: un cupón puede estar habilitado y aun así estar
   * expirado o agotado. Lo calcula el backend en
   * promotions.services.vigencia_cupon.
   */
  private static readonly ETIQUETAS: Record<string, { texto: string; punto: string; texto_clase: string }> = {
    vigente:    { texto: 'Vigente',    punto: 'bg-success',   texto_clase: 'text-success' },
    programado: { texto: 'Programado', punto: 'bg-primary',   texto_clase: 'text-primary' },
    expirado:   { texto: 'Expirado',   punto: 'bg-secondary', texto_clase: 'text-muted' },
    agotado:    { texto: 'Agotado',    punto: 'bg-warning',   texto_clase: 'text-warning' },
  };

  private info(cupon: Cupon) {
    return CuponesComponent.ETIQUETAS[cupon?.vigencia || 'vigente']
      || CuponesComponent.ETIQUETAS['vigente'];
  }

  etiquetaEstado(cupon: Cupon): string {
    return this.info(cupon).texto;
  }

  claseEstado(cupon: Cupon): string {
    return this.info(cupon).punto;
  }

  claseTextoEstado(cupon: Cupon): string {
    return this.info(cupon).texto_clase;
  }

  cargar_cupones(page = 1) {
    this.pythonAnywhereService.obtener_cupones(page).subscribe(resp => {
      this.total = Object(resp).total_objects;
      this.arr_cupon = Object(resp).results;
      this.arr_filtered_cupon = this.arr_cupon;
      this.currentPage = Object(resp).current_page_number || page;
      this.condicionNext = Object(resp).next != null;
      this.pageNumber = [];
      for (let index = 1; index <= Object(resp).total_pages; index++) {
        this.pageNumber.push(index);
      }
    });
  }

  // ponytail: window de +-2 páginas alrededor de la actual + primera/última,
  // mismo patrón que proveedores.component.ts.
  get paginasVisibles(): (number | string)[] {
    const total = this.pageNumber.length;
    const actual = this.currentPage;
    const delta = 2;
    const paginas: (number | string)[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= actual - delta && i <= actual + delta)) {
        paginas.push(i);
      } else if (paginas[paginas.length - 1] !== '...') {
        paginas.push('...');
      }
    }
    return paginas;
  }

  next(event: any) {
    this.cargar_cupones(this.currentPage + 1);
  }

  previous(event: any) {
    this.cargar_cupones(this.currentPage - 1);
  }

  iteracion(event: any) {
    this.cargar_cupones(Number(event.target.value));
  }

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.cargar_cupones();

    /*this.pythonAnywhereService.obtener_servicios().subscribe((resp: any[]) => {
      this.categoria = resp
      console.log("cat",resp)
    })*/

    /*this.pythonAnywhereService.obtener_categorias().subscribe((resp: any[]) => {
      this.listCategorias = resp
      if(this.listCategorias.length>0){
        this.primeraCat=this.listCategorias[0].nombre
      }else{
        this.primeraCat=''
      }
      
      console.log("list sub",resp)

    })*/
    this.pythonAnywhereService.obtener_categorias().subscribe((resp: any[]) => {
      this.categoria = resp
    })

    const imagenCrearControl = this.cuponCrear.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.cuponCrear.get('imagen') as AbstractControl, 'crear'));
  }


  cuponCrear: FormGroup = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    codigo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    descuento: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    cantidad: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    inicio: new FormControl('', [Validators.required]),
    fin: new FormControl('', [Validators.required]),
    punto: new FormControl('10', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    imagen: new FormControl(this.fileImagenCrear),
    // Vacío = "Todas": el cupón no se restringe a ninguna categoría de servicio.
    categoria: new FormControl(''),
  });

  actualizarCup() {
    this.cargar_cupones(this.currentPage);
  }

  abrirSelectorArchivo(event: Event, fileInput: HTMLInputElement): void {
    event.stopPropagation();
    fileInput.click();
  }

  limpiarForm(tipo: string) {
    this.codigo = Math.random().toString(36).substr(2, 6);
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
          return 'El campo puntos necesarios es requerido';
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

    if (tipo === 'eliminar') {
      this.isEliminar = true;
      this.isCrear = false;
    } else if (tipo === 'crear') {
      this.isCrear = true;
      this.isEliminar = false;
    }
    this.mensajeAlerta = mensaje;
  }

  isInvalidForm(subForm: string, _tipo: string) {
    return this.cuponCrear.get(subForm)?.invalid && this.cuponCrear.get(subForm)?.touched
      || this.cuponCrear.get(subForm)?.dirty && this.getErrorMessage(this.cuponCrear, subForm).length !== 0;
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
            return { image_error: 'Solo imágenes con formato jpg, jpeg, png o jfif.' };
          }
          console.log('Formato de imagen correcto');
          if (tipo === 'crear') {
            this.existImageCrear = true;
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
    console.log("click en crear")
    let cupon: CuponCrear = {
      codigo: '',
      titulo: '',
      descripcion: '',
      porcentaje: 0,
      fecha_iniciacion: '',
      fecha_expiracion: '',
      participantes: '',
      puntos: 10,
      categoria: null,
      cantidad: 0,
      estado: false
    }
    const codigo = this.cuponCrear.get('codigo')?.value;
    const titulo = this.cuponCrear.get('titulo')?.value;
    const descripcion = this.cuponCrear.get('descripcion')?.value;
    const inicio = this.cuponCrear.get('inicio')?.value;
    const fin = this.cuponCrear.get('fin')?.value;
    // Los cupones son solo para solicitantes: ya no hay selector, va fijo.
    const participantes = 'Solicitante';
    const cantidad = this.cuponCrear.get('cantidad')?.value;
    const puntos = this.cuponCrear.get('punto')?.value;
    const categoria = this.cuponCrear.get('categoria')?.value;
    const descuento = this.cuponCrear.get('descuento')?.value;
    const foto = this.cuponCrear.get('imagen')?.value as File;



    if (titulo && descripcion && inicio && fin && cantidad && puntos && descuento) {
      cupon.codigo = codigo
      cupon.titulo = titulo
      cupon.descripcion = descripcion
      cupon.fecha_iniciacion = inicio
      cupon.fecha_expiracion = fin
      cupon.porcentaje = descuento
      cupon.cantidad = cantidad
      cupon.puntos = puntos
      cupon.categoria = categoria ? Number(categoria) : null
      cupon.participantes = participantes
      cupon.estado = true;

      if (foto && this.existImageCrear) {

        cupon.foto = foto;
        console.log("nullo", cupon.foto)


      }
      this.pythonAnywhereService.crear_cupon(cupon).subscribe(resp => {
        console.log("Cupon", cupon)
        //this.limpiarForm('crear');
        this.mostrarToastInfo('Estado del Cupon ', 'Cupon Creado correctamente', false);
        this.cargar_cupones(1);
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
      this.arr_filtered_cupon = this.arr_filtered_cupon?.filter((solicitud: any) => {
        return solicitud.titulo.toLowerCase().includes(texto.toLowerCase())
      });
    }
  }

  /** Marca cuál se va a eliminar y prepara el modal de confirmación. */
  pedirEliminar(cupon: Cupon) {
    this.cupon_seleccionada = cupon;
    this.establecerMensaje(
      `¿Está seguro que desea eliminar el cupón "${cupon.titulo}"? Esta acción no se puede deshacer.`,
      'eliminar',
    );
  }

  onDelete() {
    if (!this.cupon_seleccionada) {
      return;
    }
    this.pythonAnywhereService.eliminar_cupon(this.cupon_seleccionada.id).subscribe({
      next: () => {
        this.mostrarToastInfo('Cupón eliminado', 'Se eliminó correctamente', false);
        this.actualizarCup();
      },
      // El backend devuelve 409 cuando el cupón ya tiene canjes: no se borra,
      // se desactiva, para no perder el rastro de quién lo usó.
      error: (err) => {
        const data = err.error;
        const mensaje = data?.canjes !== undefined
          ? `${data.error} (${data.canjes} canje(s) y ${data.pagos} pago(s) asociados).`
          : 'No se pudo eliminar el cupón.';
        this.mostrarToastInfo('No se pudo eliminar', mensaje, true);
      },
    });
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

  filtrarPorFechas() {
    if (this.fechaInicio && this.fechaFin) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaFin = new Date(this.fechaFin);

      this.arr_filtered_cupon = this.arr_cupon.filter(a => {
        const fechaIni = new Date(a.fecha_iniciacion);
        const fechaIFni = new Date(a.fecha_expiracion);
        if (this.fechaInicio && this.fechaFin) {
          return fechaInicio >= fechaInicio && fechaIFni <= fechaFin;
        }
        return true;
      });
    }
  }

  seleccionarOpcion(opcion: string) {
    console.log('Opción seleccionada:', opcion);
    this.dropdownOpen = false;
  }
}
