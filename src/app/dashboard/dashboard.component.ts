import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  usuario = localStorage.getItem('admin');

getDashboardView() {
  switch (this.usuario) {
    case 'admin': return 'dashboard/admin';
    case 'docente': return 'dashboard/docente';
    case 'estudiante': return 'dashboard/estudiante';
    default: return 'auth/login';
  }
}

}
