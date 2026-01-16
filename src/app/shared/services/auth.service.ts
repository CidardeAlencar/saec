import { Injectable, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated : boolean = false;

  constructor(private auth: Auth, private ngZone: NgZone) { }

  async loginFB(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    // return createUserWithEmailAndPassword(this.auth, email, password);
    return this.ngZone.run(() =>
      createUserWithEmailAndPassword(this.auth, email, password)
    );
  }

  async logoutFB() {
    return signOut(this.auth);
  }

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
