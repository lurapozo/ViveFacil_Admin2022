import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Servicio } from 'src/app/interfaces/servicio';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { Categoria } from '../../interfaces/categoria';
import { BodyActualizarInsignia, BodyActualizarMedalla, BodyCrearMedalla, Insignia, Medalla } from '../../interfaces/insignia';
@Component({
  selector: 'app-medalla',
  templateUrl: './medalla.component.html',
  styleUrls: ['./medalla.component.css']
})

export class MedallaComponent {
  total = 0
  arr_insignia?: Medalla[];
  arr_filtered_insignia?: Medalla[];
  condicionNext = false
  currentPage = 1
  pageNumber: number[] = [];
  insignia_seleccionada?: Medalla;
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
  profesion = ['Automotriz', 'Hogar', 'Oficina', 'Promociones']
  arr_tipo = ['Solicitante', 'Proveedor']
  arr_servicios: Servicio[] | undefined;
  arr_categoria?: Categoria[] | undefined;

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_medallas().subscribe(resp => {
      this.arr_insignia = resp;
      this.arr_filtered_insignia = this.arr_insignia;
      console.log(this.arr_filtered_insignia)
    });
    this.pythonAnywhereService.obtener_servicios().subscribe((resp) => {
      this.arr_servicios = resp;
      console.log(this.arr_servicios)
    });

