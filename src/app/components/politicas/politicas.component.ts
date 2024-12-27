import { FocusTrap } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent {
  politicas: any = []
  isEditing: boolean = false;
  identifier: string = '';
  
  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.get_politicas();
  }

  get_politicas(){
    this.pythonAnywhereService.obtener_politicas().subscribe(resp => {
      for(let o of Object(resp)){
            if(o.identifier==='0'){
               this.politicas=o.terminos;
               this.identifier = o.identifier;  
               console.log(this.politicas)
            }
      }
  
     })
  }

  enableEditMode(): void {
    this.isEditing = true;
  }

  saveChanges(newPoliticas: string): void {
    this.politicas = newPoliticas;
    this.pythonAnywhereService.put_politicas(this.identifier, this.politicas).subscribe(
      (response) => {
        console.log('Política actualizada:', response);
      },
      (error) => {
        console.error('Error al actualizar la política:', error);
      }
    );
    this.isEditing = false;
    this.get_politicas();

  }

  cancelEdit(): void {
    this.isEditing = false;
  }
}
