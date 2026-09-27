import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./frontoffice/frontoffice.routes').then(m => m.FRONTOFFICE_ROUTES)
  }
];
