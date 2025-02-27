import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated : boolean = false;

  constructor() { }

  login(user:string,password:string):boolean{
    if(user==='admin' && password===  'Control123'){
      return true;
    }
    return false;
  }

  logout(){
    this.isAuthenticated = false;
  }

  logged():boolean{
    return this.isAuthenticated;
  }
}
