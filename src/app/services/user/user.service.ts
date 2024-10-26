import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,  sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  refreshObs$ = new Subject<void>();
  correoUsuario: string | null = null;
  constructor(private auth: Auth, private http: HttpClient) { }

  get refresh$(){
    return this.refreshObs$;
  }

  register(email: string, password: string){
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, pass: string){
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logout(){
    return signOut(this.auth);
  }

  getImageFromURL(url: string){
    return this.http.get(url);
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  establecerCorreo(correo: string) {
    this.correoUsuario = correo;
  }
}
