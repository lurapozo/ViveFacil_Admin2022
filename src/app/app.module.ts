import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';
import { HttpClientModule } from '@angular/common/http';
import { FiltroPipe } from './pages/cuentas/administradores/filtro/filtro.pipe';
import { NgxPaginationModule } from "ngx-pagination";
import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';
import { MainComponent } from './pages/main/main.component';
import { AdministradorComponent } from './pages/cuentas/administradores/administrador/administrador.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    PoliticasComponent,
    AdministradorComponent,
    AsideMenuComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatListModule,
    MatDatepickerModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
