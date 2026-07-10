import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  arr_admi: any[] = [];
  datos!: any[];
  correoUsuario: string | null = '';
  user: any;

  constructor(private userService: UserService, private pythonAnywhereService: PythonAnywhereService, private router: Router) {
    this.pythonAnywhereService.obtener_administradores().subscribe(resp => {
      this.arr_admi = resp.results || [];
      console.log('resp', this.arr_admi);
  });

  }

  ngOnInit() {
    this.correoUsuario = this.userService.correoUsuario;
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  getUsername(email: string | null): { nombre: string; apellido: string } {
    if (!Array.isArray(this.arr_admi) || this.arr_admi.length === 0) {
      return { nombre: '', apellido: '' };
    }

    for (const result of this.arr_admi) {
      if (result.user_datos && result.user_datos.user) {
        const userEmail = result.user_datos.user.email;

        if (userEmail === email) {
          const nombres = result.user_datos.nombres || '';
          const apellidos = result.user_datos.apellidos || '';
          return { nombre: nombres, apellido: apellidos };
        }
      }
    }
    return { nombre: '', apellido: '' };
  }

  logout() {
    this.userService.logout().then(() => {
      console.log("Exito al cerrar sesión:");
      this.userService.logout();
      localStorage.removeItem('user'); // Limpiar el localStorage
      this.router.navigate(['/login']);
    }).catch(error => {
      console.error("Error al cerrar sesión:", error);
    });
  }

}
