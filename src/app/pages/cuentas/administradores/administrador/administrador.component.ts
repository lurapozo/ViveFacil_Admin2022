import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { Administrador } from 'src/app/interfaces/administrador';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  @Input() identificador: string = "";
  administradores: Administrador[]=[]

  constructor(   private pythonAnyWhereService: PythonAnywhereService){}

  ngOnInit() {
    var contPage = 2;
    this.pythonAnyWhereService.obtener_administradores().subscribe(adminPagination => {
      this.administradores = adminPagination.results;
      // while(adminPagination.next){
      //   this.pythonAnyWhereService.obtener_administradores(contPage).subscribe(adminPaginationInner => {
      //     this.administradores.concat(adminPaginationInner.results);
      //   });
      //   contPage++;
      // }
      console.log(adminPagination);
    })
    console.log(this.identificador);
  }

}
