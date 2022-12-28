import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  selection: string = "";

  setSelection(texto: string){
    this.selection = texto;
  }
}
