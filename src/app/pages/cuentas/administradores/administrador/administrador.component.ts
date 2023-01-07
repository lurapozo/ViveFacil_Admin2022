import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Administrador } from 'src/app/interfaces/administrador';
import { Cargo } from 'src/app/interfaces/cargo';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent {
  @Input() identificador: string = "";
  administradores: Administrador[]=[]
  cargos: Cargo[]=[]
  pageNumber :number []=[];
  datos= new FormData()
  condicionNext=false
  currentPage =1
  show =false
  constructor(   private pythonAnyWhereService: PythonAnywhereService){}
  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    cedula: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    passwordC: new FormControl('', Validators.required),

  });

  ngOnInit() {
   this.pythonAnyWhereService.obtener_cargos().subscribe(cargo=>{

   })
    this.pythonAnyWhereService.obtener_administradores().subscribe(adminPagination => {
      this.administradores = adminPagination.results;
      if(adminPagination.next!=null){
        this.condicionNext=true
      }
      for (let index = 1; index <= adminPagination.total_pages; index++) {
        this.pageNumber.push(index)
        console.log(this.pageNumber)
      }
      console.log( this.administradores.length)

    
    })
    
  }
iteracion(event:any){
this.pythonAnyWhereService.obtener_administradores(event.target.value).subscribe(admi=>{
  this.administradores= admi.results
  this.currentPage =admi.current_page_number
  if(admi.next!=null){
    this.condicionNext=true
  }
  
})

}
next(event:any){
 
  this.currentPage=this.currentPage+1
  this.pythonAnyWhereService.obtener_administradores(this.currentPage).subscribe(admi=>{
    this.administradores= admi.results
    this.currentPage =admi.current_page_number
  })
 }
  
 previous(event:any){
 
  this.currentPage=this.currentPage-1
  this.pythonAnyWhereService.obtener_administradores(this.currentPage).subscribe(admi=>{
    this.administradores= admi.results
    this.currentPage =admi.current_page_number
  })
 }
 mostrar(event:Event) {
  this.show=true

 }
 enviar(){
 
 }
}

