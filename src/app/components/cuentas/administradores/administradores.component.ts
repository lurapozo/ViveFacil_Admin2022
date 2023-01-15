import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators ,FormBuilder, AbstractControl} from '@angular/forms';
import { Administrador, BodyActualizarAdministrador, BodyCrearAdministrador } from 'src/app/interfaces/administrador';
import { Cargo } from 'src/app/interfaces/cargo';
import { PythonAnywhereService } from 'src/app/services/PythonAnywhere/python-anywhere.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent {
  @Input() identificador: string = "";
  administradores: Administrador[]=[]
  submitted = false;
  cargos: Cargo[]=[]
  pageNumber :number []=[];
  datos= new FormData()
  condicionNext=false
  currentPage =1
  show =false
  showEdit =false
  showFormEdit =false
  administradoSelected!: Administrador;
  administradoEdit!: Administrador;
  hidePassword = true;
  hideConfirmPassword = true;
  isRegistered = false;
  ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Sto. Domingo', 'Ibarra'];
  generos = ['Masculino', 'Femenino', 'Otro'];
  sexoSelected = '';
  admiEditar:BodyActualizarAdministrador={
    id: 0,
    username: '',
    email: '',
    password: '',
    tipo: '',
    nombres: '',
    apellidos: '',
    ciudad: '',
    cedula: '',
    telefono: '',
    genero: '',
    emailNuevo: '',
    foto: null
  }
  admi: BodyCrearAdministrador={
    username:"",
    email:"",
    password:"",
    ciudad:"",
    tipo:"",
    nombres:"",
    apellidos:"",
    cedula:"",
    telefono:"",
    genero:"",
    rol:"",
    foto:null,

  }
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    rol: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    cedula: new FormControl('', [Validators.required, Validators.minLength(10)]),
  }, []);

  constructor(   private pythonAnyWhereService: PythonAnywhereService,private sanitizer: DomSanitizer,private formBuilder: FormBuilder){

    const passwordControl = this.registerForm.get('password') as FormControl;
    passwordControl.addValidators(this.sendUpdateToCompareValidator(this.registerForm.get('passwordConfirm') as AbstractControl));

    const passwordConfControl = this.registerForm.get('passwordConfirm') as FormControl;
    passwordConfControl.addValidators(this.createCompareValidator(this.registerForm.get('password') as AbstractControl, this.registerForm.get('passwordConfirm') as AbstractControl));

    const telefonoControl = this.registerForm.get('telefono') as FormControl;
    telefonoControl.addValidators(this.createNumberValidator(this.registerForm.get('telefono') as AbstractControl));

    const cedulaControl = this.registerForm.get('cedula') as FormControl;
    cedulaControl.addValidators(this.createNumberValidator(this.registerForm.get('cedula') as AbstractControl));


  }

  createNumberValidator(controlNumber: AbstractControl) {
    return () => {
      if (isNaN(controlNumber.value.replace(/\s/g, ''))){
        return { number_error: 'Solo se aceptan números.' };
      }
      else if(controlNumber.value.replace(/\s/g, '').length !== 10){
        return { number_error: 'Ingrese los 10 dígitos requeridos.' };
      }
      return null;
    };
  }
  sendUpdateToCompareValidator(reciberUpdateControl: AbstractControl) {
    return () => {
      reciberUpdateControl.updateValueAndValidity();
      return null;
    };
  }

  createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value){
        return { match_error: 'Value does not match' };
      }
      return null;
    };
  }

  formEdit: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
     correo: new FormControl(''),
    ced: new FormControl(''),
    cell: new FormControl(''),
    city: new FormControl(''),
    cargo: new FormControl(''),
    sexo: new  FormControl(''),
    pass: new FormControl(''),
    confirmPass: new FormControl(''),

  });

  form: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    cedula: new FormControl(''),
    telefono: new FormControl(''),
    ciudad: new FormControl(''),
    rol: new FormControl(''),
    genero: new  FormControl(''),
    password: new FormControl(),
    confirmPassword: new FormControl(),

  });
  ngOnInit() {
   this.pythonAnyWhereService.obtener_cargos().subscribe(cargo=>{
    this.cargos=cargo

   })
    this.pythonAnyWhereService.obtener_administradores().subscribe(adminPagination => {
      this.administradores = adminPagination.results;
      console.log(this.administradores)
      if(adminPagination.next!=null){
        this.condicionNext=true
      }
      for (let index = 1; index <= adminPagination.total_pages; index++) {
        this.pageNumber.push(index)

      }



    })
    this.form = this.formBuilder.group(
      {
        fullname: ['', Validators.required],
        lastname: ['', Validators.required],
        telefono: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        cedula: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        rol: ['', [Validators.required]],
        ciudad: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
      },

    );
    this.formEdit = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        cell: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        ced: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        cargo: ['', [Validators.required]],
        city: ['', [Validators.required]],
        sexo: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        pass: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPass: ['', Validators.required],
      },

    );
  }


