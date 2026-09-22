import { Routes } from '@angular/router';
import { PatientLayout } from './layouts/patient-layout/patient-layout.component';
import { MedecinLayout } from './layouts/medecin-layout/medecin-layout.component';
import { TableauDeBordPatient } from './features/consultation/pages/tableau-de-bord-patient/tableau-de-bord-patient.component';
import { TableauDeBordMedecin } from './features/consultation/pages/tableau-de-bord-medecin/tableau-de-bord-medecin.component';
import { PriseRdv } from './features/consultation/pages/prise-rdv/prise-rdv.component';
import { HistoriqueMedicalComponent } from './features/consultation/pages/historique-medical/historique-medical.component';
import { ConsultationDetail } from './features/consultation/pages/consultation-detail/consultation-detail.component';
import { RedigerPrescription } from './features/consultation/pages/rediger-prescription/rediger-prescription.component';
import { AgendaMedecin } from './features/consultation/pages/agenda-medecin/agenda-medecin.component';
import { Inscription } from './features/profil-utilisateur/pages/inscription/inscription.component';
import { Connexion } from './features/profil-utilisateur/pages/connexion/connexion.component';

export const routes: Routes = [

  { path: '', redirectTo: 'inscription', pathMatch: 'full' },
  
  { path: 'inscription', component: Inscription },
  { path: 'connexion', component: Connexion },

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
    ]
  },

  // Anciennes URL raccourcies
  { path: 'rdv', redirectTo: 'patient/prise-rdv', pathMatch: 'full' },
  { path: 'historique', redirectTo: 'patient/historique-medical', pathMatch: 'full' },

  { path: '**', redirectTo: 'inscription' }
];
