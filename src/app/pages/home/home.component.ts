import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  arr_admi: any[] = [];
  correoUsuario: string | null = '';
  user: any;

  constructor(private userService: UserService, private pythonAnywhereService: PythonAnywhereService) {}

  ngOnInit(): void {
    this.correoUsuario = this.userService.correoUsuario;
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    this.pythonAnywhereService.obtener_administradores().subscribe(resp => {
      this.arr_admi = resp.results || [];
    });
  }

  getUsername(email: string | null): { nombre: string; apellido: string } {
    if (!Array.isArray(this.arr_admi) || this.arr_admi.length === 0) {
      return { nombre: '', apellido: '' };
    }
    for (const result of this.arr_admi) {
      if (result.user_datos && result.user_datos.user) {
        const userEmail = result.user_datos.user.email;
        if (userEmail === email) {
          return { nombre: result.user_datos.nombres || '', apellido: result.user_datos.apellidos || '' };
        }
      }
    }
    return { nombre: '', apellido: '' };
  }
}
