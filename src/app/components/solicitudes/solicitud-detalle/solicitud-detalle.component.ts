import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  mapaUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pythonAnywhereService: PythonAnywhereService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const pk = Number(this.route.snapshot.paramMap.get('pk'));
    this.pythonAnywhereService.obtener_solicitud_admin(pk).subscribe({
      next: (resp) => {
        this.solicitud = resp;
        this.cargando = false;
        const lat = resp.ubicacion?.latitud;
        const lng = resp.ubicacion?.altitud;
        if (lat && lng) {
          // ponytail: iframe "output=embed" de Google Maps, no requiere API key
          // (a diferencia del Embed API oficial), suficiente para solo visualizar.
          this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
          );
        }
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
