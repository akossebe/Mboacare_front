import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'pharmacies',
        loadComponent: () => import('./pages/pharmacie/pharmacie-list/pharmacie-list.component').then(c => c.PharmacieListComponent)
      },
      {
        path: 'pharmacies/ajouter',
        loadComponent: () => import('./pages/pharmacie/pharmacie-form/pharmacie-form.component').then(c => c.PharmacieFormComponent)
      },
      {
        path: 'pharmacies/modifier/:id',
        loadComponent: () => import('./pages/pharmacie/pharmacie-form/pharmacie-form.component').then(c => c.PharmacieFormComponent)
      },
      {
        path: 'pharmacies/detail/:id',
        loadComponent: () => import('./pages/pharmacie/pharmacie-detail/pharmacie-detail.component').then(c => c.PharmacieDetailComponent)
      },
      {
        path: 'medicaments',
        loadComponent: () => import('./pages/medicament/medicament-list/medicament-list.component').then(c => c.MedicamentListComponent)
      },
      {
        path: 'medicaments/ajouter',
        loadComponent: () => import('./pages/medicament/medicament-form/medicament-form.component').then(c => c.MedicamentFormComponent)
      },
      {
        path: 'medicaments/modifier/:id',
        loadComponent: () => import('./pages/medicament/medicament-form/medicament-form.component').then(c => c.MedicamentFormComponent)
      },
      {
        path: 'medicaments/detail/:id',
        loadComponent: () => import('./pages/medicament/medicament-detail/medicament-detail.component').then(c => c.MedicamentDetailComponent)
      },
      {
        path: 'stocks',
        loadComponent: () => import('./pages/stock/stock-list/stock-list.component').then(c => c.StockListComponent)
      },
      {
        path: 'stocks/ajouter',
        loadComponent: () => import('./pages/stock/stock-form/stock-form.component').then(c => c.StockFormComponent)
      },
      {
        path: 'stocks/modifier/:id',
        loadComponent: () => import('./pages/stock/stock-form/stock-form.component').then(c => c.StockFormComponent)
      },
      {
        path: 'stocks/detail/:id',
        loadComponent: () => import('./pages/stock/stock-detail/stock-detail.component').then(c => c.StockDetailComponent)
      },
    ]
  }
];