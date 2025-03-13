import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { provideAuth, getAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  providers: [
    provideAuth(() => getAuth())
  ]
})
export class AuthModule { }