iteracion(event:any){
this.pythonAnyWhereService.obtener_administradores(event.target.value).subscribe(admi=>{
  this.administradores= admi.results
  this.currentPage =admi.current_page_number
  if(admi.next!=null){
    this.condicionNext=true
  }

})

}
next(event:any){

  this.currentPage=this.currentPage+1
  this.pythonAnyWhereService.obtener_administradores(this.currentPage).subscribe(admi=>{
    this.administradores= admi.results
    this.currentPage =admi.current_page_number
  })
 }

 previous(event:any){

  this.currentPage=this.currentPage-1
  this.pythonAnyWhereService.obtener_administradores(this.currentPage).subscribe(admi=>{
    this.administradores= admi.results
    this.currentPage =admi.current_page_number
  })
 }
 mostrar(event:Event) {
  this.show=true

 }
 get f(): { [key: string]: AbstractControl } {
  return this.form.controls;
}
get e(): { [key: string]: AbstractControl } {
  return this.formEdit.controls;
}
onSubmit(): void {
  this.submitted = true;
  this.admi.nombres=this.form.value.fullname
  this.admi.username=this.form.value.email
  this.admi.email=this.form.value.email
  this.admi.password=this.form.value.password
  this.admi.tipo="Administrador"
  this.admi.apellidos=this.form.value.lastname
  this.admi.cedula=this.form.value.cedula
  this.admi.ciudad=this.form.value.ciudad
  this.admi.rol="Secretario"
  this.admi.genero=this.form.value.genero
  this.admi.telefono=this.form.value.telefono


  if (this.form.status=="INVALID") {

    return;
  }else{
    this.pythonAnyWhereService.crear_administrador(this.admi).subscribe(resp=>{

      console.log(resp)
     })
  }


}

onReset(): void {
  this.submitted = false;
  this.form.reset();
}

ver(admi:any){
  this.showEdit=true
  this.showFormEdit=false
this.administradoSelected=admi


}
cerrar(){
this.showEdit=false

}
editar(){
  this.administradoEdit=this.administradoSelected
  console.log(this.administradoEdit)
  this.showFormEdit=true
  this.showEdit=false


}
save(){
  this.submitted = true;
  let id = this.administradoEdit.id
  this.admiEditar.nombres=this.formEdit.value.nombre
  this.admiEditar.username=this.formEdit.value.correo
  this.admiEditar.email=this.formEdit.value.correo
  this.admiEditar.password=this.formEdit.value.pass
  this.admiEditar.tipo=this.formEdit.value.cargo
  this.admiEditar.apellidos=this.formEdit.value.apellido
  this.admiEditar.cedula=this.formEdit.value.ced
  this.admiEditar.ciudad=this.formEdit.value.city
  this.admiEditar.emailNuevo=this.formEdit.value.correo
  this.admiEditar.genero=this.formEdit.value.sexo
  this.admiEditar.telefono=this.formEdit.value.ced


  if (this.form.status=="INVALID") {

    return;
  }else{
   this.pythonAnyWhereService.actualizar_administrador(id,this.admiEditar).subscribe(resp=>console.log(resp)
   )
  }


}
cancelar(){
  this.showFormEdit=false
}

}
