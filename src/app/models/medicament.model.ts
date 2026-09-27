export interface Medicament {
  idMedicament?: string;
  nom: string;
  forme: string;
  prix: number;
  stock?: {
    idStock: string;
    nom: string;
    quantite: number;
  };
}
