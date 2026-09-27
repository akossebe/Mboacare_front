import { Routes } from '@angular/router';
import { FrontLayoutComponent } from './layout/front-layout/front-layout.component';

export const FRONTOFFICE_ROUTES: Routes = [
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/accueil/accueil.component').then(m => m.AccueilComponent)
      },
      {
        path: 'pharmacies',
        loadComponent: () =>
          import('./pages/pharmacies-public/pharmacies-public.component').then(m => m.PharmaciesPublicComponent)
      },
      {
        path: 'medicaments',
        loadComponent: () =>
          import('./pages/medicaments-public/medicaments-public.component').then(m => m.MedicamentsPublicComponent)
      }
    ]
  }
];