import { Routes } from '@angular/router';
import { PatientLayout } from './layouts/patient-layout/patient-layout';
import { MedecinLayout } from './layouts/medecin-layout/medecin-layout';
import { TableauDeBordPatient } from './features/consultation/pages/tableau-de-bord-patient/tableau-de-bord-patient';
import { TableauDeBordMedecin } from './features/consultation/pages/tableau-de-bord-medecin/tableau-de-bord-medecin';
import { PriseRdv } from './features/consultation/pages/prise-rdv/prise-rdv';
import { HistoriqueMedicalComponent } from './features/consultation/pages/historique-medical/historique-medical';
import { ConsultationDetail } from './features/consultation/pages/consultation-detail/consultation-detail';
import { RedigerPrescription } from './features/consultation/pages/rediger-prescription/rediger-prescription';
import { AgendaMedecin } from './features/consultation/pages/agenda-medecin/agenda-medecin';
import { RechercheMedecin } from './features/consultation/pages/recherche-medecin/recherche-medecin';

export const routes: Routes = [
  // Redirection par défaut vers le tableau de bord patient avec layout
  { path: '', redirectTo: 'patient/tableau-de-bord', pathMatch: 'full' },

  // Espace Patient avec PatientLayout (Navbar, Loader, Footer)
  {
    path: 'patient',
    component: PatientLayout,
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordPatient },
      { path: 'prise-rdv', component: PriseRdv },
      { path: 'historique-medical', component: HistoriqueMedicalComponent },
    ]
  },

  // Espace Médecin avec MedecinLayout (Navbar, Loader, Footer)
  {
    path: 'medecin',
    component: MedecinLayout,
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordMedecin },
      { path: 'consultation', component: ConsultationDetail },
      { path: 'consultation/:id', component: ConsultationDetail },
      { path: 'rediger-prescription', component: RedigerPrescription },
      { path: 'rediger-prescription/:idConsultation', component: RedigerPrescription },
      { path: 'agenda', component: AgendaMedecin },
      { path: 'recherche', component: RechercheMedecin },
    ]
  },

  // Accès direct demandé : /rdv mène directement à la prise de RDV
  { path: 'rdv', redirectTo: 'patient/prise-rdv', pathMatch: 'full' },
  { path: 'prise-rdv', redirectTo: 'patient/prise-rdv', pathMatch: 'full' },
  { path: 'historique', redirectTo: 'patient/historique-medical', pathMatch: 'full' },

  // Compatibilité ascendante avec le module consultation
  {
    path: 'consultation',
    children: [
      { path: '', redirectTo: '/patient/tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord-patient', redirectTo: '/patient/tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord-medecin', redirectTo: '/medecin/tableau-de-bord', pathMatch: 'full' },
      { path: 'prise-rdv', redirectTo: '/patient/prise-rdv', pathMatch: 'full' },
      { path: 'historique-medical', redirectTo: '/patient/historique-medical', pathMatch: 'full' },
      { path: 'fiche-consultation', redirectTo: '/medecin/consultation', pathMatch: 'full' },
      { path: 'fiche-consultation/:id', redirectTo: '/medecin/consultation/:id', pathMatch: 'full' },
      { path: 'rediger-prescription', redirectTo: '/medecin/rediger-prescription', pathMatch: 'full' },
    ]
  },

  // Redirection globale
  { path: '**', redirectTo: 'patient/tableau-de-bord' }
];
