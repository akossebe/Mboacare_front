// Aligné sur l'enum backend com.Mboacare.Mboacare.enums.StatutConsultation
export type StatutConsultation = 'EN_COURS' | 'CLOTUREE';

export interface ConsultationReqDTO {
  idRendezVous: number;
  motif?: string;
}

export interface DiagnosticReqDTO {
  diagnostic: string;
  observations?: string;
}

export interface CompteRenduDTO {
  idConsultation: number;
  dateConsultation: string;
  motif: string;
  diagnostic: string;
  observations: string;
  contenuTextuel: string;
}

export interface ConsultationResDTO {
  idConsultation: number;
  dateConsultation: string;
  heureConsultation: string;
  motif: string;
  diagnostic?: string;
  observations?: string;
  statut: StatutConsultation;
  idRendezVous: number;
  idPatient: number;
  idMedecin: number;
}
