import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCardModule } from '@angular/material/card';
import { MainComponent } from './pages/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfesionesComponent } from './components/profesiones/profesiones.component';
import { PlanesProveedoresComponent } from './components/planes-proveedores/planes-proveedores.component';
import { RolesComponent } from './components/roles/roles.component';
import { PublicidadComponent } from './components/publicidad/publicidad.component';
import { PromocionComponent } from './components/promocion/promocion.component';
import { PlanesComponent } from './components/planes/planes.component';
import { InsigniasComponent } from './components/insignias/insignias.component';
import { CuponesComponent } from './components/cupones/cupones.component';
import { NotificacionesPushComponent } from './components/notificaciones-push/notificaciones-push.component';
import { SolicitudesProfesionesComponent } from './components/solicitudes-profesiones/solicitudes-profesiones.component';
import { PoliticasComponent } from './components/politicas/politicas.component';
import { CategoriasComponent } from './components/servicios/categorias/categorias.component';
import { SubCategoriasComponent } from './components/servicios/sub-categorias/sub-categorias.component';
import { CargosComponent } from './components/pagos/cargos/cargos.component';
import { EfectivoComponent } from './components/pagos/efectivo/efectivo.component';
import { TarjetaComponent } from './components/pagos/tarjeta/tarjeta.component';
import { PendientesComponent } from './components/cuentas/pendientes/pendientes.component';
import { RechazadosComponent } from './components/cuentas/rechazados/rechazados.component';
import { ProveedoresComponent } from './components/cuentas/proveedores/proveedores.component';
import { SolicitantesComponent } from './components/cuentas/solicitantes/solicitantes.component';
import { AdministradoresComponent } from './components/cuentas/administradores/administradores.component';
import { SugerenciasLeidasComponent } from './components/sugerencias/sugerencias-leidas/sugerencias-leidas.component';
import { SugerenciasNoLeidasComponent } from './components/sugerencias/sugerencias-no-leidas/sugerencias-no-leidas.component';
import { NotificacionesAutomaticasComponent } from './components/notificaciones-push/notificaciones-automaticas/notificaciones-automaticas.component';
import { NotificacionesMasivasComponent } from './components/notificaciones-push/notificaciones-masivas/notificaciones-masivas.component';
import { LoginComponent } from './pages/login/login.component';
import { SpinnerComponent } from './components/spinner/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptor/spinner.interceptor';
import { UserService } from './services/user/user.service';
import { provideAuth, getAuth} from '@angular/fire/auth';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { IgxComboModule } from "igniteui-angular";  
// // to use ngModel in page  
// import { FormsModule } from "@angular/forms"; 

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MedallaComponent } from './components/medalla/medalla.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PoliticasComponent,
    ProfesionesComponent,
    PlanesProveedoresComponent,
    RolesComponent,
    PublicidadComponent,
    PromocionComponent,
    PlanesComponent,
    InsigniasComponent,
    CuponesComponent,
    NotificacionesPushComponent,
    SolicitudesProfesionesComponent,
    CategoriasComponent,
    SubCategoriasComponent,
    CargosComponent,
    EfectivoComponent,
    TarjetaComponent,
    PendientesComponent,
    ProveedoresComponent,
    RechazadosComponent,
    SolicitantesComponent,
    AdministradoresComponent,
    SugerenciasLeidasComponent,
    SugerenciasNoLeidasComponent,
    NotificacionesAutomaticasComponent,
    NotificacionesMasivasComponent,
    LoginComponent,
    SpinnerComponent,
    MedallaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatListModule,
    MatCardModule,
    MatDatepickerModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    FormsModule,
    MatIconModule,
    MatMenuModule ,
    MatButtonModule ,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    provideFirebaseApp( () => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    provideFirestore(() => getFirestore()), 
    provideAuth(() => getAuth()), // AuthModule
  ],
  providers: [ UserService, {provide: HTTP_INTERCEPTORS,useClass:SpinnerInterceptor,multi:true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
