import { Component } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { Categoria } from '../../../interfaces/categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent {
  categoria?: Categoria[];
  categoria_seleccionada?: Categoria
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_categorias().subscribe((resp:any[])=>{
      this.categoria=resp
       console.log(resp)
   
     })
 
  }



  search(evento: any) {
    const texto = evento.target.value;
    console.log('Escribe en el buscador: ', texto)
    this.categoria = this.categoria;
    if (texto && texto.trim() !== '') {
      this.categoria = this.categoria?.filter((solicitud) => {
        return solicitud.nombre.toLowerCase().includes(texto.toLowerCase())
      });
    }}

    cambiarEstado(event:Event){
      console.log(this.categoria_seleccionada?.estado)

    }
}
