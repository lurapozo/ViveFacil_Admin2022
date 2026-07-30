import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BodyCuponActualizar, Cupon, UsoCupon, VigenciaCupon } from 'src/app/interfaces/cupon';
import { Categoria } from 'src/app/interfaces/categoria';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

/**
 * Vigencia: si el cupón sirve hoy por fechas y cupos. Se muestra aparte del
 * interruptor manual (`estado`), que es lo que controla el botón
 * Habilitar/Deshabilitar. Son dos cosas independientes y antes iban mezcladas
 * en un solo badge, que era justamente lo que no se entendía.
 */
const VIGENCIAS: Record<VigenciaCupon, { etiqueta: string; clase: string; ayuda: string }> = {
  vigente: {
    etiqueta: 'Vigente',
    clase: 'badge-activo',
    ayuda: 'Dentro de fechas y con cupos disponibles.',
  },
  programado: {
    etiqueta: 'Programado',
    clase: 'badge-programado',
    ayuda: 'Su fecha de inicio todavía no llega.',
  },
  expirado: {
    etiqueta: 'Expirado',
    clase: 'badge-inactivo',
    ayuda: 'Pasó su fecha de expiración. Los canjes pendientes ya no se pueden usar.',
  },
  agotado: {
    etiqueta: 'Agotado',
    clase: 'badge-agotado',
    ayuda: 'No quedan cupos por canjear. Sube la cantidad para reabrirlo.',
  },
};

@Component({
  selector: 'app-cupon-detalle',
  templateUrl: './cupon-detalle.component.html',
  styleUrls: ['./cupon-detalle.component.css'],
})
export class CuponDetalleComponent implements OnInit {
  cupon: Cupon | null = null;
  cargando = true;
  noEncontrado = false;
  editando = false;
  listCategorias?: Categoria[];

  // Tabla paginada de canjes.
  arrUsos: UsoCupon[] = [];
  totalUsos = 0;
  currentPage = 1;
  pageNumber: number[] = [];

  isErrorToast = false;
  mensajeToast = '';
  tituloToast = '';

  fotoFile: File | null = null;
  fotoPreview: string | null = null;

