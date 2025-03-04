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

    login(){

      if(this.authService.login(this.email.value ?? '', this.password.value ?? '')){
        console.log("entra");
        this.router.navigate(['/dashboard/certificaciones/busqueda']);
      } else{
        Swal.fire({
          icon: 'error',
          title: 'Credenciales Incorrectas',
          text: 'Por favor, verifica tu correo y contraseña.',
          confirmButtonText: 'OK',
          // timer: 2000,
          // showConfirmButton: false,
          confirmButtonColor: '#3085d6'
        });
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
