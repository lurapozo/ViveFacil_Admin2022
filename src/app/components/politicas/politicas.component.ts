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

  constructor(private pythonAnywhereService: PythonAnywhereService, private sanitizer: DomSanitizer) {
    this.pythonAnywhereService.obtener_politicas().subscribe(resp => {
     for(let o of Object(resp)){
           if(o.identifier==='0'){
              this.politicas=o.terminos
              console.log(this.politicas)
           }
     }
 
    })

  }
}
