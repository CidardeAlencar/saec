import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  usuario:string =''
  password:string =''

constructor(
  private authService:AuthService,
  private router:Router
){};

  login(){
    if(this.authService.login(this.usuario,this.password)){
      this.router.navigate(['/dashboard']);
    } else{
      alert('Credenciales incorrectos');
    }
  }
}
