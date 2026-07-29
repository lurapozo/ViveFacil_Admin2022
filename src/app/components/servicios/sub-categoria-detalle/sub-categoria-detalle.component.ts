import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { Categoria } from 'src/app/interfaces/categoria';
import { BodyActualizarServicio } from 'src/app/interfaces/servicio';
import { SubCategoria } from 'src/app/interfaces/sub-categoria';

@Component({
  selector: 'app-sub-categoria-detalle',
  templateUrl: './sub-categoria-detalle.component.html',
  styleUrls: ['./sub-categoria-detalle.component.css']
})
export class SubCategoriaDetalleComponent implements OnInit {
  servicio: SubCategoria | null = null;
  cargando = true;
  noEncontrada = false;
  listCategorias?: Categoria[];
  editando = false;

  // Tabla paginada de proveedores asociados a este servicio.
  arrProveedores: any[] = [];
  totalProveedores = 0;
  currentPage = 1;
  pageNumber: number[] = [];

  isErrorToast = false;
  mensajeToast = '';
  tituloToast = '';

  // ponytail: la foto no va en el FormGroup, es un File suelto + preview con
  // createObjectURL — el accept="image/*" del input ya filtra el formato, no
  // hace falta el validator de extensiones que arrastra sub-categorias.
  fotoFile: File | null = null;
  fotoPreview: string | null = null;

  formEdit = new FormGroup({
    categoria: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    estado: new FormControl(true),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pythonAnywhereService: PythonAnywhereService,
  ) {}

  // ponytail: no hay endpoint get-by-id para Servicio, pero la lista de
  // sub-categorías siempre trae la colección completa (todas=True, sin
  // paginación) así que el list-scan por :pk es 100% confiable acá.
  ngOnInit(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    this.pythonAnywhereService.obtener_servicios().subscribe((resp: any[]) => {
      const encontrado = resp.find(s => String(s.id) === pk);
      if (!encontrado) {
        this.noEncontrada = true;
        this.cargando = false;
        return;
      }
      this.servicio = encontrado;
      this.pythonAnywhereService.obtener_categorias().subscribe((categorias: any[]) => {
        this.listCategorias = categorias;
        this.limpiarForm();
        this.cargando = false;
      });
      this.cargarProveedores(1);
    });
  }

  volver(): void {
    this.router.navigate(['/servicios/sub-categorias']);
  }

  limpiarForm() {
    const categoria_obj = this.listCategorias?.find(c => c.id === this.servicio?.categoria);
    this.formEdit.patchValue({
      nombre: this.servicio?.nombre || '',
      descripcion: this.servicio?.descripcion || '',
      categoria: categoria_obj ? categoria_obj.nombre : '',
      estado: this.servicio?.estado !== undefined ? this.servicio.estado : true,
    });
  }

  onFotoSeleccionada(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;
    if (this.fotoPreview) URL.revokeObjectURL(this.fotoPreview);
    this.fotoFile = file;
    this.fotoPreview = URL.createObjectURL(file);
  }

  quitarFotoSeleccionada() {
    if (this.fotoPreview) URL.revokeObjectURL(this.fotoPreview);
    this.fotoFile = null;
    this.fotoPreview = null;
  }

  isInvalidForm(subForm: string): boolean {
    const control = this.formEdit.get(subForm);
    return !!(control?.invalid && control?.touched) || !!(control?.dirty && this.getErrorMessage(subForm).length !== 0);
  }

  getErrorMessage(item: string): string {
    const itemControl = this.formEdit.get(item) as FormControl;
    switch (item) {
      case 'nombre':
        return itemControl.hasError('required') ? 'Debe llenar este campo' : '';
      case 'descripcion':
        return itemControl.hasError('required') ? 'Debe llenar este campo' : '';
      case 'categoria':
        return itemControl.hasError('required') ? 'Debe elegir una categoría' : '';
      default:
        return '';
    }
  }

  onActualizar() {
    if (!this.servicio || this.formEdit.invalid) return;
    const subCategoria: BodyActualizarServicio = {};
    const nombre = this.formEdit.get('nombre')?.value;
    const descripcion = this.formEdit.get('descripcion')?.value;
    const categoria = this.formEdit.get('categoria')?.value;
    const estado = this.formEdit.get('estado')?.value;

    if (nombre) subCategoria.nombre = nombre;
    if (descripcion) subCategoria.descripcion = descripcion;
    if (categoria) subCategoria.categoria = categoria;
    if (estado !== null) subCategoria.estado = estado;
    if (this.fotoFile) subCategoria.foto = this.fotoFile;

    this.pythonAnywhereService.actualizar_servicios(subCategoria, this.servicio.id.toString()).subscribe(() => {
      this.mostrarToastInfo('Sub-Categoría actualizada', 'Se guardaron los cambios correctamente', false);
      this.editando = false;
      this.quitarFotoSeleccionada();
      this.pythonAnywhereService.obtener_servicios().subscribe((resp: any[]) => {
        const actualizado = resp.find(s => s.id === this.servicio?.id);
        if (actualizado) {
          this.servicio = actualizado;
          this.limpiarForm();
        }
      });
    });
  }

  eliminarServicio() {
    if (!this.servicio) return;
    this.pythonAnywhereService.eliminar_subcategoria_definitivo(this.servicio.id).subscribe({
      next: () => {
        this.mostrarToastInfo('Sub-categoría eliminada', 'Se eliminó correctamente', false);
        this.volver();
      },
      error: (err) => {
        const data = err.error;
        const mensaje = data?.solicitudes !== undefined
          ? `No se puede eliminar: ${data.solicitudes} solicitud(es) y ${data.proveedores_asociados} proveedor(es) asociado(s).`
          : 'No se pudo eliminar la sub-categoría.';
        this.mostrarToastInfo('No se pudo eliminar', mensaje, true);
      }
    });
  }

  cargarProveedores(page: number) {
    if (!this.servicio) return;
    this.pythonAnywhereService.obtener_proveedores_por_servicio(this.servicio.id, page).subscribe(resp => {
      this.arrProveedores = resp.results;
      this.totalProveedores = resp.total_objects;
      this.currentPage = resp.current_page_number;
      this.pageNumber = [];
      for (let index = 1; index <= resp.total_pages; index++) {
        this.pageNumber.push(index);
      }
    });
  }

  // ponytail: window de +-2 páginas alrededor de la actual + primera/última,
  // mismo patrón que proveedores.component.ts / solicitantes.component.ts.
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

  next(event?: any) {
    this.cargarProveedores(this.currentPage + 1);
  }

  previous(event?: any) {
    this.cargarProveedores(this.currentPage - 1);
  }

  iteracion(event: any) {
    this.cargarProveedores(Number(event.target.value));
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
    }
  }
}
