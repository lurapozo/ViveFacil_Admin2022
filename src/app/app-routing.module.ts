import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { SolicitudesProfesionesComponent } from './components/solicitudes-profesiones/solicitudes-profesiones.component';
import { AdministradoresComponent } from './components/cuentas/administradores/administradores.component';
import { PendientesComponent } from './components/cuentas/pendientes/pendientes.component';
import { ProveedoresComponent } from './components/cuentas/proveedores/proveedores.component';
import { RechazadosComponent } from './components/cuentas/rechazados/rechazados.component';
import { SolicitantesComponent } from './components/cuentas/solicitantes/solicitantes.component';
import { CategoriasComponent } from './components/servicios/categorias/categorias.component';
import { SubCategoriasComponent } from './components/servicios/sub-categorias/sub-categorias.component';
import { CargosComponent } from './components/pagos/cargos/cargos.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { SugerenciasLeidasComponent } from './components/sugerencias/sugerencias-leidas/sugerencias-leidas.component';
import { SugerenciasNoLeidasComponent } from './components/sugerencias/sugerencias-no-leidas/sugerencias-no-leidas.component';
import { NotificacionesAutomaticasComponent } from './components/notificaciones-push/notificaciones-automaticas/notificaciones-automaticas.component';
import { NotificacionesMasivasComponent } from './components/notificaciones-push/notificaciones-masivas/notificaciones-masivas.component';
import { MedallaComponent } from './components/medalla/medalla.component';
import { PromocionComponent } from './components/promocion/promocion.component';
import { PoliticasComponent } from './components/politicas/politicas.component';
import { CuponesComponent } from './components/cupones/cupones.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: '',
    component: MainComponent,
    canActivateChild: [authGuard],
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'solicitud-profesion', component: SolicitudesProfesionesComponent },
      {
        path: 'cuentas',
        children: [
          { path: '', redirectTo: 'administrador', pathMatch: 'full' },
          { path: 'administrador', component: AdministradoresComponent },
          { path: 'pendientes', component: PendientesComponent },
          { path: 'proveedores', component: ProveedoresComponent },
          { path: 'rechazados', component: RechazadosComponent },
          { path: 'solicitantes', component: SolicitantesComponent },
        ],
      },
      {
        path: 'servicios',
        children: [
          { path: '', redirectTo: 'categorias', pathMatch: 'full' },
          { path: 'categorias', component: CategoriasComponent },
          { path: 'sub-categorias', component: SubCategoriasComponent },
        ],
      },
      {
        path: 'pagos',
        children: [
          { path: '', redirectTo: 'solicitudes', pathMatch: 'full' },
          { path: 'cargos', component: CargosComponent },
          { path: 'solicitudes', component: SolicitudesComponent },
        ],
      },
      {
        path: 'sugerencias',
        children: [
          { path: '', redirectTo: 'leidas', pathMatch: 'full' },
          { path: 'leidas', component: SugerenciasLeidasComponent },
          { path: 'no-leidas', component: SugerenciasNoLeidasComponent },
        ],
      },
      {
        path: 'notificaciones',
        children: [
          { path: '', redirectTo: 'automaticas', pathMatch: 'full' },
          { path: 'automaticas', component: NotificacionesAutomaticasComponent },
          { path: 'masivas', component: NotificacionesMasivasComponent },
        ],
      },
      { path: 'medallas', component: MedallaComponent },
      { path: 'promocion', component: PromocionComponent },
      { path: 'politicas', component: PoliticasComponent },
      { path: 'cupones', component: CuponesComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
