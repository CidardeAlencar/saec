import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { AuthService } from '../../../shared/services/auth.service';
import { EstudianteService } from '../../../shared/services/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  readonly ci = new FormControl('', [Validators.required]);
  nombres = new FormControl('', [Validators.required]);
  apellidoPaterno = new FormControl('', [Validators.required]);
  apellidoMaterno = new FormControl('', [Validators.required]);
  celular = new FormControl('', [Validators.required]);
  grado = new FormControl('', [Validators.required]);
  correo = new FormControl('', [Validators.required, Validators.email]);
  contrasena = new FormControl('', [Validators.required, Validators.minLength(6)]);

  constructor( private authService:AuthService, private estudianteService: EstudianteService){

  }
    // async buscar(event?: Event) {
      // if (event) {
      //   event.preventDefault();
      // }

      // const ciValue = this.ci.value?.trim();
      // if (!ciValue) {
      //   Swal.fire("Advertencia", "Ingrese un CI válido.", "warning");
      //   return;
      // }

      // const encontrado = await this.estudianteService.buscarEstudiantePorCI(ciValue);
      // console.log(encontrado);
      // if (encontrado) {
      //   this.router.navigate(['/dashboard/certificaciones/informacion']);
      // } else {
      //   Swal.fire("Error", "No se encontró un estudiante con ese CI.", "error");
      // }
    // }

    preventSubmit(event: any) {
      event.preventDefault();
      event.stopPropagation();
    }

    private camposInvalidos(): boolean {
      return (
        this.ci.invalid ||
        this.nombres.invalid ||
        this.apellidoPaterno.invalid ||
        this.apellidoMaterno.invalid ||
        this.celular.invalid ||
        this.grado.invalid ||
        this.correo.invalid ||
        this.contrasena.invalid
      );
    }

    private resetFormFields() {
      this.ci.reset();
      this.nombres.reset();
      this.apellidoPaterno.reset();
      this.apellidoMaterno.reset();
      this.celular.reset();
      this.grado.reset();
      this.correo.reset();
      this.contrasena.reset();
    }

    async registerStudent(){

      if (this.camposInvalidos()) {
        Swal.fire({
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos correctamente.',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#d33'
        });
        return;
      }

      const ci = this.ci.value!;
      const estudianteData = {
        nombres: this.nombres.value,
        apPat: this.apellidoPaterno.value,
        apMat: this.apellidoMaterno.value,
        celular: this.celular.value,
        grado: this.grado.value,
        email: this.correo.value,
        contrasenia: this.contrasena.value
      };

      try{
          const userCreated  = await this.authService.register(this.correo.value!, this.contrasena.value!);
          console.log(userCreated);

          const registrado = await this.estudianteService.registrarEstudiante(ci, estudianteData);

          if (userCreated && registrado) {
            // console.log('Datos del estudiante guardados correctamente en Firestore');
            if (userCreated && registrado) {
              Swal.fire({
                title: 'Éxito',
                text: 'Datos del estudiante guardados correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6'
              }).then(() => {
                this.resetFormFields();
              });
            }

          }

      }catch(error){
        console.error('Error en el inicio de sesión:', error);
      }

    }

}
