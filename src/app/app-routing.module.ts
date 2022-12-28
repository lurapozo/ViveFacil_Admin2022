import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdministradorComponent } from './pages/cuentas/administradores/administrador/administrador.component';
import { MainComponent } from './pages/main/main.component';
import { PoliticasComponent } from './pages/politicas/politicas.component';

const routes: Routes = [
  {path: "main", component: MainComponent},
  {path: "**", redirectTo: "main"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
