import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'dashboard',
    children: [
      {
        path: 'certificaciones',
        loadChildren: () => import('./dashboard/certificaciones/certificaciones.module').then(m => m.CertificacionesModule)
      }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '**', redirectTo: 'auth/login' }
];
