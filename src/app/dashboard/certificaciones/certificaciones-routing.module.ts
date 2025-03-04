import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { InformacionComponent } from './informacion/informacion.component';
import { AuthGuard } from '../../core/auth.guard';

const routes: Routes = [
  {
    path: 'busqueda', component: BusquedaComponent
  },
  {
    path: 'informacion', component: InformacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificacionesRoutingModule { }
