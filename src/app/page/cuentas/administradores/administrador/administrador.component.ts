import { Component, OnInit,ViewChild } from '@angular/core';
import { Administrador } from 'src/app/interfaces/administrador';
import { PythonAnywhereService } from 'src/app/servicios/PythonAnywhere/python-anywhere.service';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  constructor(   private pythonAnyWhereService: PythonAnywhereService){}
  administradores: Administrador[]=[]   
  page=1
  ngOnInit() {
    this.pythonAnyWhereService.getAdministradores().subscribe(
      administrador=> {
        this.administradores =administrador
        console.log(administrador)
      })
    
  }
  
}