  formEdit = new FormGroup({
    codigo: new FormControl('', [Validators.required]),
    titulo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    porcentaje: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100)]),
    puntos: new FormControl(0, [Validators.required, Validators.min(0)]),
    cantidad: new FormControl(0, [Validators.required, Validators.min(0)]),
    fecha_iniciacion: new FormControl('', [Validators.required]),
    fecha_expiracion: new FormControl('', [Validators.required]),
    tipo_categoria: new FormControl(''),
    participantes: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pythonAnywhereService: PythonAnywhereService,
  ) {}

  ngOnInit(): void {
    const pk = this.route.snapshot.paramMap.get('pk');
    if (!pk) {
      this.noEncontrado = true;
      this.cargando = false;
      return;
    }
    this.pythonAnywhereService.obtener_cupon_detalle(pk).subscribe({
      next: (cupon) => {
        this.cupon = cupon;
        this.limpiarForm();
        this.cargando = false;
        this.cargarUsos(1);
        this.pythonAnywhereService.obtener_categorias().subscribe((categorias: any[]) => {
          this.listCategorias = categorias;
        });
      },
      error: () => {
        this.noEncontrado = true;
        this.cargando = false;
      },
    });
  }

  get vigenciaInfo() {
    return VIGENCIAS[this.cupon?.vigencia || 'vigente'];
  }

  volver(): void {
    this.router.navigate(['/cupones']);
  }

  limpiarForm() {
    this.formEdit.patchValue({
      codigo: this.cupon?.codigo || '',
      titulo: this.cupon?.titulo || '',
      descripcion: this.cupon?.descripcion || '',
      porcentaje: this.cupon?.porcentaje || 0,
      puntos: this.cupon?.puntos || 0,
      cantidad: this.cupon?.cantidad || 0,
      // El <input type="datetime-local"> no acepta el offset que manda el API.
      fecha_iniciacion: this.paraInput(this.cupon?.fecha_iniciacion),
      fecha_expiracion: this.paraInput(this.cupon?.fecha_expiracion),
      tipo_categoria: this.cupon?.tipo_categoria || '',
      participantes: this.cupon?.participantes || '',
    });
  }

  /** ISO con zona -> 'YYYY-MM-DDTHH:mm', que es lo único que lee datetime-local. */
  private paraInput(iso?: string | null): string {
    if (!iso) { return ''; }
    const d = new Date(iso);
    if (isNaN(d.getTime())) { return ''; }
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  onFotoSeleccionada(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) { return; }
    if (this.fotoPreview) { URL.revokeObjectURL(this.fotoPreview); }
    this.fotoFile = file;
    this.fotoPreview = URL.createObjectURL(file);
  }

  quitarFotoSeleccionada() {
    if (this.fotoPreview) { URL.revokeObjectURL(this.fotoPreview); }
    this.fotoFile = null;
    this.fotoPreview = null;
  }

  isInvalidForm(campo: string): boolean {
    const control = this.formEdit.get(campo);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  onActualizar() {
    if (!this.cupon || this.formEdit.invalid) {
      this.formEdit.markAllAsTouched();
      return;
    }
    // `formEdit.value` es parcial y nullable con strict templates; se normaliza
    // a string antes de armar el body.
    const v = this.formEdit.value;
    const body: BodyCuponActualizar = {
      codigo: v.codigo ?? '',
      titulo: v.titulo ?? '',
      descripcion: v.descripcion ?? '',
      porcentaje: Number(v.porcentaje ?? 0),
      puntos: Number(v.puntos ?? 0),
      cantidad: Number(v.cantidad ?? 0),
      fecha_iniciacion: v.fecha_iniciacion || null,
      fecha_expiracion: v.fecha_expiracion ?? '',
      tipo_categoria: v.tipo_categoria ?? '',
      participantes: v.participantes ?? '',
    };
    if (this.fotoFile) { body.foto = this.fotoFile; }

    this.pythonAnywhereService.actualizar_cupon(body, this.cupon.id).subscribe({
      next: (resp: any) => {
        if (!resp?.success) {
          this.mostrarToastInfo('No se pudo actualizar', resp?.error || 'Revisa los datos.', true);
          return;
        }
        this.mostrarToastInfo('Cupón actualizado', 'Se guardaron los cambios correctamente', false);
        this.editando = false;
        this.quitarFotoSeleccionada();
        this.recargar();
      },
      error: () => this.mostrarToastInfo('No se pudo actualizar', 'Error de conexión.', true),
    });
  }

  cambiarEstado(activar: boolean) {
    if (!this.cupon) { return; }
    this.pythonAnywhereService.cambio_cupon_estado(this.cupon.id, activar).subscribe({
      next: () => {
        this.mostrarToastInfo(
          activar ? 'Cupón habilitado' : 'Cupón deshabilitado',
          'Se actualizó el estado correctamente', false,
        );
        this.recargar();
      },
      error: () => this.mostrarToastInfo('No se pudo cambiar el estado', 'Error de conexión.', true),
    });
  }

  eliminarCupon() {
    if (!this.cupon) { return; }
    this.pythonAnywhereService.eliminar_cupon(this.cupon.id).subscribe({
      next: () => {
        this.mostrarToastInfo('Cupón eliminado', 'Se eliminó correctamente', false);
        this.volver();
      },
      error: (err) => {
        // 409: el backend bloquea el borrado cuando el cupón ya tiene historial.
        const data = err.error;
        const mensaje = data?.canjes !== undefined
          ? `${data.error} (${data.canjes} canje(s) y ${data.pagos} pago(s) asociados).`
          : 'No se pudo eliminar el cupón.';
        this.mostrarToastInfo('No se pudo eliminar', mensaje, true);
      },
    });
  }

  private recargar() {
    const pk = this.cupon?.id;
    if (!pk) { return; }
    this.pythonAnywhereService.obtener_cupon_detalle(pk).subscribe((cupon) => {
      this.cupon = cupon;
      this.limpiarForm();
    });
  }

  cargarUsos(page: number) {
    if (!this.cupon) { return; }
    this.pythonAnywhereService.obtener_usos_cupon(this.cupon.id, page).subscribe((resp) => {
      this.arrUsos = resp.results || [];
      this.totalUsos = resp.total_objects || 0;
      this.currentPage = resp.current_page_number || 1;
      this.pageNumber = [];
      for (let index = 1; index <= (resp.total_pages || 0); index++) {
        this.pageNumber.push(index);
      }
    });
  }

  // ponytail: window de +-2 páginas alrededor de la actual + primera/última,
  // mismo patrón que sub-categoria-detalle.component.ts.
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
    if (this.currentPage < this.pageNumber.length) { this.cargarUsos(this.currentPage + 1); }
  }

  previous(event?: any) {
    if (this.currentPage > 1) { this.cargarUsos(this.currentPage - 1); }
  }

  iteracion(event: any) {
    this.cargarUsos(Number(event.target.value));
  }

  mostrarToastInfo(titulo: string, mensaje: string, isErrorToast: boolean) {
    this.isErrorToast = isErrorToast;
    this.tituloToast = titulo;
    this.mensajeToast = mensaje;
    const toast = document.getElementById('liveToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 7000);
    }
  }
}
