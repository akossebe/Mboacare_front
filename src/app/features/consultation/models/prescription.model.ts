export type StatutPrescription = 'CREEE' | 'VALIDEE' | 'ENVOYEE_PHARMACIE' | 'DELIVREE';

export interface LigneMedicamentDTO {
  nomMedicament: string;
  posologie: string;
  duree: string;
  quantite: number;
}

export interface PrescriptionReqDTO {
  idConsultation: number;
  lignesMedicaments: LigneMedicamentDTO[];
}

export interface EnvoyerPharmacieDTO {
  idPharmacie: number;
}

export interface PrescriptionResDTO {
  idPrescription: number;
  dateEmission: string;
  lignesMedicaments: LigneMedicamentDTO[];
  statut: StatutPrescription;
  idConsultation: number;
  idMedecin: number;
  idPharmacie?: number;
}
