import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotasComponent } from './notas/notas.component';
import { CargadoComponent } from './cargado/cargado.component';

const routes: Routes = [
  {
    path: 'notas', component: NotasComponent
  },
  {
    path: 'cargado', component: CargadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
