import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroup} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatIconModule} from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [MatIconModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatCardModule, MatButtonModule,MatDividerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // loginForm: FormGroup;
  hide = signal(true);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  errorMessage = signal('');

  // usuario:string =''
  // password:string =''

constructor(
  private authService:AuthService,
  private router:Router,
  private fb: FormBuilder
){
  merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  // this.loginForm = this.fb.group({
  //   email: ['', [Validators.required, Validators.email]],
  //   password: ['', Validators.required]
  // });
  };

   async login(){

    const email = this.email.value?.trim() ?? '';
    const password = this.password.value?.trim() ?? '';

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Vacíos',
        text: 'Por favor, ingresa tu correo y contraseña.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const userCredential  = await this.authService.loginFB(email, password);

      if (userCredential) {
        const loggedEmail = userCredential.user.email;
        console.log("Inicio de sesión exitoso como:", loggedEmail);
        if (loggedEmail === 'certificaciones.epsst@gmail.com') {
          this.router.navigate(['/dashboard/certificaciones/busqueda']);
        } else if (loggedEmail === 'perfil.emte@gmail.com') {
          this.router.navigate(['/dashboard/admin/profile']);
        } else if(loggedEmail === 'notas.epsst@gmail.com'){
          this.router.navigate(['/dashboard/docente/notas']);
        }
        else {
          this.router.navigate(['/dashboard/estudiante/information']);
        }


        // this.router.navigate(['/dashboard/certificaciones/busqueda']);
      } else {
        this.showErrorMessage('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      this.showErrorMessage(this.getAuthErrorMessage(error));
    }
  }

  showErrorMessage(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error de Autenticación',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6'
    });
  }

  getAuthErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado. Verifica tu correo.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta. Inténtalo de nuevo.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      default:
        return 'Error al iniciar sesión. Intenta nuevamente.';
    }
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('Debes ingresar el correo');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Correo no valido');
    } else {
      this.errorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
