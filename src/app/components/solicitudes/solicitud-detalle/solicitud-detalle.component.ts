import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudAdmin } from 'src/app/interfaces/solicitud-admin';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-solicitud-detalle',
  templateUrl: './solicitud-detalle.component.html',
  styleUrls: ['./solicitud-detalle.component.css']
})
export class SolicitudDetalleComponent implements OnInit {
  solicitud: SolicitudAdmin | null = null;
  cargando = true;
  noEncontrada = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pythonAnywhereService: PythonAnywhereService,
  ) {}

  ngOnInit(): void {
    const pk = Number(this.route.snapshot.paramMap.get('pk'));
    this.pythonAnywhereService.obtener_solicitud_admin(pk).subscribe({
      next: (resp) => {
        this.solicitud = resp;
        this.cargando = false;
      },
      error: () => {
        this.noEncontrada = true;
        this.cargando = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/pagos/solicitudes']);
  }
}
