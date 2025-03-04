import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated : boolean = false;

  constructor() { }

  login(user:string,password:string):boolean{
    if(user==='certificaciones.epsst@gmail.com' && password===  'certificaciones1#'){
      return true;
      this.isAuthenticated = true;
    }
    return false;
  }

  logout(){
    this.isAuthenticated = false;
    // localStorage.removeItem('user');
  }

  logged():boolean{
    return this.isAuthenticated;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null; // Retorna true si hay usuario en localStorage
  }

}
