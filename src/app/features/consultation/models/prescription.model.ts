// Aligné sur l'enum backend com.Mboacare.Mboacare.enums.StatutPrescription
export type StatutPrescription = 'EMISE' | 'TRANSMISE' | 'DELIVREE' | 'EXPIREE';

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
