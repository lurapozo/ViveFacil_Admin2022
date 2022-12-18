import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { AdministradorComponent } from './page/cuentas/administradores/administrador/administrador.component';

const routes: Routes = [
  {path: "main", component: MainComponent},
  {path: "administrador",component:AdministradorComponent},
  {path: "politicas", component: PoliticasComponent},
  {path: "**", redirectTo: "main"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
