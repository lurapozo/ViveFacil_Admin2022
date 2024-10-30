import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, UserCredential } from '@angular/fire/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from 'src/app/services/Firebase/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  refreshObs$ = new Subject<void>();
  correoUsuario: string | null = null;
  constructor(private auth: Auth, private http: HttpClient) { }

  /*get refresh$(){
    return this.refreshObs$;
  }*/
  get currentUser() {
    return this.auth.currentUser;;
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass).then(async (userCredential) => {
      // Guarda el usuario en localStorage
      const userData = { email: userCredential.user.email, uid: userCredential.user.uid };
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("userData", userData)
    }).catch((error) => {
      console.error('Error en el inicio de sesión:', error);
    });
  }

  logout() {
    return signOut(this.auth);
  }

  getImageFromURL(url: string) {
    return this.http.get(url);
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  establecerCorreo(correo: string) {
    this.correoUsuario = correo;
  }
}
