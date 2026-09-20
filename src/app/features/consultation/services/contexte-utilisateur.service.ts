import { Injectable } from '@angular/core';

/**
 * Contexte de l'utilisateur courant pour le module Consultation.
 *
 * Le module Profil-utilisateur (authentification) n'étant pas encore livré,
 * ce service centralise les identifiants du patient et du médecin "connectés".
 * Les identifiants par défaut correspondent aux données réelles créées par le
 * DatabaseSeeder du backend (patient n°1, médecin n°1).
 *
 * Quand le module d'authentification sera disponible, il suffira de remplacer
 * l'implémentation de ce service : aucune page du module Consultation n'aura
 * à être modifiée.
 */
@Injectable({ providedIn: 'root' })
export class ContexteUtilisateurService {
  private readonly CLE_PATIENT = 'mboacare.idPatient';
  private readonly CLE_MEDECIN = 'mboacare.idMedecin';

  get idPatient(): number {
    const val = localStorage.getItem(this.CLE_PATIENT);
    return val ? Number(val) : 1;
  }

  set idPatient(id: number) {
    localStorage.setItem(this.CLE_PATIENT, String(id));
  }

  get idMedecin(): number {
    const val = localStorage.getItem(this.CLE_MEDECIN);
    return val ? Number(val) : 1;
  }

  set idMedecin(id: number) {
    localStorage.setItem(this.CLE_MEDECIN, String(id));
  }
}
