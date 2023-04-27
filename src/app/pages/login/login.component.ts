import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { Administrador } from 'src/app/interfaces/administrador';
import { BodyLogin } from 'src/app/interfaces/login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  }, []);
  hide = true;
  isRegistered = true;


  constructor(private userService: UserService, private router: Router, private pythonAnywhereService: PythonAnywhereService) { }

  onSubmit(){
    console.log("Intento de Login")
    const email = this.loginForm.value.email;
    const pass = this.loginForm.value.password;
    console.log(email)
    console.log(pass)
    if(email && pass){
      console.log("entra aca")
      this.userService.login(email, pass)
        .then((respuesta) => {
          // this.pythonAnywhereService.cambioContrasenia(email,pass).subscribe((res: any)=>
          // {
          //   console.log("respuesta");
          //   console.log(res);
          //   if(res.success){
          //     this.pythonAnywhereService.loginPythonAnywhere(bodyLogin).subscribe((resp) => {
          //       console.log("respuesta 2");
          //       console.log(resp);
          //       if(resp.error){
          //         console.log(resp.error);
          //         this.isRegistered = false;
          //       }
          //       else {
          //         let tokenPythonAny = resp.token;
          //         if (!tokenPythonAny){
          //           tokenPythonAny=""
          //         }
          //         console.log('Se obtiene token de python anywhere auth y se lo guarda en el local storage: ', tokenPythonAny);
          //         localStorage.setItem('tokenPythonAnywhere', tokenPythonAny);
          //         this.pythonAnywhereService.getAdminByCorreo(email).subscribe((admin: any) => {
          //           if(admin){
          //             console.log('Respuesta de admin: ', admin);
          //             localStorage.setItem('admin', admin);
          //             // console.log('Proveedor en el Local Storage: ', this.pythonAnywhereService.getProveedor());
          //             this.router.navigate(['/main']);
          //           }
          //           else {
          //             console.log('Proveedor no encontrado en la base de datos');
          //             this.isRegistered = false;
          //           }
          //         });
          //       }
          //     });
          //   }
          // });
          console.log('Veamos si entra aca');
          const bodyLogin: BodyLogin = {
            username: email,
            password: pass,
            tipo: 'Administrador'
          };
          this.pythonAnywhereService.loginAdminPythonAnywhere(bodyLogin).subscribe((resp) => {
            console.log("aca hace login o algo asi");
            console.log(resp);
            if(resp.error){
              console.log(resp.error);
              this.isRegistered = false;
            }
            else {
              console.log("aca crea token");
              let tokenPythonAny = resp.token;
              if (!tokenPythonAny){
                tokenPythonAny=""
              }
              console.log('Se obtiene token de python anywhere auth y se lo guarda en el local storage: ', tokenPythonAny);
              localStorage.setItem('tokenPythonAnywhere', tokenPythonAny);
              // this.pythonAnywhereService.getAdminByCorreo(email).subscribe((admin: any) => {
              //   if(admin){
              //     console.log('Respuesta de proveedor: ', admin);
              //     localStorage.setItem('admin', admin);
              //     // console.log('Proveedor en el Local Storage: ', this.pythonAnywhereService.getProveedor());
              //     this.router.navigate(['/main']);
              //   }
              //   else {
              //     console.log('Proveedor no encontrado en la base de datos');
              //     this.isRegistered = false;
              //   }
              // });
              // localStorage.setItem('admin', admin);
              this.router.navigate(['/main']);
            }
          });
        })
        .catch(error => {
          console.log(error);
          this.isRegistered = false;
        })
      ;
    }
  }

  getErrorMessage( formGroup: FormGroup, item: string): string {
    const itemControl: FormControl = formGroup.get(item) as FormControl;
    switch (item) {
      case 'email':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return itemControl.hasError('email') ? 'Email no válido' : '';

      case 'password':
        if (itemControl.hasError('required')) {
          return 'Debe llenar este campo';
        }
        return itemControl.hasError('minlength') ? 'Debe ingresar una contraseña mayor a 4 dígitos' : '';

      default:
        return '';
    }
  }
}
