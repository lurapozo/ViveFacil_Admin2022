import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  isLoading = new Subject<boolean>();

  constructor() {}

  show(): void {
    this.isLoading.next(true);
    console.log('working');
  }
  hide(): void {
    this.isLoading.next(false);
    console.log(' not working');
  }
}
