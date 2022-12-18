import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import { NavbarComponent } from './navbar/navbar.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { HttpClientModule } from '@angular/common/http';
import { AdministradorComponent } from './page/cuentas/administradores/administrador/administrador.component';
import { FiltroPipe } from './page/cuentas/administradores/filtro/filtro.pipe';
import { NgxPaginationModule } from "ngx-pagination";
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    PoliticasComponent,
    AdministradorComponent,
      
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatListModule,
    MatDatepickerModule,
    HttpClientModule,
    NgxPaginationModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
