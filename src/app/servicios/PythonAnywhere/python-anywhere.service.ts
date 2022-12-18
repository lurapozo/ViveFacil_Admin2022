import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fetchAllAdmi } from 'src/app/interfaces/administrador';
import { map, Observable } from 'rxjs';
import { Administrador } from '../../interfaces/administrador';
@Injectable({
  providedIn: 'root'
})
export class PythonAnywhereService {

administradores = 'https://tomesoft1.pythonanywhere.com/administradores'
  constructor(private http: HttpClient) { }



  getAdministradores():Observable<Administrador[]>{
    return this.http.get<fetchAllAdmi>(this.administradores).pipe(
      map(this.getAdmiDatos)
    );
  }

  private getAdmiDatos(resp:fetchAllAdmi){
    const admiList: Administrador[]=resp.results.map(admi=>{
      return {
        id:admi.id,
        user_datos: admi.user_datos,
        estado:admi.estado
      }

    })
    return admiList

  }
}
