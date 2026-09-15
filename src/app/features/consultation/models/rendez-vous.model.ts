export type StatutRendezVous = 'EN_ATTENTE' | 'CONFIRME' | 'ANNULE' | 'REPORTE' | 'EFFECTUE';

export interface RendezVousReqDTO {
  dateSouhaitee: string; // Format YYYY-MM-DD
  heureSouhaitee: string; // Format HH:mm:ss
  motifPrise?: string;
  idPatient: number;
  idMedecin: number;
}

export interface ReporterRendezVousDTO {
  nouvelleDateSouhaitee: string; // Format YYYY-MM-DD
  nouvelleHeureSouhaitee: string; // Format HH:mm:ss
}

export interface RendezVousResDTO {
  idRendezVous: number;
  dateSouhaitee: string;
  heureSouhaitee: string;
  motifPrise?: string;
  statut: StatutRendezVous;
  idPatient: number;
  idMedecin: number;
  dateCreation?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
