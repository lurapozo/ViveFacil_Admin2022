import { Pipe, PipeTransform } from '@angular/core';
import { Administrador } from '../../../../interfaces/administrador';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(admi: Administrador, ...args: Administrador[]): unknown {
    return null;
  }

}