    this.pythonAnywhereService.obtener_categorias().subscribe(resp => {
      this.arr_categoria = resp
    }

    )
    const imagenCrearControl = this.crearInsignias.get('imagen') as FormControl;
    imagenCrearControl.addValidators(this.createImageValidator(this.crearInsignias.get('imagen') as AbstractControl, 'crear'));
    const imagenActualizarControl = this.editarMedallas.get('imagen') as FormControl;
    imagenActualizarControl.addValidators(this.createImageValidator(this.editarMedallas.get('imagen') as AbstractControl, 'actualizar'));
  }
  crearInsignias = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    imagen: new FormControl(this.fileImagenActualizar),
    // pedidos: new FormControl('', [Validators.required, Validators.minLength(1),
    // Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    tiempo: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    
  }, []);

  editarMedallas = new FormGroup({
    imagen: new FormControl(this.fileImagenActualizar),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    cantidad: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),
    tiempo: new FormControl('', [Validators.required, Validators.minLength(1),
    Validators.maxLength(2), Validators.pattern(/^[0-9]+$/)]),

    
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
  establecerMensaje(mensaje: string, tipo: string) {
    console.log("LLLLLLLLLLLLLLLLL")
    console.log(mensaje)
    console.log(tipo)
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
              this.crearInsignias.get('imagen')?.setValue(null);
              this.existImageCrear = false;
            }
            else if (tipo === 'actualizar') {
              this.editarMedallas.get('imagen')?.setValue(null);
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
            this.crearInsignias.get('imagen')?.setValue(file);
            this.fileImagenCrear = file;
            this.imagenCrear = imagen.base;

          }
          else if (tipo === 'actualizar') {
            this.editarMedallas.get('imagen')?.setValue(file);
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
  isInvalidForm(subForm: string, tipo: string) {
    if (tipo === 'crear') {
      return this.crearInsignias.get(subForm)?.invalid && this.crearInsignias.get(subForm)?.touched || this.crearInsignias.get(subForm)?.dirty && this.getErrorMessage(this.crearInsignias, subForm).length !== 0;
    } else {
      return this.editarMedallas.get(subForm)?.invalid && this.editarMedallas.get(subForm)?.touched || this.editarMedallas.get(subForm)?.dirty && this.getErrorMessage(this.editarMedallas, subForm).length !== 0;
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

          return 'Debe seleccionar un estado';
        }
        return '';
        case 'pedidos':
          if (itemControl.hasError('required')) {
            return 'El campo cantidad es requerido';
          } else if (itemControl.hasError('maxlength')) {
            return ' El número máximo  permitido es 99';
          } else if (itemControl.hasError('pattern')) {
            return ' Solo se permiten números.';
          }
          return '';
      default:
        return '';
    }
  }
  limpiarForm(tipo: string) {
    if (tipo === 'crear') {
      this.existImageCrear = false;
      this.crearInsignias.get('imagen')?.reset();
      this.crearInsignias.get('nombre')?.reset();
      this.crearInsignias.get('descripcion')?.reset();
      this.crearInsignias.get('tiempo')?.setValue('');
      this.crearInsignias.get('valor')?.setValue('');
      this.crearInsignias.get('cantidad')?.setValue('');
    } else if (tipo === 'actualizar') {

      const nombre = this.insignia_seleccionada?.nombre;
      const descripcion = this.insignia_seleccionada?.descripcion;
      const estado = this.insignia_seleccionada?.estado;
      const tiempo = this.insignia_seleccionada?.tiempo;
      const valor = this.insignia_seleccionada?.valor;
      const cantidad = this.insignia_seleccionada?.cantidad;
      this.existImageActualizar = false;
      
      this.editarMedallas.get('imagen')?.reset();
      nombre ? this.editarMedallas.get('nombre')?.setValue(nombre) : this.editarMedallas.get('nombre')?.reset();
      descripcion ? this.editarMedallas.get('descripcion')?.setValue(descripcion) : this.editarMedallas.get('descripcion')?.reset();
      tiempo ? this.editarMedallas.get('tiempo')?.setValue(tiempo) : this.editarMedallas.get('tiempo')?.reset();
      // tipo ? this.editarMedallas.get('cat')?.setValue(tipo) : this.editarMedallas.get('cat')?.reset();
      valor ? this.editarMedallas.get('valor')?.setValue(valor) : this.editarMedallas.get('valor')?.reset();
      cantidad ? this.editarMedallas.get('cantidad')?.setValue(cantidad) : this.editarMedallas.get('cantidad')?.reset();

    }
  }
  onCrear() {

    const Medalla: BodyCrearMedalla = {
      nombre: '',
      descripcion: '',
      tiempo: '',
      valor: '',
      cantidad: ''

    }
    const nombre = this.crearInsignias.get('nombre')?.value;
    const descripcion = this.crearInsignias.get('descripcion')?.value;
    const foto = this.crearInsignias.get('imagen')?.value;
    const tiempo = this.crearInsignias.get('tiempo')?.value;
    const valor = this.crearInsignias.get('valor')?.value;
    const cantidad = this.crearInsignias.get('cantidad')?.value;
    
    if (nombre && descripcion && (valor != null) && (cantidad != null)  && (tiempo != null)) {
      Medalla.nombre = nombre;
      Medalla.tiempo = tiempo;
      Medalla.descripcion = descripcion;
      Medalla.valor = valor
      Medalla.cantidad = cantidad
      if (foto && this.existImageCrear) {
        Medalla.imagen = foto; // Si hay foto se le agrega al body.
      }
      console.log(Medalla)
      this.pythonAnywhereService.crear_medalla(Medalla).subscribe(resp => {
        this.limpiarForm('crear');
        this.pythonAnywhereService.obtener_medallas().subscribe(resp => {
          this.arr_insignia = resp;
          this.arr_filtered_insignia = this.arr_insignia;
          console.log(this.arr_filtered_insignia)
        });
        this.mostrarToastInfo('Estado de la Medalla ', 'Medalla Creada correctamente', false);
      })
    }
  }

  onActualizar() {
    const medalla: BodyActualizarMedalla = {
      nombre: '',
      descripcion: '',
      tiempo: '',
      valor: '',
      estado: false,
      cantidad: '',
    }

    const id = this.insignia_seleccionada?.id;
    
    const nombre = this.editarMedallas.get('nombre')?.value;
    const descripcion = this.editarMedallas.get('descripcion')?.value;
    const tiempo = this.editarMedallas.get('tiempo')?.value;
    const valor = this.editarMedallas.get('valor')?.value;
    const cantidad = this.editarMedallas.get('cantidad')?.value;
    const foto = this.editarMedallas.get('imagen')?.value;
    console.log(nombre, tiempo, descripcion, cantidad && valor)
    if (nombre && descripcion && (valor != null) && (cantidad != null)  && (tiempo != null)) {
      medalla.tiempo = tiempo;
      medalla.valor = valor;
      medalla.nombre = nombre;
      medalla.descripcion = descripcion;
      medalla.cantidad = cantidad
    }
    if (this.existImageActualizar && foto) {
      medalla.imagen = foto;
    }

    this.pythonAnywhereService.actualizar_medalla(medalla, id).subscribe(resp => {
      console.log(resp)
      this.limpiarForm('actualizar');
      this.pythonAnywhereService.obtener_medallas().subscribe(resp => {
        this.arr_insignia = resp;
        this.arr_filtered_insignia = this.arr_insignia;
        console.log(this.arr_filtered_insignia)
      });
      this.mostrarToastInfo('Estado de la Insignia ', 'Insignia editada correctamente', false);
    })
  }

  onEliminar() {
    if (this.insignia_seleccionada) {
      this.pythonAnywhereService.cambio_medalla_estado(this.insignia_seleccionada.id).subscribe(resp => {
        this.pythonAnywhereService.obtener_medallas().subscribe(resp => {
          this.arr_insignia = resp;
          this.arr_filtered_insignia = this.arr_insignia;
          console.log(this.arr_filtered_insignia)
        });
        this.mostrarToastInfo('Estado de  Insignia', 'Insignia Anulada correctamente', false);
      })
    }

  }
  ver(cupon: any) {
    this.insignia_seleccionada = cupon
    if (!this.activoCond) {
      this.activo = 'Activo'

    } else {
      this.activo = 'Inactivo'
    }


  }

  cambiarEstado(event: any) {
    let estado = event.srcElement.checked
    if (this.insignia_seleccionada) {
      this.pythonAnywhereService.cambio_insignia_estado(this.insignia_seleccionada.id, estado).subscribe(resp => { console.log(resp); });
      this.mostrarToastInfo('Estado de la Insignia ', 'Insignia editada correctamente', false);
    }
  }
}
